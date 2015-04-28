// bit.narrative

angular.module('bitnarrative', ['ionic',
                                'LocalStorageModule',
                                'ngCordova',

                                'bitnarrative.controllers.authentication',
                                'bitnarrative.services.authentication',
                                
                                'bitnarrative.services.accounts',

                                'bitnarrative.controllers.topics',
                                'bitnarrative.services.topics',

                                'bitnarrative.controllers.communities',
                                'bitnarrative.services.community',

                                'bitnarrative.controllers.content',
                                'bitnarrative.services.content',

                                'bitnarrative.services.bits'])

.run(function($ionicPlatform, $rootScope, $state, $urlRouter, Authentication, Account) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show
    // the accessory bar above the keyboard for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      $cordovaStatusbar.style(1);
    }


    // fetch and cache the user object
    var sessionToken = Authentication.pullCachedToken();
    if(sessionToken){
        Account.me().then(function(s){
          Account.cacheMe(s.data);
        }, function(e){console.log(e);});
    }


  });

  // check if the user is authenticated
  $rootScope.$on('$locationChangeSuccess', function(evt) {
     // Halt state change from even starting
     evt.preventDefault();
     // Verify the user has a session token
     var sessionToken = Authentication.pullCachedToken();
     // Continue with the update and state transition if logic allows
     if(sessionToken){
        $urlRouter.sync();
     }else{
        $state.go('authentication');
     }
   });
})

.constant('DOMAIN', 'http://54.69.55.116:8000')

.config(['localStorageServiceProvider',
  function(localStorageServiceProvider) {
    localStorageServiceProvider
      .setPrefix('bit');
}])

.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /
    $urlRouterProvider.otherwise("/topics");

    //
    // Now set up the states
    $stateProvider
      .state('authentication', {
        url: "/authentication",
        templateUrl: "js/authentication/views/authentication.tmpl.html",
        controller: "AuthenticationController"
      })

      .state('topics', {
        url: "/topics",
        templateUrl: "js/topics/views/topic-grid.tmpl.html",
        controller: "TopicsController"
      })

      .state('communities', {
        url: "/topic/:topicID/communities",
        templateUrl: "js/communities/views/communities.tmpl.html",
        controller: "CommunityListController"
      })

      .state('contents', {
        url: "/community/:communityID/content",
        templateUrl: "js/content/views/content-list.tmpl.html",
        controller: "ContentListController"
      })

      .state('content', {
        url: "/content/:contentID",
        templateUrl: "js/content/views/content-detail.tmpl.html",
        controller: "ContentDetailController"
      })

}])


.directive('dynamic', function ($compile) {
  return {
    restrict: 'A',
    replace: true,
    link: function (scope, ele, attrs) {
      scope.$watch(attrs.dynamic, function(html) {
        ele.html(html);
        $compile(ele.contents())(scope);
      });
    }
  };
});
;