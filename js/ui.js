// UI Manager
const UI = {
    // DOM elements
    elements: {
        scoreContainer: document.getElementById('score-container'),
        score: document.getElementById('score'),
        lives: document.getElementById('lives'),
        pauseBtn: document.getElementById('pause-btn'),
        replayBtn: document.getElementById('replay-btn'),
        gameOver: document.getElementById('game-over'),
        finalScore: document.getElementById('final-score'),
        scoreForm: document.getElementById('score-form'),
        emailInput: document.getElementById('email-input'),
        replayBtnOver: document.getElementById('replay-btn-over'),
        leaderboardBtn: document.getElementById('leaderboard-btn'),
        leaderboard: document.getElementById('leaderboard'),
        leaderboardList: document.getElementById('leaderboard-list'),
        closeLeaderboardBtn: document.getElementById('close-leaderboard'),
        tutorialOverlay: document.getElementById('tutorial-overlay'),
        tutorialContent: document.querySelector('.tutorial-content'),
        messageContainer: document.getElementById('message-container'),
        message: document.getElementById('message'),
        powerUpIndicator: document.getElementById('power-up-indicator'),
        powerUpIcon: document.getElementById('power-up-icon'),
        powerUpTimer: document.getElementById('power-up-timer')
    },
    
    // Message timeout
    messageTimeout: null,
    
    // Power-up timer interval
    powerupInterval: null,
    
    // Initialize UI
    init() {
        console.log('Initializing UI...');
        
        // Make sure tutorial overlay is visible
        if (this.elements.tutorialOverlay) {
            this.elements.tutorialOverlay.style.display = 'flex';
            console.log('Tutorial overlay set to display: flex');
        } else {
            console.error('Tutorial overlay element not found!');
        }
        
        // Add logo to tutorial if available
        if (ASSETS.images['logo'] && ASSETS.images['logo'].complete) {
            console.log('Adding logo to tutorial...');
            const logoImg = document.createElement('img');
            logoImg.src = 'Images/Logo Mark Color (3).png';
            logoImg.alt = 'Cookie Dunk Showdown Logo';
            logoImg.style.width = '150px';
            logoImg.style.height = 'auto';
            logoImg.style.margin = '0 auto 20px';
            logoImg.style.display = 'block';
            
            // Add logo at the top of tutorial content
            if (this.elements.tutorialContent) {
                this.elements.tutorialContent.insertBefore(logoImg, this.elements.tutorialContent.firstChild);
                console.log('Logo added to tutorial content');
            } else {
                console.error('Tutorial content element not found!');
            }
        } else {
            console.warn('Logo image not loaded or not available');
        }
        
        // Replace cookie icon with actual cookie image if available
        if (ASSETS.images['cookie'] && ASSETS.images['cookie'].complete) {
            console.log('Replacing cookie icon with image...');
            const cookieIcon = document.querySelector('.cookie-icon');
            if (cookieIcon) {
                cookieIcon.innerHTML = '';
                const cookieImg = document.createElement('img');
                cookieImg.src = 'Images/choco chip (1).png';
                cookieImg.alt = 'Cookie';
                cookieImg.style.width = '40px';
                cookieImg.style.height = '40px';
                cookieIcon.appendChild(cookieImg);
                console.log('Cookie icon replaced with image');
            }
        }
    },
    
    // Update score display
    updateScore(score) {
        if (this.elements.score) {
            this.elements.score.textContent = score;
        }
    },
    
    // Update lives display
    updateLives(lives) {
        if (this.elements.lives) {
            let livesText = '';
            for (let i = 0; i < lives; i++) {
                livesText += '❤️';
            }
            this.elements.lives.textContent = livesText;
        }
    },
    
    // Show message
    showMessage(message, duration = 2000) {
        // Clear any existing message
        if (this.messageTimeout) {
            clearTimeout(this.messageTimeout);
        }
        
        // Show message container
        if (this.elements.messageContainer) {
            this.elements.messageContainer.style.display = 'flex';
            
            // Set message text
            if (this.elements.message) {
                this.elements.message.textContent = message;
            }
            
            // Hide message after duration
            this.messageTimeout = setTimeout(() => {
                this.elements.messageContainer.style.display = 'none';
            }, duration);
        } else {
            // Fallback if container doesn't exist
            console.log('Message:', message);
        }
    },
    
    // Update powerup indicator
    updatePowerupIndicator(type, duration) {
        if (!this.elements.powerUpIndicator || !this.elements.powerUpIcon || !this.elements.powerUpTimer) {
            console.error('Power-up indicator elements not found');
            return;
        }
        
        // Clear any existing interval
        if (this.powerupInterval) {
            clearInterval(this.powerupInterval);
        }
        
        // Set icon based on powerup type
        let icon = '';
        switch (type) {
            case 'shield':
                icon = '🛡️';
                break;
            case 'slowmo':
                icon = '⏱️';
                break;
            case 'tripleDunk':
                icon = '3️⃣';
                break;
            case 'milkMagnet':
                icon = '🧲';
                break;
            default:
                icon = '✨';
        }
        
        // Update icon
        this.elements.powerUpIcon.textContent = icon;
        
        // Show powerup indicator
        this.elements.powerUpIndicator.style.display = 'flex';
        
        // Start countdown timer
        const startTime = Date.now();
        const endTime = startTime + duration;
        
        this.updatePowerupTimer(endTime - Date.now());
        
        this.powerupInterval = setInterval(() => {
            const timeLeft = endTime - Date.now();
            
            if (timeLeft <= 0) {
                clearInterval(this.powerupInterval);
                this.hidePowerupIndicator();
                return;
            }
            
            this.updatePowerupTimer(timeLeft);
        }, 100);
    },
    
    // Update powerup timer display
    updatePowerupTimer(timeLeft) {
        if (this.elements.powerUpTimer) {
            const seconds = Math.ceil(timeLeft / 1000);
            this.elements.powerUpTimer.textContent = `${seconds}s`;
        }
    },
    
    // Hide powerup indicator
    hidePowerupIndicator() {
        if (this.elements.powerUpIndicator) {
            this.elements.powerUpIndicator.style.display = 'none';
        }
        
        if (this.powerupInterval) {
            clearInterval(this.powerupInterval);
            this.powerupInterval = null;
        }
    },
    
    // Show game over screen
    showGameOver(score) {
        if (this.elements.finalScore && this.elements.gameOver) {
            this.elements.finalScore.textContent = score;
            this.elements.gameOver.style.display = 'flex';
        }
    },
    
    // Hide game over screen
    hideGameOver() {
        if (this.elements.gameOver) {
            this.elements.gameOver.style.display = 'none';
        }
    },
    
    // Show leaderboard
    showLeaderboard(scores) {
        if (!this.elements.leaderboard || !this.elements.leaderboardList) {
            console.error('Leaderboard elements not found');
            return;
        }
        
        // Clear existing entries
        this.elements.leaderboardList.innerHTML = '';
        
        // Create header row
        const headerRow = document.createElement('div');
        headerRow.className = 'leaderboard-row header';
        headerRow.innerHTML = `
            <div class="rank">Rank</div>
            <div class="email">Player</div>
            <div class="score">Score</div>
        `;
        this.elements.leaderboardList.appendChild(headerRow);
        
        // Add scores
        scores.forEach((scoreData, index) => {
            const row = document.createElement('div');
            row.className = 'leaderboard-row';
            
            // Highlight user's score
            if (scoreData.isCurrentUser) {
                row.classList.add('current-user');
            }
            
            row.innerHTML = `
                <div class="rank">${index + 1}</div>
                <div class="email">${scoreData.email.split('@')[0]}</div>
                <div class="score">${scoreData.score}</div>
            `;
            
            this.elements.leaderboardList.appendChild(row);
        });
        
        // Show leaderboard
        this.elements.leaderboard.style.display = 'flex';
    },
    
    // Hide leaderboard
    hideLeaderboard() {
        if (this.elements.leaderboard) {
            this.elements.leaderboard.style.display = 'none';
        }
    }
};

// Export the UI object
window.UI = UI;
