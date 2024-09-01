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

const GameFlowControl = function(playerXName = "Player One", playerOName = "Player Two") {

    const board = Gameboard();

    const players = [
        {
            name: playerXName,
            token: "x"
        },
        {
            name: playerOName,
            token: "o"
        }
    ];

    let gameWinner = null; // Game winner is always null except if the game is finished. In that situation it is players[0].name or players[1].name or "Tie"

    const getGameWinner = () => {
        return gameWinner;
    }

    let activePlayer = players[0];

    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => {
        return activePlayer;
    }

    const checkWinCondition = (board) => {

        const announceWinner = (winner) => {
            if(gameWinner != null) return;
            gameWinner = winner.name;
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
            return true;
        };
    }

    const checkTieCondition = () => {
        const boardCopy = board.getBoard();

        // We are checking whether the board is filled 

        const boardAvailableCells = [];
        boardCopy.forEach(row => row.forEach(cell => boardAvailableCells.push(cell.getAvailable())));

        const boardFilled = boardAvailableCells.filter(boolean => boolean === false).length === 9 ? true : false;

        if(boardFilled) {
            gameWinner = "Tie";
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

        // Dropping token
        board.dropToken(getActivePlayer(), boardTargetRowIndex, boardTargetCellIndex);
        
        // Check win and tie condition
        
        if(checkWinCondition(board)) return;
        if(checkTieCondition(board)) return;

        switchActivePlayer();
    }

    return { getActivePlayer, playRound, resetGame, getBoard: board.getBoard, getGameWinner};
};

const screenFlowControl = function() {
    const gameStartFormEl = document.querySelector(".creation");

    const gameStartFormSubmitEventHandler = (e) => {
        e.preventDefault();

        // Player Names and JS validation
        const playerXName = document.querySelector("#player-x-name").value;
        const playerOName = document.querySelector("#player-o-name").value;
        
        if(playerXName.split('').length > 9 ||
        playerXName.split('').length < 2 ||
        playerOName.split('').length > 9 ||
        playerOName.split('').length < 2) return; 
        
        // Closing creation-phase and showing main part of the webpage

        document.querySelector("body").classList.remove("creation-phase");

        screenBoardControl(playerXName, playerOName);
    }

    gameStartFormEl.addEventListener("submit", gameStartFormSubmitEventHandler);

    let isGameFinished = false;

    const screenBoardControl = (playerXName, playerOName) => {
        const game = GameFlowControl(playerXName, playerOName);
        const boardEl = document.querySelector(".gameboard__grid");

        const updateScreen = () => {
            if(isGameFinished) return;
    
            boardEl.innerHTML = "";
    
            const board = game.getBoard();
            const activePlayerToken = game.getActivePlayer().token;
    
            const quitGameButtonEl = document.querySelector(".game-quit-button");
    
            // result dialog
            const resultDialogEl = document.querySelector(".dialog--game-finished");
    
            // dialog control function
    
            const controlDialog = () => {
    
                // Show Result
    
                const dialogResultBoxEl = document.querySelector(".dialog__heading");
                const dialogResultEl = document.querySelector(".dialog__heading span");
    
                dialogResultEl.textContent = game.getGameWinner();
    
                const dialogCloseEl =  document.querySelector(".dialog__close-button");
                const dialogQuitGameEl = document.querySelector(".dialog__button--quit-game");
                const dialogNewGameEl = document.querySelector(".dialog__button--new-game");

                // Display winner

                const winnerName = game.getGameWinner();

                const dialogResultBoxXIconEl = dialogResultBoxEl.querySelector(".dialog__heading-icon--x");
                const dialogResultBoxOIconEl = dialogResultBoxEl.querySelector(".dialog__heading-icon--o");

                if(playerXName == winnerName) {
                    dialogResultBoxEl.style.color = "var(--clr-primary-400)";

                    // X icon visible
                    dialogResultBoxXIconEl.style.visibility = "visible";
                    dialogResultBoxXIconEl.style.opacity = 1;

                    // O icon hidden

                    dialogResultBoxOIconEl.style.visibility = "hidden";
                    dialogResultBoxOIconEl.style.opacity = 0;

                } else if(playerOName == winnerName) {
                    dialogResultBoxEl.style.color = "var(--clr-secondary-400)";

                    // X icon hidden
                    dialogResultBoxXIconEl.style.visibility = "hidden";
                    dialogResultBoxXIconEl.style.opacity = 0;

                    // O icon visible

                    dialogResultBoxOIconEl.style.visibility = "visible";
                    dialogResultBoxOIconEl.style.opacity = 1;
                } else if ("Tie" == winnerName) {
                    dialogResultBoxEl.style.color = "var(--clr-tertiary-400)";

                    // X icon visible
                    dialogResultBoxXIconEl.style.visibility = "visible";
                    dialogResultBoxXIconEl.style.opacity = 1;

                    // O icon visible

                    dialogResultBoxOIconEl.style.visibility = "visible";
                    dialogResultBoxOIconEl.style.opacity = 1;
                }
    
                const dialogCloseClickEventHandler = (e) => {
                    // Make the quit game button visible
                    quitGameButtonEl.style.visibility = "visible";
                    quitGameButtonEl.style.pointerEvents = "all";
                    quitGameButtonEl.style.opacity = 1;
    
                    // Close the dialog
                    resultDialogEl.close();
                }
    
                const dialogQuitGameClickEventHandler = (e) => {
                    location.reload();
                }
    
                const dialogNewGameClickEventHandler = (e) => {
                    // Close dialog
                    resultDialogEl.close();
    
                    // Reset game board
                    game.resetGame();
    
                    // Update isGameFinished variable
                    isGameFinished = false;
    
                    // Run updateScreen Function to render new gameboard
                    updateScreen();
                }
    
                dialogCloseEl.addEventListener("click", dialogCloseClickEventHandler);
                dialogQuitGameEl.addEventListener("click", dialogQuitGameClickEventHandler);
                dialogNewGameEl.addEventListener("click", dialogNewGameClickEventHandler);
            }
    
            // Quit Game 
    
            const quitGameButtonClickEventHandler = (e) => {
                location.reload();
            }
    
            quitGameButtonEl.addEventListener("click", quitGameButtonClickEventHandler);
    
            // Checking if the game is over to stop dialog from popping up when the gam is finished
            if(game.getGameWinner() != null) { 
                isGameFinished = true;
    
                resultDialogEl.showModal();
                controlDialog();
            }
    
            // Display Active player by class attribute on body El 
            switch(activePlayerToken) {
                case "x":
                    document.querySelector("body").classList.remove(`active-o`);
                    document.querySelector("body").classList.add(`active-x`);
                break;
                case "o":
                    document.querySelector("body").classList.remove(`active-x`);
                    document.querySelector("body").classList.add(`active-o`);
                break;
            }
    
            // Render all Board Cells
    
            board.forEach((row, rowIndex) => {
                row.forEach((cell, cellIndex) => {
                    // Create cell button element 
                    const cellEl = document.createElement("button");
    
                    // Added classes, type and data attributes
                    cellEl.setAttribute("type", "button");
                    cellEl.dataset.cell = `${rowIndex + 1}.${cellIndex + 1}`;
                    cellEl.dataset.token = cell.getToken();
                    cellEl.classList.add("gameboard__cell");
                    cellEl.classList.add(`gameboard__cell--${rowIndex + 1}-${cellIndex + 1}`);
    
                    // Check if cell is available and add another data attribute for that
                    
                    cellEl.dataset.cellIsAvailable = cell.getAvailable();
    
                    // Append element into BoardEl 
    
                    boardEl.appendChild(cellEl);
                })
            })
        }
    
                    
        const boardClickEventHandler = (e) => {
            // Checking if the click was on the gameboard__cell
    
            const eventTargetEl = e.target;
            if(eventTargetEl.classList[0] != "gameboard__cell") return;
            //if(!Boolean(eventTargetEl.getAttribute("data-cell-is-available"))) return;
    
            const targetCellIndex = eventTargetEl.getAttribute("data-cell");
    
            game.playRound(targetCellIndex);
            updateScreen();
        }
    
        boardEl.addEventListener("click", boardClickEventHandler);
    
        updateScreen();
    }

    const pageContentLoadEventHandler = (e) => {
        const animateElements = document.querySelectorAll(".container > *");

        animateElements.forEach(animateEl => {
            animateEl.style.opacity = 1;
            animateEl.style.filter = "blur(0)";
        });
    }

    document.addEventListener("DOMContentLoaded", pageContentLoadEventHandler);
}

screenFlowControl();