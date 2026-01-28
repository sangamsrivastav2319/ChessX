// ============================================================================
// CHESS GAME - Complete Implementation
// ============================================================================

// ============================================================================
// GLOBAL STATE
// ============================================================================

let board = []; // 8x8 array representing the chess board
let selectedSquare = null; // Currently selected square {row, col}
let currentTurn = 'white'; // Current player's turn
let gameOver = false; // Game state flag
let lastMove = null; // Track last move for en passant and highlighting
let moveHistory = []; // Track move history
let whiteKingMoved = false; // Track if white king has moved (for castling)
let blackKingMoved = false; // Track if black king has moved (for castling)
let whiteRookKingsideMoved = false; // Track white kingside rook
let whiteRookQueensideMoved = false; // Track white queenside rook
let blackRookKingsideMoved = false; // Track black kingside rook
let blackRookQueensideMoved = false; // Track black queenside rook

// ============================================================================
// PIECE DEFINITIONS
// ============================================================================

const PIECES = {
    white: {
        king: '♔',
        queen: '♕',
        rook: '♖',
        bishop: '♗',
        knight: '♘',
        pawn: '♙'
    },
    black: {
        king: '♚',
        queen: '♛',
        rook: '♜',
        bishop: '♝',
        knight: '♞',
        pawn: '♟'
    }
};

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize the chess board with starting positions
 */
function initializeBoard() {
    // Create empty 8x8 board
    board = Array(8).fill(null).map(() => Array(8).fill(null));
    
    // Setup black pieces (top of board)
    board[0][0] = { type: 'rook', color: 'black' };
    board[0][1] = { type: 'knight', color: 'black' };
    board[0][2] = { type: 'bishop', color: 'black' };
    board[0][3] = { type: 'queen', color: 'black' };
    board[0][4] = { type: 'king', color: 'black' };
    board[0][5] = { type: 'bishop', color: 'black' };
    board[0][6] = { type: 'knight', color: 'black' };
    board[0][7] = { type: 'rook', color: 'black' };
    
    // Setup black pawns
    for (let col = 0; col < 8; col++) {
        board[1][col] = { type: 'pawn', color: 'black' };
    }
    
    // Setup white pawns
    for (let col = 0; col < 8; col++) {
        board[6][col] = { type: 'pawn', color: 'white' };
    }
    
    // Setup white pieces (bottom of board)
    board[7][0] = { type: 'rook', color: 'white' };
    board[7][1] = { type: 'knight', color: 'white' };
    board[7][2] = { type: 'bishop', color: 'white' };
    board[7][3] = { type: 'queen', color: 'white' };
    board[7][4] = { type: 'king', color: 'white' };
    board[7][5] = { type: 'bishop', color: 'white' };
    board[7][6] = { type: 'knight', color: 'white' };
    board[7][7] = { type: 'rook', color: 'white' };
}

/**
 * Render the chess board to the DOM
 */
function renderBoard() {
    const chessboard = document.getElementById('chessboard');
    chessboard.innerHTML = ''; // Clear existing board
    
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.className = 'square';
            
            // Add alternating colors
            if ((row + col) % 2 === 0) {
                square.classList.add('white');
            } else {
                square.classList.add('black');
            }
            
            // Add piece if present
            const piece = board[row][col];
            if (piece) {
                const pieceElement = document.createElement('span');
                pieceElement.textContent = PIECES[piece.color][piece.type];
                pieceElement.className = `piece ${piece.color}-piece`;
                square.appendChild(pieceElement);
            }
            
            // Add data attributes for position
            square.dataset.row = row;
            square.dataset.col = col;
            
            // Add click event listener
            square.addEventListener('click', () => handleSquareClick(row, col));
            
            chessboard.appendChild(square);
        }
    }
    
    // Highlight selected square if exists
    if (selectedSquare) {
        highlightSquare(selectedSquare.row, selectedSquare.col, 'selected');
    }
    
    // Highlight last move
    if (lastMove) {
        highlightSquare(lastMove.from.row, lastMove.from.col, 'last-move');
        highlightSquare(lastMove.to.row, lastMove.to.col, 'last-move');
    }
    
    // Check if current player is in check and highlight king
    if (isKingInCheck(currentTurn)) {
        const kingPos = findKing(currentTurn);
        if (kingPos) {
            highlightSquare(kingPos.row, kingPos.col, 'check');
        }
    }
}

/**
 * Highlight a square with a specific class
 */
