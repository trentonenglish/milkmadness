// Milk Glass Class
class MilkGlass {
    constructor(x, y, width = CONFIG.MILK_GLASS_WIDTH, height = CONFIG.MILK_GLASS_HEIGHT) {
        this.x = x;
        this.y = y;
        this.baseY = y; // Store original Y position for floating animation
        this.width = width;
        this.height = height;
        this.scored = false;
        this.perfect = false;
        this.glowIntensity = 0;
        this.glowDirection = 1;
        this.points = 10; // Default points value
        this.splashParticles = [];
        this.splashRings = []; // For splash ring effect
        this.fadeOut = 1.0; // For fade out effect when hit
        
        // Milk emoji
        this.emoji = '🥛';
        
        // Animation properties
        this.floatTimer = Math.random() * Math.PI * 2; // Random start position
        this.floatSpeed = 0.03; // Slower than powerups
        this.floatAmount = 5; // Less movement than powerups
        this.pulseTimer = Math.random() * Math.PI * 2; // Random start position
        this.pulseSpeed = 0.03; // Slower than powerups
        this.pulseAmount = 0.1; // 10% size variation (less than powerups)
        this.rotation = 0; // No initial rotation
        this.rotationSpeed = 0.005; // Very subtle rotation
        
        // Splash effect properties
        this.splashActive = false;
        this.splashTime = 0;
        this.splashDuration = 60; // Frames the splash will be visible
    }
    
    // Update milk glass position
    update(deltaTime) {
        // Move milk glass left
        this.x -= CONFIG.SCROLL_SPEED;
        
        if (!this.scored) {
            // Floating animation
            this.floatTimer += this.floatSpeed;
            this.y = this.baseY + Math.sin(this.floatTimer) * this.floatAmount;
            
            // Very subtle rotation
            this.rotation += this.rotationSpeed;
            
            // Pulse animation
            this.pulseTimer += this.pulseSpeed;
        } else {
            // If splash is active, update splash timer
            if (this.splashActive) {
                this.splashTime++;
                
                // Deactivate splash after duration
                if (this.splashTime >= this.splashDuration) {
                    this.splashActive = false;
                }
            }
            
            // Fade out the milk glass more slowly to allow splash to be visible
            this.fadeOut -= 0.01; // Reduced to fade out even more slowly
        }
        
        // Return false if off screen or fully faded
        return this.x + this.width > 0 && this.fadeOut > 0;
    }
    
    // Draw milk glass
    draw(ctx) {
        // Only draw if not completely faded out
        if (this.fadeOut <= 0) return;
        
        ctx.save();
        
        // Apply fade out effect
        ctx.globalAlpha = this.fadeOut;
        
        // Add glow effect if scored
        if (this.scored) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.perfect ? '#FFD700' : '#FFFFFF';
        }
        
        // Draw splash effect if active
        if (this.splashActive) {
            this.drawSplash(ctx);
        }
        
        // Calculate pulse scale (only if not scored)
        const pulseScale = this.scored ? 1 : 1 + Math.sin(this.pulseTimer) * this.pulseAmount;
        
        // Translate to center for rotation and scaling
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);
        ctx.scale(pulseScale, pulseScale);
        
        // Draw milk glass using emoji
        ctx.font = `${this.height * 0.8}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.emoji, 0, 0);
        
        ctx.restore();
    }
    
    // Draw splash effect
    drawSplash(ctx) {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const progress = this.splashTime / this.splashDuration;
        
        // Draw expanding rings
        const numRings = 3;
        for (let i = 0; i < numRings; i++) {
            const ringProgress = Math.min(1, progress * 1.5 - i * 0.2);
            if (ringProgress <= 0) continue;
            
            const maxRadius = this.width * 3; // Larger radius
            const radius = maxRadius * ringProgress;
            const opacity = Math.max(0, 0.9 - ringProgress); // Higher opacity
            
            ctx.globalAlpha = opacity * this.fadeOut;
            ctx.strokeStyle = i === 0 ? '#FFFFFF' : (i === 1 ? '#F0F8FF' : '#E6F0FF');
            ctx.lineWidth = 5 - i * 0.5; // Thicker lines
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Draw splash particles
        const numParticles = 40; // More particles
        for (let i = 0; i < numParticles; i++) {
            const angle = (i / numParticles) * Math.PI * 2;
            const distance = this.width * 2 * progress; // Larger distance
            const size = 4 + Math.random() * 4; // Larger particles
            
            // Particle position with some randomness
            const x = centerX + Math.cos(angle) * distance * (0.8 + Math.random() * 0.4);
            const y = centerY + Math.sin(angle) * distance * (0.8 + Math.random() * 0.4) - distance * 0.3; // Bias upward
            
            // Particle opacity decreases as it moves outward
            const particleOpacity = Math.max(0, 1.0 - progress * 0.8); // Higher opacity
            
            ctx.globalAlpha = particleOpacity * this.fadeOut;
            ctx.fillStyle = i % 5 === 0 ? '#F0F8FF' : '#FFFFFF'; // Mix in some light blue particles
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Reset global alpha
        ctx.globalAlpha = 1;
    }
    
    // Create splash effect
    createSplash() {
        console.log('Creating splash effect!');
        this.splashActive = true;
        this.splashTime = 0;
    }
    
    // Check if player dunked in the milk glass
    checkDunk(player) {
        // Skip if already scored
        if (this.scored) {
            return false;
        }
        
        // Check collision
        if (player.x < this.x + this.width &&
            player.x + player.width > this.x &&
            player.y < this.y + this.height &&
            player.y + player.height > this.y) {
            
            console.log('Collision detected! Creating splash effect.');
            
            // Mark as scored
            this.scored = true;
            
            // Create splash effect
            this.createSplash();
            
            return true;
        }
        
        return false;
    }
}

// Export the MilkGlass class
window.MilkGlass = MilkGlass;
