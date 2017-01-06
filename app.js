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

// Function to be executed when socket is connected
io.on('connection', function (socket) {

  // socket.emit('read-questions', function() {
  //   Question.find({}, function(err, question) {
  //     if (err) {
  //
  //     }
  //     return question;
  //   });
  // });

  // Get questions on connection
  Question.find({}, function(err, result) {
    if (err) {
      return err;
    }
    //Send result to frontend
    io.emit('read-questions', result);
    console.log('Frågorna har hämtats');
  });

  socket.emit('message', 'You are connected!');

  // Function to be executed when 'vote' is sent from frontend
  socket.on('vote', function (question, chosenChoice) {
    console.log(question.title);
    console.log('Din röst: ' + chosenChoice._id);
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

  // // create question
  // router.post('/question', function(req, res) {
  //   var newQuestion = req.body;
  //   Question.create(newQuestion, function(err, result) {
  //     if (err) {
  //       return res.status(500).json({ err: err.message });
  //     }
  //     //res.json({ 'question': newQuestion, message: 'Question added to db' });
  //     socket.emit('question-added', result);
  //   });
  // });

  // Function to be executed when 'updated-question' is sent from frontend
  socket.on('updated-question', function (question) {
    console.log('frågan på backend är:');
    console.log(question);
    console.log('update');
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

//   // update question
//   router.put('/question/:id', function(req, res) {
//     var id = req.params.id;
//     var question = req.body;
//     if (question && question._id !== id) {
//       return res.status(500).json({ err: "Ids don't match!" });
//     }
//     console.log("PUT");
//     console.log(question);
//     Question.findByIdAndUpdate(id, question, {new: true}, function(err, result) {
//       if (err) {
//         return res.status(500).json({ err: err.message });
//       }
//       console.log('fråga är uppdaterad');
//       //res.json({ 'question': question, message: 'Series updated' });
//       socket.emit('question-updated', result);
//     });
//   });
//

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
//

//
//   // // delete series
//   router.delete('/question/:id', function(req, res) {
//     var id = req.params.id;
//     Question.findByIdAndRemove(id, function(err, result) {
//       if (err) {
//         return res.status(500).json({ err: err.message });
//       }
//       console.log('fråga är raderad');
//       //res.json({ message: 'Series deleted' });
//       socket.emit('question-deleted', result);
//     });
//   });
//
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
