// Cookie Logo Generator
document.addEventListener('DOMContentLoaded', () => {
    // Create a cookie logo SVG
    function generateCookieLogo() {
        const logoContainer = document.getElementById('game-logo-container');
        if (!logoContainer) return;
        
        // Create SVG element
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "120");
        svg.setAttribute("height", "120");
        svg.setAttribute("viewBox", "0 0 120 120");
        svg.setAttribute("id", "game-logo");
        svg.style.borderRadius = "22px";
        svg.style.backgroundColor = "#f7cc6b";
        svg.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
        
        // Create cookie base
        const cookieBase = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        cookieBase.setAttribute("cx", "60");
        cookieBase.setAttribute("cy", "60");
        cookieBase.setAttribute("r", "50");
        cookieBase.setAttribute("fill", "#e0a84e");
        svg.appendChild(cookieBase);
        
        // Create chocolate chips
        const chipPositions = [
            {x: 40, y: 40, r: 8},
            {x: 75, y: 35, r: 7},
            {x: 50, y: 70, r: 9},
            {x: 80, y: 65, r: 6},
            {x: 35, y: 85, r: 7},
            {x: 65, y: 90, r: 8},
            {x: 90, y: 50, r: 7}
        ];
        
        chipPositions.forEach(pos => {
            const chip = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            chip.setAttribute("cx", pos.x);
            chip.setAttribute("cy", pos.y);
            chip.setAttribute("r", pos.r);
            chip.setAttribute("fill", "#5a3921");
            svg.appendChild(chip);
        });
        
        // Add bite mark
        const bite = document.createElementNS("http://www.w3.org/2000/svg", "path");
        bite.setAttribute("d", "M 100,30 A 50,50 0 0,1 110,60 L 60,60 Z");
        bite.setAttribute("fill", "#f7cc6b");
        svg.appendChild(bite);
        
        // Add milk glass
        const glass = document.createElementNS("http://www.w3.org/2000/svg", "path");
        glass.setAttribute("d", "M 20,100 L 25,70 L 45,70 L 50,100 Z");
        glass.setAttribute("fill", "white");
        glass.setAttribute("stroke", "#ddd");
        glass.setAttribute("stroke-width", "1");
        svg.appendChild(glass);
        
        // Add milk
        const milk = document.createElementNS("http://www.w3.org/2000/svg", "path");
        milk.setAttribute("d", "M 25,85 L 27,75 L 43,75 L 45,85 Z");
        milk.setAttribute("fill", "#f9f9f9");
        svg.appendChild(milk);
        
        // Replace the img element with our SVG
        logoContainer.innerHTML = '';
        logoContainer.appendChild(svg);
    }
    
    // Try to generate the logo
    generateCookieLogo();
});
