// Main JavaScript - COMPLETE UPDATED VERSION WITH ALL FIXES AND VIDEO MODAL
document.addEventListener('DOMContentLoaded', function() {
    // FIXED: Prevent double initialization
    if (window._mainInitDone) return;
    window._mainInitDone = true;
    
    // Initialize counters immediately for fast first paint
    initializeCounters();
    
    // iOS fallback as CTO suggested - run again when idle
    if ('requestIdleCallback' in window) {
        requestIdleCallback(initializeCounters);
    } else {
        setTimeout(initializeCounters, 300);
    }
    
    // Don't duplicate lazy load - it's in lazyload.js now
    
    initializeAnimations();
    initializeMobileMenu();
    initializeScrollEffects();
    initializeParallax();
    initializeStarField();
    initializeSparks();
    
    // Initialize typewriter animation for hero with looping
    initializeTypewriter();
    
    // Initialize scroll animations
    initializeScrollAnimations();
    
    // Initialize mini records hub animation
    initializeMiniRecordsHub();
    
    // Initialize video modal for Florence demo
    initializeVideoModal();
    
    // Fix iOS issues
    fixIOSBackground();
    fixIOSIssues();
    
    // Generate QR Code
    generateQRCode();
    
    // Initialize Florence button after dashboard is ready
    setTimeout(() => {
        if (!document.getElementById('florenceExplainBtn')) {
            initializeFlorenceButton();
        }
    }, 1500);
});

