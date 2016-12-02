var mongoose = require('mongoose');

// Create schema for alternatives, child of questionSchema
var alternativesSchema = new mongoose.Schema({
	text: String,
	votes: Number
});

// Create schema for question
var questionSchema = new mongoose.Schema({
	question: String,
	alternatives: [alternativesSchema]
});

// Create model
var Question = mongoose.model('Question', questionSchema);

module.exports = Question;
