var _ = require('lodash');

module.exports = function (injected) {

    return function (history) {

        var gamefull= false;
        var gameWon = false;
        var player = 'X';
        var moves = 0;
        var gameBoard = [ '.', '*', '*', 
                          '*', '.', '.', 
                          '.', '*', '*' ]; 

        function processEvent(event) {
            if(event.type==="GameJoined") {
                gamefull=true;
            }
            if(event.type==="MovePlaced") {
                gameBoard[event.mark] = player;
                moves++;
                
                if(event.side === 'X') {
                    player = 'O';
                }
                else {
                    player = 'X';
                }
            }
        }

        function processEvents(history) {
            _.each(history, processEvent);
        }

        function gameHasBeenWon() {

            return ( (gameBoard[0] === gameBoard[1] && gameBoard[0] === gameBoard[2]) || 
                     (gameBoard[3] === gameBoard[4] && gameBoard[3] === gameBoard[5]) ||
                     (gameBoard[6] === gameBoard[7] && gameBoard[6] === gameBoard[8]) ||
                     (gameBoard[0] === gameBoard[3] && gameBoard[0] === gameBoard[6]) ||
                     (gameBoard[1] === gameBoard[4] && gameBoard[1] === gameBoard[7]) ||
                     (gameBoard[2] === gameBoard[5] && gameBoard[2] === gameBoard[8]) ||
                     (gameBoard[0] === gameBoard[4] && gameBoard[0] === gameBoard[8]) ||
                     (gameBoard[2] === gameBoard[4] && gameBoard[2] === gameBoard[6]) )
        }

        function gameIsDraw() {
            return moves === 9;
        }

        function outOfTurn(side) {
            return !(side===player); 
        }

        function isMarked(mark) {
            return !(gameBoard[mark] === '.' || gameBoard[mark] === '*');
        }

        function gameFull() {
            return gamefull;
        }

        processEvents(history);

        return {
            gameIsDraw: gameIsDraw,
            gameHasBeenWon: gameHasBeenWon,
            outOfTurn: outOfTurn,
            isMarked: isMarked,
            gameFull: gameFull,
            processEvents: processEvents
        }
    };
};