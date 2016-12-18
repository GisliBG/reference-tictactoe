module.exports=function(injected){

    const io = require('socket.io-client');
    const RoutingContext = require('../../client/src/routing-context');
    const generateUUID = require('../../client/src/common/framework/uuid');

    var connectCount =0;

    function userAPI(){
        var waitingFor=[];
        var commandId=0;

        var routingContext = RoutingContext(inject({
            io,
            env:"test"
        }));

        var myGame = {

        };

        connectCount++;
        const me = {
            expectUserAck:(cb)=>{
                waitingFor.push("expectUserAck");
                routingContext.socket.on('userAcknowledged', function(ackMessage){
                    expect(ackMessage.clientId).not.toBeUndefined();
                    waitingFor.pop();
                });
                return me;
            },
            sendChatMessage:(message)=>{
                var cmdId = generateUUID();
                routingContext.commandRouter.routeMessage({commandId:cmdId, type:"chatCommand", message });
                return me;
            },
            expectChatMessageReceived:(message)=>{
                waitingFor.push("expectChatMessageReceived");
                routingContext.eventRouter.on('chatMessageReceived', function(chatMessage){
                    expect(chatMessage.sender).not.toBeUndefined();
                    if(chatMessage.message===message){
                        waitingFor.pop();
                    }
                });
                return me;
            },
            cleanDatabase:()=>{
                var cmdId = commandId++;
                routingContext.commandRouter.routeMessage({commandId:cmdId, type:"cleanDatabase"});
                return me;
            },
            waitForCleanDatabase:()=>{
                waitingFor.push("expectChatMessageReceived");
                routingContext.eventRouter.on('databaseCleaned', function(chatMessage){
                    waitingFor.pop();
                });
                return me;
            },
            expectGameCreated:()=>{
                waitingFor.push("expectGameCreated");
                routingContext.eventRouter.on('GameCreated', function(game){
                    myGame = game;
                    if(myGame.gameId === game.gameId) {
                        waitingFor.pop();
                    }
                });
                return me;
            },
            createGame:()=>{
                var cmdId = generateUUID();
                myGame.gameId = generateUUID();
                routingContext.commandRouter.routeMessage({
                    gameId:myGame.gameId, type:"CreateGame", commandId:cmdId
                });
                return me;
            },
            expectGameJoined:()=>{
                waitingFor.push("expectGameJoined");
                routingContext.eventRouter.on('GameJoined', function(game){
                    expect(game.gameId).not.toBeUndefined();
                    myGame = game;
                    if(myGame.gameId === game.gameId) {
                        waitingFor.pop();
                    }
                });
                return me;
            },
            joinGame:(gameId)=>{
                var cmdId = commandId++;
                routingContext.commandRouter.routeMessage({
                    gameId:gameId, type:"JoinGame", commandId:cmdId
                });
                return me;
            },
            getGame:()=>{
                return myGame;
            },
            expectMoveMade:()=>{
                waitingFor.push("expectMoveMade");
                routingContext.eventRouter.on('MovePlaced', function(game){
                    myGame = game;
                    expect(game.gameId).not.toBeUndefined();
                    if(myGame.gameId === game.gameId) {
                        waitingFor.pop();
                    }
                });
                return me;
            },
            placeMove:(marker)=>{
                var cmdId = commandId++;
                routingContext.commandRouter.routeMessage({
                    gameId: myGame.gameId, type:"PlaceMove", commandId:cmdId, mark:marker, side:myGame.side
                });
                return me;
            },
            expectGameWon:()=>{
                waitingFor.push("expectGameWon");
                routingContext.eventRouter.on('GameWon', function(game){
                    expect(game.gameId).not.toBeUndefined();
                    if(myGame.gameId === game.gameId) {
                        waitingFor.pop();
                    }
                });
                return me;
            },
            then:(whenDoneWaiting)=>{
                function waitLonger(){
                    if(waitingFor.length>0){
                        setTimeout(waitLonger, 0);
                        return;
                    }
                    whenDoneWaiting();
                }
                waitLonger();
                return me;
            },
            disconnect:function(){
                routingContext.socket.disconnect();
            }

        };
        return me;

    }

    return userAPI;
};
