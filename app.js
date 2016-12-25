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

  socket.on('vote', function (question, chosenChoice) {
    console.log(question.title);
    console.log('Din röst: ' + chosenChoice._id);
    var questionId = question._id;
    var choiceId = chosenChoice._id;
    Question.findOneAndUpdate({ '_id': questionId, 'choices._id': choiceId }, { $inc: {'choices.$.votes': 1} }, {new: true}, function(err, updatedQuestion) {
      if (err) {
        //return res.status(500).json({ err: err.message });
      }
      io.emit('vote-updated', updatedQuestion);
      console.log('Rösten har uppdaterats');
      //res.json({ 'series': series, message: 'Series updated' });
    });
  });

  socket.on('new-question', function (question) {
    io.emit('question-added', question);
  });

  router.post('/question', function(req, res) {
    var newQuestion = req.body;
    Question.create(newQuestion, function(err, result) {
      if (err) {
        return res.status(500).json({ err: err.message });
      }
      //res.json({ 'question': newQuestion, message: 'Question added to db' });
      socket.emit('question-added', result);
    });
  });

});




http.listen(3000, function(){
  console.log('listening on *:3000');
});
