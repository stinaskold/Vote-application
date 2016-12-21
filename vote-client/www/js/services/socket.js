app.factory('socket',function(socketFactory){
    //Create socket and connect
    var myIoSocket = io.connect('http://mattias.privatedns.org/');

    mySocket = socketFactory({
        ioSocket: myIoSocket
    });

    return mySocket;
})