function highlightSquare(row, col, className) {
    const squares = document.querySelectorAll('.square');
    const index = row * 8 + col;
    if (squares[index]) {
        squares[index].classList.add(className);
    }
}

/**
 * Highlight valid moves for the selected piece
 */
function highlightValidMoves(validMoves) {
    validMoves.forEach(move => {
        highlightSquare(move.row, move.col, 'valid-move');
    });
}

// ============================================================================
// CLICK HANDLING
// ============================================================================

/**
 * Handle square click events
 */
function handleSquareClick(row, col) {
    if (gameOver) {
        return;
    }
    
    const piece = board[row][col];
    
    // If no piece is selected
    if (!selectedSquare) {
        // Select piece if it belongs to current player
        if (piece && piece.color === currentTurn) {
            selectedSquare = { row, col };
            renderBoard();
            
            // Get and highlight valid moves
            const validMoves = getValidMoves(row, col);
            highlightValidMoves(validMoves);
        }
    } else {
        // If clicking the same square, deselect
        if (selectedSquare.row === row && selectedSquare.col === col) {
            selectedSquare = null;
            renderBoard();
            return;
        }
        
        // If clicking another piece of same color, switch selection
        if (piece && piece.color === currentTurn) {
            selectedSquare = { row, col };
            renderBoard();
            
            const validMoves = getValidMoves(row, col);
            highlightValidMoves(validMoves);
            return;
        }
        
        // Try to move the selected piece
        const validMoves = getValidMoves(selectedSquare.row, selectedSquare.col);
        const isValidMove = validMoves.some(move => move.row === row && move.col === col);
        
        if (isValidMove) {
            // Attempt the move
            const moveResult = makeMove(selectedSquare.row, selectedSquare.col, row, col);
            
            if (moveResult) {
                selectedSquare = null;
                renderBoard();
                
                // Check for checkmate or stalemate
                checkGameEnd();
            } else {
                // Move would leave king in check
                alert('Invalid move: Your king would be in check!');
                selectedSquare = null;
                renderBoard();
            }
        } else {
            // Invalid move
            selectedSquare = null;
            renderBoard();
        }
    }
}

// ============================================================================
// MOVE VALIDATION
// ============================================================================

/**
 * Get all valid moves for a piece at the given position
 */
function getValidMoves(row, col) {
    const piece = board[row][col];
    if (!piece) return [];
    
    let moves = [];
    
    switch (piece.type) {
        case 'pawn':
            moves = getPawnMoves(row, col, piece.color);
            break;
        case 'rook':
            moves = getRookMoves(row, col, piece.color);
            break;
        case 'knight':
            moves = getKnightMoves(row, col, piece.color);
            break;
        case 'bishop':
            moves = getBishopMoves(row, col, piece.color);
            break;
        case 'queen':
            moves = getQueenMoves(row, col, piece.color);
            break;
        case 'king':
            moves = getKingMoves(row, col, piece.color);
            break;
    }
    
    // Filter out moves that would leave king in check
    moves = moves.filter(move => !wouldMoveLeaveKingInCheck(row, col, move.row, move.col, piece.color));
    
    return moves;
}

/**
 * Get valid pawn moves
 */
function getPawnMoves(row, col, color) {
    const moves = [];
    const direction = color === 'white' ? -1 : 1; // White moves up (-1), black moves down (+1)
    const startRow = color === 'white' ? 6 : 1;
    
    // Move forward one square
    const newRow = row + direction;
    if (isValidPosition(newRow, col) && !board[newRow][col]) {
        moves.push({ row: newRow, col });
        
        // Move forward two squares from starting position
        if (row === startRow) {
            const doubleRow = row + (2 * direction);
            if (!board[doubleRow][col]) {
                moves.push({ row: doubleRow, col });
            }
        }
    }
    
    // Capture diagonally
    const captureCols = [col - 1, col + 1];
    captureCols.forEach(captureCol => {
        if (isValidPosition(newRow, captureCol)) {
            const targetPiece = board[newRow][captureCol];
            if (targetPiece && targetPiece.color !== color) {
                moves.push({ row: newRow, col: captureCol });
            }
        }
    });
    
    // En passant
    if (lastMove && lastMove.piece.type === 'pawn' && 
        Math.abs(lastMove.from.row - lastMove.to.row) === 2) {
        
        const enPassantRow = color === 'white' ? 3 : 4;
        if (row === enPassantRow && Math.abs(col - lastMove.to.col) === 1) {
            moves.push({ row: newRow, col: lastMove.to.col, isEnPassant: true });
        }
    }
    
    return moves;
}

