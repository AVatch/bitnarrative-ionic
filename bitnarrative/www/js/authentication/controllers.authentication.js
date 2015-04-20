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

}]);