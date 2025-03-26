// Milk Glass Class
class MilkGlass {
    constructor(x, y, width = CONFIG.MILK_GLASS_WIDTH, height = CONFIG.MILK_GLASS_HEIGHT) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.scored = false;
        this.perfect = false;
        this.glowIntensity = 0;
        this.glowDirection = 1;
        this.emoji = '🥛';
        this.emojiSize = 30; // Smaller emoji size
        this.splashParticles = [];
        this.fadeOut = 1.0; // For fade out effect when hit
        
        console.log('MilkGlass created at:', x, y, 'with size:', width, height);
    }
    
    // Update milk glass position
    update() {
        // Move milk glass left
        this.x -= CONFIG.SCROLL_SPEED;
        
        // Update splash particles
        if (this.scored) {
            // Fade out the milk glass
            this.fadeOut -= 0.05;
            
            // Update splash particles
            for (let i = 0; i < this.splashParticles.length; i++) {
                const particle = this.splashParticles[i];
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.1; // Gravity
                particle.life -= 0.02;
            }
            
            // Remove dead particles
            this.splashParticles = this.splashParticles.filter(p => p.life > 0);
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
        
        // Draw milk emoji
        ctx.font = `${this.emojiSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.emoji, this.x + this.width / 2, this.y + this.height / 2);
        
        // Draw splash particles
        for (const particle of this.splashParticles) {
            ctx.globalAlpha = particle.life;
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    createSplash() {
        // Create splash particles
        for (let i = 0; i < 20; i++) {
            this.splashParticles.push({
                x: this.x + this.width / 2,
                y: this.y + this.height / 2,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5 - 2, // Mostly upward
                size: Math.random() * 3 + 1,
                life: Math.random() * 0.5 + 0.5
            });
        }
    }
    
    // Check if player dunked in the milk glass
    checkDunk(player) {
        // Skip if already scored
        if (this.scored) {
            return false;
        }
        
        // Check if player is within milk glass
        const playerCenterX = player.x + player.width / 2;
        const playerBottom = player.y + player.height;
        
        // Check if player is within horizontal bounds of milk glass
        const milkCenterX = this.x + this.width / 2;
        const milkCenterY = this.y + this.height / 2;
        const hitDistance = 25; // Collision radius
        
        // Calculate distance between centers
        const dx = playerCenterX - milkCenterX;
        const dy = playerBottom - milkCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // If close enough, count as a hit
        if (distance < hitDistance) {
            this.scored = true;
            this.perfect = distance < hitDistance / 2; // Perfect if very close to center
            this.createSplash(); // Create splash effect
            return true;
        }
        
        return false;
    }
}

// Export the MilkGlass class
window.MilkGlass = MilkGlass;
