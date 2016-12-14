var _ = require('lodash');

module.exports = function (injected) {

    return function (history) {

        var gamefull=false;
        var player = 'X';

        function processEvent(event) {
            if(event.type==="GameJoined"){
                gamefull=true;
            }

        }

        function processEvents(history) {
            _.each(history, processEvent);
        }

        function getPlayer() {
            return player;
        }

        function gameFull() {
            return gamefull;
        }

        processEvents(history);

        return {
            gameFull:gameFull,
            processEvents: processEvents
        }
    };
};