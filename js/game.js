// Game Class
class Game {
    constructor(canvas) {
        // Canvas setup
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Game state
        this.state = GAME_STATES.MENU;
        this.score = 0;
        this.streak = 0;
        this.lives = CONFIG.LIVES_START;
        this.fireMode = false;
        this.fireModeTimer = 0;
        
        // Game statistics
        this.stats = {
            milkCollected: 0,
            highestStreak: 0,
            distanceTraveled: 0,
            whisksPassed: 0,
            timeElapsed: 0,
            gameStartTime: 0,
            powerupsCollected: 0
        };
        
        // Game objects
        this.player = new Player(
            CONFIG.COOKIE_START_X,
            CONFIG.COOKIE_START_Y,
            CONFIG.COOKIE_WIDTH,
            CONFIG.COOKIE_HEIGHT
        );
        this.milkGlasses = [];
        this.whisks = []; 
        this.powerups = [];
        
        // Floor position (1/4 up from the bottom)
        this.floorY = Math.floor(this.canvas.height * 3/4);
        
        // Info box dimensions
        this.infoBoxHeight = this.canvas.height - this.floorY;
        this.infoBoxPadding = 20;
        
        // Bounce mechanics
        this.bouncing = false;
        this.bounceVelocity = CONFIG.FLAP_POWER;
        this.clickVelocity = CONFIG.FLAP_POWER;
        
        // Background
        this.backgroundLoaded = false;
        
        // Particles
        this.particles = new ParticleSystem();
        
        // Animation frame ID
        this.animationFrameId = null;
        this.lastFrameTime = 0;
        
        // Input handling
        this.setupInputHandlers();
        
        // Invincibility after hit
        this.invincible = false;
        this.invincibilityTimer = 0;
        this.invincibilityDuration = 60; // frames
        
        // Last whisk spawn time to prevent overlapping
        this.lastWhiskSpawnTime = 0;
        this.whiskSpawnInterval = 2000; // ms between whisk spawns
        
        // Powerup state
        this.activePowerup = null;
        this.powerupTimer = 0;
        this.pointMultiplier = 1;
        this.milkMagnet = false;
        
        // Visual effects
        this.screenShake = 0;
        this.flashEffect = 0;
        this.flashColor = 'white';
        
        // New power-ups
        this.slowMotion = false;
        this.slowMotionTimer = 0;
        this.shieldActive = false;
        this.shieldTimer = 0;
    }
    
    // Reset game
    resetGame() {
        // Reset game state
        this.score = 0;
        this.streak = 0;
        this.lives = CONFIG.LIVES_START;
        this.fireMode = false;
        this.fireModeTimer = 0;
        
        // Reset game statistics
        this.stats = {
            milkCollected: 0,
            highestStreak: 0,
            distanceTraveled: 0,
            whisksPassed: 0,
            timeElapsed: 0,
            gameStartTime: Date.now(),
            powerupsCollected: 0
        };
        
        // Reset player
        this.player = new Player(
            CONFIG.COOKIE_START_X,
            CONFIG.COOKIE_START_Y,
            CONFIG.COOKIE_WIDTH,
            CONFIG.COOKIE_HEIGHT
        );
        
        // Clear game objects
        this.milkGlasses = [];
        this.whisks = [];
        this.powerups = [];
        
        // Reset powerup state
        this.activePowerup = null;
        this.powerupTimer = 0;
        this.pointMultiplier = 1;
        this.milkMagnet = false;
        this.slowMotion = false;
        this.slowMotionTimer = 0;
        this.shieldActive = false;
        this.shieldTimer = 0;
        
        // Reset invincibility
        this.invincible = false;
        this.invincibilityTimer = 0;
        
        // Reset visual effects
        this.screenShake = 0;
        this.flashEffect = 0;
        
        // Update UI
        if (UI && UI.updateScore) {
            UI.updateScore(this.score);
        }
        if (UI && UI.updateLives) {
            UI.updateLives(this.lives);
        }
        
        // Start game
        this.state = GAME_STATES.PLAYING;
    }
    
