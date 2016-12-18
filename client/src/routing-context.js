const inject = require('./common/framework/inject');
const WebSocketModule =  require('./io/webSocket');
const MessageRouter = require('./common/framework/message-router');

const IncomingSocketMessageDispatcherModule = require('./common/framework/incoming-socket-message-dispatcher');
const OutgoingSocketIoMessagePortModule = require('./common/framework/outgoing-socket-io-message-port');


function routingContext(injected){

    const eventRouter = MessageRouter();
    const commandRouter = MessageRouter();
    const queryRouter = MessageRouter();

    const environment = injected('env');
    var socketURI;
    if(environment==='development' || environment==='test'){
        socketURI='http://35.160.42.253/'
    } else {
        socketURI='/'
    }

    const io = injected('io');
    const socket = WebSocketModule(inject({
        io,
        socketURI:socketURI
    }));

    const incomingSocketEventDispatcher = IncomingSocketMessageDispatcherModule(
        inject({
            socketIoVerb:'eventIssued',
            messageRouter:eventRouter
        })
    );
    const incomingSocketQueryDispatcher = IncomingSocketMessageDispatcherModule(
        inject({
            socketIoVerb:'queryResult',
            messageRouter:queryRouter
        })
    );

    const outgoingSocketIoMessagePort = OutgoingSocketIoMessagePortModule(
        inject({
            io:socket,
            messageRouter:commandRouter
        })
    );

    outgoingSocketIoMessagePort.dispatchThroughIo('*','issueCommand');
    incomingSocketEventDispatcher.startDispatching(socket);
    incomingSocketQueryDispatcher.startDispatching(socket);

    var exports = {
        eventRouter,
        commandRouter,
        queryRouter,
        socket
    };
    return exports;

}

module.exports = routingContext;