# DrugWars JS

<img src="https://img.shields.io/badge/version-1.2.0-blue" alt="Version 1.2.0" /> <img src="https://img.shields.io/badge/react-19.0.0-61DAFB" alt="React 19" /> <img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License" />

A modern JavaScript remake of the classic text-based strategy game "Drug Wars" from the 1980s. Buy low, sell high, and try to make as much money as possible before your time runs out—all while avoiding the dangers of the streets.

![DrugWars JS Screenshot](screenshot.png)

## 🎮 Game Overview

In DrugWars JS, you play as a drug dealer in New York City. Your goal is to make as much money as possible by buying and selling drugs across different boroughs, managing your debt with loan sharks, and avoiding random events like police busts and muggings.

You start with a small amount of cash and a debt to the loan shark. You have 30 days to pay off your debt and make as much money as possible. Will you become the kingpin of NYC or end up broke and in debt?

## ✨ Features

- **Modern React Implementation**: Built with React 19, Vite, and Chakra UI
- **Two Game Interfaces**: 
  - Modern UI with Chakra components
  - Retro calculator-style UI for nostalgic gameplay
- **Strategic Gameplay**:
  - Buy and sell 6 different types of drugs across 6 NYC locations
  - Price fluctuations based on location and market conditions
  - Manage inventory space in your "trenchcoat"
  - Deal with loan sharks to borrow money or pay off debt
- **Random Events**: Face unexpected situations like police busts, price spikes, and muggings
- **State Management**: Uses Jotai for efficient state management with persistence
- **Debug Mode**: Press F1 to access debug features (for development and testing)

## 🚀 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/drugwars-js.git
   cd drugwars-js
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## 🎲 How to Play

### Game Objective
Make as much money as possible within 30 days while paying off your initial debt.

### Basic Gameplay
1. **Buy Drugs**: Purchase drugs at low prices
2. **Travel**: Move between different NYC boroughs
3. **Sell Drugs**: Sell your drugs at higher prices
4. **Manage Debt**: Pay off your loan or borrow more money
5. **End Day**: Advance to the next day (prices will change)
6. **Watch Out**: Random events may occur that can help or hurt you

### Tips for Success
- Pay attention to price fluctuations across different locations
- Keep an eye on your inventory space
- Don't let your debt grow too large - the interest adds up!
- Sometimes it's worth traveling to find better prices
- Be careful when carrying large amounts of drugs or cash

## 🧠 Game Mechanics

### Drugs
The game features six types of drugs, each with different price ranges and volatility:
- Weed: $300-$800 (Low volatility)
- Cocaine: $1,000-$3,000 (Medium volatility)
- Heroin: $5,000-$9,000 (High volatility)
- Acid: $1,000-$4,000 (Very high volatility)
- Speed: $250-$1,500 (Medium volatility)
- Ludes: $10-$60 (Low volatility)

### Locations
You can travel between six locations in NYC:
- Bronx
- Brooklyn
- Queens
- Manhattan
- Staten Island
- Central Park

Each location has different price patterns and risk levels.

### Random Events
During gameplay, you may encounter random events:
- Police Bust: Lose some drugs and cash
- Price Spike: Drug prices suddenly increase
- Mugging: Lose some cash

## 🛠️ Technical Details

DrugWars JS is built with:
- React 19
- Vite
- Chakra UI
- Jotai (for state management)
- React Router

The game state is persisted in local storage, so your progress is saved even if you close the browser.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Inspired by the original "Drug Wars" game by John E. Dell
- Built with React and modern web technologies
- Special thanks to all contributors and players

---

**Note**: This game is a work of fiction and is meant for entertainment purposes only. It does not promote or endorse illegal activities.