// Video Modal Functionality
function initializeVideoModal() {
    // Create modal HTML
    const modalHTML = `
        <div class="video-modal" id="florenceVideoModal">
            <div class="video-modal-content">
                <button class="video-modal-close" aria-label="Close video"></button>
                <video id="florenceVideo" controls preload="metadata">
                    <source src="video/florencedemo.mp4" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Get elements
    const modal = document.getElementById('florenceVideoModal');
    const video = document.getElementById('florenceVideo');
    const closeBtn = modal.querySelector('.video-modal-close');
    const triggerBtn = document.querySelector('a[href="#patient-chats"].btn.hollow');
    
    if (!triggerBtn) {
        console.error('See Florence in Action button not found');
        return;
    }
    
    // Open modal function
    function openModal(e) {
        e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Play video after modal opens
        setTimeout(() => {
            video.play().catch(err => {
                console.log('Auto-play prevented:', err);
                // User will need to click play manually
            });
        }, 300);
    }
    
    // Close modal function
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        video.pause();
        video.currentTime = 0;
    }
    
    // Event listeners
    triggerBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Update button text to indicate video
    triggerBtn.innerHTML = '<span style="margin-right: 8px;">▶</span> See Florence in Action';
}

/* -------- HERO TYPEWRITER WITH LOOPING -------- */
function initializeTypewriter() {
    const el = document.getElementById('typewrite');
    if (!el) return;
    
    const run = () => {
        el.classList.remove('typing'); // reset
        el.classList.remove('done'); // remove done class
        void el.offsetWidth; // re-flow
        el.style.setProperty('--ch', el.textContent.length);
        el.classList.add('typing');
        
        // Remove cursor after typing animation completes (3.5s)
        setTimeout(() => {
            el.classList.add('done');
            el.classList.remove('typing');
        }, 3500);
    };
    
    run(); // first pass
    // FIXED: Store interval ID and clear on visibility change
    const twId = setInterval(run, 120000); // every 2 min
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) clearInterval(twId);
    });
}

// Initialize reveal animations
function initializeAnimations() {
    const reveals = document.querySelectorAll('[data-reveal]');
    reveals.forEach((el, index) => {
        el.style.animationDelay = index * 0.2 + 's';
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        observer.observe(el);
    });
}

// Initialize counter animations
function initializeCounters() {
    const observers = new WeakMap();
    
    document.querySelectorAll('.metric[data-target]').forEach(el => {
        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            
            const target = +el.dataset.target; // Using '+' correctly parses floats and ints
            const duration = 2000;
            const start = performance.now();
            
            el.parentElement.parentElement.classList.add('animate-in');
            
            const step = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const easeOut = 1 - Math.pow(1 - progress, 3);
                
                // *** THIS IS THE UPDATED LOGIC FOR THE COUNTER ***
                if (target % 1 !== 0) {
                    // If the target is a float, animate with one decimal place
                    el.textContent = (easeOut * target).toFixed(1);
                } else {
                    // Otherwise, animate with a whole number
                    el.textContent = Math.round(easeOut * target);
                }
                
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    el.textContent = target;
                }
            };
            
            requestAnimationFrame(step);
            observer.disconnect();
        }, { threshold: 0.5 });
        
        observers.set(el, observer);
        observer.observe(el);
    });
}

// Mobile menu functionality
function initializeMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav-links');
    
    if (!toggle || !nav) return;
    
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    mobileMenu.innerHTML = nav.innerHTML;
    document.body.appendChild(mobileMenu);
    
    toggle.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.contains('open');
        
        if (isOpen) {
            mobileMenu.classList.remove('open');
            toggle.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            mobileMenu.classList.add('open');
            toggle.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
    
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !toggle.contains(e.target) && mobileMenu.classList.contains('open')) {
            mobileMenu.classList.remove('open');
            toggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Initialize scroll effects
function initializeScrollEffects() {
    let lastScroll = 0;
    const header = document.querySelector('.nav-header');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        parallaxElements.forEach(el => {
            const speed = el.dataset.parallax || 0.5;
            el.style.transform = 'translateY(' + (currentScroll * speed) + 'px)';
        });
        
        lastScroll = currentScroll;
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Parallax effect for hero elements
function initializeParallax() {
    const hero = document.querySelector('.hero-cinematic, .demo-visual');
    if (!hero) return;
    
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        hero.querySelectorAll('[data-depth]').forEach(el => {
            const depth = +el.dataset.depth;
            el.style.transform = 'translate(' + (x * depth * 8) + 'px, ' + (y * depth * 8) + 'px)';
        });
    });
    
    hero.addEventListener('mouseleave', () => {
        hero.querySelectorAll('[data-depth]').forEach(el => {
            el.style.transform = 'translate(0, 0)';
        });
    });
}

// FIXED: Initialize starfield background with better visibility
function initializeStarField() {
    let canvas = document.getElementById('bgStars');
    
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'bgStars';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
            opacity: 0.6;
        `;
        document.body.insertBefore(canvas, document.body.firstChild);
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let stars = [];
    let animationId;
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initStars();
    }
    
    function initStars() {
        stars = [];
        const numStars = Math.min(200, Math.floor((window.innerWidth * window.innerHeight) / 4000));
        
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2.5 + 0.5,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.8 + 0.2,
                pulse: Math.random() * Math.PI * 2,
                color: Math.random() > 0.7 ? '#1FC9C8' : '#FFFFFF'
            });
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        stars.forEach(star => {
            star.x += star.speedX;
            star.y += star.speedY;
            star.pulse += 0.02;
            
            if (star.x < -10) star.x = canvas.width + 10;
            if (star.x > canvas.width + 10) star.x = -10;
            if (star.y < -10) star.y = canvas.height + 10;
            if (star.y > canvas.height + 10) star.y = -10;
            
            const pulseFactor = 0.5 + Math.sin(star.pulse) * 0.5;
            
            if (star.color === '#1FC9C8') {
                ctx.save();
                ctx.globalAlpha = star.opacity * pulseFactor * 0.3;
                
                const gradient = ctx.createRadialGradient(
                    star.x, star.y, 0,
                    star.x, star.y, star.size * 8
                );
                gradient.addColorStop(0, 'rgba(31, 201, 200, 0.8)');
                gradient.addColorStop(0.5, 'rgba(31, 201, 200, 0.3)');
                gradient.addColorStop(1, 'transparent');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size * 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
            
            ctx.save();
            ctx.globalAlpha = star.opacity * (0.7 + pulseFactor * 0.3);
            ctx.fillStyle = star.color;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
        
        animationId = requestAnimationFrame(animate);
    }
    
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        } else {
            if (!animationId) {
                animate();
            }
        }
    });
    
    window.addEventListener('resize', () => {
        resize();
    });
    
    resize();
    animate();
}

