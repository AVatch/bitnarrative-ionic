angular.module('bitnarrative.controllers.communities', [])

.controller('CommunityListController', ['$scope', '$window', '$stateParams',
  '$ionicModal', 'Account', 'Community', 'Topic',
  function($scope, $window, $stateParams, $ionicModal, Account, Community, Topic){
    
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
    var pullCommunities = function(){
      Topic.getCommunityList($scope.topicID).then(function(s){
        if(s.status==200){
          console.log(s);
          $scope.communities = s.data.results;
        }
      }, function(e){console.log(e);});
    }; pullCommunities();


    // create a community
    $scope.community = {public: true}
    $scope.createCommunity = function(community){
      // add the topic
      $scope.community.topics = [$scope.topic.id];

      // add creator
      Account.me().then(function(s){
        if(s.status==200){
          var me = s.data;

          $scope.community.accounts = [me.id];

          // push it through
          Community.pushCommunity($scope.community).then(function(s){
            console.log(s);
            pullCommunities();
            $scope.closeModal();
          }, function(e){console.log(e);});

        }
      }, function(e){console.log(e);});
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
