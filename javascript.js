// Gameboard Module
const Gameboard = (() => {
    let board = ['', '', '', '', '', '', '', '', ''];

    const resetBoard = () => {
        board = ['', '', '', '', '', '', '', '', ''];
    };

    const getBoard = () => [...board];

    const makeMove = (index, marker) => {
        if (board[index] === '') {
            board[index] = marker;
            return true;
        }
        return false;
    };

    const checkWinner = () => {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];

        for (const combo of winningCombinations) {
            const [a, b, c] = combo;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a]; // returns 'X' or 'O'
            }
        }

        if (!board.includes('')) {
            return 'tie';
        }

        return null;
    };

    return { resetBoard, getBoard, makeMove, checkWinner };
})();

// Player Factory
const Player = (name, marker) => {
    return { name, marker };
};

// Game Controller Module
const GameController = (() => {
    let player1, player2, currentPlayer, gameActive;

    const startGame = (player1Name, player2Name) => {
        player1 = Player(player1Name || 'Player 1', 'X');
        player2 = Player(player2Name || 'Player 2', 'O');
        currentPlayer = player1;
        gameActive = true;
        Gameboard.resetBoard();
        DisplayController.updateGame();
    };

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const playTurn = (cellIndex) => {
        if (!gameActive) return false;

        if (Gameboard.makeMove(cellIndex, currentPlayer.marker)) {
            const winner = Gameboard.checkWinner();

            if (winner) {
                gameActive = false;
                if (winner === 'tie') {
                    DisplayController.displayMessage("It's a tie!");
                } else {
                    const winningPlayer = winner === 'X' ? player1 : player2;
                    DisplayController.displayMessage(`${winningPlayer.name} wins!`);
                }
            } else {
                switchPlayer();
            }

            DisplayController.updateGame();
            return true;
        }

        return false;
    };

    const getCurrentPlayer = () => currentPlayer;
    const isGameActive = () => gameActive;

    return { startGame, playTurn, getCurrentPlayer, isGameActive };
})();

// Display Controller Module
const DisplayController = (() => {
    const gameboardElement = document.querySelector('.gameboard');
    const currentPlayerElement = document.getElementById('current-player');
    const gameStatusElement = document.querySelector('.game-status');
    const gameSetupElement = document.querySelector('.game-setup');
    const gameContainerElement = document.querySelector('.game-container');
    const startButton = document.getElementById('start-btn');
    const restartButton = document.getElementById('restart-btn');

    const createBoard = () => {
        gameboardElement.innerHTML = '';
        const board = Gameboard.getBoard();

        board.forEach((cell, index) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            if (cell) {
                cellElement.classList.add(cell.toLowerCase());
                cellElement.textContent = cell;
            }
            cellElement.dataset.index = index;
            gameboardElement.appendChild(cellElement);
        });
    };

    const updateCurrentPlayerDisplay = () => {
        const currentPlayer = GameController.getCurrentPlayer();
        currentPlayerElement.textContent = `${currentPlayer.name}'s turn (${currentPlayer.marker})`;
    };

    const updateGame = () => {
        createBoard();
        updateCurrentPlayerDisplay();
    };

    const displayMessage = (message) => {
        gameStatusElement.textContent = message;
    };

    const handleCellClick = (e) => {
        if (!e.target.classList.contains('cell')) return;

        const cellIndex = e.target.dataset.index;
        GameController.playTurn(parseInt(cellIndex));
    };

    const handleStartGame = () => {
        const player1Name = document.getElementById('player1').value;
        const player2Name = document.getElementById('player2').value;

        gameSetupElement.classList.add('hidden');
        gameContainerElement.classList.remove('hidden');
        GameController.startGame(player1Name, player2Name);
    };

    const handleRestartGame = () => {
        gameSetupElement.classList.remove('hidden');
        gameContainerElement.classList.add('hidden');
        displayMessage('');
    };

    const initEventListeners = () => {
        gameboardElement.addEventListener('click', handleCellClick);
        startButton.addEventListener('click', handleStartGame);
        restartButton.addEventListener('click', handleRestartGame);
    };

    const init = () => {
        initEventListeners();
    };

    return { updateGame, displayMessage, init };
})();

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    DisplayController.init();
});
