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

    return{
      me: me
    };
}])