/**
 * Get valid rook moves
 */
function getRookMoves(row, col, color) {
    const moves = [];
    const directions = [
        { dr: -1, dc: 0 },  // Up
        { dr: 1, dc: 0 },   // Down
        { dr: 0, dc: -1 },  // Left
        { dr: 0, dc: 1 }    // Right
    ];
    
    directions.forEach(dir => {
        let newRow = row + dir.dr;
        let newCol = col + dir.dc;
        
        while (isValidPosition(newRow, newCol)) {
            const targetPiece = board[newRow][newCol];
            
            if (!targetPiece) {
                moves.push({ row: newRow, col: newCol });
            } else {
                if (targetPiece.color !== color) {
                    moves.push({ row: newRow, col: newCol });
                }
                break; // Stop at any piece
            }
            
            newRow += dir.dr;
            newCol += dir.dc;
        }
    });
    
    return moves;
}

/**
 * Get valid knight moves
 */
function getKnightMoves(row, col, color) {
    const moves = [];
    const knightMoves = [
        { dr: -2, dc: -1 }, { dr: -2, dc: 1 },
        { dr: -1, dc: -2 }, { dr: -1, dc: 2 },
        { dr: 1, dc: -2 },  { dr: 1, dc: 2 },
        { dr: 2, dc: -1 },  { dr: 2, dc: 1 }
    ];
    
    knightMoves.forEach(move => {
        const newRow = row + move.dr;
        const newCol = col + move.dc;
        
        if (isValidPosition(newRow, newCol)) {
            const targetPiece = board[newRow][newCol];
            if (!targetPiece || targetPiece.color !== color) {
                moves.push({ row: newRow, col: newCol });
            }
        }
    });
    
    return moves;
}

/**
 * Get valid bishop moves
 */
function getBishopMoves(row, col, color) {
    const moves = [];
    const directions = [
        { dr: -1, dc: -1 }, // Up-left
        { dr: -1, dc: 1 },  // Up-right
        { dr: 1, dc: -1 },  // Down-left
        { dr: 1, dc: 1 }    // Down-right
    ];
    
    directions.forEach(dir => {
        let newRow = row + dir.dr;
        let newCol = col + dir.dc;
        
        while (isValidPosition(newRow, newCol)) {
            const targetPiece = board[newRow][newCol];
            
            if (!targetPiece) {
                moves.push({ row: newRow, col: newCol });
            } else {
                if (targetPiece.color !== color) {
                    moves.push({ row: newRow, col: newCol });
                }
                break;
            }
            
            newRow += dir.dr;
            newCol += dir.dc;
        }
    });
    
    return moves;
}

/**
 * Get valid queen moves (combination of rook and bishop)
 */
function getQueenMoves(row, col, color) {
    return [...getRookMoves(row, col, color), ...getBishopMoves(row, col, color)];
}

/**
 * Get valid king moves
 */
function getKingMoves(row, col, color) {
    const moves = [];
    const kingMoves = [
        { dr: -1, dc: -1 }, { dr: -1, dc: 0 }, { dr: -1, dc: 1 },
        { dr: 0, dc: -1 },                      { dr: 0, dc: 1 },
        { dr: 1, dc: -1 },  { dr: 1, dc: 0 },  { dr: 1, dc: 1 }
    ];
    
    kingMoves.forEach(move => {
        const newRow = row + move.dr;
        const newCol = col + move.dc;
        
        if (isValidPosition(newRow, newCol)) {
            const targetPiece = board[newRow][newCol];
            if (!targetPiece || targetPiece.color !== color) {
                moves.push({ row: newRow, col: newCol });
            }
        }
    });
    
    // Castling
    const castlingMoves = getCastlingMoves(row, col, color);
    moves.push(...castlingMoves);
    
    return moves;
}

/**
 * Get valid castling moves
 */
