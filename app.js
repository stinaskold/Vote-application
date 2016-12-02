var express = require('express'),
    app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var parser = require('body-parser');
var router = require('./api');

require('./database');

app.use('/', express.static('vote-client/www'));
// app.get('/', function(req, res){
//   res.sendfile('index.html');
// });
app.use(parser.json());
app.use('/api', router);

io.on('connection', function(socket){
  console.log('connected');  
 //  socket.on('chat message', function(msg){
 //   io.emit('chat message', msg);
 // });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
