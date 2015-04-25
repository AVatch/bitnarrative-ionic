angular.module('bitnarrative.controllers.content', [])

.controller('ContentListController', ['$scope', '$window', '$stateParams',
  '$ionicModal', 'Account', 'Community', 'Content',
  function($scope, $window, $stateParams, $ionicModal, Account, Community,
    Content){

    // pull me
    $scope.me = Account.getMe();

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



.controller('ContentDetailController', ['$scope', '$window', 
  '$stateParams', '$ionicActionSheet', 'Content', 'Bit',
  function($scope, $window, $stateParams, $ionicActionSheet, 
    Content, Bit){
    
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
    var totalBitViews = 1;
    Content.getBits(contentID).then(function(s){
      if(s.status==200){
        $scope.bits = s.data.results;
        console.log($scope.bits);
        for(var i=0; i<$scope.bits.length; i++){
          totalBitViews += $scope.bits[i].view_count;
        }
      }
    }, function(e){console.log(e);});


    $scope.showingBits = false;
    $scope.toggleContentState = function(){
      $scope.showingBits = !$scope.showingBits
    };


    $scope.upVoteBit = function(bit){
      Bit.upVote(bit.id).then(function(s){
        bit.up_count += 1;
      }, function(e){console.log(e);});
    };
    $scope.downVoteBit = function(bit){
      Bit.downVote(bit.id).then(function(s){
        bit.down_count += 1;
      }, function(e){console.log(e);});
    };


    $scope.scaleColor = function(bit){
      // yellow, red, green
      var colors = ['FCC755', 'F4324A', '88C425'];
      var colorIndx = 0;

      var upRatio = bit.up_count;
      var downRatio = bit.down_count;

      if( Math.abs(upRatio - downRatio) <= 2){
        colorIndx = 0
      }else if(Math.abs(upRatio - downRatio) > 2 && upRatio - downRatio > 0){
        colorIndx = 2;
      }else{
        colorIndx = 1;
      }

      return colors[colorIndx];

    };
    

    $scope.back = function(){
      $window.history.back();
    };

    // Triggered on a button click, or some other target
    $scope.showActionSheet = function() {
     // Show the action sheet
     var hideSheet = $ionicActionSheet.show({
       buttons: [
         { text: 'Option 01' },
         { text: 'Option 02' }
       ],
       destructiveText: 'Flag',
       titleText: 'Content Options',
       cancelText: 'Cancel',
       cancel: function() {
            // add cancel code..
          },
       buttonClicked: function(index) {
         return true;
       }
     });
    };

}]);
