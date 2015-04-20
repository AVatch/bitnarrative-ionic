/**
* bit.controllers.content Module
*
* Content handling controllers
*/
angular.module('bitnarrative.services.content', [])

.factory('Content', ['$http', '$state', 'localStorageService', 'Authentication', 'DOMAIN',
  function($http, $state, localStorageService, Authentication, DOMAIN){

    var getContent = function(pk){
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

    var parseContent = function(content){
      var token = Authentication.pullCachedToken().token;
      var response = $http({
                        url: DOMAIN + '/api/v1/content/parse/',
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json',
                                   'Authorization': 'Token ' + token },
                        data: content
                      });
      return response;
    };

    var getBits = function(pk){
      var token = Authentication.pullCachedToken().token;
      var response = $http({
                        url: DOMAIN + '/api/v1/content/' + pk.toString() + '/bits/',
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