function getCastlingMoves(row, col, color) {
    const moves = [];
    
    // Check if king has moved
    if ((color === 'white' && whiteKingMoved) || (color === 'black' && blackKingMoved)) {
        return moves;
    }
    
    // Check if king is in check
    if (isKingInCheck(color)) {
        return moves;
    }
    
    const baseRow = color === 'white' ? 7 : 0;
    
    // Kingside castling
    const kingsideRookMoved = color === 'white' ? whiteRookKingsideMoved : blackRookKingsideMoved;
    if (!kingsideRookMoved) {
        const rook = board[baseRow][7];
        if (rook && rook.type === 'rook' && rook.color === color) {
            // Check if squares between king and rook are empty
            if (!board[baseRow][5] && !board[baseRow][6]) {
                // Check if king passes through or ends in check
                if (!isSquareUnderAttack(baseRow, 5, color) && !isSquareUnderAttack(baseRow, 6, color)) {
                    moves.push({ row: baseRow, col: 6, isCastling: true, rookCol: 7 });
                }
            }
        }
    }
    
    // Queenside castling
    const queensideRookMoved = color === 'white' ? whiteRookQueensideMoved : blackRookQueensideMoved;
    if (!queensideRookMoved) {
        const rook = board[baseRow][0];
        if (rook && rook.type === 'rook' && rook.color === color) {
            // Check if squares between king and rook are empty
            if (!board[baseRow][1] && !board[baseRow][2] && !board[baseRow][3]) {
                // Check if king passes through or ends in check
                if (!isSquareUnderAttack(baseRow, 2, color) && !isSquareUnderAttack(baseRow, 3, color)) {
                    moves.push({ row: baseRow, col: 2, isCastling: true, rookCol: 0 });
                }
            }
        }
    }
    
    return moves;
}

/**
 * Check if a position is valid on the board
 */
function isValidPosition(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}

// ============================================================================
// MOVE EXECUTION
// ============================================================================

/**
 * Make a move on the board
 * Returns true if move was successful, false if move would leave king in check
 */
function makeMove(fromRow, fromCol, toRow, toCol) {
    const piece = board[fromRow][fromCol];
    const capturedPiece = board[toRow][toCol];
    
    // Check if this is a castling move
    const validMoves = getValidMoves(fromRow, fromCol);
    const moveData = validMoves.find(m => m.row === toRow && m.col === toCol);
    
    // Store move for en passant detection
    lastMove = {
        piece: { ...piece },
        from: { row: fromRow, col: fromCol },
        to: { row: toRow, col: toCol },
        capturedPiece: capturedPiece
    };
    
    // Execute the move
    board[toRow][toCol] = piece;
    board[fromRow][fromCol] = null;
    
    // Handle special moves
    
    // En passant capture
    if (moveData && moveData.isEnPassant) {
        board[fromRow][toCol] = null; // Remove captured pawn
    }
    
    // Castling
    if (moveData && moveData.isCastling) {
        const rookFromCol = moveData.rookCol;
        const rookToCol = toCol === 6 ? 5 : 3; // Kingside: 5, Queenside: 3
        board[toRow][rookToCol] = board[toRow][rookFromCol];
        board[toRow][rookFromCol] = null;
    }
    
    // Pawn promotion
    if (piece.type === 'pawn' && (toRow === 0 || toRow === 7)) {
        board[toRow][toCol] = { type: 'queen', color: piece.color }; // Auto-promote to queen
    }
    
    // Update castling flags
    if (piece.type === 'king') {
        if (piece.color === 'white') whiteKingMoved = true;
        else blackKingMoved = true;
    }
    
    if (piece.type === 'rook') {
        if (piece.color === 'white') {
            if (fromCol === 7) whiteRookKingsideMoved = true;
            if (fromCol === 0) whiteRookQueensideMoved = true;
        } else {
            if (fromCol === 7) blackRookKingsideMoved = true;
            if (fromCol === 0) blackRookQueensideMoved = true;
        }
    }
    
    // Check if move leaves king in check (should already be filtered, but double-check)
    if (isKingInCheck(piece.color)) {
        // Undo the move
        board[fromRow][fromCol] = piece;
        board[toRow][toCol] = capturedPiece;
        
        if (moveData && moveData.isEnPassant) {
            board[fromRow][toCol] = lastMove.capturedPiece;
        }
        
        if (moveData && moveData.isCastling) {
            const rookFromCol = moveData.rookCol;
            const rookToCol = toCol === 6 ? 5 : 3;
            board[toRow][rookFromCol] = board[toRow][rookToCol];
            board[toRow][rookToCol] = null;
        }
        
        return false;
    }
    
    // Switch turns
    currentTurn = currentTurn === 'white' ? 'black' : 'white';
    
    return true;
}

// ============================================================================
// CHECK DETECTION
// ============================================================================

/**
 * Check if the king of the specified color is in check
 */
