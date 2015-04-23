/**
* bit.controllers.content Module
*
* Content handling controllers
*/
angular.module('bitnarrative.services.authentication', [])

.factory('Authentication', ['$http', '$state', 'localStorageService', 'DOMAIN',
  function($http, $state, localStorageService, DOMAIN){

    var registerUser = function(user){
      var response = $http({
                        url: DOMAIN + '/api/v1/accounts/create/',
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        data: JSON.stringify(user)
                      });
      return response;
    };

    var requestToken = function(user){
      var response = $http({
                        url: DOMAIN + '/api/v1/api-token-auth/',
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        data: JSON.stringify(user)
                      });
      return response;
    };

    var cacheToken = function(token){
      return localStorageService.set('token', token);
    };

    var pullCachedToken = function(){
      return localStorageService.get('token');
    };

    return{
      registerUser: registerUser,
      requestToken: requestToken,
      cacheToken: cacheToken, 
      pullCachedToken: pullCachedToken,
    };
}])
