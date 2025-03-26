// Particle Class
class Particle {
    constructor(x, y, vx, vy, radius, color, lifespan) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
        this.alpha = 1;
        this.lifespan = lifespan || 60; // Default 60 frames (1 second at 60fps)
        this.age = 0;
    }
    
    // Update particle position and properties
    update() {
        // Update position
        this.x += this.vx;
        this.y += this.vy;
        
        // Apply gravity and friction
        this.vy += 0.1;
        this.vx *= 0.99;
        
        // Age particle
        this.age++;
        
        // Update alpha based on age
        this.alpha = 1 - (this.age / this.lifespan);
        
        // Return true if still alive
        return this.age < this.lifespan;
    }
    
    // Draw particle
    draw(ctx) {
        ctx.save();
        
        // Set alpha
        ctx.globalAlpha = this.alpha;
        
        // Draw particle
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// Particle System Class
class ParticleSystem {
    constructor() {
        this.particles = [];
    }
    
    // Update all particles
    update() {
        this.particles = this.particles.filter(particle => particle.update());
    }
    
    // Draw all particles
    draw(ctx) {
        this.particles.forEach(particle => particle.draw(ctx));
    }
    
    // Create a splash effect (for milk glass dunks)
    createSplash(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 3;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed - 2; // Upward bias
            const radius = 2 + Math.random() * 3;
            const lifespan = 30 + Math.random() * 30;
            
            this.particles.push(new Particle(
                x, y, vx, vy, radius, color, lifespan
            ));
        }
    }
    
    // Create an explosion effect (for collisions)
    createExplosion(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 4;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const radius = 2 + Math.random() * 4;
            const lifespan = 40 + Math.random() * 20;
            
            this.particles.push(new Particle(
                x, y, vx, vy, radius, color, lifespan
            ));
        }
    }
    
    // Create a trail effect (for fire mode)
    createTrail(x, y, color) {
        for (let i = 0; i < 3; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.5 + Math.random() * 1;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed + 1; // Downward bias
            const radius = 1 + Math.random() * 2;
            const lifespan = 20 + Math.random() * 10;
            
            this.particles.push(new Particle(
                x, y, vx, vy, radius, color, lifespan
            ));
        }
    }
}

// Export the classes
window.Particle = Particle;
window.ParticleSystem = ParticleSystem;
