// Leaderboard Manager
const Leaderboard = {
    // Initialize Firebase
    init() {
        // Initialize Firebase with config
        if (!firebase.apps.length) {
            firebase.initializeApp(CONFIG.FIREBASE_CONFIG);
        }
        this.db = firebase.firestore();
    },
    
    // Save score to leaderboard
    saveScore(email, score) {
        // Make sure Firebase is initialized
        if (!this.db) {
            this.init();
        }
        
        // Get user's location (city) from email domain or IP
        const city = this.getUserCity(email);
        
        // Get user's initials from email
        const initials = this.getInitialsFromEmail(email);
        
        // Create score data
        const scoreData = {
            email: email,
            score: score,
            initials: initials,
            city: city,
            timestamp: new Date().toISOString()
        };
        
        // Save to Firebase
        this.db.collection('scores')
            .add(scoreData)
            .then(() => {
                UI.showMessage('Score saved!');
                this.loadLeaderboard();
            })
            .catch(error => {
                console.error('Error saving score:', error);
                UI.showMessage('Error saving score');
            });
    },
    
    // Load leaderboard data
    loadLeaderboard() {
        // Make sure Firebase is initialized
        if (!this.db) {
            this.init();
        }
        
        const leaderboardList = document.getElementById('leaderboard-list');
        leaderboardList.innerHTML = '<div class="loading">Loading...</div>';
        
        // Get top 25 scores
        this.db.collection('scores')
            .orderBy('score', 'desc')
            .limit(25)
            .get()
            .then(snapshot => {
                leaderboardList.innerHTML = '';
                
                if (snapshot.empty) {
                    leaderboardList.innerHTML = '<div class="no-scores">No scores yet. Be the first!</div>';
                    return;
                }
                
                // Add header row
                const headerRow = document.createElement('div');
                headerRow.className = 'leaderboard-item header';
                headerRow.innerHTML = `
                    <span><strong>Rank</strong></span>
                    <span><strong>Player</strong></span>
                    <span><strong>Score</strong></span>
                `;
                leaderboardList.appendChild(headerRow);
                
                // Add score rows
                snapshot.docs.forEach((doc, index) => {
                    const data = doc.data();
                    const row = document.createElement('div');
                    row.className = 'leaderboard-item';
                    row.innerHTML = `
                        <span>${index + 1}</span>
                        <span>${data.initials} (${data.city})</span>
                        <span>${data.score}</span>
                    `;
                    leaderboardList.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Error loading leaderboard:', error);
                leaderboardList.innerHTML = '<div class="error">Error loading leaderboard</div>';
            });
    },
    
    // Get user's initials from email
    getInitialsFromEmail(email) {
        // Extract username part of email
        const username = email.split('@')[0];
        
        // If username contains dots or underscores, use them to split
        let parts;
        if (username.includes('.')) {
            parts = username.split('.');
        } else if (username.includes('_')) {
            parts = username.split('_');
        } else {
            // Try to split by capital letters
            parts = username.match(/[A-Z][a-z]+/g);
        }
        
        // If we couldn't split, just use first 2-3 characters
        if (!parts || parts.length === 1) {
            return username.substring(0, Math.min(3, username.length)).toUpperCase();
        }
        
        // Get first letter of each part
        return parts.map(part => part.charAt(0).toUpperCase()).join('');
    },
    
    // Get user's city from email or IP
    getUserCity(email) {
        // In a real implementation, we would use a geolocation service
        // For now, we'll extract from email domain or use a placeholder
        
        const domain = email.split('@')[1];
        
        // Map some common domains to locations (very simplified)
        const domainMap = {
            'gmail.com': 'Unknown',
            'yahoo.com': 'Unknown',
            'hotmail.com': 'Unknown',
            'outlook.com': 'Unknown'
        };
        
        // Return mapped city or "Unknown"
        return domainMap[domain] || 'Unknown';
    }
};
