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
        // Get the base URL for GitHub Pages
        const isGitHubPages = window.location.hostname.includes('github.io');
        const repoName = 'milkmadness'; // Your repository name
        const baseUrl = isGitHubPages ? `/${repoName}/` : '';
        
        console.log(`Loading assets with baseUrl: ${baseUrl}`);
        
        // Define image assets with fallback paths
        const imageAssets = {
            'cookie': [
                `${baseUrl}Images/choco chip (1).png`, 
                `${baseUrl}images/choco chip (1).png`,
                'Images/choco chip (1).png', 
                'images/choco chip (1).png'
            ],
            'defender': [
                `${baseUrl}Images/monster 1.png`, 
                `${baseUrl}images/monster 1.png`,
                'Images/monster 1.png', 
                'images/monster 1.png'
            ],
            'logo': [
                `${baseUrl}Images/Logo Mark Color (3).svg`, 
                `${baseUrl}images/Logo Mark Color (3).svg`,
                'Images/Logo Mark Color (3).svg', 
                'images/Logo Mark Color (3).svg'
            ],
            'whisk': [
                `${baseUrl}Images/whisk.png`, 
                `${baseUrl}images/whisk.png`,
                'Images/whisk.png', 
                'images/whisk.png'
            ],
            'background': [
                `${baseUrl}Images/ChatGPT Image Mar 26, 2025, 03_14_34 PM.svg`, 
                `${baseUrl}images/ChatGPT Image Mar 26, 2025, 03_14_34 PM.svg`,
                'Images/ChatGPT Image Mar 26, 2025, 03_14_34 PM.svg', 
                'images/ChatGPT Image Mar 26, 2025, 03_14_34 PM.svg'
            ]
        };
        
        // Define sound assets with paths to the sound files
        const soundAssets = {
            'flap': `${baseUrl}sounds/flap.mp3`,
            'dunk': `${baseUrl}sounds/dunk.mp3`,
            'perfect': `${baseUrl}sounds/perfect.mp3`,
            'crumble': `${baseUrl}sounds/crumble.mp3`,
            'powerup': `${baseUrl}sounds/powerup.mp3`,
            'fire': `${baseUrl}sounds/fire.mp3`,
            'rejected': `${baseUrl}sounds/rejected.mp3`,
            'bgMusic': `${baseUrl}sounds/bgMusic.mp3`
        };
        
        // Count total assets to load
        this.totalAssets = Object.keys(imageAssets).length + Object.keys(soundAssets).length;
        this.loadedAssets = 0;
        
        console.log(`Loading ${this.totalAssets} assets...`);
        
        // Load images
        for (const [key, paths] of Object.entries(imageAssets)) {
            this.loadImageWithFallback(key, paths);
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
    
    // Load image asset with fallback paths
    loadImageWithFallback(key, paths) {
        console.log(`Loading image: ${key} with paths:`, paths);
        const img = new Image();
        let pathIndex = 0;
        
        const tryNextPath = () => {
            if (pathIndex >= paths.length) {
                console.error(`Failed to load image ${key} after trying all paths`);
                this.loadedAssets++;
                return;
            }
            
            const src = paths[pathIndex];
            console.log(`Trying path ${pathIndex + 1}/${paths.length}: ${src}`);
            img.src = src;
            pathIndex++;
        };
        
        img.onload = () => {
            console.log(`Image loaded: ${key} from ${img.src}`);
            this.loadedAssets++;
        };
        
        img.onerror = () => {
            console.error(`Failed to load image: ${img.src}, trying next path...`);
            tryNextPath();
        };
        
        // Start with first path
        tryNextPath();
        this.images[key] = img;
    },
    
    // Load image asset (legacy method)
    loadImage(key, src) {
        return this.loadImageWithFallback(key, Array.isArray(src) ? src : [src]);
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
            console.error(`Error setting sound source: ${e}`);
            this.loadedAssets++;
        }
    },
    
    // Play sound
    playSound(key, volume = 1.0, loop = false) {
        if (!this.sounds[key]) {
            console.warn(`Sound not found: ${key}`);
            return;
        }
        
        try {
            // Create a new Audio instance from the original
            const soundInstance = new Audio();
            soundInstance.src = this.sounds[key].src;
            
            // Set volume and loop
            soundInstance.volume = volume;
            soundInstance.loop = loop;
            
            // Play the sound
            soundInstance.play().catch(e => {
                console.warn(`Error playing sound ${key}: ${e}`);
            });
            
            return soundInstance;
        } catch (e) {
            console.error(`Error playing sound ${key}: ${e}`);
        }
    },
    
    // Stop sound
    stopSound(sound) {
        if (!sound) return;
        
        try {
            sound.pause();
            sound.currentTime = 0;
        } catch (e) {
            console.error(`Error stopping sound: ${e}`);
        }
    },
    
    // Draw cookie
    drawCookie(ctx, x, y, width, height, rotation = 0) {
        if (!this.images.cookie) {
            // Fallback drawing if image isn't loaded
            ctx.fillStyle = '#F5DEB3'; // Wheat color
            ctx.beginPath();
            ctx.arc(x + width/2, y + height/2, width/2, 0, Math.PI * 2);
            ctx.fill();
            
            // Add chocolate chips
            ctx.fillStyle = '#654321'; // Brown
            for (let i = 0; i < 5; i++) {
                const chipX = x + Math.random() * width;
                const chipY = y + Math.random() * height;
                const chipSize = Math.random() * 5 + 2;
                
                ctx.beginPath();
                ctx.arc(chipX, chipY, chipSize, 0, Math.PI * 2);
                ctx.fill();
            }
            return;
        }
        
        // Draw the cookie image
        ctx.drawImage(this.images.cookie, x, y, width, height);
    },
    
    // Draw defender (cookie monster)
    drawDefender(ctx, x, y, width, height) {
        if (!this.images.defender) {
            // Fallback drawing if image isn't loaded
            ctx.fillStyle = '#0000FF'; // Blue
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
            ctx.arc(x + width * 0.3, y + height * 0.3, width * 0.05, 0, Math.PI * 2);
            ctx.arc(x + width * 0.7, y + height * 0.3, width * 0.05, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw mouth
            ctx.beginPath();
            ctx.arc(x + width/2, y + height * 0.6, width * 0.3, 0, Math.PI);
            ctx.stroke();
            return;
        }
        
        // Draw the defender image
        ctx.drawImage(this.images.defender, x, y, width, height);
    },
    
    // Get background image
    getBackgroundImage() {
        return this.images.background;
    },
    
    // Get whisk image
    getWhiskImage() {
        return this.images.whisk;
    }
};

// Create and export the asset manager instance
window.ASSETS = ASSETS;
