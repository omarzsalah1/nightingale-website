// Count-up animation utility
export function countUp(element, endValue, duration = 1500) {
    let startValue = 0;
    let startTime = null;
    
    const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        const currentValue = Math.floor(easeOutQuart * endValue);
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            element.textContent = endValue;
        }
    };
    
    requestAnimationFrame(step);
}

// Initialize count-up animations with data attributes
document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('[data-count], .metric[data-target]');
    
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const end = parseInt(el.dataset.count || el.dataset.target);
                
                if (el.classList.contains('metric')) {
                    // For metric class elements
                    let n = 0;
                    const timer = setInterval(() => {
                        el.textContent = ++n;
                        if (n === end) clearInterval(timer);
                    }, 25);
                } else {
                    // For regular count-up
                    countUp(el, end);
                }
                
                io.unobserve(el);
            }
        });
    }, { threshold: 0.6 });
    
    counters.forEach(counter => io.observe(counter));
});