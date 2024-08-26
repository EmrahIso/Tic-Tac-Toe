"use strict"

// Gameboard object represents state of the game board

const Gameboard = function() {

    const gameboard = [];

    const boardRows = 3;
    const boardColumns = 3;

    // Create 2D gameboard Array

    const fillBoard = () => {
        for(let rowIndex = 0; rowIndex < boardRows; rowIndex++) {
            gameboard[rowIndex] = [];
            for(let cellIndex = 0; cellIndex < boardColumns; cellIndex++) {
                gameboard[rowIndex].push(Cell(`${rowIndex + 1}.${cellIndex + 1}`));
            }
        }
    }

    fillBoard();

    const emptyBoard = () => {
        gameboard.splice(0, gameboard.length);
    }

    const getBoard = () => {
        return gameboard;
    }

    const dropToken = (player, boardTargetRowIndex, boardTargetCellIndex) => {
        gameboard[boardTargetRowIndex][boardTargetCellIndex].unavailableCell();
        gameboard[boardTargetRowIndex][boardTargetCellIndex].addToken(player);
    }

    return { getBoard, dropToken, emptyBoard, fillBoard };
};


// Cell object represent one square on a board

const Cell = function(cellIndex) {
    let cellAvailable = true;
    let cellToken = null;

    const getIndex = () => {
        return cellIndex;
    }

    const unavailableCell = () => {
        cellAvailable = false;
    }

    const getAvailable = () => {
        return cellAvailable;
    }

    const addToken = (player) => {
        cellToken = player.token;
    }

    const getToken = () => {
        return cellToken;
    }

    return { unavailableCell, getAvailable, addToken, getToken, getIndex};
};

// GameFlowControl object will control the game

