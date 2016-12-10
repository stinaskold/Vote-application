app.factory('socket',function(socketFactory){
    //Create socket and connect
    var myIoSocket = io.connect('http://stinas-imac.local:3000/');

    mySocket = socketFactory({
        ioSocket: myIoSocket
    });

    return mySocket;
})
