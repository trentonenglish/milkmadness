// Player Class
class Player {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocity = {
            y: 0
        };
        this.rotation = 0;
        this.flapCooldown = 0;
        this.maxVelocity = 6; // Further reduced max velocity for even more control
        this.terminalVelocity = 4; // Terminal velocity for falling (slower than max)
        
        // Animation properties
        this.scale = 1.0;
        this.scaleDirection = 1;
        this.isAnimating = false;
        this.animationDuration = 10;
        this.animationTimer = 0;
        
        // Dribble effect properties
        this.dribbleParticles = [];
        this.lastDribbleY = 0;
        this.dribbleThreshold = 5; // Minimum Y change to trigger dribble effect
    }
    
    // Update player position and state
    update() {
        // Apply gravity (constant acceleration downward)
        this.velocity.y += CONFIG.GRAVITY;
        
        // Clamp velocity to prevent too fast movement
        // Different limits for upward and downward movement
        if (this.velocity.y > this.terminalVelocity) {
            this.velocity.y = this.terminalVelocity; // Slower falling
        } else if (this.velocity.y < -this.maxVelocity) {
            this.velocity.y = -this.maxVelocity;
        }
        
        // Store previous Y position to detect direction changes
        const previousY = this.y;
        
        // Update position
        this.y += this.velocity.y;
        
        // Check for direction change for dribble effect
        if (previousY < this.y && Math.abs(previousY - this.y) > this.dribbleThreshold) {
            // Moving downward after reaching peak - add dribble particles
            this.createDribbleEffect();
            this.lastDribbleY = this.y;
        }
        
        // Update dribble particles
        this.updateDribbleParticles();
        
        // Update rotation based on velocity (gentler rotation)
        if (this.velocity.y < 0) {
            // Going up - rotate upward slightly (max -20 degrees)
            this.rotation = Math.max(-0.35, this.velocity.y * 0.03);
        } else {
            // Falling - rotate downward more gradually (max 45 degrees)
            this.rotation = Math.min(0.8, this.velocity.y * 0.05);
        }
        
        // Update flap cooldown
        if (this.flapCooldown > 0) {
            this.flapCooldown--;
        }
        
        // Update animation
        if (this.isAnimating) {
            this.animationTimer--;
            
            // Scale effect (pulsing)
            this.scale += 0.03 * this.scaleDirection;
            
            if (this.scale > 1.2) {
                this.scale = 1.2;
                this.scaleDirection = -1;
            } else if (this.scale < 0.9) {
                this.scale = 0.9;
                this.scaleDirection = 1;
            }
            
            if (this.animationTimer <= 0) {
                this.isAnimating = false;
                this.scale = 1.0;
            }
        }
    }
    
    // Create dribble effect particles
    createDribbleEffect() {
        // Add 3-5 particles that move in different directions
        const numParticles = Math.floor(Math.random() * 3) + 3;
        
        for (let i = 0; i < numParticles; i++) {
            this.dribbleParticles.push({
                x: this.x + this.width / 2,
                y: this.y + this.height / 2,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() * -2) - 1,
                size: Math.random() * 5 + 2,
                alpha: 1.0,
                life: 20
            });
        }
    }
    
    // Update dribble particles
    updateDribbleParticles() {
        for (let i = this.dribbleParticles.length - 1; i >= 0; i--) {
            const p = this.dribbleParticles[i];
            
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; // Gravity on particles
            p.alpha -= 0.05;
            p.life--;
            
            if (p.life <= 0 || p.alpha <= 0) {
                this.dribbleParticles.splice(i, 1);
            }
        }
    }
    
    // Make the cookie flap upward
    flap() {
        // Set velocity directly to a fixed negative value (upward)
        // Allow flapping even if already moving upward
        this.velocity.y = CONFIG.FLAP_POWER;
        
        // Start animation
        this.isAnimating = true;
        this.animationTimer = this.animationDuration;
        this.scale = 1.2; // Start with a slightly larger scale
        this.scaleDirection = -1; // Start by shrinking
        
        // Create dribble effect
        this.createDribbleEffect();
        
        // Very short cooldown to prevent accidental double-flaps
        this.flapCooldown = 3;
        
        // Play flap sound
        ASSETS.playSound('flap');
    }
    
    // Draw the player
    draw(ctx) {
        ctx.save();
        
        // Draw dribble particles
        this.drawDribbleParticles(ctx);
        
        // Translate to player center for rotation
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        
        // Rotate based on velocity
        ctx.rotate(this.rotation);
        
        // Apply scale for animation
        ctx.scale(this.scale, this.scale);
        
        // Draw cookie centered
        ASSETS.drawCookie(
            ctx,
            -this.width / 2, -this.height / 2,
            this.width, this.height,
            0 // No additional rotation needed since we're using ctx.rotate
        );
        
        ctx.restore();
    }
    
    // Draw dribble particles
    drawDribbleParticles(ctx) {
        ctx.save();
        
        for (const p of this.dribbleParticles) {
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = '#F5DEB3'; // Wheat color for cookie crumbs
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
}

// Export the Player class
window.Player = Player;
