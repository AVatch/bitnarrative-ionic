angular.module('bitnarrative.controllers.content', [])

.controller('ContentListController', ['$scope', '$window', '$stateParams',
  '$ionicModal', 'Community', 'Content',
  function($scope, $window, $stateParams, $ionicModal, Community, Content){

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
