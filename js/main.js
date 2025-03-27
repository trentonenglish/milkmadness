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
    
    // Handle performance mode toggle
    const perfModeToggle = document.getElementById('perf-mode');
    
    // Only show performance toggle on mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const perfToggleContainer = document.getElementById('performance-toggle');
    
    if (isMobile) {
        perfToggleContainer.style.display = 'block';
        
        // Initialize performance mode from localStorage or default to true
        const savedPerfMode = localStorage.getItem('performanceMode');
        const initialPerfMode = savedPerfMode !== null ? savedPerfMode === 'true' : true;
        
        // Set the checkbox and CONFIG value
        perfModeToggle.checked = initialPerfMode;
        CONFIG.MOBILE_PERFORMANCE_MODE = initialPerfMode;
        
        // Handle toggle changes
        perfModeToggle.addEventListener('change', () => {
            CONFIG.MOBILE_PERFORMANCE_MODE = perfModeToggle.checked;
            localStorage.setItem('performanceMode', perfModeToggle.checked);
            
            // Show feedback message
            if (UI && UI.showMessage) {
                UI.showMessage(
                    perfModeToggle.checked ? 
                    'Performance Mode ON - Game will run smoother' : 
                    'Performance Mode OFF - Visual effects enabled',
                    2000
                );
            }
        });
    } else {
        // Hide the toggle on desktop
        perfToggleContainer.style.display = 'none';
    }
    
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
    
    // Add additional mobile optimizations
    if (isMobile) {
        // Disable long press context menu
        window.oncontextmenu = function(event) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        };
        
        // Add touch-action CSS to prevent browser handling of touch gestures
        const style = document.createElement('style');
        style.innerHTML = `
            #game-canvas, #game-container {
                touch-action: none;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                user-select: none;
            }
        `;
        document.head.appendChild(style);
    }
});
