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
        let gameOver = false;
        let winner = null;

        const switchPlayer = () => {
            currentPlayer = currentPlayer === player1 ? player2 : player1;
        };

        const playMove = (index) => {
            if (!gameOver) {
                const board = gameboardModule.getBoard();
                if (board[index] === '') {
                    gameboardModule.updateCell(index, currentPlayer.symbol);
                    if (checkWin(board, currentPlayer.symbol)) {
                        gameOver = true;
                        winner = currentPlayer;
                    } else if (board.every(cell => cell !== '')) {
                        gameOver = true;
                    } else {
                        switchPlayer();
                    }
                }
            }
        };

        const checkWin = (board, symbol) => {
            const winningCombos = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
                [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
                [0, 4, 8], [2, 4, 6]            // Diagonals
            ];

            for (const combo of winningCombos) {
                const [a, b, c] = combo;
                if (board[a] === symbol && board[b] === symbol && board[c] === symbol) {
                    return true;
                }
            }

            return false;
        };

        const resetGame = () => {
            gameOver = false;
            winner = null;
            gameboardModule.getBoard().fill('');
        };

        const getWinner = () => winner;

        return { playMove, isGameOver: () => gameOver, resetGame, getWinner };
    })();

    const UIModule = (() => {
        const cells = document.querySelectorAll('.cell');
        const startButton = document.getElementById('start-button');
        const themeSelect = document.getElementById('theme-select');
        const resultMessage = document.getElementById('result');
        const body = document.body;

        themeSelect.addEventListener('change', (event) => {
            const selectedTheme = event.target.value;
            body.className = `theme-${selectedTheme}`;
        });

        startButton.addEventListener('click', () => {
            const player1Name = document.getElementById('player1-name').value || 'Player 1';
            const player2Name = document.getElementById('player2-name').value || 'Player 2';

            player1.name = player1Name;
            player2.name = player2Name;

            resultMessage.textContent = '';
            gameModule.resetGame();
            updateUI();
        });

        const updateUI = () => {
            const board = gameboardModule.getBoard();
            cells.forEach((cell, index) => {
                cell.textContent = board[index];
                cell.setAttribute('data-symbol', board[index]);
            });
        };

        cells.forEach((cell, index) => {
            cell.addEventListener('click', () => {
                if (!gameModule.isGameOver() && gameboardModule.getBoard()[index] === '') {
                    gameModule.playMove(index);
                    updateUI();
                    if (gameModule.isGameOver()) {
                        if (gameModule.getWinner()) {
                            resultMessage.textContent = `${gameModule.getWinner().name} wins!`;
                        } else {
                            resultMessage.textContent = "It's a tie!";
                        }
                    }
                }
            });
        });

        return { updateUI };
    })();

    document.addEventListener('DOMContentLoaded', () => {
        UIModule.updateUI();
    });
