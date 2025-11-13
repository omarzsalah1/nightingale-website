// scripts/chat-gallery.js
document.addEventListener('DOMContentLoaded', () => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const conversations = {};

  function mapRole(sender){
    if (sender === 'florence') return 'ai';
    if (sender === 'patient' || sender === 'provider' || sender === 'clinician') return 'user';
    return sender;
  }

  function fetchConversations(){
    Promise.allSettled([
      fetch('data/chats.json'),
      fetch('data/provider-chats.json')
    ]).then(async results => {
      const merged = [];
      for (const r of results){
        if (r.status === 'fulfilled' && r.value && r.value.ok){
          merged.push(...await r.value.json());
        }
      }
      merged.forEach(chat => {
        conversations[chat.id] = {
          dialog: chat.dialog.map(([sender,text]) => ({ role: mapRole(sender), content: text })),
          audio: chat.audio || '' // optional
        };
      });
      initPhones();
    });
  }

  function initPhones(){
    document.querySelectorAll('.iphone-mockup.phone[data-conversation]').forEach(phone => {
      const id = phone.dataset.conversation;
      if (!conversations[id]) return;

      phone._dialog = conversations[id].dialog;
      phone._audio  = conversations[id].audio;

      const io = new IntersectionObserver(es => {
        es.forEach(e => {
          if (e.isIntersecting && !phone._ran){
            phone._ran = true;
            run(phone);
            io.disconnect();
          }
        });
      }, {threshold:.35});
      io.observe(phone);
    });
  }

  function typeInto(ul,msg){
    return new Promise(res=>{
      const li=document.createElement('li'); li.className='msg '+msg.role;
      const b=document.createElement('div'); b.className='msg-bubble'; li.appendChild(b); ul.appendChild(li);
      if(msg.role==='user'){
        b.innerHTML='<span class="typing-indicator"><span></span><span></span><span></span></span>';
        setTimeout(()=>{b.innerHTML=''; let i=0; const iv=setInterval(()=>{b.textContent=msg.content.slice(0,++i); if(i===msg.content.length){clearInterval(iv);res();}},24)},280);
      }else{
        b.innerHTML='<span class="typing-indicator"><span></span><span></span><span></span></span>';
        setTimeout(()=>{b.textContent=msg.content;res();},650+msg.content.length*7);
      }
    }).then(()=>{ul.parentElement.scrollTop = ul.scrollHeight;});
  }

  function maybeAddSpeaker(phone){
    // Only create a button when an audio path is defined
    if(!phone._audio) return;

    if(phone.querySelector('.play-audio')) return;
    const btn = document.createElement('button');
    btn.className='play-audio';
    btn.innerHTML = `<img src="icons/speaker-muted.svg" class="muted" alt="">
                     <img src="icons/speaker.svg" class="unmuted" alt="" style="display:none">`;
    const screen = phone.querySelector('.iphone-screen');
    screen.appendChild(btn);

    const audio = new Audio(phone._audio);
    btn.addEventListener('click',(e)=>{
      e.preventDefault(); e.stopPropagation();
      if(audio.paused){
        document.querySelectorAll('audio').forEach(a=>{ try{a.pause()}catch{} });
        audio.play();
        btn.querySelector('.muted').style.display='none';
        btn.querySelector('.unmuted').style.display='block';
      }else{
        audio.pause(); audio.currentTime=0;
        btn.querySelector('.muted').style.display='block';
        btn.querySelector('.unmuted').style.display='none';
      }
    });
    audio.addEventListener('ended',()=>{
      btn.querySelector('.muted').style.display='block';
      btn.querySelector('.unmuted').style.display='none';
    });
  }

  function run(phone){
    const ul = phone.querySelector('.messages');
    const msgs = phone._dialog || [];
    ul.innerHTML = '';

    if(isIOS){
      const frag=document.createDocumentFragment();
      msgs.forEach(m=>{
        const li=document.createElement('li'); li.className='msg '+m.role;
        const b=document.createElement('div'); b.className='msg-bubble'; b.textContent=m.content;
        li.appendChild(b); frag.appendChild(li);
      });
      ul.appendChild(frag); ul.scrollTop=ul.scrollHeight;
      maybeAddSpeaker(phone);
    }else{
      (async()=>{ for(const m of msgs){ await typeInto(ul,m); } })().then(()=> maybeAddSpeaker(phone));
    }
  }

  fetchConversations();
});