// Pipe Class (Flappy Bird-style pipe obstacles)
class Pipe {
    constructor(x, y, width, height, isTop) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isTop = isTop; // Whether this is a top pipe or bottom pipe
        this.color = '#75B943'; // Green pipe color like in Flappy Bird
    }
    
    update() {
        // Move pipe left
        this.x -= CONFIG.SCROLL_SPEED;
        
        // Return false if off screen
        return this.x + this.width > 0;
    }
    
    draw(ctx) {
        ctx.save();
        
        // Draw pipe body
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw pipe cap
        const capHeight = 20;
        const capWidth = this.width + 10;
        const capX = this.x - 5;
        
        ctx.fillStyle = '#5A9136'; // Darker green for the cap
        
        if (this.isTop) {
            // Bottom cap for top pipe
            ctx.fillRect(capX, this.y + this.height - capHeight, capWidth, capHeight);
        } else {
            // Top cap for bottom pipe
            ctx.fillRect(capX, this.y, capWidth, capHeight);
        }
        
        ctx.restore();
    }
    
    checkCollision(player) {
        // Simple AABB collision detection
        if (player.x + player.width > this.x && 
            player.x < this.x + this.width && 
            player.y + player.height > this.y && 
            player.y < this.y + this.height) {
            return true;
        }
        return false;
    }
}

// Export the Pipe class
window.Pipe = Pipe;
