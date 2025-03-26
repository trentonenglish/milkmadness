# Cookie Dunk Showdown – Milk Madness Edition

"Tap to flap. Dunk the milk. Dodge the monsters. Don't crumble."

## Overview

Cookie Dunk Showdown is a mobile-first, vertically-oriented endless side-scrolling game inspired by the mechanics of Flappy Bird with the visual flair and arcade energy of NBA Jam.

The player controls a flying cookie that remains horizontally stationary on the screen. Milk glasses, cookie monster defenders, power-ups, and background elements scroll toward the player from right to left.

## Game Mechanics

- **Controls**: Tap (or spacebar on desktop) to make the cookie flap upward
- **Objective**: Score points by dunking into glasses of milk while dodging defenders
- **Scoring**:
  - Successful dunk = 1 point
  - Perfect dunk (no rim hit) = 2 points
  - Streak multipliers increase points based on consecutive successful dunks
  - Power-ups can multiply points for limited time

## Features

### Core Gameplay
- **Streak System**: Build up consecutive successful dunks to increase your score multiplier
- **Visual Feedback**: Screen shake and flash effects for important game events
- **Particle Effects**: Chocolate chip explosions when the cookie collides with obstacles

### Power-ups with Enhanced Visuals
- **Shield**: Absorbs one hit without losing a life, with visible shield bubble effect
- **Slow Motion**: Slows down all game movement for easier navigation
- **2X Points**: Doubles all points earned for a limited time
- **Milk Magnet**: Attracts milk glasses to the cookie with animated magnetic field effect
- **Extra Life**: Grants an additional life

### Enhanced UI
- **Detailed Info Box**: Displays comprehensive game statistics:
  - Score, lives, current streak, highest streak
  - Total milk collected, obstacles passed, power-ups collected
  - Time elapsed and active power-ups with remaining duration

## Development Notes

This game currently uses placeholder assets for all visual elements. Custom Crave Cookies artwork will be added later.

### Firebase Integration

To enable the leaderboard functionality, you need to:

1. Create a Firebase project
2. Enable Firestore database
3. Update the Firebase configuration in `js/config.js`

```javascript
FIREBASE_CONFIG: {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-app.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-app.appspot.com",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
}
```

## Recent Enhancements

- Added chocolate chip particle explosions
- Implemented streak-based scoring system
- Enhanced power-up visuals with SVG icons and animations
- Added magnetic field effect for milk magnet power-up
- Improved visual feedback with screen shake and flash effects
- Enhanced info box with detailed game statistics

## Running the Game

Simply open `index.html` in a web browser. The game is optimized for mobile devices but works on desktop browsers as well.

## Embedding on cravecookies.com

To embed the game on cravecookies.com, use an iframe:

```html
<iframe src="path/to/game/index.html" width="100%" height="700px" frameborder="0"></iframe>
```

## Future Enhancements

- Custom Crave Cookies artwork
- Additional power-ups and obstacles
- More background environments
- Social sharing functionality
- Integration with Crave Cookies rewards system
