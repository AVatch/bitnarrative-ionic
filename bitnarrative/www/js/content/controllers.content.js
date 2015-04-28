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



.controller('ContentDetailController', ['$scope', '$sce', '$window', 
  '$stateParams', '$ionicModal', '$ionicActionSheet', 'Content', 'Bit',
  function($scope, $sce, $window, $stateParams, $ionicModal, $ionicActionSheet, 
    Content, Bit){
    
    var contentID = $stateParams.contentID;

    $scope.content = {};
    $scope.contentLoad = false;
    Content.getContent(contentID).then(function(s){
      if(s.status==200){
        $scope.content = s.data;
        $scope.content.content = prepareContent($scope.content.content);
        $scope.contentLoad = true;
      }
    },function(e){console.log(e);});


    $scope.bits = [];
    var totalBitViews = 1;
    Content.getBits(contentID).then(function(s){
      if(s.status==200){
        console.log(s.data.results);
        $scope.bits = s.data.results;
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


    var scopeToggle = false;
    $scope.toggleOverlay = function(){
      if(!scopeToggle){
        scopeToggle = true;
        var c = {'#4AFF32': ['74','255','50'], 
                 '#96FF31': ['150','255','46'], 
                 '#BFFF2B': ['191','255','43'],
                 '#E2FF2A': ['226','255','42'],
                 '#FFFF28': ['255','255','40'],
                 '#FFDF2A': ['255','223','42'],
                 '#FFBC2B': ['255','188','43'],
                 '#FF8D2E': ['255','141','46'],
                 '#FF642F': ['255','100','47'],
                 '#FF3232': ['255','50','50']}

        for(var i=0; i<$scope.bits.length; i++){
          
          document.getElementById(i).style['background-color']="rgba("+c[$scope.bits[i].highlight][0]+","+c[$scope.bits[i].highlight][1]+","+c[$scope.bits[i].highlight][2]+", 0.8)";
          document.getElementById(i).style['box-shadow']="0px 0px 2px 1px rgba("+c[$scope.bits[i].highlight][0]+","+c[$scope.bits[i].highlight][1]+","+c[$scope.bits[i].highlight][2]+", 0.8)";
        }  
      }else{
        scopeToggle = false;
        for(var i=0; i<$scope.bits.length; i++){
          document.getElementById(i).style['background-color']="white";
          document.getElementById(i).style['box-shadow']="none";
        }  
      }
      
    };

    var scaleColor = function(bit){
      // red, yello, green

      // (74,255,50)  -> #4AFF32
      // (150,255,46) -> #96FF31
      // (191,255,43) -> #BFFF2B
      // (226,255,42) -> #E2FF2A
      // (255,255,40) -> #FFFF28
      // (255,223,42) -> #FFDF2A
      // (255,188,43) -> #FFBC2B
      // (255,141,46) -> #FF8D2E
      // (255,100,47) -> #FF642F
      // (255,50,50)  -> #FF3232
      var colors = ['#FF3232', '#FF642F', '#FF8D2E', '#FFBC2B', '#FFDF2A',
                    '#FFFF28', '#E2FF2A', '#BFFF2B', '#96FF31', '#4AFF32'] 
      var colorIndx = 0;

      var bitValue = parseFloat( (bit.up_count - bit.down_count) / (1 + bit.up_count + bit.down_count));

      console.log(bit.up_count + '\t' + bit.down_count + '\t' + (bit.up_count + bit.down_count) + '\t' + bitValue)

      if(bitValue <= -0.8){
        colorIndx = 0
      }else if(bitValue <= -0.6 && bitValue > -0.8){
        colorIndx = 1
      }else if(bitValue <= -0.4 && bitValue > -0.6){
        colorIndx = 2
      }else if(bitValue <= -0.2 && bitValue > -0.4){
        colorIndx = 3
      }else if(bitValue <= 0.0 && bitValue > -0.2){
        colorIndx = 4
      }else if(bitValue <= 0.2 && bitValue > 0.0){
        colorIndx = 5
      }else if(bitValue <= 0.4 && bitValue > 0.2){
        colorIndx = 6
      }else if(bitValue <= 0.6 && bitValue > 0.4){
        colorIndx = 7
      }else if(bitValue <= 0.8 && bitValue > 0.6){
        colorIndx = 8
      }else{
        colorIndx = 9
      }
      return colors[colorIndx];
    };



    var prepareContent = function(rawContent){
        /**
         * Wraps every sentence with an 
         * ng-click listener.
         * -- for now every <p>
         */
        var wrappedContent = '';

        // remove <em> tags..TBD - filter out other unwanted tags
        rawContent = rawContent.replace(/<\/?em[^>]*>/g,"");
        // convert to HTML
        htmlContent = stringToHTML(rawContent);
        // pull out references to the <p>
        var pReferences = [];    
        traverse(htmlContent, pReferences);
        var nSentences = 0;
        for(var p = 0; p < pReferences.length; p++){
          output = wrapSentences(pReferences[p], nSentences);
          pReferences[p] = output[0];
          nSentences += parseInt(output[1]);
        }

        // Sanitize it so angular is a happy puppy
        var sanitizedContent = $sce.trustAsHtml(htmlContent.innerHTML);
        return sanitizedContent;
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

    // Convert String to HTML
    var stringToHTML = function(string) {
      var el = document.createElement('div');
      el.innerHTML = string;
      return el.childNodes[0];
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