const GameFlowControl = function() {

    const board = Gameboard();

    // Ask for player names

    const askForPlayerName = (playerID) => { // playerID is the name for the sequence number of the player 
        let playerName = prompt(`Enter ${playerID} Player Name: `, `${playerID} Player`);
        
        if(playerName === null) playerName = `${playerID} Player`;

        // we use this string to discard all "empty characters" when checking the length of player names
        let playerNameCharacterArray = playerName.split('').filter(char => char != " ");
        
        while(playerNameCharacterArray.length < 5 || playerNameCharacterArray.length > 20) {
            alert("The player's name must be five or more and less than twenty letters.");
            playerName = prompt(`Enter ${playerID} Player Name: `, `${playerID} Player`); 
            playerNameCharacterArray = playerName.split('').filter(char => char != " ");
        }

        return playerName;

    }

    const players = [
        {
            name: askForPlayerName("First"),
            token: "x"
        },
        {
            name: askForPlayerName("Second"),
            token: "o"
        }
    ];

    let gameWinner = null; // Game winner is always null except if the game is finished. In that situation it is players[0].name or players[1].name or "Tie"

    let activePlayer = players[0];

    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => {
        return activePlayer;
    }

    console.log("Start");
    console.log('------------');
    console.log(`First player: "${players[0].name}", Token: "${players[0].token}"`);
    console.log('------------');
    console.log(`Second player: "${players[1].name}", Token: "${players[1].token}"`);
    console.log('------------');
    console.log(`${getActivePlayer().name}'s turn`);
    console.log('------------');
    console.log('------------');
    console.log('------------');

    const printNewRound = () => {
        console.log('------------');
        console.log('New round');
        console.log('------------');
        console.log(`${getActivePlayer().name}'s turn`);
        console.log('------------');
    }

    const checkWinCondition = (board) => {
        console.log('checking winner');
        console.log('------------');

        const announceWinner = (winner) => {
            if(gameWinner != null) return;
            gameWinner = winner.name;
            console.log(`${gameWinner} is winner`);
        };

        // We use these two array variables to store tokens in array to help our condition checking functions
        let cellXTokens = []; 
        let cellOTokens = [];

        // Horizontal check
        
        const horizontalRowCheck = () => {
            horizontalRowIteration: for(let rowIndex = 0; rowIndex < 3; rowIndex++){
                for(let cellIndex = 0; cellIndex < 3; cellIndex++) {
                    switch (board.getBoard()[rowIndex][cellIndex].getToken()) {
                        case "x":
                                cellXTokens.push(board.getBoard()[rowIndex][cellIndex].getToken());
                            break;
                        case "o":
                                cellOTokens.push(board.getBoard()[rowIndex][cellIndex].getToken());
                            break;
                        default:
                                null
                            break;
                    }

                    if(cellXTokens.length === 3) {
                        announceWinner(players[0]);
                        break horizontalRowIteration;
                    } else if(cellOTokens.length === 3) {
                        announceWinner(players[1]);
                        break horizontalRowIteration;
                    }
                }
                cellXTokens = [];
                cellOTokens = [];
            }
        }

        // Vertical check

        const verticalColumnCheck = () => {
            // We iterate through board object and change the position of the cells so that each cell is in an array within that object, but now that array represents column instead of row. 
            const boardCopy = board.getBoard();

            // We use this nested loop to fill up this arrays.
            // Each array represents one column

            let columnOne = [];
            let columnTwo = [];
            let columnThree = [];

            for(let rowIndex = 0; rowIndex < boardCopy.length; rowIndex++) {
                for(let cellIndex = 0; cellIndex < boardCopy[rowIndex].length; cellIndex++) {
                    switch(boardCopy[rowIndex][cellIndex].getIndex().split('.')[1]) {
                        case "1":
                            columnOne.push(boardCopy[rowIndex][cellIndex]);
                        break;
                        case "2":
                            columnTwo.push(boardCopy[rowIndex][cellIndex]);
                        break;
                        case "3":
                            columnThree.push(boardCopy[rowIndex][cellIndex]);
                        break;
                        default:
                            null
                        break;
                    }
                }
            }

            const verticalBoard = [columnOne, columnTwo, columnThree];

            // We use this loop to check for vertical winning conditions

            // We still use cellXTokens and cellOTokens even if we check the columns.
            // That's because it doesn't matter we're just putting cells in vertically instead of horizontally
            
            verticalColumnIteration: for(let rowIndex = 0; rowIndex < 3; rowIndex++){
                for(let cellIndex = 0; cellIndex < 3; cellIndex++) {
                    switch (verticalBoard[rowIndex][cellIndex].getToken()) {
                        case "x":
                                cellXTokens.push(verticalBoard[rowIndex][cellIndex].getToken());
                            break;
                        case "o":
                                cellOTokens.push(verticalBoard[rowIndex][cellIndex].getToken());
                            break;
                        default:
                                null
                            break;
                    }

                    if(cellXTokens.length === 3) {
                        announceWinner(players[0]);
                        break verticalColumnIteration;
                    } else if(cellOTokens.length === 3) {
                        announceWinner(players[1]);
                        break verticalColumnIteration;
                    }
                }
                cellXTokens = [];
                cellOTokens = [];
            }
        }

        // Diagonal check

        const diagonalCheck = () => {

            const boardCopy = board.getBoard();

            let diagonalOne = [];
            let diagonalTwo = [];

            // When checking diagonal lines, we don't need 4 cells surrounding the central cell. 
            // When we add their two numbers that make up the index (1.2), we always get an odd number. It is so for all those 4 cells and for no other cell.
            // We'll use that to get rid of those cells.

            for(let rowIndex = 0; rowIndex < boardCopy.length; rowIndex++) {
                for(let cellIndex = 0; cellIndex < boardCopy[rowIndex].length; cellIndex++) {
                    // This variable represents the sum of those indices
                    const cellIndexSum = boardCopy[rowIndex][cellIndex].getIndex().split('.').map(index => Number(index)).reduce((total, index) => total + index);

                    // With this piece of code, we discard all odd indices and put all cells in arrays with diagonally

                    if(cellIndexSum % 2 != 0) { 
                        continue;
                    } else if(cellIndexSum == 2 || cellIndexSum == 6) {
                        diagonalOne.push(boardCopy[rowIndex][cellIndex]);
                    } else if(rowIndex == 1 && cellIndex == 1) {
                        diagonalOne.push(boardCopy[rowIndex][cellIndex]);
                        diagonalTwo.push(boardCopy[rowIndex][cellIndex]);
                    } else {
                        diagonalTwo.push(boardCopy[rowIndex][cellIndex]);
                    }

                }
            }

            const diagonalBoard = [diagonalOne, diagonalTwo];

            diagonalIteration: for(let rowIndex = 0; rowIndex < 2; rowIndex++){
                for(let cellIndex = 0; cellIndex < 3; cellIndex++) {
                    switch (diagonalBoard[rowIndex][cellIndex].getToken()) {
                        case "x":
                                cellXTokens.push(diagonalBoard[rowIndex][cellIndex].getToken());
                            break;
                        case "o":
                                cellOTokens.push(diagonalBoard[rowIndex][cellIndex].getToken());
                            break;
                        default:
                                null
                            break;
                    }

                    if(cellXTokens.length === 3) {
                        announceWinner(players[0]);
                        break diagonalIteration;
                    } else if(cellOTokens.length === 3) {
                        announceWinner(players[1]);
                        break diagonalIteration;
                    }
                }
                cellXTokens = [];
                cellOTokens = [];
            }
        }
        
        horizontalRowCheck();
        verticalColumnCheck();
        diagonalCheck();

        if(gameWinner != null) { 
            console.log('-----------');
            console.log("The end of the game");    
            return true;
        };
        
        console.log("the end of the condition variable");
        console.log('------------');
    }

    const checkTieCondition = () => {
        const boardCopy = board.getBoard();

        // We are checking whether the board is filled 

        const boardAvailableCells = [];
        boardCopy.forEach(row => row.forEach(cell => boardAvailableCells.push(cell.getAvailable())));

        const boardFilled = boardAvailableCells.filter(boolean => boolean === false).length === 9 ? true : false;

        if(boardFilled) {
            gameWinner = "Tie";
            console.log(gameWinner);  
            console.log('-----------');
            console.log("The end of the game");  
            return true;
        } 
    }

    const resetGame = () => {
        // Reset board
        board.emptyBoard();
        board.fillBoard();

        // Reset gameWinner variable

        gameWinner = null;

        // Reset active player
        activePlayer = players[0];

        // Message

        console.log('------------');
        console.log("Starting new game");
        console.log('------------');
        console.log(`First player: "${players[0].name}", Token: "${players[0].token}"`);
        console.log('------------');
        console.log(`Second player: "${players[1].name}", Token: "${players[1].token}"`);
        console.log('------------');
        console.log(`${getActivePlayer().name}'s turn`);
        console.log('------------');

    }

    const playRound = (cellIndex) => {
        // Checking validity of cellIndex
        const errorMessage = `The cell Index isn't in the require format (Format: ["1-3.1-3"])`;
        
        try {
            if(typeof cellIndex !== "string") throw new Error(errorMessage);

            const rowIndex = Number(cellIndex.split('.')[0]);
            const columnIndex = Number(cellIndex.split('.')[1]);

            if(isNaN(rowIndex) || isNaN(columnIndex)) throw new Error(errorMessage);
            if(rowIndex < 1 || rowIndex > 3) throw new Error(errorMessage);
            if(columnIndex < 1 || columnIndex > 3) throw new Error(errorMessage); 
        } catch(error) {
            console.error(error);
            return
        }

        // With this if statement we ensure that the user cannot play a round after the game ends (until the user resets the game)
        if(gameWinner != null) return;

        const boardTargetRowIndex = Number(cellIndex.split('.')[0]) - 1;
        const boardTargetCellIndex = Number(cellIndex.split('.')[1]) - 1;
        
        // Checking if the target cell is available
        const isCellAvailable = board.getBoard()[boardTargetRowIndex][boardTargetCellIndex].getAvailable();
        if(!isCellAvailable) return;
        
        console.log('------------');
        console.log(`Dropping ${getActivePlayer().name}'s token (${getActivePlayer().token}) into ${cellIndex} cell.`);
        console.log('------------');

        // Dropping token
        board.dropToken(getActivePlayer(), boardTargetRowIndex, boardTargetCellIndex);
        
        // Check win and tie condition
        
        if(checkWinCondition(board)) return;
        if(checkTieCondition(board)) return;

        switchActivePlayer();
        printNewRound();
    }

    return { getActivePlayer, playRound, resetGame};
};

const game = GameFlowControl();