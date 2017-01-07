app.factory('socket',function(socketFactory){
    //Create socket and connect
    var myIoSocket = io.connect('http://localhost:3000');

    mySocket = socketFactory({
        ioSocket: myIoSocket
    });

    return mySocket;
})
