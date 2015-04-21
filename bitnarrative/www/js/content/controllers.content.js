angular.module('bitnarrative.controllers.content', [])

.controller('ContentListController', ['$scope', '$window', '$stateParams',
  '$ionicModal', 'Account', 'Community', 'Content',
  function($scope, $window, $stateParams, $ionicModal, Account, Community,
    Content){

    // pull me
    $scope.me = {};
    var pullMe = function(){
      Account.me().then(function(s){
        if(s.status==200){
          $scope.me = s.data;
          console.log($scope.me);
        }
      }, function(e){console.log(e);});
    }; pullMe();

    $scope.communityID = $stateParams.communityID;
    $scope.community = {};
    var pullCommunity = function(){
      Community.getCommunity($scope.communityID).then(function(s){
        if(s.status==200){
          $scope.community = s.data;
        }
      }, function(e){console.log(e);});
    }; pullCommunity();
    

    $scope.contentList = [];
    var pullContentList = function(){
      Community.getContentList($scope.communityID).then(function(s){
        if(s.status==200){
          $scope.contentList = s.data.results;
        }
      }, function(e){console.log(e);});  
    }; pullContentList();
    


    $scope.createContent = function(content){
      content.community = $scope.community.id;
      Content.parseContent(content).then(function(s){
        pullContentList();
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
          $scope.me.community.push(id);
        }
      }, function(e){console.log(e);});
    };
    // leave a community
    $scope.leave = function(id){
      Community.leaveCommunity(id).then(function(s){
        if(s.status==200){
          var index = $scope.me.community.indexOf(id);
          if(index > -1){
            $scope.me.community.splice(index, 1);
          }
        }
      }, function(e){console.log(e);});
    };


    // helper
    $scope.isInCommunity = function(id){
      for(var i=0; i<$scope.me.community.length; i++){
        if(id == $scope.me.community[i]){
          return true;
        }
      }
      return false;
    };

    $scope.back = function(){
      $window.history.back();
    };

    $ionicModal.fromTemplateUrl('js/content/views/content-add.modal.tmpl.html', {
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
}])



.controller('ContentDetailController', ['$scope', '$window', '$stateParams', 'Content',
  function($scope, $window, $stateParams, Content){
    
    var contentID = $stateParams.contentID;

    $scope.content = {};
    $scope.contentLoad = false;
    Content.getContent(contentID).then(function(s){
      if(s.status==200){
        $scope.content = s.data;
        $scope.contentLoad = true;
      }
    },function(e){console.log(e);});


    $scope.bits = [];
    Content.getBits(contentID).then(function(s){
      if(s.status==200){
        $scope.bits = s.data.results;
        console.log($scope.bits);
      }
    }, function(e){console.log(e);});


    $scope.showingBits = false;
    $scope.toggleContentState = function(){
      $scope.showingBits = !$scope.showingBits
    };
    

    $scope.back = function(){
      $window.history.back();
    };
}]);
