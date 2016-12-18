app.controller('QuestionCtrl', function($scope, $http, $ionicModal, socket, request, $ionicSideMenuDelegate) {
  //$scope.activeQuestion = 'Fråga 1';
  $scope.newChoices = [];
  // for (var i=0;i<$scope.newChoices.length;i++) {
  //   $scope.newChoices[i].text = 'Alternativ ' + (parseFloat([i]) + 1);
  // }

  $scope.addChoice = function() {
  // push an empty object onto the array
  $scope.newChoices.push({});
    for (var i=0;i<$scope.newChoices.length;i++) {
      $scope.newChoices[i].text = 'Alternativ ' + (parseFloat([i]) + 1);
    }
  }

  $scope.removeChoice = function() {
  // remove last object from array
    if ($scope.newChoices.length > 2)
      $scope.newChoices.pop();
  }


  // Get questions from database
  request.getQuestions(function(response) {
    $scope.questions = response.data.question;
  });

  // Save questions to database
  // $scope.saveQuestion = function(question) {
  //   request.updateQuestion(question);
  //   console.log('Question saved');
  // };


  // Create and load the Modal
  $ionicModal.fromTemplateUrl('../templates/modals/new-question.html',
  {
    id: 'question',
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
      $scope.questionModal = modal;
  });

  // Create and load the Modal
  $ionicModal.fromTemplateUrl('../templates/modals/new-vote.html',
  {
    id: 'vote',
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
      $scope.voteModal = modal;
  });

  // Called when the form is submitted
  $scope.createQuestion = function(question) {
    var choicesArray = [];
    for (var i in question.choices) {
      var choicesObj = {text : question.choices[i].text, votes: 0};
      console.log(choicesObj);
      choicesArray.push(choicesObj);
    }
    console.log(choicesArray);
    question.choices = choicesArray;
    // for (var i = 0; i < question.choices.length; i++) {
    //   console.log(question.choices[i].text);
    // }
    //console.log('choices är ' + question.choices[2].votes);
    request.updateQuestion(question);
    // $scope.questions.push({
    //   title: question.title
    // });
    socket.emit('new-question', question);
    console.log('Här kommer en ny fråga');
    // question.title = "";
    // question.choices = {};
    $scope.questionModal.hide();
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

  $scope.openModal = function(id) {
  if (id == 'question') {
    for(var i=0; i < 2; i++) {
      $scope.addChoice();
    }
    $scope.questionModal.show();
  }
  else {
    $scope.voteModal.show();
  }
};

$scope.closeModal = function(id) {
  if (id == 'question') $scope.questionModal.hide();
  else $scope.voteModal.hide();
};


  $scope.$on('$destroy', function() {
  console.log('Destroying modals...');
  $scope.questionModal.remove();
  $scope.voteModal.remove();
  });

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

socket.on('message', function (message) {
  console.log('The server has a message for you: ' + message);
});

socket.on('vote-updated', function (updatedQuestion) {
    for (var i=0;i<$scope.questions.length;i++) {
      if ($scope.questions[i].title === updatedQuestion.title) {
        $scope.questions[i].choices = updatedQuestion.choices;
      }
    }
  $scope.voteModal.hide();
  // console.log();
  // $('.result-list').empty();
  // for (var i=0;i<updatedQuestion.choices.length;i++) {
  //   $('.result-list').append('<li class="result-list-item">' + updatedQuestion.choices[i].text + ' har ' + updatedQuestion.choices[i].votes +' röster.</li>');
  // }
  //
  // console.log('Rösten uppdaterad' + updatedQuestion.title);

  // Lägg till ny text node med antal röster
  // Hur få det att uppdateras i alla fönster

  // Get questions from database
  //$scope.questions.push(updatedQuestion);
});



  // socket.on('test', function (socket) {
  //   console.log('test client');
  // });

  //initializing messages array
 this.messages=[{content: 'hej'},{content: 'svej'}];

 $scope.formData = {};

 $scope.vote =function(chosenChoice, question) {
    console.log(chosenChoice);
    for (var i=0;i<question.choices.length;i++) {
      if (question.choices[i].text === chosenChoice) {
        console.log('Du har röstat på ' + question.choices[i].text);
        $scope.activeChoice = question.choices[i].text;
        socket.emit('vote', question, question.choices[i]);
      }
    }
    //socket.emit('vote', chosenChoice);
    //alert('Hoppla');
  }

  // // Whenever the server emits 'new message', update the chat body
  //  socket.on('new message', function (data) {
  //    if(data.message)
  //    {
  //      addMessageToList(data.message)
  //    }
  //  });
  //
  //  // Display message by adding it to the message list
  //  function addMessageToList(message){
  //    this.messages.push({content:message})
  //    $ionicScrollDelegate.scrollBottom();
  //  }

})
