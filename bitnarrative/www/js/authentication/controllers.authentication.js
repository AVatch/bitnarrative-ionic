/**
* bit.controllers.authentication Module
*
* Description
*/
angular.module('bitnarrative.controllers.authentication', [])

.controller('AuthenticationBaseController', ['$scope',
  function($scope){

}])

.controller('AuthenticationController', ['$scope', '$state', 'Authentication',
  function($scope, $state, Authentication){

    $scope.authenticate = function(user){
      var request = Authentication.requestToken(user);
      request.then(function(s){
        if(s.status==200){
          Authentication.cacheToken(s.data);
          $state.go('topics');
        }
      }, function(e){
        $scope.authError = true;
      });
    };


    $scope.register = function(user){
      // register
      console.log(user)
      user.email = "";
      user.first_name = "";
      user.last_name = "";
      user.profile_picture_url = "";
      user.is_admin = false;
      user.is_manager = false;

      var request = Authentication.registerUser(user);
      request.then(function(s){
        if(s.status==201){
          // get token
          var request = Authentication.requestToken({"username": user.username, 
                                                     "password": user.password});
          request.then(function(s){
            if(s.status==200){
              // got to the page
              Authentication.cacheToken(s.data);
              $state.go('topics');
            }
          }, function(e){
            $scope.authError = true;
          });

        }
      }, function(e){
        console.log(e)
        $scope.authError = true;
      });
    };

}]);