function isKingInCheck(color) {
    const kingPos = findKing(color);
    if (!kingPos) return false;
    
    return isSquareUnderAttack(kingPos.row, kingPos.col, color);
}

/**
 * Find the position of the king for a given color
 */
function findKing(color) {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && piece.type === 'king' && piece.color === color) {
                return { row, col };
            }
        }
    }
    return null;
}

/**
 * Check if a square is under attack by the opponent
 */
function isSquareUnderAttack(row, col, defenderColor) {
    const attackerColor = defenderColor === 'white' ? 'black' : 'white';
    
    // Check all opponent pieces to see if they can attack this square
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece && piece.color === attackerColor) {
                const moves = getPieceMoves(r, c, piece.type, attackerColor);
                if (moves.some(move => move.row === row && move.col === col)) {
                    return true;
                }
            }
        }
    }
    
    return false;
}

/**
 * Get moves for a piece without checking if they leave king in check
 * (Used for attack detection to avoid infinite recursion)
 */
function getPieceMoves(row, col, type, color) {
    switch (type) {
        case 'pawn':
            return getPawnAttackMoves(row, col, color);
        case 'rook':
            return getRookMoves(row, col, color);
        case 'knight':
            return getKnightMoves(row, col, color);
        case 'bishop':
            return getBishopMoves(row, col, color);
        case 'queen':
            return getQueenMoves(row, col, color);
        case 'king':
            return getKingBasicMoves(row, col, color);
        default:
            return [];
    }
}

/**
 * Get pawn attack moves (only diagonals, not forward moves)
 */
function getPawnAttackMoves(row, col, color) {
    const moves = [];
    const direction = color === 'white' ? -1 : 1;
    const newRow = row + direction;
    
    const captureCols = [col - 1, col + 1];
    captureCols.forEach(captureCol => {
        if (isValidPosition(newRow, captureCol)) {
            moves.push({ row: newRow, col: captureCol });
        }
    });
    
    return moves;
}

/**
 * Get basic king moves without castling
 */
function getKingBasicMoves(row, col, color) {
    const moves = [];
    const kingMoves = [
        { dr: -1, dc: -1 }, { dr: -1, dc: 0 }, { dr: -1, dc: 1 },
        { dr: 0, dc: -1 },                      { dr: 0, dc: 1 },
        { dr: 1, dc: -1 },  { dr: 1, dc: 0 },  { dr: 1, dc: 1 }
    ];
    
    kingMoves.forEach(move => {
        const newRow = row + move.dr;
        const newCol = col + move.dc;
        
        if (isValidPosition(newRow, newCol)) {
            const targetPiece = board[newRow][newCol];
            if (!targetPiece || targetPiece.color !== color) {
                moves.push({ row: newRow, col: newCol });
            }
        }
    });
    
    return moves;
}

/**
 * Check if a move would leave the king in check
 */
function wouldMoveLeaveKingInCheck(fromRow, fromCol, toRow, toCol, color) {
    // Make temporary move
    const piece = board[fromRow][fromCol];
    const capturedPiece = board[toRow][toCol];
    
    board[toRow][toCol] = piece;
    board[fromRow][fromCol] = null;
    
    // Check if king is in check
    const inCheck = isKingInCheck(color);
    
    // Undo move
    board[fromRow][fromCol] = piece;
    board[toRow][toCol] = capturedPiece;
    
    return inCheck;
}

// ============================================================================
// GAME END DETECTION
// ============================================================================

/**
 * Check if the game has ended (checkmate or stalemate)
 */
function checkGameEnd() {
    const hasValidMoves = playerHasValidMoves(currentTurn);
    
    if (!hasValidMoves) {
        if (isKingInCheck(currentTurn)) {
            // Checkmate
            const winner = currentTurn === 'white' ? 'Black' : 'White';
            setTimeout(() => {
                alert(`Checkmate! ${winner} wins!`);
            }, 100);
            gameOver = true;
        } else {
            // Stalemate
            setTimeout(() => {
                alert('Stalemate! The game is a draw.');
            }, 100);
            gameOver = true;
        }
    }
}

/**
 * Check if the current player has any valid moves
 */
function playerHasValidMoves(color) {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && piece.color === color) {
                const validMoves = getValidMoves(row, col);
                if (validMoves.length > 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

// ============================================================================
// GAME START
// ============================================================================

/**
 * Initialize and start the game
 */
function startGame() {
    initializeBoard();
    renderBoard();
}
// Start the game when the page loads
document.addEventListener('DOMContentLoaded', startGame);