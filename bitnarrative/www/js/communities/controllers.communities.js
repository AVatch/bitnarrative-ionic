angular.module('bitnarrative.controllers.communities', [])

.controller('CommunityListController', ['$scope', '$rootScope', '$window', '$stateParams',
  '$ionicModal', 'Account', 'Community', 'Topic',
  function($scope, $rootScope, $window, $stateParams, $ionicModal, Account, Community, Topic){
    
    // pull me
    $scope.me = Account.getMe();


    // pull the topic
    $scope.topicID = $stateParams.topicID;
    $scope.topic = {};
    var pullTopic = function(){
      Topic.getTopic($scope.topicID).then(function(s){
        if(s.status==200){
          $scope.topic = s.data;
        }
      }, function(e){console.log(e);});
    }; pullTopic();

    // pull the communities in the topic
    $scope.communities = [];
    $scope.communitiesLoaded = false;
    var pullCommunities = function(){
      Topic.getCommunityList($stateParams.topicID).then(function(s){
        if(s.status==200){
          $scope.communitiesLoaded = true;
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
      $scope.community.accounts = [$scope.me.id];

      // push it through
      Community.pushCommunity($scope.community).then(function(s){
        console.log(s);
        pullCommunities();
        $scope.closeModal();
      }, function(e){console.log(e);});
    };


    // join a community
    $scope.toggleCommunity = function(id){
      if($scope.isInCommunity(id)){
        $scope.leave(id);
      }else{
        $scope.join(id);
      }
    };
    $scope.join = function(id){
      Community.joinCommunity(id).then(function(s){
        if(s.status==200){
          $scope.me.community.push(parseInt(id));
          Account.cacheMe($scope.me);
        }
      }, function(e){console.log(e);});
    };
    // leave a community
    $scope.leave = function(id){
      Community.leaveCommunity(id).then(function(s){
        if(s.status==200){
          var index = $scope.me.community.indexOf(parseInt(id));
          if(index > -1){
            $scope.me.community.splice(index, 1);
            Account.cacheMe($scope.me);
          }
        }
      }, function(e){console.log(e);});
    };

    // helper functions
    $scope.isInCommunity = function(id){
      // console.log(id);
      for(var i=0; i<$scope.me.community.length; i++){
        if(id == $scope.me.community[i]){
          return true;
        }
      }
      return false;
    };

    $scope.doRefresh = function(){
      $scope.$broadcast('scroll.refreshComplete');
    };

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
