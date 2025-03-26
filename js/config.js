// Game Configuration
const CONFIG = {
    // Game settings
    FPS: 60,
    GRAVITY: 0.05, 
    FLAP_POWER: -2.3,      // Reduced to about 2/3 of previous value (-3.5)
    SCROLL_SPEED: 0.8, 
    MAX_SCROLL_SPEED: 1.2,
    MAX_VELOCITY: 4,
    TERMINAL_VELOCITY: 3,
    
    // Player settings
    COOKIE_WIDTH: 50,
    COOKIE_HEIGHT: 50,
    COOKIE_START_X: 100,
    COOKIE_START_Y: 200,
    COOKIE_FLAP_COOLDOWN: 3,
    
    // Game objects
    MILK_GLASS_WIDTH: 60,
    MILK_GLASS_HEIGHT: 80,
    MILK_GLASS_SPAWN_RATE: 0.008, 
    MILK_GLASS_SPACING: 400, 
    MILK_GLASS_MIN_HEIGHT: 150,
    MILK_GLASS_MAX_HEIGHT: 450,
    
    // Pipe settings (replacing defender settings)
    PIPE_WIDTH: 60,
    PIPE_SPAWN_RATE: 0.003,
    PIPE_SPACING: 500,
    PIPE_GAP_HEIGHT: 200,
    
    // Power-up settings
    POWERUP_WIDTH: 40,
    POWERUP_HEIGHT: 40,
    POWERUP_SPAWN_RATE: 0.001, 
    POWERUP_CHANCE: 0.2,
    POWERUP_DURATION: 5000, 
    
    // Game mechanics
    FIRE_MODE_STREAK: 5,
    FIRE_MODE_DURATION: 5000,
    FIRE_STREAK_THRESHOLD: 5,
    FIRE_STREAK_GLOW_THRESHOLD: 3,
    FIRE_STREAK_BONUS: 2,
    PERFECT_DUNK_BONUS: 1,
    LIVES_START: 3,
    LIFE_RESTORE_STREAK: 5,
    
    // Difficulty scaling
    DIFFICULTY_INCREASE_INTERVAL: 30,
    MAX_DEFENDER_SPEED: 1.5,
    MAX_DEFENDER_FREQUENCY: 0.3,
    
    // Sound settings
    SOUND_VOLUME: 0.5,
    MUSIC_VOLUME: 0.3,
    
    // Firebase config (to be replaced with actual config)
    FIREBASE_CONFIG: {
        apiKey: "YOUR_API_KEY",
        authDomain: "your-app.firebaseapp.com",
        projectId: "your-project-id",
        storageBucket: "your-app.appspot.com",
        messagingSenderId: "your-messaging-sender-id",
        appId: "your-app-id"
    }
};

// Power-up types
const POWERUP_TYPES = {
    SHIELD: 'shield',
    SLOW_MO: 'slow_mo',
    TRIPLE_DUNK: 'triple_dunk',
    MILK_MAGNET: 'milkMagnet'
};

// Game states
const GAME_STATES = {
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'game_over'
};

// Export the CONFIG object
window.CONFIG = CONFIG;
window.POWERUP_TYPES = POWERUP_TYPES;
window.GAME_STATES = GAME_STATES;
