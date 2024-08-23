// Gameboard object represents state of the game board

const Gameboard = function() {
    let gameboard = [];

    const boardRows = 3;
    const boardColumns = 3;

    for(let i = 0; i < boardRows; i++) {
        gameboard[i] = [];
        for(let j = 0; j < boardColumns; j++) {
            gameboard[i].push(Cell(`${i + 1}.${j + 1}`));
        }
    }

    const getBoard = function() {
        return gameboard;
    }

    const printBoard = function() {
        // Make sure that this function prints gameboard correctly 

        gameboard.forEach(row => {
            row.forEach((cell) => console.log(cell));
        });
    }

    const dropToken = function (player, boardTargetRowIndex, boardTargetCellIndex) {
        gameboard[boardTargetRowIndex][boardTargetCellIndex].unavailableCell();
        gameboard[boardTargetRowIndex][boardTargetCellIndex].addToken(player);
    }

    return { getBoard, printBoard, dropToken };
};


// Cell object represent one square on a board

const Cell = function(cellIndex) {
    let cellAvailable = true;
    let cellToken = null;

    const getIndex = function() {
        return cellIndex;
    }

    const unavailableCell = function() {
        cellAvailable = false;
    }

    const getAvailable = function() {
        return cellAvailable;
    }

    const addToken = function(player) {
        cellToken = player.token;
    }

    const getToken = function() {
        return cellToken;
    }

    return { unavailableCell, getAvailable, addToken, getToken, getIndex};
};

// GameFlowControl object will control the game

const GameFlowControl = (function(playerOneName = "Player One", playerTwoName = "Player Two") {

    const board = Gameboard();

    const players = [
        {
            name: playerOneName,
            token: "X"
        },
        {
            name: playerTwoName,
            token: "O"
        }
    ];

    let activePlayer = players[0];

    const switchActivePlayer = function() {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = function() {
        return activePlayer;
    }

    const printNewRound = function() {
        console.log('------------');
        console.log('New round');
        console.log(`${getActivePlayer().name}'s turn`);
        console.log('------------');
    }

    const getAllCells = function() {
        const allCellsArray = [];
        board.getBoard().forEach(row => row.forEach(cell => allCellsArray.push({ token : cell.getToken(), index: cell.getIndex()})));
        return allCellsArray;
    }

    console.log("Start");
    console.log('------------');
    console.log(`${getActivePlayer().name}'s turn`);
    console.log('------------');

    const playRound = function(cellIndex) {
        const boardTargetRowIndex = Number(cellIndex.split('.')[0]) - 1;
        const boardTargetCellIndex = Number(cellIndex.split('.')[1]) - 1;

        const isCellAvailable = board.getBoard()[boardTargetRowIndex][boardTargetCellIndex].getAvailable();
        if(!isCellAvailable) return;

        console.log(`Dropping ${getActivePlayer().name}'s token (${getActivePlayer().token}) into ${cellIndex} cell.`);
        board.dropToken(getActivePlayer(), boardTargetRowIndex, boardTargetCellIndex);

        switchActivePlayer();
        printNewRound();
    }

    return { getActivePlayer, playRound };
})();


GameFlowControl.playRound("1.1");
GameFlowControl.playRound("1.2");
GameFlowControl.playRound("1.3");
GameFlowControl.playRound("2.1");
GameFlowControl.playRound("2.2");
GameFlowControl.playRound("2.3");
GameFlowControl.playRound("3.1");
GameFlowControl.playRound("3.2");
GameFlowControl.playRound("3.3");