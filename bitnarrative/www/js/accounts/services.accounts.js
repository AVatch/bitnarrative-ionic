/**
* bit.controllers.content Module
*
* Content handling controllers
*/
angular.module('bitnarrative.services.accounts', [])

.factory('Account', ['$http', '$state', 'localStorageService', 'Authentication', 'DOMAIN',
  function($http, $state, localStorageService, Authentication, DOMAIN){

    var me = function(){
      var token = Authentication.pullCachedToken().token;
      var response = $http({
                        url: DOMAIN + '/api/v1/me/',
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json',
                                   'Authorization': 'Token ' + token },
                      });
      return response;
    };

    var cacheMe = function(me){
      return localStorageService.set('me', me);
    };

    var getMe = function(){
      return localStorageService.get('me');
    }

    return{
      me: me,
      cacheMe: cacheMe,
      getMe: getMe
    };
}])
