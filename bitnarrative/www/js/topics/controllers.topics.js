angular.module('bitnarrative.controllers.topics', [])

.controller('TopicsController', ['$scope', 'Topic',
  function($scope, Topic){

    $scope.topicList = [];
    var pullTopicList = function(){
      Topic.getTopicList().then(function(s){
        if(s.status==200){
          // deal with the topics
        }
      }, function(e){console.log(e);});  
    }; 
    // pullTopicList();
}]);
