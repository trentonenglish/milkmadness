// Pipe Class (Vertical obstacles)
class Pipe {
    // Static class property to hold the image
    static whiskImage = null;
    static imageLoaded = false;
    static loadingAttempted = false;
    
    constructor(x, y, width, height, isTop) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isTop = isTop;
        this.counted = false;
        
        // Initialize the static image only once
        if (!Pipe.loadingAttempted) {
            Pipe.loadingAttempted = true;
            Pipe.whiskImage = new Image();
            
            // Log when the image is loaded
            Pipe.whiskImage.onload = function() {
                console.log('Whisk image loaded successfully!');
                Pipe.imageLoaded = true;
            };
            
            // Log if there's an error loading the image
            Pipe.whiskImage.onerror = function(error) {
                console.error('Error loading whisk image:', error);
            };
            
            // Set the source last
            Pipe.whiskImage.src = 'images/whisk.png';
            console.log('Attempting to load whisk image from: images/whisk.png');
        }
    }
    
    update() {
        // Move pipe left
        this.x -= CONFIG.SCROLL_SPEED;
        
        // Return false if off screen
        return this.x + this.width > 0;
    }
    
    draw(ctx) {
        // Draw whisk using direct image if available
        if (Pipe.imageLoaded && Pipe.whiskImage) {
            ctx.save();
            
            if (this.isTop) {
                // For top pipes, draw upside down
                ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
                ctx.rotate(Math.PI);
                ctx.drawImage(
                    Pipe.whiskImage,
                    -this.width / 2,
                    -this.height / 2,
                    this.width,
                    this.height
                );
            } else {
                // For bottom pipes, draw normally
                ctx.drawImage(
                    Pipe.whiskImage,
                    this.x,
                    this.y,
                    this.width,
                    this.height
                );
            }
            
            ctx.restore();
        } else {
            // Fallback to rectangle if image not available
            ctx.fillStyle = '#8B4513'; // Brown color
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    
    checkCollision(player) {
        // Check if player collides with this pipe
        return (
            player.x < this.x + this.width &&
            player.x + player.width > this.x &&
            player.y < this.y + this.height &&
            player.y + player.height > this.y
        );
    }
}

// Export the Pipe class
window.Pipe = Pipe;