    // Update game state
    update() {
        try {
            // Update game time
            if (this.state === GAME_STATES.PLAYING) {
                this.stats.timeElapsed = (Date.now() - this.stats.gameStartTime) / 1000;
                this.stats.distanceTraveled += CONFIG.SCROLL_SPEED;
            }
            
            // Update visual effects
            if (this.screenShake > 0) {
                this.screenShake -= 1;
            }
            
            if (this.flashEffect > 0) {
                this.flashEffect -= 0.1;
                if (this.flashEffect < 0) this.flashEffect = 0;
            }
            
            // Update invincibility
            if (this.invincible) {
                this.invincibilityTimer--;
                if (this.invincibilityTimer <= 0) {
                    this.invincible = false;
                }
            }
            
            // Update fire mode timer
            if (this.fireMode) {
                this.fireModeTimer--;
                if (this.fireModeTimer <= 0) {
                    this.fireMode = false;
                    if (UI && UI.showMessage) {
                        UI.showMessage('🔥 FIRE MODE ENDED! 🔥', 1000);
                    }
                }
            }
            
            // Update powerup timer
            if (this.activePowerup && this.powerupTimer > 0) {
                this.powerupTimer--;
                if (this.powerupTimer <= 0) {
                    this.deactivatePowerup();
                }
            }
            
            // Update slow motion timer
            if (this.slowMotion && this.slowMotionTimer > 0) {
                this.slowMotionTimer--;
                if (this.slowMotionTimer <= 0) {
                    this.slowMotion = false;
                    if (UI && UI.showMessage) {
                        UI.showMessage('⏱️ NORMAL SPEED RESUMED! ⏱️', 1000);
                    }
                }
            }
            
            // Update shield timer
            if (this.shieldActive && this.shieldTimer > 0) {
                this.shieldTimer--;
                if (this.shieldTimer <= 0) {
                    this.shieldActive = false;
                    if (UI && UI.showMessage) {
                        UI.showMessage('🛡️ SHIELD DEACTIVATED! 🛡️', 1000);
                    }
                }
            }
            
            // Update player
            if (this.player) {
                this.player.update();
                
                // Check if player hits the floor
                if (this.player.y + this.player.height > this.floorY && !this.bouncing) {
                    // Initiate bounce
                    this.bouncing = true;
                    
                    // Apply bounce using player's flap method
                    this.player.flap();
                    
                    // Reset position to floor
                    this.player.y = this.floorY - this.player.height;
                    
                    // Lose a life when hitting the floor
                    this.loseLife();
                    
                    // Create chocolate chip particles at floor contact point
                    this.createChocolateChips(
                        this.player.x + this.player.width / 2,
                        this.floorY,
                        15
                    );
                } else if (this.player.y + this.player.height < this.floorY) {
                    // Reset bouncing state when player is above the floor
                    this.bouncing = false;
                }
                
                // Check if player hits the top of the screen
                if (this.player.y < 0) {
                    this.player.y = 0;
                    this.player.velocity.y = 0;
                }
            }
            
            // Update milk glasses
            for (let i = this.milkGlasses.length - 1; i >= 0; i--) {
                const milkGlass = this.milkGlasses[i];
                
                // Apply magnet effect if active
                if (this.milkMagnet && this.player) {
                    // Calculate distance between milk glass and player
                    const dx = this.player.x + this.player.width/2 - (milkGlass.x + milkGlass.width/2);
                    const dy = this.player.y + this.player.height/2 - (milkGlass.y + milkGlass.height/2);
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    // Apply magnetic force if within range (stronger as milk gets closer)
                    const magnetRange = 200;
                    if (distance < magnetRange) {
                        // Calculate magnetic force (stronger as milk gets closer)
                        const magnetStrength = 0.5 + (1 - distance/magnetRange) * 2;
                        
                        // Normalize direction vector
                        const normalizedDx = dx / distance;
                        const normalizedDy = dy / distance;
                        
                        // Apply magnetic force
                        milkGlass.x += normalizedDx * magnetStrength;
                        milkGlass.y += normalizedDy * magnetStrength;
                        
                        // Draw magnetic effect particles
                        if (Math.random() < 0.1) {  // Only 10% chance to create particles to avoid too many
                            this.createMagneticEffect(
                                milkGlass.x + milkGlass.width/2,
                                milkGlass.y + milkGlass.height/2,
                                this.player.x + this.player.width/2,
                                this.player.y + this.player.height/2
                            );
                        }
                    }
                }
                
                // Update milk glass
                if (!milkGlass.update()) {
                    // Remove if off screen
                    this.milkGlasses.splice(i, 1);
                    continue;
                }
                
                // Check collision with player
                if (this.player && this.checkCollision(this.player, milkGlass)) {
                    // Calculate points based on streak
                    let points = 5;
                    
                    // Increase streak and apply multiplier
                    this.streak++;
                    
                    // Update highest streak stat
                    if (this.streak > this.stats.highestStreak) {
                        this.stats.highestStreak = this.streak;
                    }
                    
                    // Update milk collected stat
                    this.stats.milkCollected++;
                    
                    if (this.streak >= 3) {
                        // Apply streak multiplier
                        const multiplier = Math.min(Math.floor(this.streak / 3), 5); // Cap at 5x
                        points *= multiplier;
                        
                        // Show message for streak
                        if (UI && UI.showMessage) {
                            UI.showMessage(`${multiplier}x COMBO! (${this.streak})`, 1000);
                        }
                        this.playSound('perfect');
                        
                        // Visual feedback for high streaks
                        if (multiplier >= 3) {
                            this.flashEffect = 0.5;
                            this.flashColor = 'rgba(255, 215, 0, 0.2)'; // Gold for high streaks
                        }
                    }
                    
                    // Apply powerup multiplier if active
                    if (this.pointMultiplier > 1) {
                        points *= this.pointMultiplier;
                    }
                    
                    // Increase score
                    this.score += points;
                    
                    // Create splash effect
                    this.particles.createSplash(
                        milkGlass.x + milkGlass.width / 2,
                        milkGlass.y + milkGlass.height / 2,
                        '#FFFFFF',
                        15
                    );
                    
                    // Play sound
                    this.playSound('collect');
                    
                    // Remove milk glass
                    this.milkGlasses.splice(i, 1);
                    
                    // Spawn more milk glasses
                    if (Math.random() < 0.3) {
                        this.spawnMilkGlass();
                    }
                    
                    // Update UI
                    if (UI && UI.updateScore) {
                        UI.updateScore(this.score);
                    }
                }
            }
            
            // Update whisks
            for (let i = this.whisks.length - 1; i >= 0; i--) {
                const whisk = this.whisks[i];
                whisk.update();
                
                // Remove if off screen
                if (whisk.x + whisk.width < 0) {
                    this.whisks.splice(i, 1);
                    
                    // Spawn new whisks if a pair is removed
                    if (i % 2 === 0 && this.whisks.length < 4) {
                        this.spawnWhisks();
                    }
                    
                    continue;
                }
                
                // Ensure whisks don't fall below the floor
                if (!whisk.isTop && whisk.y + whisk.height > this.floorY) {
                    whisk.height = this.floorY - whisk.y;
                }
                
                // Check collision with player
                if (this.player && !this.invincible && whisk.checkCollision(this.player)) {
                    // If shield is active, don't lose a life
                    if (this.shieldActive) {
                        // Shield absorbs the hit
                        this.shieldActive = false;
                        this.shieldTimer = 0;
                        
                        // Visual feedback
                        this.screenShake = 10;
                        this.flashEffect = 1;
                        this.flashColor = 'rgba(0, 255, 255, 0.3)'; // Cyan for shield
                        
                        // Create shield break particles
                        this.particles.createExplosion(
                            this.player.x + this.player.width / 2,
                            this.player.y + this.player.height / 2,
                            '#00FFFF', // Cyan
                            30
                        );
                        
                        if (UI && UI.showMessage) {
                            UI.showMessage('🛡️ SHIELD ABSORBED HIT! 🛡️', 1000);
                        }
                    } else {
                        // Lose a life
                        this.loseLife();
                        
                        // Create chocolate chip particles at collision point
                        this.createChocolateChips(
                            this.player.x + this.player.width / 2,
                            this.player.y + this.player.height / 2,
                            20
                        );
                        
                        // Visual feedback
                        this.screenShake = 15;
                        this.flashEffect = 1;
                        this.flashColor = 'rgba(255, 0, 0, 0.2)';
                    }
                    
                    // Break out of loop after first collision
                    break;
                }
                
                // Count whisks passed
                if (whisk.x + whisk.width < this.player.x && !whisk.counted) {
                    whisk.counted = true;
                    this.stats.whisksPassed++;
                }
            }
            
            // Update powerups
            for (let i = this.powerups.length - 1; i >= 0; i--) {
                const powerup = this.powerups[i];
                
                // Update powerup
                if (!powerup.update()) {
                    // Remove if off screen
                    this.powerups.splice(i, 1);
                    continue;
                }
                
                // Check collision with player
                if (this.player && this.checkCollision(this.player, powerup)) {
                    // Activate powerup
                    this.activatePowerup(powerup.type);
                    
                    // Update powerups collected stat
                    this.stats.powerupsCollected++;
                    
                    // Create particles
                    this.particles.createExplosion(
                        powerup.x + powerup.width / 2,
                        powerup.y + powerup.height / 2,
                        powerup.color,
                        20
                    );
                    
                    // Play sound
                    this.playSound('powerup');
                    
                    // Remove powerup
                    this.powerups.splice(i, 1);
                }
            }
            
            // Spawn milk glasses
            if (Math.random() < CONFIG.MILK_GLASS_SPAWN_RATE) {
                // Check if there's enough space between the last milk glass and the new one
                const canSpawn = this.milkGlasses.length === 0 || 
                    (this.milkGlasses[this.milkGlasses.length - 1].x < 
                    this.canvas.width - CONFIG.MILK_GLASS_SPACING);
                
                if (canSpawn) {
                    this.spawnMilkGlass();
                }
            }
            
            // Spawn whisks
            if (Math.random() < CONFIG.PIPE_SPAWN_RATE) {
                // Check if there's enough space between the last whisk and the new one
                const canSpawn = this.whisks.length === 0 || 
                    (this.whisks[0].x < this.canvas.width - CONFIG.PIPE_SPACING);
                
                if (canSpawn) {
                    this.spawnWhisks();
                }
            }
            
            // Spawn powerups
            if (Math.random() < CONFIG.POWERUP_SPAWN_RATE) {
                this.spawnPowerup();
            }
            
            // Update particles
            this.particles.update();
            
            // Add fire trail in fire mode
            if (this.fireMode && this.player) {
                this.particles.createTrail(
                    this.player.x,
                    this.player.y + this.player.height/2,
                    '#FF5500'
                );
            }
        } catch (error) {
            console.error('Error in update method:', error.message || error);
        }
    }
    
