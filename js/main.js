// Main entry point for the game
document.addEventListener('DOMContentLoaded', () => {
    // Get the canvas element
    const canvas = document.getElementById('game-canvas');
    
    // Set canvas dimensions to match container
    const resizeCanvas = () => {
        const container = document.getElementById('game-container');
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    };
    
    // Resize canvas initially and on window resize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create game instance with canvas
    const game = new Game(canvas);
    
    // Load assets
    ASSETS.loadAssets(() => {
        console.log('Assets loaded, game ready to start');
        
        // Initialize UI with loaded assets
        UI.init();
        
        // Initialize Firebase for leaderboard
        try {
            Leaderboard.init();
        } catch (e) {
            console.warn('Firebase initialization failed:', e);
            // Show a message to the user
            UI.showMessage('Leaderboard unavailable');
        }
        
        // Show tutorial overlay
        const tutorialOverlay = document.getElementById('tutorial-overlay');
        tutorialOverlay.style.display = 'flex'; // Make sure it's visible
        
        // Start game button
        document.getElementById('start-game-btn').addEventListener('click', () => {
            tutorialOverlay.style.display = 'none';
            game.init();
        });
        
        // Also allow tapping on the tutorial to start
        tutorialOverlay.addEventListener('click', (e) => {
            // Only if the click is outside the tutorial content
            if (e.target === tutorialOverlay) {
                tutorialOverlay.style.display = 'none';
                game.init();
            }
        });
        
        // Allow spacebar to start the game
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && tutorialOverlay.style.display !== 'none') {
                e.preventDefault();
                tutorialOverlay.style.display = 'none';
                game.init();
            }
        });
    });
    
    // Prevent default touch behavior to avoid scrolling on mobile
    document.addEventListener('touchmove', (e) => {
        if (e.target.id === 'game-canvas') {
            e.preventDefault();
        }
    }, { passive: false });
});
