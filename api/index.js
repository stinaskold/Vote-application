var express = require('express');
var Question = require('../models/question');


var router = express.Router();

// get questions
// router.get('/get-questions', function(req, res) {
//   Question.find({}, function(err, question) {
//     if (err) {
//       return res.status(500).json({ message: err.message });
//     }
//     res.json({ question: question });
//   });
// });

// add new question
// router.post('/question', function(req, res) {
//   var newQuestion = req.body;
//   Question.create(newQuestion, function(err, result) {
//     if (err) {
//       return res.status(500).json({ err: err.message });
//     }
//     res.json({ 'question': newQuestion, message: 'Question added to db' });
//     socket.emit('question-added', result);
//   });
// });

// update question
// router.put('/question/:id', function(req, res) {
//   var id = req.params.id;
//   var question = req.body;
//   if (series && series._id !== id) {
//     return res.status(500).json({ err: "Ids don't match!" });
//   }
//   Serie.findByIdAndUpdate(id, series, {new: true}, function(err, todo) {
//     if (err) {
//       return res.status(500).json({ err: err.message });
//     }
//     res.json({ 'series': series, message: 'Series updated' });
//   });
// });
//
// // delete series
// router.delete('/series/:id', function(req, res) {
//   var id = req.params.id;
//   Serie.findByIdAndRemove(id, function(err, result) {
//     if (err) {
//       return res.status(500).json({ err: err.message });
//     }
//     res.json({ message: 'Series deleted' });
//   });
// });

module.exports = router;