    // Activate a powerup
    activatePowerup(type) {
        // Set active powerup
        this.activePowerup = type;
        this.powerupTimer = 300; // 5 seconds at 60fps
        
        // Apply powerup effect
        switch (type) {
            case 'multiplier':
                this.pointMultiplier = 2;
                if (UI && UI.showMessage) {
                    UI.showMessage('🌟 2X POINTS ACTIVATED! 🌟', 1000);
                }
                break;
            case 'magnet':
                this.milkMagnet = true;
                if (UI && UI.showMessage) {
                    UI.showMessage('🧲 MILK MAGNET ACTIVATED! 🧲', 1000);
                }
                break;
            case 'slowmo':
                this.slowMotion = true;
                this.slowMotionTimer = 300; // 5 seconds
                if (UI && UI.showMessage) {
                    UI.showMessage('⏱️ SLOW MOTION ACTIVATED! ⏱️', 1000);
                }
                break;
            case 'shield':
                this.shieldActive = true;
                this.shieldTimer = 600; // 10 seconds
                if (UI && UI.showMessage) {
                    UI.showMessage('🛡️ SHIELD ACTIVATED! 🛡️', 1000);
                }
                break;
            case 'extralife':
                this.lives++;
                if (UI && UI.updateLives) {
                    UI.updateLives(this.lives);
                }
                if (UI && UI.showMessage) {
                    UI.showMessage('❤️ EXTRA LIFE GAINED! ❤️', 1000);
                }
                break;
        }
        
        // Visual feedback
        this.flashEffect = 1;
        this.flashColor = 'rgba(255, 255, 255, 0.3)';
    }
    
