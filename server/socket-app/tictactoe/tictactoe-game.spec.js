var should = require('should');
var _ = require('lodash');

var TictactoeState = require('./tictactoe-state')(inject({}));

var tictactoe = require('./tictactoe-handler')(inject({
    TictactoeState
}));

var createEvent = function(name) {
    return {
        type: "GameCreated",
        user: {
            userName: name
        },
        name: "TheFirstGame",
        timeStamp: "2014-12-02T11:29:29",
        side: 'X'
    }
};

var joinEvent = function(name) {
    return {
        type: "JoinGame",
        user: {
            userName: name
        },
        name: "TheFirstGame",
        timeStamp: "2014-12-02T11:29:29",
        side: 'O'
    }
};

var gameJoinedEvent = function(name) {
    return {
        type: "GameJoined",
        user: {
            userName: name
        },
        name: "TheFirstGame",
        timeStamp: "2014-12-02T11:29:29",
        side:'O'
    }
};

var fullGameJoinEvent = function(name) {
    return {
        type: "FullGameJoinAttempted",
        user: {
            userName: name
        },
        name: "TheFirstGame",
        timeStamp: "2014-12-02T11:29:29"
    }
};

var placeMoveEvent = function(name, side, mark) {
    return {
        type: "PlaceMove",
        user: {
            userName: name
        },
        name: "TheGame",
        timeStamp: "2014-12-02T11:29:29",
        side: side,
        mark: mark
    }
};

var movePlacedEvent = function(name, side, mark) {
    return {
        type: "MovePlaced",
        user: {
            userName: name
        },
        name: "TheGame",
        timeStamp: "2014-12-02T11:29:29",
        side: side,
        mark: mark
    }
};


describe('create game command', function() {


    var given, when, then;

    beforeEach(function(){
        given=undefined;
        when=undefined;
        then=undefined;
    });

    afterEach(function () {
        tictactoe(given).executeCommand(when, function(actualEvents){
            should(JSON.stringify(actualEvents)).be.exactly(JSON.stringify(then));
        });
    });


    it('should emit game created event', function(){

        given = [];
        when =
        {
            id:"123987",
            type: "CreateGame",
            user: {
                userName: "TheGuy"
            },
            name: "TheFirstGame",
            timeStamp: "2014-12-02T11:29:29"
        };
        then = [createEvent("TheGuy")];

    })
});


describe('join game command', function () {


    var given, when, then;

    beforeEach(function () {
        given = undefined;
        when = undefined;
        then = undefined;
    });

    afterEach(function () {
        tictactoe(given).executeCommand(when, function (actualEvents) {
            should(JSON.stringify(actualEvents)).be.exactly(JSON.stringify(then));
        });
    });


    it('should emit game joined event...', function () {

        given = [createEvent("Gisli")];
        when = joinEvent("Gummi");
        then = [gameJoinedEvent("Gummi")];

    });

    it('should emit FullGameJoinAttempted event when game is full', function () {

        given = [createEvent("Kalli"), gameJoinedEvent("Gummi")];
        when = joinEvent("Gisli");
        then = [fullGameJoinEvent("Gisli")];
    });
});

