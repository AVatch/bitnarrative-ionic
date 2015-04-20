angular.module('bitnarrative.controllers.communities', [])

.controller('CommunityListController', ['$scope', '$window', '$stateParams',
  '$ionicModal', 'Topic',
  function($scope, $window, $stateParams, $ionicModal, Topic){
    
    // pull the topic
    $scope.topicID = $stateParams.topicID;
    $scope.topic = {};
    Topic.getTopic($scope.topicID).then(function(s){
      if(s.status==200){
        $scope.topic = s.data;
      }
    }, function(e){console.log(e);});


    // pull the communities in the topic
    $scope.communities = [];
    Topic.getCommunityList($scope.topicID).then(function(s){
      console.log(s);
      if(s.status==200){
        $scope.communities = s.data.results;
      }
    }, function(e){console.log(e);});


    // create a community
    $scope.createCommunity = function(community){
      console.log(community);
    };


    // helper functions
    $scope.back = function(){
      $window.history.back();
    };

    $ionicModal.fromTemplateUrl('js/communities/views/community-add.modal.tmpl.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };

}]);
