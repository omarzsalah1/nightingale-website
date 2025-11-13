// Health Plan Charts Module - Fixed without export

// Draw gap closure chart
function drawGapClosureChart() {
    const canvas = document.getElementById('gapChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 80;
    
    let progress = 0;
    const targetProgress = 0.75; // 75%
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Background circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 15;
        ctx.stroke();
        
        // Progress circle
        ctx.beginPath();
        ctx.arc(
            centerX, 
            centerY, 
            radius, 
            -Math.PI / 2, 
            -Math.PI / 2 + (progress * 2 * Math.PI), 
            false
        );
        ctx.strokeStyle = '#4ADE80';
        ctx.lineWidth = 15;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        // Center text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 36px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(Math.floor(progress * 100) + '%', centerX, centerY - 10);
        
        // Label
        ctx.font = '14px Inter';
        ctx.fillStyle = '#A8B2C7';
        ctx.fillText('Gap Closure', centerX, centerY + 20);
        
        if (progress < targetProgress) {
            progress += 0.01;
            requestAnimationFrame(animate);
        }
    }
    
    // Start animation when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animate();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(canvas);
}

// Initialize charts when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', drawGapClosureChart);
} else {
    drawGapClosureChart();
}