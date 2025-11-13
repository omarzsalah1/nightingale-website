// Conversation Data
const convoSets = [
  {
    id: 'postDischarge_EN',
    lang: 'en',
    scenario: 'Post-Discharge Care (COPD)',
    bubbles: [
      {speaker:'ai', text:"Good morning, Margaret! I see you were discharged yesterday with COPD. How is your breathing today?"},
      {speaker:'user', text:"Much better. I walked around the house without getting winded."},
      {speaker:'ai', text:"Fantastic progress. Have you used your maintenance inhaler twice today?"},
      {speaker:'user', text:"Yes, and only needed the rescue one once."},
      {speaker:'ai', text:"Great! I've scheduled your follow-up with Dr Wilson for tomorrow at 10 AM. Need transportation?"},
      {speaker:'user', text:"A taxi is expensive. Is there another option?"},
      {speaker:'ai', text:"Your Medicare Advantage plan covers free medical transport. Shall I arrange pickup at 9 AM?"},
      {speaker:'user', text:"That would be wonderful—thank you!"},
      {speaker:'ai', text:"Done. A licensed driver will wait and bring you home after the visit."},
      {speaker:'ai', text:"Any questions for Dr Wilson you'd like me to note?"},
      {speaker:'user', text:"I want to know if I'll need inhalers forever and how to avoid another hospital stay."},
      {speaker:'ai', text:"Noted. I'll remind Dr Wilson. I'll call you tomorrow evening to see how it went. Keep up the great work!"}
    ],
    source: 'post-discharge script'
  },
  {
    id: 'preventive_ES',
    lang: 'es',
    scenario: 'Mamografía & Transporte',
    bubbles: [
      {speaker:'ai', text:"¡Hola María! Revisé su expediente y su última mamografía fue hace tres años."},
      {speaker:'user', text:"Sí, pero me da miedo y no tengo cómo llegar."},
      {speaker:'ai', text:"Entiendo ambas preocupaciones. Primero, puedo organizar transporte gratuito cubierto por su seguro."},
      {speaker:'user', text:"¿En serio? Eso ayudaría mucho."},
      {speaker:'ai', text:"Claro. El viernes a las 9:15 AM, el conductor Carlos la recogerá, esperará y la llevará de regreso."},
      {speaker:'ai', text:"Sobre el miedo al resultado: más del 80 % de los hallazgos tempranos NO son cáncer, y si se detecta pronto el tratamiento es menos invasivo."},
      {speaker:'user', text:"Eso me tranquiliza."},
      {speaker:'ai', text:"¿Le viene bien la cita del viernes a las 10 AM en el Centro de Salud de la Mujer?"},
      {speaker:'user', text:"Sí, confirmo."},
      {speaker:'ai', text:"Perfecto. Le enviaré un recordatorio mañana y estaré disponible si surgen dudas."},
      {speaker:'user', text:"Muchas gracias por su ayuda."},
      {speaker:'ai', text:"Un placer servirle, María. ¡Hasta pronto!"}
    ],
    source: 'Gonzalez screening script'
  },
  {
    id: 'gapClosure_EN',
    lang: 'en',
    scenario: 'Diabetes Gap Closure',
    bubbles: [
      {speaker:'ai', text:"Hi Jonathan, your last A1C was 7.8 %. Let's schedule your follow-up lab."},
      {speaker:'user', text:"Earliest appointment works."},
      {speaker:'ai', text:"Tuesday 8 AM or Thursday 2 PM at Quest Diagnostics on Maple. Preference?"},
      {speaker:'user', text:"Tuesday, please."},
      {speaker:'ai', text:"Booked. Do you need a Lyft Health ride?"},
      {speaker:'user', text:"Yes, that helps."},
      {speaker:'ai', text:"Ride confirmed—pickup 7:20 AM. Reminder set for Monday evening."},
      {speaker:'ai', text:"Meanwhile, remember metformin with dinner. Any side-effects?"},
      {speaker:'user', text:"Mild nausea, nothing major."},
      {speaker:'ai', text:"Taking it with food usually reduces that. Let's monitor and discuss results next week."},
      {speaker:'user', text:"Sounds good, thanks."},
      {speaker:'ai', text:"You're doing great—closing this care gap moves you closer to your A1C goal."}
    ],
    source: 'diabetes follow-up'
  },
  {
    id: 'humanEscalation_EN',
    lang: 'en',
    scenario: 'Human Escalation',
    bubbles: [
      {speaker:'user', text:"I'm having chest pain and difficulty breathing since this morning"},
      {speaker:'ai', text:"I understand you're experiencing chest pain and breathing difficulties. These symptoms require immediate medical attention. I'm connecting you with Nurse Sarah right now.", typing: true},
      {speaker:'ai', text:"Connected to Nurse Sarah, RN - Cardiac Care Specialist"},
      {speaker:'nurse', text:"Hello, this is Nurse Sarah. I see you're having chest pain and breathing problems. Can you describe the pain? Is it sharp, dull, or pressure-like?"},
      {speaker:'user', text:"It feels like pressure on my chest."},
      {speaker:'nurse', text:"On a scale of 1-10, how severe is the pain right now?"},
      {speaker:'user', text:"About 7."},
      {speaker:'nurse', text:"Given your symptoms, I strongly recommend calling 911 immediately. This could be a cardiac emergency. Are you able to do that now?"}
    ],
    source: 'emergency escalation'
  }
];

