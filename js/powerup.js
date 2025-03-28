// Powerup Class
class Powerup {
    constructor(x, y, width, height, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.baseY = y;
        this.type = type;
        this.floatTimer = 0;
        this.floatSpeed = 0.05;
        this.floatAmount = 15;
        this.rotation = 0;
        this.rotationSpeed = 0.02;
        
        // Colors for different powerup types
        this.colors = {
            'multiplier': '#FFD700', // Gold
            'magnet': '#32CD32',     // Lime Green
            'slowmo': '#9932CC',     // Dark Orchid
            'shield': '#4169E1',     // Royal Blue
            'extralife': '#FF6347'   // Tomato Red
        };
        
        // Flag to indicate if this powerup uses emoji
        this.useEmoji = this.type === 'slowmo' || this.type === 'magnet';
        
        // Emoji for specific powerup types
        this.emoji = {
            'slowmo': '🕒',
            'magnet': '🧲'
        };
        
        // Load images for powerups
        this.images = {};
        this.loadImages();
        
        // Set color based on type
        this.color = this.colors[this.type] || '#FFFFFF';
        
        // Pulse animation
        this.pulseTimer = 0;
        this.pulseSpeed = 0.05;
        this.pulseAmount = 0.2; // 20% size variation
    }
    
    // Load powerup images
    loadImages() {
        const types = ['multiplier', 'magnet', 'slowmo', 'shield', 'extralife'];
        
        types.forEach(type => {
            // Skip image loading for emoji-based powerups
            if ((type === 'slowmo' || type === 'magnet') && this.useEmoji) {
                return;
            }
            
            this.images[type] = new Image();
            
            // Set appropriate image path based on powerup type
            switch(type) {
                case 'multiplier':
                    // Use a star for multiplier
                    this.images[type].src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FFD700"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>';
                    break;
                case 'magnet':
                    // Use a magnet icon
                    this.images[type].src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2332CD32"><path d="M3 7v4a5 5 0 0 0 5 5h3V7H3m11 0v9h3a5 5 0 0 0 5-5V7h-8m-9 2h3v5H5a3 3 0 0 1-3-3V9h3m11 0h3v2a3 3 0 0 1-3 3h-3V9z"/></svg>';
                    break;
                case 'slowmo':
                    // Use a clock icon
                    this.images[type].src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%239932CC"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/></svg>';
                    break;
                case 'shield':
                    // Use a shield icon
                    this.images[type].src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234169E1"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4m0 4c1.4 0 2.8 1.1 2.8 2.5V9c.6 0 1.2.6 1.2 1.3v3.5c0 .6-.6 1.2-1.3 1.2H9.2c-.6 0-1.2-.6-1.2-1.3v-3.5c0-.6.6-1.2 1.2-1.2v-1.5c0-1.4 1.4-2.5 2.8-2.5m0 1.2c-.8 0-1.5.5-1.5 1.3V9h3v-1.5c0-.8-.7-1.3-1.5-1.3z"/></svg>';
                    break;
                case 'extralife':
                    // Use a heart icon
                    this.images[type].src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FF6347"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
                    break;
            }
        });
    }
    
    // Update powerup position
    update() {
        // Move left based on scroll speed
        this.x -= CONFIG.SCROLL_SPEED;
        
        // Floating animation
        this.floatTimer += this.floatSpeed;
        this.y = this.baseY + Math.sin(this.floatTimer) * this.floatAmount;
        
        // Rotation animation
        this.rotation += this.rotationSpeed;
        
        // Pulse animation
        this.pulseTimer += this.pulseSpeed;
        
        // Return false if off screen to remove from game
        return this.x + this.width > 0;
    }
    
    // Draw powerup
    draw(ctx) {
        ctx.save();
        
        // Calculate pulse scale
        const pulseScale = 1 + Math.sin(this.pulseTimer) * this.pulseAmount;
        
        // Translate to center of powerup for rotation
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);
        
        // Apply pulse scale
        ctx.scale(pulseScale, pulseScale);
        
        // Draw glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        
        if (this.useEmoji && this.emoji[this.type]) {
            // Draw emoji for slowmo and magnet powerups
            ctx.font = `${this.width * 0.8}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.emoji[this.type], 0, 0);
        } else if (this.images[this.type]) {
            // Draw image for other powerups
            ctx.drawImage(
                this.images[this.type],
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height
            );
        } else {
            // Fallback to colored circle if image not available
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    // Draw fallback icon if image not loaded
    drawFallbackIcon(ctx) {
        ctx.fillStyle = '#FFFFFF';
        
        switch(this.type) {
            case 'multiplier':
                // Draw x2 text
                ctx.font = `bold ${this.width/3}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('x2', 0, 0);
                break;
                
            case 'magnet':
                // Draw magnet icon
                ctx.beginPath();
                ctx.moveTo(-this.width/4, -this.width/6);
                ctx.lineTo(this.width/4, -this.width/6);
                ctx.lineTo(this.width/4, this.width/6);
                ctx.lineTo(-this.width/4, this.width/6);
                ctx.closePath();
                ctx.stroke();
                break;
                
            case 'slowmo':
                // Draw clock icon
                ctx.beginPath();
                ctx.arc(0, 0, this.width/3, 0, Math.PI * 2);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, -this.width/5);
                ctx.moveTo(0, 0);
                ctx.lineTo(this.width/6, 0);
                ctx.stroke();
                break;
                
            case 'shield':
                // Draw shield icon
                ctx.beginPath();
                ctx.moveTo(0, -this.width/3);
                ctx.lineTo(this.width/3, -this.width/6);
                ctx.lineTo(this.width/3, this.width/6);
                ctx.lineTo(0, this.width/3);
                ctx.lineTo(-this.width/3, this.width/6);
                ctx.lineTo(-this.width/3, -this.width/6);
                ctx.closePath();
                ctx.stroke();
                break;
                
            case 'extralife':
                // Draw heart icon
                ctx.beginPath();
                ctx.moveTo(0, this.width/4);
                ctx.bezierCurveTo(
                    this.width/4, 0,
                    this.width/3, -this.width/6,
                    0, -this.width/3
                );
                ctx.bezierCurveTo(
                    -this.width/3, -this.width/6,
                    -this.width/4, 0,
                    0, this.width/4
                );
                ctx.fill();
                break;
                
            default:
                // Draw question mark for unknown types
                ctx.font = `bold ${this.width/3}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('?', 0, 0);
                break;
        }
    }
    
    // Check collision with player
    checkCollision(player) {
        return player.x < this.x + this.width &&
               player.x + player.width > this.x &&
               player.y < this.y + this.height &&
               player.y + player.height > this.y;
    }
}

// Export the Powerup class
window.Powerup = Powerup;
