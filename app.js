var express = require('express'),
    app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var parser = require('body-parser');
var router = require('./api');
var Question = require('./models/question');

require('./database');

app.use('/', express.static('vote-client/www'));
// app.get('/', function(req, res){
//   res.sendfile('index.html');
// });
app.use(parser.json());
app.use('/api', router);

// io.on('connection', function(socket){
//   console.log('connected');
 //  socket.on('chat message', function(msg){
 //   io.emit('chat message', msg);
 // });
//});

io.on('connection', function (socket) {

  // socket.emit('read-questions', function() {
  //   Question.find({}, function(err, question) {
  //     if (err) {
  //
  //     }
  //     return question;
  //   });
  // });

  socket.emit('message', 'You are connected!');
  socket.on('vote', function (data) {
    console.log('Din röst ' + data);
  });
  // socket.on('new-question', function (question) {
  //   console.log('Frågan är ' + question.title);
  //   var newQuestion = new Question({
  //       title: question.title
  //   });
  //   newQuestion.save(function (err) {
  //     if (err) return handleError(err);
  //     console.log('Question saved to database');
  //   })
  //
  // });

});


http.listen(3000, function(){
  console.log('listening on *:3000');
});
