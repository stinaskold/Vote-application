// Service to handle http requests
app.service('request', function($http) {

  this.getQuestions = function(callback) {
    $http.get('/api/get-questions').then(callback);
  };

  this.updateQuestion = function(question) {
    if(!question._id) {
      $http.post('/api/question', question).then(function() {
      //question.title = "";
      //question.choices = {};
      //window.location = '/';
      });
    } else {
      $http.put('/api/question/' + question._id, question).then(function(result) {
        return result.data.question;
      });
    }
  };

  this.deleteQuestion = function(question) {
    if (!question._id) {
      console.log("Id not found");
    }
    return $http.delete('/api/question/' + question._id).then(function() {
      console.log("I deleted " + question.title);
    });
  };


});
