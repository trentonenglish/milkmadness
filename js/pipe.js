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
        // Draw the whisk image if loaded
        if (Pipe.imageLoaded && Pipe.whiskImage) {
            // For top pipes, flip the image
            ctx.save();
            
            if (this.isTop) {
                // Translate to the position, flip vertically, then draw
                ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
                ctx.scale(1, -1);
                ctx.drawImage(
                    Pipe.whiskImage,
                    -this.width / 2,
                    -this.height / 2,
                    this.width,
                    this.height
                );
            } else {
                // Draw bottom pipe normally
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
            // Fallback drawing if image not loaded
            ctx.fillStyle = this.isTop ? '#FF6347' : '#32CD32';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Draw whisk handle
            ctx.fillStyle = '#8B4513';
            const handleWidth = this.width / 3;
            const handleHeight = this.height / 5;
            const handleX = this.x + (this.width - handleWidth) / 2;
            const handleY = this.isTop ? this.y + this.height - handleHeight : this.y;
            ctx.fillRect(handleX, handleY, handleWidth, handleHeight);
        }
        
        // Draw hitbox in debug mode
        if (window.DEBUG_MODE) {
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
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
