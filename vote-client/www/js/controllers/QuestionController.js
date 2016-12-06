app.controller('QuestionCtrl', function($scope, $http, $ionicModal, socket, request, $ionicSideMenuDelegate) {

  //$scope.activeQuestion = 'Fråga 1';
  $scope.newChoices = [
    { text: 'Alternativ 1' },
    { text: 'Alternativ 2' },
    { text: 'Alternativ 3' },
    { text: 'Alternativ 4' }
  ];

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
  $ionicModal.fromTemplateUrl('new-question.html', function(modal) {
    $scope.questionModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  // Called when the form is submitted
  $scope.createQuestion = function(question) {
    for (var i in question.choices) {
      console.log(question.choices[i].text);
    }
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
    $scope.questionModal.hide();
  };

  // Open our new task modal
  $scope.newQuestion = function() {
    $scope.questionModal.show();
  };

  // Close the new task modal
  $scope.closeNewQuestion = function() {
    $scope.questionModal.hide();
  };

  $scope.toggleQuestions = function() {
  $ionicSideMenuDelegate.toggleLeft();
  };

  // Select question
  $scope.selectQuestion = function(question, index) {
    $scope.activeQuestion = question;
    console.log(question.choices);
    $ionicSideMenuDelegate.toggleLeft(false);
  };

socket.on('message', function (message) {
      //alert('The server has a message for you: ' + message);
  });

socket.on('read-questions', function (questions) {
  console.log(questions);
});



  // socket.on('test', function (socket) {
  //   console.log('test client');
  // });

  //initializing messages array
 this.messages=[{content: 'hej'},{content: 'svej'}];

 $scope.vote =function(data) {
    socket.emit('vote', data);
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
