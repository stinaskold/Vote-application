app.controller('QuestionCtrl', function($scope, $http, $ionicModal, socket, request, $ionicSideMenuDelegate) {

  //$scope.newChoices = [];

  // Object to store data from form
  $scope.formData = {};

  // Add choice to form
  $scope.addChoice = function(array, id) {
    // push an empty object onto the array
    array.push({});
    if (id == 'new') {
      array[array.length - 1].text = 'Alternativ ' + array.length;
    } else {
      array[array.length - 1].text = '';
      array[array.length - 1].votes = 0;
    }
  }

  // Remove choice from form
  $scope.removeChoice = function(array) {
  // remove last object from array
    if (array.length > 2)
      array.pop();
  }




  //GET QUESTIONS WITH ROUTER:

  // Get questions from database
  // request.getQuestions(function(response) {
  //   $scope.questions = response.data.question;
  // });




  // Save questions to database
  // $scope.saveQuestion = function(question) {
  //   request.updateQuestion(question);
  //   console.log('Question saved');
  // };


  // Create and load the New Question Modal
  $ionicModal.fromTemplateUrl('../templates/modals/new-question.html',
  {
    id: 'question',
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
      $scope.questionModal = modal;
  });

  // Create and load the Update Modal
  $ionicModal.fromTemplateUrl('../templates/modals/update-question.html',
  {
    id: 'update',
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
      $scope.updateModal = modal;
  });

  $scope.openModal = function(id, question) {
  if (id == 'question') {
    $scope.question = {};
    $scope.newChoices = [];
    for(var i=0; i < 2; i++) {
      $scope.addChoice($scope.newChoices, 'new');
    }
    $scope.questionModal.show();
  }
  else {
    $scope.currentQuestion = question;
    $scope.updateModal.show();
  }
};

// Close modals
$scope.closeModal = function(id) {
  if (id == 'question') $scope.questionModal.hide();
  else if (id == 'update') $scope.updateModal.hide();
  else $scope.voteModal.hide();
};

  // Destroy modals
  $scope.$on('$destroy', function() {
  console.log('Destroying modals...');
  $scope.questionModal.remove();
  $scope.voteModal.remove();
  });


  // Create new question, called when the form is submitted
  $scope.createQuestion = function(question) {
    var choicesArray = [];
    for (var i in question.choices) {
      var choicesObj = {text : question.choices[i].text, votes : 0};
      console.log(choicesObj);
      choicesArray.push(choicesObj);
    }
    console.log(choicesArray);
    question.choices = choicesArray;
    // for (var i = 0; i < question.choices.length; i++) {
    //   console.log(question.choices[i].text);
    // }
    //console.log('choices är ' + question.choices[2].votes);
    // request.updateQuestion(question);
    // $scope.questions.push({
    //   title: question.title
    // });
    console.log('Här kommer en ny fråga');
    //question.title = "";
    //question.choices = {};
    $scope.questionModal.hide();
    //$scope.openModal();

    // Send data to backend
    socket.emit('new-question', question);
  };

  // Update question, called when the form is submitted
  $scope.updateQuestion = function(question) {
    console.log('alternativen är: ')
    console.log(question.choices);
    // var choicesArray = [];
    // for (var i in question.choices) {
    //   var choicesObj = {text : question.choices[i].text, votes: question.choices[i].votes};
    //   console.log(choicesObj);
    //   choicesArray.push(choicesObj);
    // }
    // console.log(choicesArray);
    // question.choices = choicesArray;
    //request.updateQuestion(question);
    $scope.updateModal.hide();

    // Send data to backend
    socket.emit('updated-question', question);
  };

  $scope.deleteQuestion = function(question) {
    console.log(question)
    request.deleteQuestion(question);

    // Send data to backend
    socket.emit('deleted-question', question);
  };

  // // Open new question modal
  // $scope.newQuestion = function() {
  //   for(var i=0; i < 2; i++) {
  //     $scope.addChoice();
  //   }
  //   $scope.questionModal.show();
  // };
  //
  // // Open new vote modal
  // $scope.newVote = function() {
  //   $scope.voteModal.show();
  // };
  //
  // // Close the new task modal
  // $scope.closeNewQuestion = function() {
  //   $scope.questionModal.hide();
  // };
  //
  // // Close the new task modal
  // $scope.closeNewVote = function() {
  //   $scope.voteModal.hide();
  // };

  // Show side menu with questions
  $scope.toggleQuestions = function() {
  $ionicSideMenuDelegate.toggleLeft();
  };

  // Select question
  $scope.selectQuestion = function(question, index) {
    $scope.activeQuestion = question;
    $scope.activeChoice = "";
    console.log(question.choices);
    $ionicSideMenuDelegate.toggleLeft(false);
  };

// When connected to socket, log message to the console
socket.on('message', function (message) {
  console.log('The server has a message for you: ' + message);
});

// When we get the questions from the database, assign the result to the questions array
socket.on('read-questions', function (result) {
  console.log(result);
  $scope.questions = result;
});

// When vote is updated, replace the old question with the updated question
socket.on('vote-updated', function (updatedQuestion) {
    console.log('den uppdaterade rösten är ' + updatedQuestion);
    for (var i=0;i<$scope.questions.length;i++) {
      if ($scope.questions[i]._id === updatedQuestion._id) {
        $scope.questions[i].choices = updatedQuestion.choices;
      }
    }
});

// When new question is added, push it into the questions array
socket.on('question-added', function (newQuestion) {
  console.log('Den nya frågan är: ' + newQuestion);
  console.log(newQuestion);
  $scope.questions.push(newQuestion);
});

// When question is updated, show message
socket.on('question-updated', function (updatedQuestion) {
  console.log('Den uppdaterade frågan är:' + updatedQuestion);
  console.log('alternativen till den uppdaterade frågan är ');
  console.log(updatedQuestion.choices);
  // for (var i=0;i<$scope.questions.length;i++) {
  //   console.log($scope.questions[i].title);
  //   if ($scope.questions[i]._id == updatedQuestion._id ) {
  //     console.log('Se nu innan');
  //     console.log($scope.questions[i]);
  //     $scope.questions[i] = updatedQuestion;
  //     // $scope.questions.splice(i,1,updatedQuestion);
  //     console.log('Se nu efter');
  //     console.log($scope.questions[i]);
  //   }
  // }
});

// When question is deleted, remove it from the questions array
socket.on('question-deleted', function (deletedQuestion) {
  console.log('Den raderade frågan är:' + deletedQuestion);
  for (var i=0;i<$scope.questions.length;i++) {
    if ($scope.questions[i]._id === deletedQuestion._id ) {
      console.log(deletedQuestion.title);
      $scope.questions.splice(i,1);
    }
  }
  window.location = '/';
});


// socket.on('question-added', function(question) {
//   $scope.questions.push(question);
// });

  // socket.on('test', function (socket) {
  //   console.log('test client');
  // });




 // Function to update vote, called when 'vote' is clicked
 $scope.vote =function(chosenChoice, question) {
    console.log(chosenChoice);
    for (var i=0;i<question.choices.length;i++) {
      if (question.choices[i].text === chosenChoice) {
        console.log('Du har röstat på ' + question.choices[i].text);
        // Assign the vote to variable activeChoice
        $scope.activeChoice = question.choices[i].text;

        //Send data to backend
        socket.emit('vote', question, question.choices[i]);
      }
    }
    //socket.emit('vote', chosenChoice);
    //alert('Hoppla');
  }



})
