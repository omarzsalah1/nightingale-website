// Sticky CTA Utility
export function initStickyCTA() {
    const stickyCta = document.getElementById('stickyCta');
    if (!stickyCta) return;
    
    let isVisible = false;
    const showThreshold = 600;
    const hideThreshold = 400;
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        if (scrollY > showThreshold && !isVisible) {
            stickyCta.classList.add('visible');
            isVisible = true;
        } else if (scrollY < hideThreshold && isVisible) {
            stickyCta.classList.remove('visible');
            isVisible = false;
        }
    }, { passive: true });
    
    // Add analytics tracking
    const ctaButton = stickyCta.querySelector('.btn');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    'event_category': 'Sticky CTA',
                    'event_label': 'Book Call',
                    'value': 1
                });
            }
        });
    }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStickyCTA);
} else {
    initStickyCTA();
}