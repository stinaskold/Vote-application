var mongoose = require('mongoose');

//Create schema for choices, child of questionSchema
var choicesSchema = new mongoose.Schema({
	text: String,
	votes: Number
});

// Create schema for question
var questionSchema = new mongoose.Schema({
	title: String,
	choices: [choicesSchema]
});

// Create model
var Question = mongoose.model('Question', questionSchema);

module.exports = Question;
