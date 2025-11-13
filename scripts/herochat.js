document.addEventListener('DOMContentLoaded', function() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    const heroConversation = [
        {role: "user", content: "Hi Florence, my inhaler training video just finished. Can we review it one more time?"},
        {role: "ai", content: "Of course! Quick recap: remove the cap, shake five times, exhale fully, seal lips around the mouthpiece, press once as you inhale slowly, hold 10 s, exhale gently."},
        {role: "user", content: "Got it. When should I use the rescue inhaler versus the controller?"},
        {role: "ai", content: "Rescue = sudden shortness of breath, wheezing, or chest tightness. Controller = every morning and evening to keep airways calm."},
        {role: "user", content: "I used the rescue inhaler twice yesterday. Is that okay?"},
        {role: "ai", content: "Two puffs in 24 h is acceptable. If you reach 4 in a day, message me immediately."},
        {role: "user", content: "Noted. I'm still coughing a bit—no mucus, just dry."},
        {role: "ai", content: "Dry cough can follow steroid tapers. Stay hydrated; warm tea helps. Rate cough 0‑10?"},
        {role: "user", content: "Maybe a 4."},
        {role: "ai", content: "Mild. I'll re‑check in 48 h. If it hits 7 or if you notice fever, call 911 and tap the red SOS inside Florence."},
        {role: "user", content: "Will do. Any breathing exercises?"},
        {role: "ai", content: "Yes—pursed‑lip breathing: inhale 2 s through nose, exhale 4 s through tight lips. Repeat 10×, 3 times daily."},
        {role: "user", content: "Trying it now… feels better already."},
        {role: "ai", content: "Great!"},
    ];
    
    // RESTORED: This function is needed for desktop animations
    function pushMessage(ul, msg) {
        return new Promise(res => {
            const li = document.createElement('li');
            li.className = 'msg ' + msg.role;
            const bubble = document.createElement('div');
            bubble.className = 'msg-bubble';
            li.appendChild(bubble);
            ul.appendChild(li);

            if (msg.role === 'user') {
                let i = 0;
                bubble.innerHTML = '<span class="cursor"></span>';
                const iv = setInterval(() => {
                    bubble.textContent = msg.content.slice(0, ++i);
                    if (i === msg.content.length) { clearInterval(iv); res(); }
                }, 25);
            } else {
                bubble.innerHTML = '<span class="typing-indicator"><span></span><span></span><span></span></span>';
                const delay = 800 + msg.content.length * 8;
                setTimeout(() => { 
                    bubble.innerHTML = msg.content; 
                    res(); 
                }, delay);
            }
        }).then(() => { ul.parentElement.scrollTop = ul.scrollHeight; });
    }

    // RESTORED: This function is needed for the speaker icon
    function addHeroSpeakerButton() {
        const screen = document.querySelector('.hero-phone .screen');
        if (!screen || screen.querySelector('.play-audio')) return;
        
        const audioButton = document.createElement('button');
        audioButton.className = 'play-audio';
        audioButton.innerHTML = `<img src="icons/speaker-muted.svg" alt="Play audio" class="speaker-icon muted"><img src="icons/speaker.svg" alt="Stop audio" class="speaker-icon unmuted" style="display:none;">`;
        screen.appendChild(audioButton);
        
        let audio = new Audio('audio/hero-copd.mp3'); // Ensure this path is correct
        audioButton.addEventListener('click', function(e) {
            e.preventDefault(); e.stopPropagation();
            if (audio.paused) {
                audio.play();
                this.classList.add('playing');
                this.querySelector('.muted').style.display = 'none';
                this.querySelector('.unmuted').style.display = 'block';
            } else {
                audio.pause(); audio.currentTime = 0;
                this.classList.remove('playing');
                this.querySelector('.muted').style.display = 'block';
                this.querySelector('.unmuted').style.display = 'none';
            }
        });
        audio.addEventListener('ended', () => {
            audioButton.classList.remove('playing');
            audioButton.querySelector('.muted').style.display = 'block';
            audioButton.querySelector('.unmuted').style.display = 'none';
        });
    }

    function loadHeroChat() {
        const chatContainer = document.getElementById('heroChat');
        if (!chatContainer) return;
        
        chatContainer.innerHTML = '';

        if (isIOS) {
            const fragment = document.createDocumentFragment();
            heroConversation.forEach(msg => {
                const li = document.createElement('li');
                li.className = 'msg ' + msg.role;
                li.style.cssText = 'display: flex; width: 100%; margin-bottom: 1rem;';

                const bubble = document.createElement('div');
                bubble.className = 'msg-bubble';
                bubble.innerHTML = msg.content;
                
                let bubbleStyle = 'max-width: 85%;';
                if (msg.role === 'user') {
                    bubbleStyle += ' margin-left: auto;';
                }
                bubble.style.cssText = bubbleStyle;

                li.appendChild(bubble);
                fragment.appendChild(li);
            });
            chatContainer.appendChild(fragment);
            chatContainer.scrollTop = chatContainer.scrollHeight;
            addHeroSpeakerButton(); // Also add speaker button for iOS, but without animations
        } else {
            // RESTORED: Proper desktop animation logic
            (async() => {
                for (const m of heroConversation) {
                    await pushMessage(chatContainer, m);
                }
            })().then(() => {
                // Add speaker button AFTER animations complete
                setTimeout(addHeroSpeakerButton, 800);
            });
        }
    }
    
    loadHeroChat();
});