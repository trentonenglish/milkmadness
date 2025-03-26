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
        // Define image assets
        const imageAssets = {
            'cookie': 'Images/choco chip (1).png',
            'defender': 'Images/monster 1.png',
            'logo': 'Images/Logo Mark Color (3).png'
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
        
        // Count total assets to load
        this.totalAssets = Object.keys(imageAssets).length + Object.keys(soundAssets).length;
        this.loadedAssets = 0;
        
        console.log(`Loading ${this.totalAssets} assets...`);
        
        // Load images
        for (const [key, src] of Object.entries(imageAssets)) {
            this.loadImage(key, src);
        }
        
        // Load sounds
        for (const [key, src] of Object.entries(soundAssets)) {
            this.loadSound(key, src);
        }
        
        // Check if all assets are loaded
        const checkInterval = setInterval(() => {
            if (this.loadedAssets >= this.totalAssets) {
                clearInterval(checkInterval);
                console.log('All assets loaded');
                callback();
            }
        }, 100);
    },
    
    // Load image asset
    loadImage(key, src) {
        console.log(`Loading image: ${src}`);
        const img = new Image();
        
        img.onload = () => {
            console.log(`Image loaded: ${src}`);
            this.loadedAssets++;
        };
        
        img.onerror = () => {
            console.error(`Failed to load image: ${src}`);
            this.loadedAssets++;
        };
        
        img.src = src;
        this.images[key] = img;
    },
    
    // Load sound asset
    loadSound(key, src) {
        console.log(`Loading sound: ${src}`);
        const sound = new Audio();
        
        sound.addEventListener('canplaythrough', () => {
            console.log(`Sound loaded: ${src}`);
            this.loadedAssets++;
        }, { once: true });
        
        sound.addEventListener('error', () => {
            console.error(`Failed to load sound: ${src}. Creating empty audio object.`);
            // Still count as loaded to avoid blocking the game
            this.loadedAssets++;
        });
        
        // Set a timeout in case the sound file doesn't trigger any events
        setTimeout(() => {
            if (!this.sounds[key] || this.sounds[key] !== sound) {
                console.warn(`Sound loading timed out: ${src}`);
                this.loadedAssets++;
            }
        }, 3000);
        
        // Try to load the sound
        try {
            sound.src = src;
            this.sounds[key] = sound;
        } catch (e) {
            console.error(`Error setting sound source: ${e.message}`);
            this.sounds[key] = new Audio(); // Create empty audio object
            this.loadedAssets++;
        }
    },
    
    // Play sound
    playSound(key, loop = false) {
        if (!this.sounds[key]) {
            console.warn(`Sound not found: ${key}`);
            return null;
        }
        
        try {
            // Create a new instance for overlapping sounds
            const sound = this.sounds[key].cloneNode();
            sound.loop = loop;
            sound.volume = 0.5; // Set a reasonable volume
            
            // Play the sound
            const playPromise = sound.play();
            
            // Handle play promise (might be rejected if user hasn't interacted with the page)
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn(`Sound play failed (${key}): ${error}`);
                });
            }
            
            return sound;
        } catch (e) {
            console.error(`Error playing sound ${key}: ${e.message}`);
            return null;
        }
    },
    
    // Stop sound
    stopSound(sound) {
        if (sound && typeof sound.pause === 'function') {
            try {
                sound.pause();
                sound.currentTime = 0;
            } catch (e) {
                console.error(`Error stopping sound: ${e.message}`);
            }
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
