// iPhone Chat Gallery Module

// Sample conversations
const conversations = [
    {
        id: 1,
        messages: [
            { type: 'ai', text: 'Good morning, Margaret! How are you feeling today?' },
            { type: 'user', text: 'Much better. I walked around the house without getting winded.' },
            { type: 'ai', text: 'Fantastic progress! Have you taken your morning medications?' },
            { type: 'user', text: 'Yes, but I have a question about the new inhaler.' },
            { type: 'ai', text: 'I can help with that. First, remove the cap and shake it well - about 5 times.' },
            { type: 'user', text: 'OK, I\'m shaking it now. What\'s next?' },
            { type: 'ai', text: 'Great! Now breathe out fully to empty your lungs. As you start to breathe in slowly, press down to release the medication.' }
        ]
    },
    {
        id: 2,
        messages: [
            { type: 'user', text: 'I need to see Dr. Martinez but can\'t drive' },
            { type: 'ai', text: 'No problem! I can schedule a Lyft for you. Next available with Dr. Martinez is Tuesday at 2 PM. Should I book both?' },
            { type: 'user', text: 'Yes please!' },
            { type: 'ai', text: '✅ All set! Lyft will pick you up at 1:30 PM. I\'ll text you reminders.' },
            { type: 'user', text: 'Thank you so much!' },
            { type: 'ai', text: 'You\'re welcome! Is there anything else you need for your appointment?' }
        ]
    },
    {
        id: 3,
        messages: [
            { type: 'user', text: 'My ankles are really swollen and I\'m having trouble breathing when I lie down' },
            { type: 'ai', text: 'These symptoms could indicate fluid retention. I need to connect you with a nurse immediately.' },
            { type: 'nurse', text: 'Hi Margaret, this is Nurse Sarah. I see you\'re experiencing swelling and breathing difficulties. On a scale of 1-10, how difficult is it to breathe?' },
            { type: 'user', text: 'About a 7 when lying down' },
            { type: 'nurse', text: 'That\'s concerning. Have you weighed yourself today? Any weight gain?' },
            { type: 'user', text: 'Yes, I\'m up 5 pounds since Monday' },
            { type: 'nurse', text: 'I\'m calling Dr. Wilson now. Please sit upright and I\'ll stay on with you.' }
        ]
    }
];

// Initialize iPhone chat gallery
function initializeIPhoneGallery() {
    // Load initial conversations
    loadConversation(0, 'chat1');
    loadConversation(1, 'chat2');
    loadConversation(2, 'chat3');
    
    // Set up auto-cycling
    setInterval(cycleConversations, 15000);
}

// Load a conversation into a specific chat container
function loadConversation(convoIndex, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const conversation = conversations[convoIndex % conversations.length];
    container.innerHTML = '';
    
    // Add messages with staggered animation
    conversation.messages.forEach((message, index) => {
        setTimeout(() => {
            const msgEl = createMessage(message);
            container.appendChild(msgEl);
            
            // Auto-scroll to bottom after each message
            container.scrollTop = container.scrollHeight;
        }, index * 800);
    });
    
    // Final scroll adjustment after all messages are loaded
    setTimeout(() => {
        // Find the chat body wrapper
        const chatBody = container.closest('.chat-body');
        if (chatBody) {
            chatBody.scrollTop = chatBody.scrollHeight;
        }
        
        // Also try direct container scroll
        container.scrollTop = container.scrollHeight;
    }, conversation.messages.length * 800 + 100);
}

// Create message element
function createMessage(message) {
    const li = document.createElement('li');
    li.className = `msg ${message.type}`;
    
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    
    if (message.type === 'nurse') {
        bubble.innerHTML = `
            <div class="nurse-label">Nurse Sarah, RN</div>
            <div>${message.text}</div>
        `;
    } else {
        bubble.textContent = message.text;
    }
    
    li.appendChild(bubble);
    return li;
}

// Cycle through conversations
let cycleIndex = 0;
function cycleConversations() {
    cycleIndex++;
    
    // Fade out current conversations
    const chatContainers = ['chat1', 'chat2', 'chat3'];
    chatContainers.forEach(id => {
        const container = document.getElementById(id);
        if (container) {
            container.style.opacity = '0.5';
        }
    });
    
    // Load new conversations after fade
    setTimeout(() => {
        loadConversation(cycleIndex, 'chat1');
        loadConversation(cycleIndex + 1, 'chat2');
        loadConversation(cycleIndex + 2, 'chat3');
        
        // Fade back in
        chatContainers.forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                container.style.opacity = '1';
            }
        });
    }, 300);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeIPhoneGallery);
} else {
    initializeIPhoneGallery();
}

// Export for module usage
export { initializeIPhoneGallery };