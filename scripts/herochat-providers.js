// scripts/heroChat-providers.js
document.addEventListener('DOMContentLoaded', () => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  // ED de‑escalation (post‑op bruising) – patient ↔ Florence
  const convo = [
    { role: 'user', content: 'Hi Florence. My bandage looks a little yellow and the bruise is bigger. I’m worried I need the ER.' },
    { role: 'ai',   content: 'Thanks for calling. Let’s check quickly. Any fever, spreading redness, drainage with odor, or severe pain in the calf?' },
    { role: 'user', content: 'No fever. No redness spreading. Dressing is dry. Pain is 3/10 around the incision. Calf feels okay.' },
    { role: 'ai',   content: 'That sounds like expected post‑op bruising and swelling. Home care: elevate above heart, ice 20 minutes on/off, and keep the dressing dry.' },
    { role: 'user', content: 'So… I don’t need to go in tonight?' },
    { role: 'ai',   content: 'Based on your answers, the ER isn’t needed now. I’ll message the on‑call surgeon to review and I’ll text you if anything changes.' },
    { role: 'ai',   content: 'Go to the ER if you develop chest pain, shortness of breath, high fever, rapidly spreading redness, or severe calf pain. Otherwise you’re safe to rest at home.' },
    { role: 'user', content: 'Okay—thank you. I’ll ice and elevate and wait for the surgeon’s note.' }
  ];

  // Helpers
  function pushMessage(ul, msg){
    return new Promise(res => {
      const li = document.createElement('li'); li.className = 'msg ' + (msg.role==='ai'?'ai':'user');
      const bubble = document.createElement('div'); bubble.className = 'msg-bubble'; li.appendChild(bubble);
      ul.appendChild(li);

      if (msg.role === 'user'){
        let i = 0; bubble.innerHTML = '<span class="typing-indicator"><span></span><span></span><span></span></span>';
        setTimeout(() => {
          bubble.innerHTML = '';
          const iv = setInterval(() => {
            bubble.textContent = msg.content.slice(0, ++i);
            if (i === msg.content.length){ clearInterval(iv); res(); }
          }, 24);
        }, 280);
      } else {
        bubble.innerHTML = '<span class="typing-indicator"><span></span><span></span><span></span></span>';
        setTimeout(() => { bubble.textContent = msg.content; res(); }, 700 + msg.content.length*7);
      }
    }).then(()=>{ ul.parentElement.scrollTop = ul.scrollHeight; });
  }

  function addSpeaker(screen){
    const audioPath = 'audio/er_avoidance_postop_bruising.mp3'; // OPTIONAL
    // Only add a button if the file is expected to exist
    if(!audioPath) return;

    const btn = document.createElement('button');
    btn.className = 'play-audio';
    btn.innerHTML = `<img src="icons/speaker-muted.svg" class="muted" alt="">
                     <img src="icons/speaker.svg" class="unmuted" alt="" style="display:none">`;
    screen.appendChild(btn);

    const audio = new Audio(audioPath);
    btn.addEventListener('click', (e)=>{
      e.preventDefault(); e.stopPropagation();
      if(audio.paused){
        // pause others
        document.querySelectorAll('audio').forEach(a => { try{a.pause()}catch{} });
        audio.play();
        btn.querySelector('.muted').style.display='none';
        btn.querySelector('.unmuted').style.display='block';
      }else{
        audio.pause(); audio.currentTime=0;
        btn.querySelector('.muted').style.display='block';
        btn.querySelector('.unmuted').style.display='none';
      }
    });
    audio.addEventListener('ended', ()=>{
      btn.querySelector('.muted').style.display='block';
      btn.querySelector('.unmuted').style.display='none';
    });
  }

  // Render
  const chat = document.getElementById('heroChat');
  if(!chat) return;
  chat.innerHTML = '';

  if(isIOS){
    // Fast render (no per-char typing) for iOS auto‑play restrictions
    const frag = document.createDocumentFragment();
    convo.forEach(m => {
      const li = document.createElement('li'); li.className = 'msg ' + (m.role==='ai'?'ai':'user');
      const b = document.createElement('div'); b.className = 'msg-bubble'; b.textContent = m.content;
      li.appendChild(b); frag.appendChild(li);
    });
    chat.appendChild(frag);
    chat.scrollTop = chat.scrollHeight;
    addSpeaker(chat.parentElement);
  } else {
    (async ()=>{ for(const m of convo){ await pushMessage(chat,m); } })().then(()=>{
      addSpeaker(chat.parentElement);
    });
  }
});