module.exports=function(injected){

    const dbPool = injected('dbPool');
    const eventRouter = injected('eventRouter');
    const commandRouter = injected('commandRouter');
    const queryRouter = injected('queryRouter');

    var repo = {

        storeEvent:function(eventObj, errCb, successCb){

            dbPool.connect(function(err, connection, done) {
                if(err) {
                    return console.error('error fetching db connection from pool', err);
                }

                var statement = 'INSERT INTO eventlog (id, timestamp, json) VALUES ($1,$2,$3)';
                var statementParams = [eventObj.eventId, new Date(), JSON.stringify(eventObj)];

                connection.query(statement,statementParams, function(err) {
                    //call `done()` to release the client back to the pool
                    done();

                    if(err) {
                        errCb('error executing statement ' + err + ", params:" + statementParams);
                    } else {
                        successCb();
                    }
                });
            });

        },
        retrieveEventLog:function(cmdObj, errCb, successCb){

            dbPool.connect(function(err, connection, done) {
                if(err) {
                    return console.error('error fetching db connection from pool', err);
                }

                var statement = 'SELECT id, timestamp, json FROM eventlog';
                var statementParams = [];

                connection.query(statement,statementParams, function(err, result) {
                    //call `done()` to release the client back to the pool
                    done();

                    if(err) {
                        errCb('error executing statement ' + err + ", params:" + statementParams);
                    } else {
                        successCb(result);
                    }
                });
            });

        }
    };

    commandRouter.on('requestChatHistory', function(requestCommand){
        repo.retrieveEventLog(requestCommand, function(err){
            queryRouter.routeMessage({type:"chatHistoryResult", requestCommand, requestError:err})
        }, function(resultSet){
            var events = _.map(resultSet.rows, function(row){
                return JSON.parse(row.json);
            });

            // Can you do better than using lodash filter here? Directly in the query perhaps?
            events = _.filter(events, (ev)=>{return ev.type==="chatMessageReceived"});

            queryRouter.routeMessage({type:"chatHistoryResult", requestCommand, events})
        });
    });

    eventRouter.on('*', function(eventObj){
        repo.storeEvent(eventObj, function(err){
            console.error('Error storing event object: ' + err)
        }, function(){
            console.debug('Event stored!');
        })
    });

    return repo
};