    // Deactivate current powerup
    deactivatePowerup() {
        // Reset powerup effects
        switch (this.activePowerup) {
            case 'multiplier':
                this.pointMultiplier = 1;
                if (UI && UI.showMessage) {
                    UI.showMessage('2X POINTS ENDED!', 1000);
                }
                break;
            case 'magnet':
                this.milkMagnet = false;
                if (UI && UI.showMessage) {
                    UI.showMessage('MILK MAGNET ENDED!', 1000);
                }
                break;
        }
        
        // Clear active powerup
        this.activePowerup = null;
        this.powerupTimer = 0;
    }
    
    // Spawn a powerup
    spawnPowerup() {
        // Random position
        const x = this.canvas.width;
        const y = Math.random() * (this.floorY - 100) + 50;
        
        // Random powerup type
        const types = ['multiplier', 'magnet', 'slowmo', 'shield', 'extralife'];
        const weights = [0.3, 0.3, 0.2, 0.1, 0.1]; // Probability weights
        
        // Weighted random selection
        let random = Math.random();
        let typeIndex = 0;
        
        for (let i = 0; i < weights.length; i++) {
            if (random < weights[i]) {
                typeIndex = i;
                break;
            }
            random -= weights[i];
        }
        
        const type = types[typeIndex];
        
        // Create powerup
        this.powerups.push(new Powerup(x, y, CONFIG.POWERUP_WIDTH, CONFIG.POWERUP_HEIGHT, type));
    }
    
    // Draw game
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Apply screen shake effect
        if (this.screenShake > 0) {
            const shakeX = (Math.random() - 0.5) * this.screenShake;
            const shakeY = (Math.random() - 0.5) * this.screenShake;
            this.ctx.save();
            this.ctx.translate(shakeX, shakeY);
        }
        
        // Draw background
        this.drawBackground();
        
        // Draw game objects
        this.drawGameObjects();
        
        // Draw particles
        this.particles.draw(this.ctx);
        
        // Draw floor (info box)
        this.drawFloor();
        
        // Draw UI
        this.drawUI();
        
        // Draw powerup status if active
        if (this.activePowerup) {
            this.drawPowerupStatus();
        }
        
        // Draw shield effect if active
        if (this.shieldActive) {
            this.drawShieldEffect();
        }
        
        // Draw flash effect
        if (this.flashEffect > 0) {
            this.ctx.fillStyle = this.flashColor;
            this.ctx.globalAlpha = this.flashEffect;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.globalAlpha = 1;
        }
        
        // Restore context if screen shake was applied
        if (this.screenShake > 0) {
            this.ctx.restore();
        }
        
