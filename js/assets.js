// Asset Manager
const ASSETS = {
    // Asset containers
    images: {},
    sounds: {},
    
    // Total assets to load
    totalAssets: 0,
    loadedAssets: 0,
    
    // Load all game assets
    loadAssets(callback) {
        // Define image assets with both lowercase and uppercase paths for fallback
        const imageAssets = {
            'cookie': ['images/choco chip (1).png', 'Images/choco chip (1).png'],
            'defender': ['images/monster 1.png', 'Images/monster 1.png'],
            'logo': ['images/Logo Mark Color (3).png', 'Images/Logo Mark Color (3).png']
        };
        
        // Define sound assets with paths to the sound files
        const soundAssets = {
            'flap': 'sounds/flap.mp3',
            'dunk': 'sounds/dunk.mp3',
            'perfect': 'sounds/perfect.mp3',
            'crumble': 'sounds/crumble.mp3',
            'powerup': 'sounds/powerup.mp3',
            'fire': 'sounds/fire.mp3',
            'rejected': 'sounds/rejected.mp3',
            'bgMusic': 'sounds/bgMusic.mp3'
        };
        
        // Set total assets to load
        this.totalAssets = Object.keys(imageAssets).length + Object.keys(soundAssets).length;
        
        // Load image assets
        for (const key in imageAssets) {
            this.loadImage(key, imageAssets[key]);
        }
        
        // Load sound assets
        for (const key in soundAssets) {
            this.loadSound(key, soundAssets[key]);
        }
        
        // Check if all assets are loaded
        const checkAllLoaded = () => {
            if (this.loadedAssets === this.totalAssets) {
                callback();
            } else {
                setTimeout(checkAllLoaded, 100);
            }
        };
        
        // Start checking
        checkAllLoaded();
    },
    
    // Load an image asset with fallback paths
    loadImage(key, paths) {
        const img = new Image();
        
        // Try to load the first path, fall back to the second if it fails
        img.onerror = () => {
            if (Array.isArray(paths) && paths.length > 1) {
                console.log(`Failed to load ${paths[0]}, trying ${paths[1]}`);
                img.src = paths[1];
            } else {
                console.error(`Failed to load image: ${paths}`);
                this.loadedAssets++;
            }
        };
        
        img.onload = () => {
            this.images[key] = img;
            this.loadedAssets++;
            console.log(`Loaded image: ${key}`);
        };
        
        // Start loading the image
        img.src = Array.isArray(paths) ? paths[0] : paths;
    },
    
    // Load a sound asset
    loadSound(key, src) {
        const audio = new Audio();
        
        audio.addEventListener('canplaythrough', () => {
            this.sounds[key] = audio;
            this.loadedAssets++;
            console.log(`Loaded sound: ${key}`);
        }, { once: true });
        
        audio.addEventListener('error', () => {
            console.error(`Failed to load sound: ${src}`);
            this.loadedAssets++;
        });
        
        audio.src = src;
        audio.load();
    },
    
    // Play sound
    playSound(key, volume = 1.0, loop = false) {
        if (this.sounds[key]) {
            const sound = this.sounds[key];
            sound.currentTime = 0;
            sound.volume = volume;
            sound.loop = loop;
            
            // Create a promise that resolves when the sound ends
            const playPromise = sound.play();
            
            // Handle play errors
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error(`Error playing sound ${key}:`, error);
                });
            }
        }
    },
    
    // Stop sound
    stopSound(key) {
        if (this.sounds[key]) {
            this.sounds[key].pause();
            this.sounds[key].currentTime = 0;
        }
    },
    
    // Draw cookie
    drawCookie(ctx, x, y, width, height, rotation = 0) {
        // Save context state
        ctx.save();
        
        // Translate to center of cookie for rotation
        ctx.translate(x + width/2, y + height/2);
        ctx.rotate(rotation);
        
        // Draw cookie image if loaded
        if (this.images['cookie'] && this.images['cookie'].complete) {
            ctx.drawImage(
                this.images['cookie'],
                -width/2, -height/2,
                width, height
            );
        } else {
            // Fallback to drawn cookie
            ctx.fillStyle = '#D2691E';
            ctx.beginPath();
            ctx.arc(0, 0, width/2, 0, Math.PI * 2);
            ctx.fill();
            
            // Add chocolate chips
            ctx.fillStyle = '#3D1C02';
            for (let i = 0; i < 5; i++) {
                const chipX = (Math.random() - 0.5) * width * 0.6;
                const chipY = (Math.random() - 0.5) * height * 0.6;
                ctx.beginPath();
                ctx.arc(chipX, chipY, width * 0.1, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Restore context state
        ctx.restore();
    },
    
    // Draw defender (cookie monster)
    drawDefender(ctx, x, y, width, height) {
        // Draw monster image if loaded
        if (this.images['defender'] && this.images['defender'].complete) {
            ctx.drawImage(
                this.images['defender'],
                x, y,
                width, height
            );
        } else {
            // Fallback to drawn monster
            ctx.fillStyle = '#0077FF';
            ctx.fillRect(x, y, width, height);
            
            // Draw eyes
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(x + width * 0.3, y + height * 0.3, width * 0.15, 0, Math.PI * 2);
            ctx.arc(x + width * 0.7, y + height * 0.3, width * 0.15, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw pupils
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(x + width * 0.3, y + height * 0.3, width * 0.07, 0, Math.PI * 2);
            ctx.arc(x + width * 0.7, y + height * 0.3, width * 0.07, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw mouth
            ctx.beginPath();
            ctx.arc(x + width/2, y + height * 0.7, width * 0.3, 0, Math.PI);
            ctx.stroke();
        }
    }
};

// Create and export the asset manager instance
window.ASSETS = ASSETS;
