/**
* bit.controllers.bits Module
*
* Content handling controllers
*/
angular.module('bitnarrative.services.bits', [])

.factory('Bit', ['$http', '$state', 'localStorageService', 'Authentication', 'DOMAIN',
  function($http, $state, localStorageService, Authentication, DOMAIN){

    var upVote = function(pk){
      var token = Authentication.pullCachedToken().token;
      var response = $http({
                        url: DOMAIN + '/api/v1/content/' + pk.toString() + '/',
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json',
                                   'Authorization': 'Token ' + token },
                        data: ''
                      });
      return response;
    };


    return{
      getContent: getContent,
      parseContent: parseContent,
      getBits: getBits,
    };
}])
