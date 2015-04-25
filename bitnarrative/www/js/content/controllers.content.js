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
    $scope.contentLoaded = false;
    var pullContentList = function(){
      Community.getContentList($scope.communityID).then(function(s){
        if(s.status==200){
          $scope.contentLoaded = true;
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

    $scope.doRefresh = function(){
      $scope.$broadcast('scroll.refreshComplete');
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
  '$stateParams', '$ionicModal', '$ionicActionSheet', 'Content', 'Bit',
  function($scope, $window, $stateParams, $ionicModal, $ionicActionSheet, 
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
        // console.log($scope.bits);
        for(var i=0; i<$scope.bits.length; i++){
          totalBitViews += $scope.bits[i].view_count;
        }
        for(var i=0; i<$scope.bits.length; i++){
          $scope.bits[i].highlight = scaleColor($scope.bits[i]);
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



    $scope.toggleConversation = function(bit){
      $scope.openModal();
    };


    var scaleColor = function(bit){
      // yellow, red, green
      var colors = ['#F4F328', '#DF151A', '#00DA3C'];
      var colorIndx = 0;

      var bitValue = parseFloat( (bit.up_count - bit.down_count) / totalBitViews);
      if(Math.abs(bitValue) <= 0.3){
        colorIndx = 0;
      }else if(bitValue > 0.3){
        colorIndx = 2;
      }else{
        colorIndx = 1;
      }

      console.log(bit.up_count + ' ' + bit.down_count + ' ' + bitValue);

      return colors[colorIndx];
    };



    var traverse = function(el, container){
      // Traverses the Dom tree rooted by el
      // In-order traversal.
      var children = angular.element(el).children();

      for(var c = 0; c < children.length; c++){
        // only store the <p>
        if(children[c].nodeName == "P" || children[c].nodeName == "BLOCKQUOTE"){
          container.push(children[c]);
        }
        traverse(children[c], container);
      }
    };

    var wrapSentences = function(ref, n){
      // Wraps all the sentences with
      // spans with a unique id
      var txt = ref.innerHTML;
      var sentences = txt.split('. ');
      var nSentences = sentences.length;
      for(var s = 0; s<nSentences; s++){
        sentences[s] = '<span class="sentenceBits" id=' + (n + s) + ' ng-click="selectBit($event, ' + (n + s) + ')" style="background-color:none;">' + sentences[s] + '</span>';
      }

      ref.innerHTML = sentences.join('. ');
      return [ref, nSentences];
    };


    

    

    $scope.back = function(){
      $window.history.back();
    };

    $ionicModal.fromTemplateUrl('js/content/views/content-comments.modal.tmpl.html', {
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
