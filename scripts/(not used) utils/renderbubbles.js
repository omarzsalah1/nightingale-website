// Render chat bubbles utility
export function renderBubbles(conversations) {
    const container = document.getElementById('chatContainer');
    if (!container) return;
    
    // Clear existing content
    container.innerHTML = '';
    
    // Render each conversation
    conversations.forEach((convo, index) => {
        const conversationDiv = document.createElement('div');
        conversationDiv.className = 'chat-conversation';
        conversationDiv.style.animationDelay = `${index * 0.1}s`;
        
        // Render messages
        if (convo.messages) {
            convo.messages.forEach(message => {
                const bubble = createBubble(message);
                conversationDiv.appendChild(bubble);
            });
        } else {
            // Handle flat array of messages
            const bubble = createBubble(convo);
            conversationDiv.appendChild(bubble);
        }
        
        container.appendChild(conversationDiv);
    });
}

// Create individual chat bubble
function createBubble(message) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${message.side}`;
    
    // Handle nurse messages differently
    if (message.side === 'nurse') {
        bubble.className = 'chat-bubble nurse-message';
        bubble.innerHTML = `
            <div class="nurse-header">
                <span class="nurse-icon">👩‍⚕️</span>
                <span class="nurse-label">Nurse Sarah, RN</span>
            </div>
            <div class="bubble-text">${message.text}</div>
        `;
    } else {
        bubble.innerHTML = `<div class="bubble-text">${message.text}</div>`;
    }
    
    return bubble;
}

// Add nurse message styles
const style = document.createElement('style');
style.textContent = `
    .chat-conversation {
        margin-bottom: 2rem;
        animation: fadeIn 0.5s ease-out;
    }
    
    .nurse-message {
        background: linear-gradient(135deg, #4ADE80, #10B981) !important;
        color: var(--bg-primary) !important;
        margin-left: 0 !important;
        margin-right: 20% !important;
    }
    
    .nurse-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
        font-weight: 600;
    }
    
    .nurse-icon {
        font-size: 1.2rem;
    }
    
    .bubble-text {
        line-height: 1.5;
    }
`;
document.head.appendChild(style);