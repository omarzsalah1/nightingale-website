// Lazy Load Helper for Records Hub Icons
document.addEventListener('DOMContentLoaded', function() {
    // Swap all data-src to src
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    lazyImages.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
    });
    
    // Wait for all hub icons to decode
    const hubIcons = [...document.querySelectorAll('.hub-icon img')];
    
    if (hubIcons.length > 0) {
        Promise.all(hubIcons.map(img => 
            img.complete ? Promise.resolve() : img.decode()
        )).then(() => {
            // Dispatch custom event when all icons are ready
            document.dispatchEvent(new Event('hubIconsReady'));
            console.log('Hub icons ready event dispatched');
        }).catch(err => {
            console.error('Error loading hub icons:', err);
            // Dispatch event anyway to prevent blocking
            document.dispatchEvent(new Event('hubIconsReady'));
        });
    }
});
