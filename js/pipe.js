// Egg Beater Class (Vertical obstacles)
class Pipe {
    constructor(x, y, width, height, isTop) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isTop = isTop; // Whether this is a top or bottom egg beater
        this.counted = false; // Track if this pipe has been counted for score
        
        // We'll use the whisk image from the ASSETS manager
        this.imageLoaded = false;
    }
    
    update() {
        // Move egg beater left
        this.x -= CONFIG.SCROLL_SPEED;
        
        // Return false if off screen
        return this.x + this.width > 0;
    }
    
    draw(ctx) {
        ctx.save();
        
        // Get the whisk image from the ASSETS manager
        const whiskImage = ASSETS.getWhiskImage();
        this.imageLoaded = whiskImage && whiskImage.complete;
        
        if (this.imageLoaded) {
            if (this.isTop) {
                // Top whisk - draw upside down
                ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
                ctx.rotate(Math.PI); // Rotate 180 degrees
                ctx.drawImage(
                    whiskImage,
                    -this.width / 2,
                    -this.height / 2,
                    this.width,
                    this.height
                );
            } else {
                // Bottom whisk - draw normally
                ctx.drawImage(
                    whiskImage,
                    this.x,
                    this.y,
                    this.width,
                    this.height
                );
            }
        } else {
            // Fallback drawing if image isn't loaded yet
            ctx.fillStyle = '#D0D0D0';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        
        ctx.restore();
    }
    
    checkCollision(player) {
        // Check if player collides with this egg beater
        return (
            player.x < this.x + this.width &&
            player.x + player.width > this.x &&
            player.y < this.y + this.height &&
            player.y + player.height > this.y
        );
    }
}

// Export the Pipe class (still named Pipe for compatibility)
window.Pipe = Pipe;
