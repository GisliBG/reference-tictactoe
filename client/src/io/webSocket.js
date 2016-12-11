module.exports= function webSocket(injected){
    const io = injected("io");
    const socketURI = injected("socketURI");

    var socket = io.connect(socketURI);
//    console.debug("Connected socket io " + socketURI);
    return socket;
}