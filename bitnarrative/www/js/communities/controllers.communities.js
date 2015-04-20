angular.module('bitnarrative.controllers.communities', [])

.controller('CommunityListController', ['$scope', '$window', '$stateParams',
  '$ionicModal', 'Topic',
  function($scope, $window, $stateParams, $ionicModal, Topic){
    $scope.topic = $stateParams.topicID;

    // pull the communities in the topic
    $scope.communities = [];
    Topic.getCommunityList($scope.topic).then(function(s){
      console.log(s);
      if(s.status==200){
        $scope.communities = s.data.results;
      }
    }, function(e){console.log(e);});

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