        // Draw game state overlays
        if (this.state === GAME_STATES.MENU) {
            this.drawMenu();
        } else if (this.state === GAME_STATES.GAME_OVER) {
            this.drawGameOver();
        } else if (this.state === GAME_STATES.PAUSED) {
            this.drawPaused();
        }
    }
    
    // Draw shield effect around player
    drawShieldEffect() {
        if (!this.player) return;
        
        this.ctx.save();
        
        // Draw shield bubble
        const radius = Math.max(this.player.width, this.player.height) * 0.8;
        const gradient = this.ctx.createRadialGradient(
            this.player.x + this.player.width / 2,
            this.player.y + this.player.height / 2,
            radius * 0.5,
            this.player.x + this.player.width / 2,
            this.player.y + this.player.height / 2,
            radius
        );
        
        gradient.addColorStop(0, 'rgba(0, 255, 255, 0)');
        gradient.addColorStop(0.7, 'rgba(0, 255, 255, 0.1)');
        gradient.addColorStop(1, 'rgba(0, 255, 255, 0.3)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(
            this.player.x + this.player.width / 2,
            this.player.y + this.player.height / 2,
            radius,
            0, Math.PI * 2
        );
        this.ctx.fill();
        
        // Draw shield border
        this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(
            this.player.x + this.player.width / 2,
            this.player.y + this.player.height / 2,
            radius,
            0, Math.PI * 2
        );
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    // Draw magnet effect around player
    drawMagnetEffect() {
        const centerX = this.player.x + this.player.width/2;
        const centerY = this.player.y + this.player.height/2;
        const radius = 100;
        
        // Draw magnetic field
        this.ctx.save();
        
        // Create gradient
        const gradient = this.ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, radius
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(0.5, 'rgba(173, 216, 230, 0.2)');
        gradient.addColorStop(1, 'rgba(173, 216, 230, 0)');
        
        // Draw circle
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        // Draw pulsing rings
        const time = performance.now() / 1000;
        const pulseRadius = 30 + Math.sin(time * 3) * 10;
        
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    // Draw floor (info box)
    drawFloor() {
        // Draw semi-transparent info box
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        this.ctx.fillRect(0, this.floorY, this.canvas.width, this.infoBoxHeight);
        
        // Add border at the top
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.fillRect(0, this.floorY, this.canvas.width, 2);
        
        // Draw info box content
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.font = 'bold 18px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        
        // Title for the info box
        this.ctx.fillText('Game Stats', this.infoBoxPadding, this.floorY + this.infoBoxPadding);
        
        // Draw game statistics
        this.ctx.font = '14px Arial';
        
        // Left column
        const leftStats = [
            `Score: ${this.score}`,
            `Lives: ${this.lives}`,
            `Streak: ${this.streak}`,
            `Highest Streak: ${this.stats.highestStreak}`
        ];
        
        // Right column
        const rightStats = [
            `Milk Collected: ${this.stats.milkCollected}`,
            `Whisks Passed: ${this.stats.whisksPassed}`,
            `Powerups: ${this.stats.powerupsCollected}`,
            `Time: ${this.stats.timeElapsed.toFixed(1)}s`
        ];
        
        // Draw left column
        leftStats.forEach((text, index) => {
            this.ctx.fillText(
                text, 
                this.infoBoxPadding, 
                this.floorY + this.infoBoxPadding * 2 + index * 20
            );
        });
        
        // Draw right column
        rightStats.forEach((text, index) => {
            this.ctx.fillText(
                text, 
                this.canvas.width / 2, 
                this.floorY + this.infoBoxPadding * 2 + index * 20
            );
        });
        
        // Draw active powerups
        if (this.activePowerup || this.slowMotion || this.shieldActive) {
            this.ctx.font = 'bold 14px Arial';
            this.ctx.fillText('Active Powerups:', this.infoBoxPadding, this.floorY + this.infoBoxPadding * 2 + 4 * 20);
            
            this.ctx.font = '14px Arial';
            let activePowerups = [];
            
            if (this.activePowerup === 'multiplier') activePowerups.push('2x Points');
            if (this.activePowerup === 'magnet') activePowerups.push('Milk Magnet');
            if (this.slowMotion) activePowerups.push('Slow Motion');
            if (this.shieldActive) activePowerups.push('Shield');
            
            this.ctx.fillText(
                activePowerups.join(', ') || 'None', 
                this.infoBoxPadding, 
                this.floorY + this.infoBoxPadding * 2 + 5 * 20
            );
        }
    }
    
    // Draw background
    drawBackground() {
        // Draw static background
        const backgroundImage = ASSETS.getBackgroundImage();
        
        if (backgroundImage && backgroundImage.complete) {
            this.backgroundLoaded = true;
            
            // Draw the background image to fill the canvas
            this.ctx.drawImage(
                backgroundImage,
                0, 0,
                this.canvas.width, this.canvas.height
            );
        } else {
            // Fallback background if image not loaded
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
            gradient.addColorStop(0, '#87CEEB'); // Sky blue
            gradient.addColorStop(1, '#E0F7FA'); // Light cyan
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    
    // Draw game objects
    drawGameObjects() {
        // Draw player with magnet effect if active
        this.drawPlayer();
        
        // Draw milk glasses
        this.milkGlasses.forEach(milkGlass => milkGlass.draw(this.ctx));
        
        // Draw whisks
        this.whisks.forEach(whisk => whisk.draw(this.ctx));
        
        // Draw powerups
        this.powerups.forEach(powerup => powerup.draw(this.ctx));
    }
    
    // Draw player with magnet effect if active
    drawPlayer() {
        if (!this.player) return;
        
        // Save context
        this.ctx.save();
        
        // Flash if invincible
        if (this.invincible && Math.floor(Date.now() / 100) % 2 === 0) {
            this.ctx.globalAlpha = 0.5;
        }
        
        // Draw with fire effect if in fire mode
        if (this.fireMode) {
            this.ctx.shadowColor = '#FF5500';
            this.ctx.shadowBlur = 20;
        }
        
        // Draw the player
        this.player.draw(this.ctx);
        
        // Draw magnet effect if active
        if (this.milkMagnet) {
            this.drawMagnetEffect();
        }
        
        // Reset
        this.ctx.globalAlpha = 1;
        this.ctx.shadowBlur = 0;
        
        this.ctx.restore();
    }
    
    // Draw UI
    drawUI() {
        // Set text properties
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        
        // Draw score
        this.ctx.fillText(`Score: ${this.score}`, 20, 20);
        
        // Draw lives
        this.ctx.fillText(`Lives: ${this.lives}`, 20, 50);
        
        // Draw streak if active
        if (this.streak >= 3) {
            const multiplier = Math.min(Math.floor(this.streak / 3), 5); // Cap at 5x
            this.ctx.fillStyle = '#FFD700'; // Gold color for streak
            this.ctx.fillText(`Streak: ${this.streak} (${multiplier}x)`, 20, 80);
            this.ctx.fillStyle = '#FFFFFF'; // Reset color
        }
    }
    
    // Draw powerup status
    drawPowerupStatus() {
        // Set text properties
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'right';
        this.ctx.textBaseline = 'top';
        
        // Get powerup name
        let powerupName = '';
        switch (this.activePowerup) {
            case 'multiplier':
                powerupName = '2x Points';
                break;
            case 'magnet':
                powerupName = 'Milk Magnet';
                break;
            case 'slowmo':
                powerupName = 'Slow Motion';
                break;
            case 'shield':
                powerupName = 'Shield';
                break;
            case 'extralife':
                powerupName = 'Extra Life';
                break;
        }
        
        // Draw powerup name and timer
        const timeLeft = Math.ceil(this.powerupTimer / 60);
        this.ctx.fillText(`${powerupName}: ${timeLeft}s`, this.canvas.width - 20, 20);
    }
    
    // Lose a life
    loseLife() {
        if (this.invincible) return;
        
        this.lives--;
        this.streak = 0; // Reset streak on hit
        if (UI && UI.updateLives) {
            UI.updateLives(this.lives);
        }
        
        // Create chocolate chip particles at player position
        this.createChocolateChips(
            this.player.x + this.player.width / 2,
            this.player.y + this.player.height / 2,
            20
        );
        
        // Visual feedback
        this.screenShake = 15;
        this.flashEffect = 1;
        this.flashColor = 'rgba(255, 0, 0, 0.2)';
        
        // Game over if no lives left
        if (this.lives <= 0) {
            this.gameOver();
            return;
        }
        
        // Make player invincible briefly
        this.invincible = true;
        this.invincibilityTimer = this.invincibilityDuration;
        
        // Play sound
        this.playSound('hit');
    }
    
    // Game over
    gameOver() {
        // Cancel animation frame to stop the game loop
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        // Set game state
        this.state = GAME_STATES.GAME_OVER;
        
        // Stop background music
        if (ASSETS && ASSETS.stopSound) {
            ASSETS.stopSound('bgMusic');
        }
        
        // Play game over sound
        this.playSound('gameOver');
        
        // Show game over screen
        document.getElementById('game-over').style.display = 'flex';
        document.getElementById('final-score').textContent = this.score;
    }
    
    // Draw game over screen
    drawGameOver() {
        // Draw background
        this.drawBackground();
        
        // Draw game over text
        this.ctx.fillStyle = '#FF0000';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('Game Over', this.canvas.width / 2, this.canvas.height / 2);
        
        // Draw final score
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 50);
    }
    
    // Resize canvas
    resizeCanvas() {
        const container = document.getElementById('game-container');
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
    }
    
    // Setup input handlers
    setupInputHandlers() {
        // Mouse click handler
        this.canvas.addEventListener('click', (event) => {
            this.handleInput();
        });
        
        // Touch handler for mobile
        this.canvas.addEventListener('touchstart', (event) => {
            event.preventDefault();
            this.handleInput();
        });
        
        // Keyboard handler
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                event.preventDefault();
                this.handleInput();
            }
        });
        
        // Pause button
        document.getElementById('pause-btn').addEventListener('click', () => {
            if (this.state === GAME_STATES.PLAYING) {
                // Cancel animation frame to pause the game
                if (this.animationFrameId) {
                    cancelAnimationFrame(this.animationFrameId);
                    this.animationFrameId = null;
                }
                
                this.state = GAME_STATES.PAUSED;
                document.getElementById('pause-btn').textContent = '▶️';
                document.getElementById('replay-btn').style.display = 'inline-block';
            } else if (this.state === GAME_STATES.PAUSED) {
                this.state = GAME_STATES.PLAYING;
                this.lastFrameTime = performance.now();
                this.gameLoop();
                document.getElementById('pause-btn').textContent = '⏸️';
                document.getElementById('replay-btn').style.display = 'none';
            }
        });
        
        document.getElementById('replay-btn').addEventListener('click', () => {
            document.getElementById('pause-btn').textContent = '⏸️';
            document.getElementById('replay-btn').style.display = 'none';
            this.init();
        });
        
        document.getElementById('replay-btn-over').addEventListener('click', () => {
            document.getElementById('game-over').style.display = 'none';
            this.init();
        });
        
        // Score form submission
        document.getElementById('score-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email-input').value;
            if (email) {
                Leaderboard.saveScore(email, this.score);
                document.getElementById('email-input').value = '';
                if (UI && UI.showMessage) {
                    UI.showMessage('Score saved!');
                }
            }
        });
        
        // Leaderboard button
        document.getElementById('leaderboard-btn').addEventListener('click', () => {
            document.getElementById('game-over').style.display = 'none';
            document.getElementById('leaderboard').style.display = 'flex';
            Leaderboard.displayScores();
        });
        
        // Close leaderboard button
        document.getElementById('close-leaderboard').addEventListener('click', () => {
            document.getElementById('leaderboard').style.display = 'none';
            document.getElementById('game-over').style.display = 'flex';
        });
    }
    
    // Handle player input
    handleInput() {
        if (this.state === GAME_STATES.MENU) {
            // Start game from menu
            this.resetGame();
            this.state = GAME_STATES.PLAYING;
        } else if (this.state === GAME_STATES.PLAYING) {
            // Jump
            if (this.player) {
                // Use the player's flap method instead of directly setting velocity
                this.player.flap();
                
                // Create jump particles
                this.particles.createSplash(
                    this.player.x + this.player.width / 2,
                    this.player.y + this.player.height,
                    '#FFD700'
                );
            }
        } else if (this.state === GAME_STATES.GAME_OVER) {
            // Restart game from game over
            this.resetGame();
            this.state = GAME_STATES.PLAYING;
        }
    }
    
    // Check collision between two objects
    checkCollision(obj1, obj2) {
        // Check if objects overlap
        if (obj1.x + obj1.width < obj2.x || obj1.x > obj2.x + obj2.width ||
            obj1.y + obj1.height < obj2.y || obj1.y > obj2.y + obj2.height) {
            return false;
        }
        
        return true;
    }
    
    // Create a chocolate chip explosion
    createChocolateChips(x, y, count = 15) {
        // Create chocolate chip particles
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 4;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const radius = 2 + Math.random() * 4;
            const lifespan = 40 + Math.random() * 20;
            
            // Random chocolate colors
            const chocolateColors = [
                '#3D2314', // Dark chocolate
                '#4A2C17', // Medium dark chocolate
                '#5C3A21', // Milk chocolate
                '#6B4226'  // Light chocolate
            ];
            
            const color = chocolateColors[Math.floor(Math.random() * chocolateColors.length)];
            
            this.particles.particles.push(new Particle(
                x, y, vx, vy, radius, color, lifespan
            ));
        }
    }
    
    // Create magnetic effect particles
    createMagneticEffect(startX, startY, endX, endY) {
        // Number of particles to create
        const count = 3;
        
        // Create particles along the path from milk to player
        for (let i = 0; i < count; i++) {
            // Position along the path (biased toward the milk)
            const t = Math.random() * 0.7; // 0-0.7 range to bias toward milk
            const x = startX + (endX - startX) * t;
            const y = startY + (endY - startY) * t;
            
            // Calculate velocity toward player
            const dx = endX - x;
            const dy = endY - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const speed = 1 + Math.random() * 2;
            
            const vx = (dx / distance) * speed;
            const vy = (dy / distance) * speed;
            
            // Random size
            const radius = 1 + Math.random() * 2;
            
            // Shorter lifespan for faster animation
            const lifespan = 10 + Math.random() * 10;
            
            // Blue/cyan color for magnetic effect
            const colors = ['#00FFFF', '#1E90FF', '#4169E1'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            // Add particle
            this.particles.particles.push(new Particle(
                x, y, vx, vy, radius, color, lifespan
            ));
        }
    }
    
    // Safe sound playing helper
    playSound(soundName, loop = false) {
        try {
            if (ASSETS && ASSETS.playSound) {
                ASSETS.playSound(soundName, loop);
            }
        } catch (error) {
            console.log(`Sound ${soundName} could not be played:`, error);
        }
    }
    
    // Spawn a milk glass
    spawnMilkGlass() {
        // Random position
        const x = this.canvas.width;
        const minY = 50;
        const maxY = this.floorY - CONFIG.MILK_GLASS_HEIGHT - 50;
        
        // Bias towards the middle-upper area of the screen
        let y;
        if (Math.random() < 0.7) {
            // 70% chance to be in a more challenging position (upper half)
            y = minY + Math.random() * ((maxY - minY) * 0.5);
        } else {
            // 30% chance to be in a more accessible position (lower half)
            y = minY + ((maxY - minY) * 0.5) + Math.random() * ((maxY - minY) * 0.5);
        }
        
        const milkGlass = new MilkGlass(
            x,
            y,
            CONFIG.MILK_GLASS_WIDTH,
            CONFIG.MILK_GLASS_HEIGHT
        );
        
        this.milkGlasses.push(milkGlass);
    }
    
    // Spawn whisks (egg beaters)
    spawnWhisks() {
        // Check if enough time has passed since the last whisk spawn to prevent overlap
        const currentTime = Date.now();
        if (currentTime - this.lastWhiskSpawnTime < this.whiskSpawnInterval) {
            return;
        }
        
        // Update last spawn time
        this.lastWhiskSpawnTime = currentTime;
        
        // Get random height for the gap
        const gapHeight = CONFIG.PIPE_GAP_HEIGHT;
        const minHeight = 50;
        
        // Calculate maximum height based on the floor position
        const maxHeight = this.floorY - gapHeight - minHeight - 50;
        
        // Get random height for top whisk
        const topHeight = Math.floor(Math.random() * (maxHeight - minHeight)) + minHeight;
        
        // Calculate bottom whisk position
        const bottomY = topHeight + gapHeight;
        const bottomHeight = this.floorY - bottomY;
        
        // Create top whisk
        const topWhisk = new Pipe(
            this.canvas.width,
            0,
            CONFIG.PIPE_WIDTH,
            topHeight,
            true
        );
        
        // Create bottom whisk
        const bottomWhisk = new Pipe(
            this.canvas.width,
            bottomY,
            CONFIG.PIPE_WIDTH,
            bottomHeight,
            false
        );
        
        // Add whisks to the array
        this.whisks.push(topWhisk, bottomWhisk);
    }
    
    // Initialize the game
    init() {
        // Cancel any existing animation frame to prevent multiple game loops
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        // Reset game
        this.resetGame();
        
        // Set game state to playing
        this.state = GAME_STATES.PLAYING;
        
        // Start game loop
        this.lastFrameTime = performance.now();
        
        // Use setTimeout to ensure this is properly bound
        const self = this;
        setTimeout(() => {
            self.gameLoop(self.lastFrameTime);
        }, 0);
        
        // Play background music - with error handling
        try {
            if (ASSETS && ASSETS.playSound) {
                ASSETS.playSound('bgMusic', true);
            }
        } catch (error) {
            console.log('Background music could not be played:', error);
        }
    }
    
    // Game loop
    gameLoop(timestamp) {
        try {
            // Calculate delta time
            const deltaTime = timestamp ? timestamp - this.lastFrameTime : 16.67; // Default to ~60fps if timestamp is undefined
            this.lastFrameTime = timestamp || performance.now();
            
            // Clear canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Draw background
            this.drawBackground();
            
            // Update and draw based on game state
            if (this.state === GAME_STATES.PLAYING) {
                // Update game state
                this.update();
                
                // Draw game objects
                this.draw();
            } else if (this.state === GAME_STATES.MENU) {
                // Draw menu
                this.drawMenu();
            } else if (this.state === GAME_STATES.GAME_OVER) {
                // Draw game over screen
                this.drawGameOver();
            }
            
            // Continue game loop
            this.animationFrameId = requestAnimationFrame((t) => {
                if (this && typeof this.gameLoop === 'function') {
                    this.gameLoop(t);
                }
            });
        } catch (error) {
            console.error('Error in game loop:', error.message || error);
            console.error('Error stack:', error.stack || 'No stack trace available');
            
            // Try to recover and continue more safely
            setTimeout(() => {
                if (this && typeof this.gameLoop === 'function') {
                    this.animationFrameId = requestAnimationFrame((t) => this.gameLoop(t));
                }
            }, 1000); // Wait a second before trying again
        }
    }
}

// Export the Game class
window.Game = Game;
