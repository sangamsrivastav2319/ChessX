# ♟️ ChessX - Pure JavaScript Implementation

A fully functional, interactive chess game built with vanilla JavaScript, HTML5, and CSS3. No frameworks, no dependencies - just pure web technologies.

## 🎮 Live Demo
[Play the game here](#) *(Add your GitHub Pages or deployment link)*

## ✨ Features

### Core Gameplay
- ✅ **Complete Chess Rules Implementation**
  - All standard piece movements (Pawn, Rook, Knight, Bishop, Queen, King)
  - Turn-based gameplay (White vs Black)
  - Piece capture mechanics
  - Move validation and legal move detection

### Advanced Chess Mechanics
- ♔ **Special Moves**
  - Castling (Kingside and Queenside)
  - En Passant capture
  - Pawn promotion (auto-promotes to Queen)
  
- 🛡️ **King Safety**
  - Check detection and visual indication
  - Checkmate detection with game-over alert
  - Stalemate detection
  - Prevents illegal moves that leave king in check

### User Interface
- 🎨 **Interactive Visual Feedback**
  - Highlighted selected pieces
  - Valid move indicators (dots for empty squares, red overlay for captures)
  - Last move highlighting
  - King highlighted when in check with pulsing animation
  - Smooth hover effects and transitions

- 📱 **Responsive Design**
  - Adapts to desktop, tablet, and mobile screens
  - Touch-friendly interface
  - Gradient background with glowing board effect

## 🚀 Getting Started

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software or dependencies required

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/yourusername/chess-game.git
```

2. **Navigate to the project directory**
```bash
   cd chess-game
```

3. **Open the game**
   - Simply open `index.html` in your web browser
   - Or use a local server:
```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Node.js
     npx serve
```
   - Then navigate to `http://localhost:8000`

## 📁 Project Structure
```
chess-game/
│
├── index.html          # Main HTML file
├── style.css           # All styling and animations
├── script.js           # Complete game logic
└── README.md           # Project documentation
```

## 🎯 How to Play

1. **Start the Game**: White moves first
2. **Select a Piece**: Click on any piece of your color
3. **View Valid Moves**: Green dots show where you can move
4. **Make a Move**: Click on a highlighted square to move
5. **Capture Pieces**: Click on enemy pieces (shown with red overlay)
6. **Special Moves**:
   - Castle by moving your king two squares toward a rook
   - Capture en passant when the opportunity arises
   - Promote pawns automatically when reaching the last rank

## 🔧 Technical Implementation

### JavaScript Features
- Object-oriented design with clear separation of concerns
- Modular functions for move validation, piece logic, and game state
- Efficient board representation using 2D arrays
- Recursive attack detection for check/checkmate validation
- Event-driven architecture for user interactions

### CSS Highlights
- CSS Grid for perfect board layout
- Custom animations (check pulse, hover effects)
- Gradient backgrounds and shadow effects
- Responsive breakpoints for multiple screen sizes
- Unicode chess symbols for pieces

### Code Quality
- Comprehensive inline documentation
- Clean, readable code structure
- Organized into logical sections
- No external dependencies
- Cross-browser compatible

## 🎨 Customization

You can easily customize the game by modifying:

- **Colors**: Edit the square colors in `style.css` (`.square.white` and `.square.black`)
- **Board Size**: Adjust grid dimensions in CSS
- **Piece Symbols**: Modify the `PIECES` object in `script.js`
- **Animations**: Customize transitions and effects in `style.css`

## 🐛 Known Limitations

- Pawn promotion currently auto-promotes to Queen (manual selection can be added)
- No move undo/redo functionality
- No game timer or move history display
- No AI opponent (player vs player only)

## 🚧 Future Enhancements

- [ ] Add move history panel
- [ ] Implement undo/redo functionality
- [ ] Add game timer and move counter
- [ ] Player vs AI mode with difficulty levels
- [ ] Save/load game state
- [ ] Manual pawn promotion selection
- [ ] Sound effects for moves and captures
- [ ] Algebraic notation display
- [ ] Game statistics and win tracking

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: https://github.com/sangamsrivastav2319
- LinkedIn: https://linkedin.com/in/sangam2319

## 🙏 Acknowledgments

- Chess piece symbols from Unicode Standard
- Inspired by classic chess implementations
- Built as a learning project for vanilla JavaScript

## 📸 Screenshots

![Chess Game Screenshot](#) *(Add screenshots of your game)*

---

⭐ **If you found this project helpful, please consider giving it a star!** ⭐
```

**Additional files you might want to add:**

**LICENSE** (MIT License example):
```
MIT License

Copyright (c) 2024 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
