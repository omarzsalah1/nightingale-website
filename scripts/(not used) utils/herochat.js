// Hero chat animation - FIXED VERSION
document.addEventListener('DOMContentLoaded', function() {
    // Extended COPD conversation - 24 messages
    const heroConversation = [
        {sender: "patient", text: "Hi Florence, my inhaler training video just finished. Can we review it one more time?"},
        {sender: "ai", text: "Of course! Quick recap: remove the cap, shake five times, exhale fully, seal lips around the mouthpiece, press once as you inhale slowly, hold 10 s, exhale gently."},
        {sender: "patient", text: "Got it. When should I use the rescue inhaler versus the controller?"},
        {sender: "ai", text: "Rescue = sudden shortness of breath, wheezing, or chest tightness. Controller = every morning and evening to keep airways calm."},
        {sender: "patient", text: "I used the rescue inhaler twice yesterday. Is that okay?"},
        {sender: "ai", text: "Two puffs in 24 h is acceptable. If you reach 4 in a day, message me immediately."},
        {sender: "patient", text: "Noted. I'm still coughing a bit—no mucus, just dry."},
        {sender: "ai", text: "Dry cough can follow steroid tapers. Stay hydrated; warm tea helps. Rate cough 0‑10?"},
        {sender: "patient", text: "Maybe a 4."},
        {sender: "ai", text: "Mild. I'll re‑check in 48 h. If it hits 7 or if you notice fever, call 911 and tap the red SOS inside Florence."},
        {sender: "patient", text: "Will do. Any breathing exercises?"},
        {sender: "ai", text: "Yes—pursed‑lip breathing: inhale 2 s through nose, exhale 4 s through tight lips. Repeat 10×, 3 times daily."},
        {sender: "patient", text: "Trying it now… feels better already."},
        {sender: "ai", text: "Great!"},
        {sender: "patient", text: "Pulse ox is 94%. Good?"},
        {sender: "ai", text: "For you, baseline is 93‑95%, so 94% is perfect."},
        {sender: "patient", text: "Next clinic visit?"},
        {sender: "ai", text: "Scheduled with Dr Allen Monday 10 AM. I'll text Lyft 24 h before."},
        {sender: "patient", text: "Lyft last time was late 😬"},
        {sender: "ai", text: "I've added a 15 min buffer and driver reminder. We'll monitor in real‑time."},
        {sender: "patient", text: "Thanks. Diet tips?"},
        {sender: "ai", text: "Low‑sodium meals reduce fluid. I'll send a 3‑day menu to your email in one minute."},
        {sender: "patient", text: "Awesome."},
        {sender: "ai", text: "Anything else before I let you breathe easy?"},
        {sender: "patient", text: "No, that's all. Appreciate you!"},
        {sender: "ai", text: "My pleasure. I'll check in tomorrow morning. Stay well, Margaret!"}
    ];
    
    function loadHeroChat() {
        const chatContainer = document.getElementById('heroChat');
        if (!chatContainer) {
            console.error('Hero chat container not found');
            return;
        }
        
        // Clear existing content
        chatContainer.innerHTML = '';
        
        let messageIndex = 0;
        
        // Function to add next message
        function addNextMessage() {
            if (messageIndex >= heroConversation.length) {
                // All messages loaded, add speaker button
                addHeroSpeakerButton();
                // Scroll to bottom
                chatContainer.scrollTop = chatContainer.scrollHeight;
                return;
            }
            
            const message = heroConversation[messageIndex];
            const messageEl = createMessage(message);
            chatContainer.appendChild(messageEl);
            
            // Auto-scroll to bottom
            chatContainer.scrollTop = chatContainer.scrollHeight;
            
            messageIndex++;
            
            // Add next message after delay
            setTimeout(addNextMessage, 300);
        }
        
        // Start adding messages
        setTimeout(addNextMessage, 500);
    }
    
    function createMessage(message) {
        const div = document.createElement('div');
        div.className = 'message ' + (message.sender === 'patient' ? 'user' : 'ai');
        
        const content = document.createElement('div');
        content.className = 'message-content';
        content.textContent = message.text;
        
        div.appendChild(content);
        
        // Add animation
        div.style.animation = 'messageSlide 0.3s ease-out';
        
        return div;
    }
    
    function addHeroSpeakerButton() {
        const screen = document.querySelector('.hero-phone .screen');
        if (!screen || screen.querySelector('.play-audio')) return;
        
        const audioButton = document.createElement('button');
        audioButton.className = 'play-audio';
        audioButton.setAttribute('aria-label', 'Play conversation');
        audioButton.innerHTML = `
            <img src="icons/speaker-muted.svg" alt="" class="speaker-icon muted">
            <img src="icons/speaker.svg" alt="" class="speaker-icon unmuted" style="display:none;">
        `;
        
        audioButton.style.position = 'absolute';
        audioButton.style.bottom = '20px';
        audioButton.style.right = '20px';
        
        screen.appendChild(audioButton);
        
        // Setup audio playback
        let audio = new Audio('audio/copd.mp3');
        let isPlaying = false;
        
        audioButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const mutedIcon = audioButton.querySelector('.muted');
            const unmutedIcon = audioButton.querySelector('.unmuted');
            
            if (isPlaying) {
                audio.pause();
                audio.currentTime = 0;
                audioButton.classList.remove('playing');
                isPlaying = false;
                
                if (mutedIcon) mutedIcon.style.display = 'block';
                if (unmutedIcon) unmutedIcon.style.display = 'none';
            } else {
                audio.play().then(() => {
                    audioButton.classList.add('playing');
                    isPlaying = true;
                    
                    if (mutedIcon) mutedIcon.style.display = 'none';
                    if (unmutedIcon) unmutedIcon.style.display = 'block';
                }).catch(err => {
                    console.error('Audio playback failed:', err);
                });
            }
        });
        
        audio.addEventListener('ended', () => {
            audioButton.classList.remove('playing');
            isPlaying = false;
            const mutedIcon = audioButton.querySelector('.muted');
            const unmutedIcon = audioButton.querySelector('.unmuted');
            if (mutedIcon) mutedIcon.style.display = 'block';
            if (unmutedIcon) unmutedIcon.style.display = 'none';
        });
    }
    
    // Initialize
    loadHeroChat();
});