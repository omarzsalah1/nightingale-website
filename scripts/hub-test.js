// Simple test to force hub animation
document.addEventListener('DOMContentLoaded', function() {
    console.log('Hub Test Script Running...');
    
    // Wait a bit for everything to load
    setTimeout(() => {
        // Get all hub elements
        const wrapper = document.querySelector('.records-animation-wrapper');
        const hub = document.querySelector('#hub');
        const hubIcons = document.querySelectorAll('.hub-icon');
        const svgLines = document.getElementById('hubLines');
        
        console.log('Hub elements found:', {
            wrapper: !!wrapper,
            hub: !!hub,
            icons: hubIcons.length,
            svg: !!svgLines
        });
        
        if (!wrapper || !hub || hubIcons.length === 0) {
            console.error('Missing hub elements!');
            return;
        }
        
        // Make hub visible
        hub.style.opacity = '1';
        
        // Position icons in a circle
        const box = wrapper.getBoundingClientRect();
        const centerX = box.width / 2;
        const centerY = box.height / 2;
        const radius = Math.min(box.width, box.height) / 2 - 80;
        
        console.log('Positioning icons - Center:', centerX, centerY, 'Radius:', radius);
        
        hubIcons.forEach((icon, i) => {
            const angle = (2 * Math.PI / hubIcons.length) * i - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle) - 36;
            const y = centerY + radius * Math.sin(angle) - 36;
            
            icon.style.position = 'absolute';
            icon.style.left = x + 'px';
            icon.style.top = y + 'px';
            icon.style.opacity = '1';
            icon.style.transition = 'opacity 0.6s ease-out';
            
            console.log(`Icon ${i} at:`, x, y);
            
            // Draw a simple line
            setTimeout(() => {
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', centerX);
                line.setAttribute('y1', centerY);
                line.setAttribute('x2', x + 36);
                line.setAttribute('y2', y + 36);
                line.setAttribute('stroke', '#1FC9C8');
                line.setAttribute('stroke-width', '2');
                line.style.opacity = '1';
                svgLines.appendChild(line);
                
                console.log(`Line ${i} drawn`);
            }, i * 300);
        });
        
        // Update counter
        const counter = document.getElementById('recordCount');
        if (counter) {
            let count = 0;
            const interval = setInterval(() => {
                count += 5;
                counter.textContent = count + ' records';
                if (count >= 100) clearInterval(interval);
            }, 100);
        }
        
    }, 1000);
});