const io = require('socket.io-client');
const RoutingContext = require('../client/src/routing-context');
var UserAPI = require('./fluentapi/user-api');
var TestAPI = require('./fluentapi/test-api');

const userAPI = UserAPI(inject({
    io,
    RoutingContext
}));

const testAPI = TestAPI(inject({
    io,
    RoutingContext
}));

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

describe('TicTacToe User load test', function(){


    beforeEach(function(done){
        var testapi = testAPI();
        testapi.waitForCleanDatabase().cleanDatabase().then(()=>{
            testapi.disconnect();
            done();
        });
    });

    const count = 100;
    const timelimit = 8000;

    it('should should be to play ' + count + '  game within '+ timelimit +'ms',function(done){

        var startMillis = new Date().getTime();

        var user1;
        var user2;
        var users=[];
        for(var i=0; i<count; i+=2){
            user1 = userAPI("User#" + i);
            user2 = userAPI("User#" + i + 1);
            users.push(user1);
            users.push(user2);

            user1.createGame().then(()=> {
                user2.joinGame(user1.getGame().gameId).then(function () {
                    user1.placeMove(0).then(()=> {
                        user2.placeMove(3).then(()=> {
                            user1.placeMove(4).then(()=> {
                                user2.placeMove(2).then(()=> {
                                    user1.placeMove(8)
                                })
                            })
                        });
                    })
                })
            })
        }

        user1 = userAPI("Final user1");
        user2 = userAPI("Final user2");
        user1.expectGameCreated().createGame().then(()=> {
                user2.expectGameJoined().joinGame(user1.getGame().gameId).then(function () {
                    user1.expectMoveMade().placeMove(0).then(()=> {
                        user1.expectMoveMade();
                        user2.expectMoveMade().placeMove(3).then(()=> {
                            user2.expectMoveMade(); // By other user
                            user1.expectMoveMade().placeMove(1).then(()=> {
                                user1.expectMoveMade(); // By other user
                                user2.expectMoveMade().placeMove(4).then(()=> {
                                    user2.expectMoveMade(); // By other user
                                    user1.expectMoveMade().placeMove(2)
                                        .expectGameWon().then(done); // Winning move
                                })
                            })
                        });
                    })
                })
            }
        ).then(function(){
            user1.disconnect();
            user2.disconnect();
            _.each(users, function(usr){
                usr.disconnect();
            });

            var endMillis = new Date().getTime();
            var duration = endMillis - startMillis;
            if(duration > timelimit){
                console.error(duration + " exceeds limit " + timelimit);
            }
            done();
        });
    });
});