// FIXED: Initialize sparks animation with better visibility
function initializeSparks() {
    let canvas = document.getElementById('sparks');
    
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'sparks';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
            opacity: 0.3;
        `;
        document.body.insertBefore(canvas, document.body.firstChild);
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let sparks = [];
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    class Spark {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 10;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = -Math.random() * 3 - 2;
            this.life = 1;
            this.decay = Math.random() * 0.01 + 0.005;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life -= this.decay;
            
            if (this.life <= 0) {
                return false;
            }
            return true;
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.life;
            ctx.fillStyle = '#1FC9C8';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#1FC9C8';
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
    function animateSparks() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (Math.random() < 0.02) {
            sparks.push(new Spark());
        }
        
        sparks = sparks.filter(spark => {
            if (spark.update()) {
                spark.draw();
                return true;
            }
            return false;
        });
        
        requestAnimationFrame(animateSparks);
    }
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    animateSparks();
}

/* -------- MINI RECORDS HUB ANIMATION -------- */
// Replace the entire old function with this new one

/* -------- MINI RECORDS HUB ANIMATION -------- */
// Replace the entire old function with this new one

function initializeMiniRecordsHub() {
    const hub = document.getElementById('miniRecordsHub');
    if (!hub) {
        console.log('Mini Records Hub not found');
        return;
    }
    
    console.log('Initializing Mini Records Hub');
    
    const svg = hub.querySelector('.hub-connections');
    const hubGlow = hub.querySelector('.hub-glow-layer');
    const icons = hub.querySelectorAll('.mini-hub-icon');
    
    // UPDATED VALUES FOR NEW LAYOUT
    const centerX = 227.5; // Stays the same (Half of 455px)
    const centerY = 227.5; // Stays the same
    const lineAndPulseRadius = 140;   // UPDATED from 169px to shorten the lines
    
    console.log('Found icons:', icons.length);
    
    // Create connection lines
    icons.forEach((icon, index) => {
        const angle = parseFloat(icon.style.getPropertyValue('--angle')) * Math.PI / 180;
        const x2 = centerX + lineAndPulseRadius * Math.cos(angle);
        const y2 = centerY + lineAndPulseRadius * Math.sin(angle);
        
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', centerX);
        line.setAttribute('y1', centerY);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.classList.add('connection-line');
        line.dataset.index = index;
        svg.appendChild(line);
    });
    
    // Staggered wake-up animation when hub comes into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hub.hasAttribute('data-animated')) {
                console.log('Hub is in view, starting animation');
                hub.setAttribute('data-animated', 'true');
                
                // Wake up icons one by one
                icons.forEach((icon, index) => {
                    setTimeout(() => {
                        icon.classList.add('wake-up');
                        icon.style.opacity = '1'; // Force visibility
                    }, index * 150);
                });
                
                // Start pulse animations after all icons are awake
                setTimeout(() => {
                    startDataPulses();
                }, icons.length * 150 + 500);
            }
        });
    }, { threshold: 0.1 });
    
    observer.observe(hub);
    
    // Create and animate data pulses
    function createPulse(iconIndex) {
        const icon = icons[iconIndex];
        const line = svg.querySelector(`line[data-index="${iconIndex}"]`);
        if (!icon || !line) return;
        
        // Pulse the icon
        icon.classList.add('sending-pulse');
        setTimeout(() => icon.classList.remove('sending-pulse'), 600);
        
        // Highlight the connection line
        line.classList.add('active');
        
        // Create traveling pulse
        const pulse = document.createElement('div');
        pulse.className = `data-pulse type-${(iconIndex % 3) + 1}`;
        hub.querySelector('.mini-hub-wrapper').appendChild(pulse);
        
        // Get line coordinates
        const angle = parseFloat(icon.style.getPropertyValue('--angle')) * Math.PI / 180;
        const startX = centerX + lineAndPulseRadius * Math.cos(angle);
        const startY = centerY + lineAndPulseRadius * Math.sin(angle);
        
        // Position pulse at icon
        pulse.style.left = startX + 'px';
        pulse.style.top = startY + 'px';
        
        // Animate pulse to center
        const duration = 1500;
        const startTime = performance.now();
        
        function animatePulse(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth movement
            const easeInOut = progress < 0.5 
                ? 2 * progress * progress 
                : -1 + (4 - 2 * progress) * progress;
            
            const currentX = startX + (centerX - startX) * easeInOut;
            const currentY = startY + (centerY - startY) * easeInOut;
            
            pulse.style.left = currentX - 4 + 'px'; // Center the 8px pulse
            pulse.style.top = currentY - 4 + 'px';
            
            if (progress < 1) {
                requestAnimationFrame(animatePulse);
            } else {
                // Pulse reached center - make hub glow
                hubGlow.classList.add('pulse-received');
                setTimeout(() => hubGlow.classList.remove('pulse-received'), 600);
                
                // Clean up
                pulse.remove();
                line.classList.remove('active');
            }
        }
        
        requestAnimationFrame(animatePulse);
    }
    
    // Start random pulse animations
    function startDataPulses() {
        console.log('Starting data pulses');
        
        // Random pulse generation
        function sendRandomPulse() {
            const randomIcon = Math.floor(Math.random() * icons.length);
            createPulse(randomIcon);
            
            // Schedule next pulse (between 1-3 seconds)
            const nextDelay = 3000 + Math.random() * 6000;
            setTimeout(sendRandomPulse, nextDelay);
        }
        
        // Start with two offset pulse streams
        sendRandomPulse();
        setTimeout(sendRandomPulse, 4500);
    }
    
    // Handle mobile responsive sizing
    function updateSizing() {
        const width = hub.offsetWidth;
        svg.setAttribute('viewBox', `0 0 ${width} ${width}`);
        
        // Update center points based on actual size
        const newCenter = width / 2;
        const scale = width / 455; // Original size is now 455px
        
        // Update line positions
        svg.querySelectorAll('line').forEach((line, index) => {
            const angle = (index * 45) * Math.PI / 180;
            const newRadius = lineAndPulseRadius * scale;
            
            line.setAttribute('x1', newCenter);
            line.setAttribute('y1', newCenter);
            line.setAttribute('x2', newCenter + newRadius * Math.cos(angle));
            line.setAttribute('y2', newCenter + newRadius * Math.sin(angle));
        });
    }
    
    // Update sizing on resize
    window.addEventListener('resize', updateSizing);
    updateSizing();
    
    // Force icons to be visible immediately (temporary fix)
    icons.forEach(icon => {
        icon.style.opacity = '1';
    });
}

// Florence Explain Button functionality
let florenceAudio = null;

function initializeFlorenceButton() {
    if (document.getElementById('florenceExplainBtn') || window.florenceButtonCreated) {
        return;
    }
    
    window.florenceButtonCreated = true;
    
    const dashboardSection = document.querySelector('.dashboard-section');
    if (!dashboardSection) {
        window.florenceButtonCreated = false;
        return;
    }
    
    const florenceSummary = dashboardSection.querySelector('.florence-summary');
    if (!florenceSummary) {
        window.florenceButtonCreated = false;
        return;
    }
    
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'florenceButtonContainer';
    buttonContainer.style.textAlign = 'center';
    buttonContainer.style.marginBottom = '2rem';
    
    buttonContainer.innerHTML = `
        <button class="florence-explain-btn" id="florenceExplainBtn" role="switch" aria-checked="false">
            <img src="icons/speaker-muted.svg" alt="" class="speaker-icon muted">
            <img src="icons/speaker.svg" alt="" class="speaker-icon unmuted" style="display:none;">
            <span>Have Florence explain your labs</span>
        </button>
    `;
    
    florenceSummary.parentNode.insertBefore(buttonContainer, florenceSummary);
    
    const button = document.getElementById('florenceExplainBtn');
    
    if (!florenceAudio) {
        florenceAudio = new Audio('audio/esrd-summary.mp3');
        florenceAudio.preload = 'metadata';
        
        florenceAudio.addEventListener('ended', function() {
            const btn = document.getElementById('florenceExplainBtn');
            if (btn) {
                btn.classList.remove('playing');
                const mutedIcon = btn.querySelector('.speaker-icon.muted');
                const unmutedIcon = btn.querySelector('.speaker-icon.unmuted');
                if (mutedIcon) mutedIcon.style.display = 'block';
                if (unmutedIcon) unmutedIcon.style.display = 'none';
                // FIXED: Update ARIA state
                btn.setAttribute('aria-checked', 'false');
            }
        });
    }
    
    button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const mutedIcon = this.querySelector('.speaker-icon.muted');
        const unmutedIcon = this.querySelector('.speaker-icon.unmuted');
        
        if (!florenceAudio) return;
        
        if (florenceAudio.paused) {
            florenceAudio.currentTime = 0;
            
            const playPromise = florenceAudio.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    this.classList.add('playing');
                    mutedIcon.style.display = 'none';
                    unmutedIcon.style.display = 'block';
                    // FIXED: Update ARIA state
                    this.setAttribute('aria-checked', 'true');
                }).catch(err => {
                    console.error('Error playing Florence audio:', err.message);
                });
            }
        } else {
            florenceAudio.pause();
            this.classList.remove('playing');
            mutedIcon.style.display = 'block';
            unmutedIcon.style.display = 'none';
            // FIXED: Update ARIA state
            this.setAttribute('aria-checked', 'false');
        }
    });
}

// iOS Background Fix
function fixIOSBackground() {
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        const bgLayer = document.createElement('div');
        bgLayer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #06080E !important;
            z-index: -10;
            pointer-events: none;
        `;
        document.body.appendChild(bgLayer);
        
        window.addEventListener('orientationchange', () => {
            document.body.style.backgroundColor = '#06080E';
            document.documentElement.style.backgroundColor = '#06080E';
        });
        
        setInterval(() => {
            if (document.body.style.backgroundColor !== 'rgb(6, 8, 14)') {
                document.body.style.backgroundColor = '#06080E';
            }
        }, 500);
    }
}

