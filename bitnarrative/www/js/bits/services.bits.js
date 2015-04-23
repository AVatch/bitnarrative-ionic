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
                        url: DOMAIN + '/api/v1/bit/' + pk.toString() + '/rate/up/',
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json',
                                   'Authorization': 'Token ' + token },
                        data: ''
                      });
      return response;
    };

    var downVote = function(pk){
      var token = Authentication.pullCachedToken().token;
      var response = $http({
                        url: DOMAIN + '/api/v1/bit/' + pk.toString() + '/rate/down/',
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json',
                                   'Authorization': 'Token ' + token },
                        data: ''
                      });
      return response;
    };

    return{
      upVote: upVote,
      downVote: downVote
    };
}])
