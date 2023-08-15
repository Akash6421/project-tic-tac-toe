// Module for gameboard
const gameboardModule = (() => {
    const board = ['', '', '', '', '', '', '', '', ''];
    
    const getBoard = () => board;
    
    const updateCell = (index, symbol) => {
        board[index] = symbol;
    };

    return { getBoard, updateCell };
})();

// Factory for players
const playerFactory = (name, symbol) => {
    return { name, symbol };
};

const player1 = playerFactory('Player 1', 'X');
const player2 = playerFactory('Player 2', 'O');

// Module for game control
const gameModule = (() => {
    let currentPlayer = player1;

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const playMove = (index) => {
        const board = gameboardModule.getBoard();
        if (board[index] === '') {
            gameboardModule.updateCell(index, currentPlayer.symbol);
            switchPlayer();
        }
    };

    return { playMove };
})();

// UI module
const UIModule = (() => {
    const cells = document.querySelectorAll('.cell');

    const updateUI = () => {
        const board = gameboardModule.getBoard();
        cells.forEach((cell, index) => {
            cell.textContent = board[index];
        });
    };

    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => {
            gameModule.playMove(index);
            updateUI();
        });
    });

    return { updateUI };
})();

// Initialize the UI on page load
document.addEventListener('DOMContentLoaded', () => {
    UIModule.updateUI();
});