// Additional iOS fixes
function fixIOSIssues() {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    }
}

// Intersection Observer for scroll-triggered animations
function initializeScrollAnimations() {
    const animatedElements = [
        { selector: '.stat-item', class: 'animate-in' },
        { selector: '.feature-visual', class: 'animate-in' },
        { selector: '.tile', class: 'animate-in' },
        { selector: '.chart-container', class: 'animate-in' },
        { selector: '.table-wrapper', class: 'animate-in' },
        { selector: '.florence-summary', class: 'animate-in' },
        { selector: '.qr-card', class: 'animate-in' },
        { selector: '.testimonial-card', class: 'animate-in' },
        { selector: '.health-card', class: 'animate-in' },
        { selector: '.feature-item', class: 'animate-in' },
        { selector: '.app-banner', class: 'animate-in' }
    ];
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                if (entry.target.classList.contains('chart-container')) {
                    const canvas = entry.target.querySelector('canvas');
                    if (canvas && canvas.chart) {
                        canvas.chart.reset();
                        canvas.chart.update();
                    }
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    animatedElements.forEach(config => {
        document.querySelectorAll(config.selector).forEach(el => {
            observer.observe(el);
        });
    });
}

// Generate QR Code
function generateQRCode() {
    const qrCanvas = document.getElementById('qrCanvas');
    if (!qrCanvas) return;
    
    const qrCtx = qrCanvas.getContext('2d');
    
    qrCanvas.width = 280;
    qrCanvas.height = 280;
    
    qrCtx.fillStyle = '#000';
    qrCtx.fillRect(0, 0, 280, 280);
    
    const cellSize = 7;
    const cells = Math.floor(280 / cellSize);
    
    qrCtx.fillStyle = '#00f7ff';
    
    const pattern = [];
    for (let i = 0; i < cells; i++) {
        pattern[i] = [];
        for (let j = 0; j < cells; j++) {
            pattern[i][j] = Math.random() > 0.5;
        }
    }
    
    for (let i = 0; i < cells; i++) {
        for (let j = 0; j < cells; j++) {
            if (pattern[i][j]) {
                qrCtx.fillRect(i * cellSize, j * cellSize, cellSize - 1, cellSize - 1);
            }
        }
    }
    
    function drawCornerMarker(x, y) {
        const markerSize = cellSize * 7;
        
        qrCtx.fillRect(x, y, markerSize, markerSize);
        qrCtx.clearRect(x + cellSize, y + cellSize, markerSize - cellSize * 2, markerSize - cellSize * 2);
        qrCtx.fillRect(x + cellSize * 2, y + cellSize * 2, cellSize * 3, cellSize * 3);
    }
    
    drawCornerMarker(0, 0);
    drawCornerMarker(280 - cellSize * 7, 0);
    drawCornerMarker(0, 280 - cellSize * 7);
    
    const centerX = Math.floor(cells / 2) - 2;
    const centerY = Math.floor(cells / 2) - 2;
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            if (i === 0 || i === 4 || j === 0 || j === 4 || (i === 2 && j === 2)) {
                qrCtx.fillRect((centerX + i) * cellSize, (centerY + j) * cellSize, cellSize - 1, cellSize - 1);
            }
        }
    }
}

// Cursor follow glow on buttons
document.querySelectorAll('.btn-glow').forEach(btn => {
    btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        btn.style.setProperty('--mx', e.clientX - rect.left);
        btn.style.setProperty('--my', e.clientY - rect.top);
    });
});

// Add mobile menu styles
const mobileMenuStyles = `
    .mobile-menu {
        position: fixed;
        top: 0;
        right: -300px;
        width: 300px;
        height: 100vh;
        background: var(--bg-primary);
        border-left: 1px solid var(--glass-border);
        padding: 80px 2rem 2rem;
        transition: right 0.3s ease;
        z-index: 999;
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }
    
    .mobile-menu.open {
        right: 0;
    }
    
    .mobile-menu .nav-link {
        display: block;
        padding: 1rem 0;
        font-size: 1.2rem;
    }
    
    .mobile-menu .btn {
        width: 100%;
        justify-content: center;
    }
    
    .mobile-menu-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .mobile-menu-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .mobile-menu-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    .nav-header.scrolled {
        background: rgba(6, 8, 14, 0.95);
        backdrop-filter: blur(30px);
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = mobileMenuStyles;
document.head.appendChild(styleSheet);