describe('Place move command', function() {
    
    var given, when, then;

    beforeEach(function () {
        given = undefined;
        when = undefined;
        then = undefined;
    });

    afterEach(function () {
        tictactoe(given).executeCommand(when, function (actualEvents) {
            should(JSON.stringify(actualEvents)).be.exactly(JSON.stringify(then));
        });
    });

    it('should emit MovePlaced on first game move', function() {
        given = [createEvent("Gisli"), gameJoinedEvent("Gummi")];
        when = placeMoveEvent("Gisli", 'X', 0);
        then = [movePlacedEvent("Gisli", 'X', 0)];
    });

    it('should emit IllegalMove when square is already occupied', function() {
        given = [createEvent("Gisli"), gameJoinedEvent("Gummi"), movePlacedEvent("Gisli", 'X', 0)];
        when = placeMoveEvent("Gummi", 'O', 0);
        then = [
            {
                type: "IllegalMove",
                user: {
                    userName: "Gummi"
                },
                name: "TheGame",
                timeStamp: "2014-12-02T11:29:29",
                side: "O",
                mark: 0
            }
        ];
    });

    it('Should emit NotYourMove if attempting to make move out of turn', function() {
        given = [createEvent("Gisli"), gameJoinedEvent("Gummi")];
        when = placeMoveEvent("Gummi", 'O', 1);
        then = [
            {
                type: "NotYourMove",
                user: {
                    userName: "Gummi"
                },
                name: "TheGame",
                timeStamp: "2014-12-02T11:29:29",
                side: "O",
                mark: 1
            }
        ];
    });

    it('Should emit gameWon with three horizontal X at the top', function() {
        given = [
                    createEvent("Gisli"), gameJoinedEvent("Gummi"), movePlacedEvent("Gisli", 'X', 0),
                    movePlacedEvent("Gummi", 'O', 3),               movePlacedEvent("Gisli", 'X', 1),
                    movePlacedEvent("Gummi", 'O', 4)
                ];
        when = placeMoveEvent("Gisli", 'X', 2);
        then = [ movePlacedEvent("Gisli", 'X', 2),
            {
                type: "GameWon",
                user: {
                    userName: "Gisli"
                },
                name: "TheGame",
                timeStamp: "2014-12-02T11:29:29",
                side: "X",
                mark: 2
            }
        ];
    });

    it('Should emit gameWon with three horizontal O at the top', function() {
        given = [
                    createEvent("Gisli"), gameJoinedEvent("Gummi"), movePlacedEvent("Gisli", 'X', 3),
                    movePlacedEvent("Gummi", 'O', 0),               movePlacedEvent("Gisli", 'X', 4),
                    movePlacedEvent("Gummi", 'O', 1),               movePlacedEvent("Gisli", 'X', 7)
                ];
        when = placeMoveEvent("Gummi", 'O', 2);
        then = [ movePlacedEvent("Gummi", 'O', 2),
            {
                type: "GameWon",
                user: {
                    userName: "Gummi"
                },
                name: "TheGame",
                timeStamp: "2014-12-02T11:29:29",
                side: "O",
                mark: 2
            }
        ];
    });

    it('Should not emit game draw if won on last move', function() {
        given = [
                    createEvent("Gisli"), gameJoinedEvent("Gummi"), movePlacedEvent("Gisli", 'X', 0),
                    movePlacedEvent("Gummi", 'O', 1),               movePlacedEvent("Gisli", 'X', 2),
                    movePlacedEvent("Gummi", 'O', 3),               movePlacedEvent("Gisli", 'X', 4),
                    movePlacedEvent("Gummi", 'O', 5),               movePlacedEvent("Gisli", 'X', 8),
                    movePlacedEvent("Gummi", 'O', 7),              
                ];
        when = placeMoveEvent("Gisli", 'X', 6);
        then = [ movePlacedEvent("Gisli", 'X', 6),
            {
                type: "GameWon",
                user: {
                    userName: "Gisli"
                },
                name: "TheGame",
                timeStamp: "2014-12-02T11:29:29",
                side: "X",
                mark: 6
            }
        ];
    });

    it('Should emit game draw when neither wins', function() {
        given = [
                    createEvent("Gisli"), gameJoinedEvent("Gummi"), movePlacedEvent("Gisli", 'X', 0),
                    movePlacedEvent("Gummi", 'O', 2),               movePlacedEvent("Gisli", 'X', 1),
                    movePlacedEvent("Gummi", 'O', 3),               movePlacedEvent("Gisli", 'X', 5),
                    movePlacedEvent("Gummi", 'O', 4),               movePlacedEvent("Gisli", 'X', 8),
                    movePlacedEvent("Gummi", 'O', 7),              
                ];
        when = placeMoveEvent("Gisli", 'X', 6);
        then = [ movePlacedEvent("Gisli", 'X', 6),
            {
                type: "GameDraw",
                user: {
                    userName: "Gisli"
                },
                name: "TheGame",
                timeStamp: "2014-12-02T11:29:29",
                side: "X",
                mark: 6
            }
        ];
    });

    it('Should emit game draw when neither wins (draw scenerio part2)', function() {
        given = [
                    createEvent("Gisli"), gameJoinedEvent("Gummi"), movePlacedEvent("Gisli", 'X', 0),
                    movePlacedEvent("Gummi", 'O', 2),               movePlacedEvent("Gisli", 'X', 1),
                    movePlacedEvent("Gummi", 'O', 3),               movePlacedEvent("Gisli", 'X', 5),
                    movePlacedEvent("Gummi", 'O', 4),               movePlacedEvent("Gisli", 'X', 7),
                    movePlacedEvent("Gummi", 'O', 8),              
                ];
        when = placeMoveEvent("Gisli", 'X', 6);
        then = [ movePlacedEvent("Gisli", 'X', 6),
            {
                type: "GameDraw",
                user: {
                    userName: "Gisli"
                },
                name: "TheGame",
                timeStamp: "2014-12-02T11:29:29",
                side: "X",
                mark: 6
            }
        ];
    });
});