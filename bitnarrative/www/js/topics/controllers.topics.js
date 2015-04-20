angular.module('bitnarrative.controllers.topics', [])

.controller('TopicsController', ['$scope', 'Topic',
  function($scope, Topic){

    $scope.topicList = [];
    Topic.getTopicList().then(function(s){
      if(s.status==200){
        console.log(s.data.results);
      }
    }, function(e){console.log(e);});

}]);
