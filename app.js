var express = require('express'),
    app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var parser = require('body-parser');
var Question = require('./models/question');

require('./database');

app.use('/', express.static('vote-client/www'));
app.use(parser.json());


// Function to be executed when socket is connected
io.on('connection', function (socket) {

  // Function to be executed when 'get-questions' is sent from frontend
  socket.on('get-questions', function () {
    Question.find({}, function(err, result) {
      if (err) {
        return err;
      }
      //Send result to frontend
      io.emit('read-questions', result);
      console.log('Frågorna har hämtats');
    });
  });

  socket.emit('message', 'You are connected!');

  // Function to be executed when 'vote' is sent from frontend
  socket.on('vote', function (question, chosenChoice) {
    var questionId = question._id;
    var choiceId = chosenChoice._id;
    // Save vote to database
    Question.findOneAndUpdate({ '_id': questionId, 'choices._id': choiceId }, { $inc: {'choices.$.votes': 1} }, {new: true}, function(err, result) {
      if (err) {
        return err;
      }
      //Send result to frontend
      io.emit('vote-updated', result);
      console.log('Rösten har uppdaterats');
    });
  });

  // Function to be executed when 'new-question' is sent from frontend
  socket.on('new-question', function (question) {
    // Save new question to database
    Question.create(question, function(err, result) {
      if (err) {
        return err;
      }
      io.emit('question-added', result);
      console.log('Rösten har lagts till');
    });
  });

  // Function to be executed when 'updated-question' is sent from frontend
  socket.on('updated-question', function (question) {
    // Find question and update in database
    Question.findOneAndUpdate({'_id': question._id}, {$set: {'title': question.title, 'choices': question.choices}}, {new: true, upsert:true}, function(err, result) {
       if (err) {
         return console.log(err);
       }
       console.log('fråga är uppdaterad');
       console.log(result);
       // Send result to frontend
       io.emit('question-updated', result);
    });
  });

  // Function to be executed when 'updated-question' is sent from frontend
  socket.on('deleted-question', function (question) {
    Question.findOneAndRemove({'_id': question._id}, function(err, result) {
      if (err) {
        return err;
      }
      console.log('fråga är raderad');
      // Send result to frontend
      io.emit('question-deleted', question);
    });
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