// Analytics tracking function
function trackUserInteraction(action, element) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': 'User Interaction',
            'event_label': element,
            'value': 1
        });
    }
}

// Error handling functions
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => errorDiv.remove(), 300);
    }, 5000);
}

function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => successDiv.remove(), 300);
    }, 5000);
}

// Loading state functions
function showLoadingOverlay() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-overlay';
    loadingDiv.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(loadingDiv);
}

function hideLoadingOverlay() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
}

// Mobile menu functionality
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (!mobileMenu) return;
    
    mobileMenu.classList.toggle('active');
    
    if (mobileMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
    
    trackUserInteraction('mobile_menu_toggle', mobileMenu.classList.contains('active') ? 'open' : 'close');
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (mobileMenu && mobileMenuToggle && !mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target) && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Header scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (!header) return;
    
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Hero chat auto-scrolling functionality
let currentConvoIndex = 0;
let messageIndex = 0;
let messageTimer = null;

function loadHeroConversation() {
    const chatContainer = document.getElementById('heroChat');
    if (!chatContainer) {
        console.log('Hero chat container not found');
        return;
    }
    
    console.log('Loading hero conversation...');
    chatContainer.innerHTML = '<div class="message-timestamp">Today</div>';
    messageIndex = 0;
    
    loadNextMessage();
}

function loadNextMessage() {
    const chatContainer = document.getElementById('heroChat');
    if (!chatContainer) return;
    
    const currentConvo = convoSets[currentConvoIndex];
    if (messageIndex >= currentConvo.bubbles.length) {
        setTimeout(() => {
            currentConvoIndex = (currentConvoIndex + 1) % convoSets.length;
            loadHeroConversation();
        }, 5000);
        return;
    }
    
    const bubble = currentConvo.bubbles[messageIndex];
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${bubble.speaker} animated-message`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    if (bubble.typing) {
        messageContent.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
    } else {
        messageContent.innerHTML = `<p>${bubble.text}</p>`;
    }
    
    messageDiv.appendChild(messageContent);
    
    if (bubble.speaker === 'nurse') {
        const escalationDiv = document.createElement('div');
        escalationDiv.className = 'escalation-indicator active';
        escalationDiv.innerHTML = `
            <div class="nurse-avatar">
                <i class="fas fa-user-nurse"></i>
            </div>
            <div class="escalation-info">
                <span class="escalation-title">Nurse Sarah, RN</span>
                <span class="escalation-subtitle">Cardiac Care Specialist</span>
            </div>
            <span class="escalation-timer">Connected</span>
        `;
        chatContainer.appendChild(escalationDiv);
    }
    
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    messageIndex++;
    messageTimer = setTimeout(loadNextMessage, bubble.typing ? 2000 : 3000);
}

// Build conversation gallery
function buildConversationGallery() {
    console.log('Building conversation gallery...');
    const galleryContainer = document.getElementById('conversationGallery');
    if (!galleryContainer) {
        console.error('Conversation gallery container not found');
        return;
    }
    
    console.log('Gallery container found, clearing and building...');
    galleryContainer.innerHTML = '';
    
    // Create conversation cards for each scenario
    convoSets.forEach((convo, index) => {
        console.log(`Creating card for conversation ${index + 1}: ${convo.scenario}`);
        const card = createConversationCard(convo);
        galleryContainer.appendChild(card);
    });
    
    // Add expanded conversation examples
    const expandedExamples = [
        {
            title: 'Medication Education & Empathy',
            category: 'Post-Discharge Support',
            messages: [
                {
                    speaker: 'ai',
                    text: "I completely understand that confusion, Miss Phillips. Let me walk you through using your inhaler step by step. First, remove the cap and shake it well - about 5 times.",
                    avatar: 'F'
                },
                {
                    speaker: 'user',
                    text: "OK, I'm shaking it now. What's next?",
                    avatar: 'MP'
                },
                {
                    speaker: 'ai',
                    text: "Great! Now breathe out fully to empty your lungs. Place the mouthpiece between your lips, creating a tight seal. As you start to breathe in slowly and deeply, press down on the inhaler to release the medication.",
                    avatar: 'F'
                }
            ],
            source: 'MissPhillips_CMS_45d_CareCoordination.pdf'
        },
        {
            title: 'Early Warning & Nurse Escalation',
            category: 'Symptom Monitoring',
            messages: [
                {
                    speaker: 'user',
                    text: "My ankles are really swollen today and I'm having trouble breathing when I lie down",
                    avatar: 'MP'
                },
                {
                    speaker: 'ai',
                    text: "Miss Phillips, with your increased symptoms - the chest tightness you mentioned, plus that new swelling in your ankles - these could be signs your heart isn't pumping as efficiently as it should.",
                    avatar: 'F'
                },
                {
                    speaker: 'ai',
                    text: "I need to contact Dr. Wilson immediately. Connecting you with Nurse Sarah now...",
                    avatar: 'F',
                    escalation: true
                },
                {
                    speaker: 'nurse',
                    text: "Hi Miss Phillips, this is Nurse Sarah. I see you're experiencing swelling and breathing difficulties. On a scale of 1-10, how difficult is it to breathe right now?",
                    avatar: 'RN'
                }
            ],
            source: 'MissPhillips_CMS_45d_CareCoordination.pdf'
        }
    ];
    
    expandedExamples.forEach((example, index) => {
        console.log(`Creating expanded card ${index + 1}: ${example.title}`);
        const expandedCard = createExpandedConversationCard(example);
        galleryContainer.appendChild(expandedCard);
    });
    
    console.log('Conversation gallery build complete');
}

function createConversationCard(convo) {
    const card = document.createElement('div');
    card.className = 'conversation-card fade-in';
    if (convo.lang === 'es') {
        card.setAttribute('lang', 'es');
    }
    
    // Create header
    const header = document.createElement('div');
    header.className = 'conversation-header';
    
    const title = document.createElement('h3');
    title.className = 'conversation-title';
    title.textContent = convo.scenario;
    header.appendChild(title);
    
    const meta = document.createElement('div');
    meta.className = 'conversation-meta';
    
    const badge = document.createElement('span');
    badge.className = 'conversation-badge';
    badge.innerHTML = `<i class="fas fa-comments"></i> ${convo.bubbles.length} messages`;
    meta.appendChild(badge);
    
    if (convo.lang === 'es') {
        const langBadge = document.createElement('span');
        langBadge.className = 'lang-indicator';
        langBadge.innerHTML = '<i class="fas fa-globe"></i> Español';
        meta.appendChild(langBadge);
    }
    
    header.appendChild(meta);
    card.appendChild(header);
    
    // Create messages container
    const messagesContainer = document.createElement('div');
    messagesContainer.className = 'conversation-messages';
    
    // Add messages (limit to first 5 for preview)
    convo.bubbles.slice(0, 5).forEach((bubble, index) => {
        const message = createMessage(bubble, index);
        messagesContainer.appendChild(message);
    });
    
    card.appendChild(messagesContainer);
    
    // Create footer
    const footer = document.createElement('div');
    footer.className = 'conversation-footer';
    
    const source = document.createElement('span');
    source.className = 'conversation-source';
    source.textContent = `Source: ${convo.source}`;
    footer.appendChild(source);
    
    const action = document.createElement('span');
    action.className = 'conversation-action';
    action.innerHTML = '<i class="fas fa-expand"></i> View full conversation';
    footer.appendChild(action);
    
    card.appendChild(footer);
    
    return card;
}

function createMessage(bubble, index) {
    const message = document.createElement('div');
    message.className = `conv-message ${bubble.speaker}`;
    message.style.animationDelay = `${index * 0.1}s`;
    
    // Create avatar
    const avatar = document.createElement('div');
    avatar.className = 'conv-avatar';
    
    if (bubble.speaker === 'ai') {
        avatar.innerHTML = '<i class="fas fa-robot"></i>';
    } else if (bubble.speaker === 'user') {
        avatar.textContent = 'P';
    } else if (bubble.speaker === 'nurse') {
        avatar.innerHTML = '<i class="fas fa-user-nurse"></i>';
    }
    
    message.appendChild(avatar);
    
    // Create bubble
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'conv-bubble';
    
    if (bubble.typing) {
        bubbleDiv.className += ' typing-indicator';
        bubbleDiv.innerHTML = `
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
        `;
    } else {
        bubbleDiv.textContent = bubble.text;
    }
    
    message.appendChild(bubbleDiv);
    
    return message;
}

function createExpandedConversationCard(example) {
    const card = document.createElement('div');
    card.className = 'expanded-conversation fade-in';
    
    // Create header
    const header = document.createElement('div');
    header.className = 'expanded-header';
    
    const title = document.createElement('h3');
    title.className = 'expanded-title';
    title.textContent = example.title;
    header.appendChild(title);
    
    const badges = document.createElement('div');
    badges.className = 'expanded-badges';
    
    const categoryBadge = document.createElement('span');
    categoryBadge.className = 'category-badge';
    categoryBadge.innerHTML = `<i class="fas fa-tag"></i> ${example.category}`;
    badges.appendChild(categoryBadge);
    
    const messageBadge = document.createElement('span');
    messageBadge.className = 'category-badge';
    messageBadge.innerHTML = `<i class="fas fa-comments"></i> ${example.messages.length} messages`;
    badges.appendChild(messageBadge);
    
    header.appendChild(badges);
    card.appendChild(header);
    
    // Create content
    const content = document.createElement('div');
    content.className = 'expanded-content';
    
    // Create messages container
    const messagesContainer = document.createElement('div');
    messagesContainer.className = 'conversation-messages';
    messagesContainer.style.maxHeight = '500px';
    
    example.messages.forEach((msg, index) => {
        const message = document.createElement('div');
        message.className = `conv-message ${msg.speaker}`;
        message.style.animationDelay = `${index * 0.1}s`;
        
        // Create avatar
        const avatar = document.createElement('div');
        avatar.className = 'conv-avatar';
        avatar.textContent = msg.avatar;
        message.appendChild(avatar);
        
        // Create bubble
        const bubble = document.createElement('div');
        bubble.className = 'conv-bubble';
        bubble.textContent = msg.text;
        message.appendChild(bubble);
        
        messagesContainer.appendChild(message);
        
        // Add escalation indicator if needed
        if (msg.escalation) {
            const escalation = document.createElement('div');
            escalation.className = 'conv-escalation';
            escalation.innerHTML = '<i class="fas fa-exchange-alt"></i> Escalating to human nurse...';
            messagesContainer.appendChild(escalation);
        }
    });
    
    content.appendChild(messagesContainer);
    
    // Add context info
    const context = document.createElement('div');
    context.className = 'expanded-context';
    
    const contexts = [
        { icon: 'fa-file-alt', label: 'Source', value: example.source },
        { icon: 'fa-star', label: 'Quality Score', value: '4.9/5.0' },
        { icon: 'fa-clock', label: 'Response Time', value: '< 2 min' }
    ];
    
    contexts.forEach(ctx => {
        const item = document.createElement('div');
        item.className = 'context-item';
        
        const icon = document.createElement('div');
        icon.className = 'context-icon';
        icon.innerHTML = `<i class="fas ${ctx.icon}"></i>`;
        item.appendChild(icon);
        
        const label = document.createElement('span');
        label.className = 'context-label';
        label.textContent = ctx.label;
        item.appendChild(label);
        
        const value = document.createElement('span');
        value.className = 'context-value';
        value.textContent = ctx.value;
        item.appendChild(value);
        
        context.appendChild(item);
    });
    
    content.appendChild(context);
    card.appendChild(content);
    
    return card;
}

// Scroll to demo section
function scrollToDemo() {
    const demoSection = document.getElementById('demo');
    if (demoSection) {
        const headerOffset = 80;
        const elementPosition = demoSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
        
        trackUserInteraction('scroll_to_demo', 'hero_button');
    }
}

// Launch demo
function launchDemo() {
    showLoadingOverlay();
    trackUserInteraction('demo_launch', 'web_demo');
    
    setTimeout(() => {
        hideLoadingOverlay();
        showSuccessMessage('Demo launching soon! This would open an interactive Florence demo.');
    }, 1000);
}

// Download whitepaper
function downloadWhitepaper() {
    trackUserInteraction('download', 'provider_guide');
    showSuccessMessage('Downloading provider guide... Check your downloads folder.');
}

// Download ROI calculator
function downloadROICalculator() {
    trackUserInteraction('download', 'executive_summary');
    showSuccessMessage('Downloading executive summary... Check your downloads folder.');
}

// Initialize dashboard animation
function initializeDashboardAnimation() {
    const patientCards = document.querySelectorAll('.patient-card');
    patientCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('animated-card');
        }, index * 500);
    });
}

// Counter animation function
function animateCounters() {
    const counters = document.querySelectorAll('.counting');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start animation when element is visible
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counterObserver.observe(counter);
    });
}

// Draw gap closure chart for health plans page
function drawGapClosureChart(canvas) {
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth * 2;
    const height = canvas.height = canvas.offsetHeight * 2;
    canvas.style.width = canvas.offsetWidth + 'px';
    canvas.style.height = canvas.offsetHeight + 'px';
    
    ctx.scale(2, 2);
    
    const centerX = canvas.offsetWidth / 2;
    const centerY = canvas.offsetHeight / 2;
    const radius = 60;
    let progress = 0;
    
    function animate() {
        ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
        
        // Background circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(100, 116, 139, 0.2)';
        ctx.lineWidth = 10;
        ctx.stroke();
        
        // Progress circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + (progress * 2 * Math.PI * 0.75), false);
        ctx.strokeStyle = '#00A86B';
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        // Text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 24px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(Math.floor(progress * 75) + '%', centerX, centerY);
        
        if (progress < 1) {
            progress += 0.02;
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...');
    
    // Track CTA clicks
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            trackUserInteraction('cta_click', buttonText);
        });
    });
    
    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
    
    // Initialize page-specific features
    if (document.querySelector('.patient-page')) {
        console.log('Initializing patient page features...');
        
        // Load hero conversation
        try {
            loadHeroConversation();
        } catch (error) {
            console.error('Error loading hero conversation:', error);
        }
        
        // Build conversation gallery
        try {
            buildConversationGallery();
        } catch (error) {
            console.error('Error building conversation gallery:', error);
        }
        
        // Initialize QR code
        if (document.getElementById('qrcode') && typeof QRCode !== 'undefined') {
            try {
                const url = window.location.origin + '/assets/records/medical-record.xml';
                new QRCode(document.getElementById('qrcode'), {
                    text: url,
                    width: 180,
                    height: 180,
                    colorDark: '#2a3b4c',
                    correctLevel: QRCode.CorrectLevel.H
                });
                console.log('QR code initialized');
            } catch (error) {
                console.error('Error initializing QR code:', error);
            }
        }
    }
    
    if (document.querySelector('.provider-page')) {
        console.log('Initializing provider page features...');
        const providerHero = document.getElementById('providersHero');
        if (providerHero) {
            initializeDashboardAnimation();
        }
    }
    
    if (document.querySelector('.healthplan-page')) {
        console.log('Initializing health plan page features...');
        const gapChart = document.getElementById('gapClosureChart');
        if (gapChart) {
            // Use IntersectionObserver to trigger animation when visible
            const chartObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        drawGapClosureChart(gapChart);
                        chartObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            chartObserver.observe(gapChart);
        }
        
        // Initialize counter animations for health plans
        animateCounters();
    }
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (document.getElementById('conversationGallery')) {
            buildConversationGallery();
        }
        
        const gapChart = document.getElementById('gapClosureChart');
        if (gapChart && document.querySelector('.healthplan-page')) {
            drawGapClosureChart(gapChart);
        }
    }, 250);
});

// Enhanced scroll animations
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    // Parallax effect for hero backgrounds
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
    
    // Floating elements parallax
    document.querySelectorAll('.floating-circle').forEach((el, index) => {
        const speed = 0.5 + (index * 0.1);
        el.style.transform = `translate(${Math.sin(scrolled * 0.001) * 20}px, ${scrolled * speed}px)`;
    });
    
    // ROI circles parallax
    document.querySelectorAll('.roi-circle').forEach((el, index) => {
        const speed = 0.3 + (index * 0.15);
        el.style.transform = `translate(${Math.cos(scrolled * 0.001) * 30}px, ${scrolled * speed}px)`;
    });
});

// Add hover effects to interactive elements - but only after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn, .card, .feature-card').forEach(el => {
        el.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        el.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Export functions to global scope for onclick handlers
window.toggleMobileMenu = toggleMobileMenu;
window.scrollToDemo = scrollToDemo;
window.launchDemo = launchDemo;
window.downloadWhitepaper = downloadWhitepaper;
window.downloadROICalculator = downloadROICalculator;