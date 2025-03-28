// Asset Manager
const ASSETS = {
    // Asset containers
    images: {},
    sounds: {},
    
    // Total assets to load
    totalAssets: 0,
    loadedAssets: 0,
    soundsEnabled: false, // Flag to track if sounds are enabled
    
    // Load all game assets
    loadAssets(callback) {
        // Get the base URL for GitHub Pages
        const isGitHubPages = window.location.hostname.includes('github.io');
        const repoName = 'milkmadness'; // Your repository name
        const baseUrl = isGitHubPages ? `/${repoName}/` : '';
        
        console.log(`Loading assets with baseUrl: ${baseUrl}`);
        
        // Define image assets with paths
        const imageAssets = {
            'cookie': `${baseUrl}images/playercookie.png`,
            'defender': `${baseUrl}Images/monster 1.png`,
            'logo': `${baseUrl}Images/Logo Mark Color (3).png`,
            'whisk': `${baseUrl}images/whisk.png`,
            'milkGlass': `${baseUrl}images/milk.png`,
            'background': `${baseUrl}images/backgroundimage.png`
        };
        
        // Define sound assets with paths to the sound files
        const soundAssets = {
            'flap': `${baseUrl}sounds/flap.wav`,
            'dunk': `${baseUrl}sounds/dunk.wav`,
            'perfect': `${baseUrl}sounds/perfect.wav`,
            'crumble': `${baseUrl}sounds/crumble.wav`,
            'powerup': `${baseUrl}sounds/powerup.wav`,
            'fire': `${baseUrl}sounds/fire.wav`,
            'rejected': `${baseUrl}sounds/rejected.wav`,
            'bgMusic': `${baseUrl}sounds/bgMusic.mp3`
        };
        
        // Count total assets to load (only count images, sounds are optional)
        this.totalAssets = Object.keys(imageAssets).length;
        this.loadedAssets = 0;
        
        console.log(`Loading ${this.totalAssets} required assets...`);
        
        // Load images
        for (const [key, src] of Object.entries(imageAssets)) {
            console.log(`Starting to load image: ${key} from ${src}`);
            this.loadImage(key, src);
        }
        
        // Try to load sounds but don't block game loading
        try {
            // Check if audio is supported
            const audio = new Audio();
            if (audio) {
                this.soundsEnabled = true;
                console.log('Sound is supported, loading sound assets...');
                
                // Load sounds but don't count them in the loading progress
                for (const [key, src] of Object.entries(soundAssets)) {
                    this.loadSound(key, src, false); // false = don't count in loading progress
                }
            } else {
                console.warn('Audio not supported in this browser');
            }
        } catch (error) {
            console.warn('Audio not supported, sounds will be disabled:', error);
            this.soundsEnabled = false;
        }
        
        // Check if all assets are loaded
        const checkInterval = setInterval(() => {
            console.log(`Loaded ${this.loadedAssets}/${this.totalAssets} required assets`);
            
            if (this.loadedAssets >= this.totalAssets) {
                clearInterval(checkInterval);
                console.log('All required assets loaded');
                callback();
            }
        }, 1000);
    },
    
    // Load image asset
    loadImage(key, src) {
        console.log(`Loading image: ${key} from ${src}`);
        const img = new Image();
        
        img.onload = () => {
            console.log(`Image loaded successfully: ${key}`);
            this.images[key] = img;
            this.loadedAssets++;
        };
        
        img.onerror = (e) => {
            console.error(`Failed to load image: ${key} from ${src}`, e);
            this.loadedAssets++;
        };
        
        img.src = src;
    },
    
    // Load sound asset
    loadSound(key, src, countInLoading = true) {
        if (!this.soundsEnabled) {
            if (countInLoading) this.loadedAssets++;
            return;
        }
        
        console.log(`Loading sound: ${src}`);
        try {
            const audio = new Audio();
            
            audio.addEventListener('canplaythrough', () => {
                console.log(`Sound loaded: ${src}`);
                if (countInLoading) this.loadedAssets++;
            }, { once: true });
            
            audio.addEventListener('error', () => {
                console.error(`Failed to load sound: ${src}`);
                if (countInLoading) this.loadedAssets++;
            }, { once: true });
            
            audio.src = src;
            this.sounds[key] = audio;
        } catch (error) {
            console.error(`Error creating audio element for ${src}:`, error);
            if (countInLoading) this.loadedAssets++;
        }
    },
    
    // Play sound
    playSound(key, loop = false) {
        if (!this.soundsEnabled || !this.sounds[key]) {
            return null;
        }
        
        try {
            // Create a new audio element for this playback
            const sound = this.sounds[key].cloneNode();
            
            // Set loop property
            sound.loop = loop;
            
            // Play the sound
            const playPromise = sound.play();
            
            // Handle play promise if supported
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error(`Error playing sound ${key}:`, error);
                });
            }
            
            // Return the sound element for control
            return sound;
        } catch (error) {
            console.error(`Error playing sound ${key}:`, error);
            return null;
        }
    },
    
    // Stop sound
    stopSound(sound) {
        if (!sound) return;
        
        try {
            sound.pause();
            sound.currentTime = 0;
        } catch (error) {
            console.error('Error stopping sound:', error);
        }
    },
    
    // Draw cookie
    drawCookie(ctx, x, y, width, height, rotation = 0) {
        if (this.images.cookie) {
            ctx.save();
            ctx.translate(x + width / 2, y + height / 2);
            ctx.rotate(rotation);
            ctx.drawImage(this.images.cookie, -width / 2, -height / 2, width, height);
            ctx.restore();
        }
    },
    
    // Draw defender (cookie monster)
    drawDefender(ctx, x, y, width, height) {
        if (this.images.defender) {
            ctx.drawImage(
                this.images.defender,
                x,
                y,
                width,
                height
            );
        } else {
            // Fallback to emoji if image not available
            ctx.font = `${height * 0.8}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('👾', x + width / 2, y + height / 2);
        }
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
