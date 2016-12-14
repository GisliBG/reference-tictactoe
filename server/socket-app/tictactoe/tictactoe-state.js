var _ = require('lodash');

module.exports = function (injected) {

    return function (history) {

        var gamefull=false;
        var player = 'X';
        var gameBoard = ['.', '.', '.', '.', '.', '.', '.', '.', '.']; 

        function processEvent(event) {
            if(event.type==="GameJoined") {
                gamefull=true;
            }
            if(event.type==="MovePlaced") {
                gameBoard[event.mark] = player;
                console.log("gameBoard", gameBoard);
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

        function isMarked(mark) {
            console.debug("isMarked", gameBoard[mark]);
            console.debug("Theboard", gameBoard);
            if(gameBoard[mark] === '.') {
                return false;
            }
            return true;
        }

        function getPlayer() {
            return player;
        }

        function gameFull() {
            return gamefull;
        }

        processEvents(history);

        return {
            isMarked: isMarked,
            gameFull: gameFull,
            processEvents: processEvents
        }
    };
};