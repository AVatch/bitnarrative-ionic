/**
* bit.controllers.content Module
*
* Content handling controllers
*/
angular.module('bitnarrative.services.community', [])

.factory('Community', ['$http', '$state', 'localStorageService', 'Authentication', 'DOMAIN',
  function($http, $state, localStorageService, Authentication, DOMAIN){

    var getCommunity = function(pk){
      var token = Authentication.pullCachedToken().token;
      var response = $http({
                        url: DOMAIN + '/api/v1/community/' + pk.toString() + '/',
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json',
                                   'Authorization': 'Token ' + token },
                        data: ''
                      });
      return response;
    };

    var pushCommunity = function(community){
      var token = Authentication.pullCachedToken().token;
      var response = $http({
                        url: DOMAIN + '/api/v1/community/',
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json',
                                   'Authorization': 'Token ' + token },
                        data: community
                      });
      return response;
    };

    var joinCommunity = function(pk){
      var token = Authentication.pullCachedToken().token;
      var response = $http({
                        url: DOMAIN + '/api/v1/community/' + pk + '/join/',
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json',
                                   'Authorization': 'Token ' + token },
                      });
      return response;
    };

    var getContentList = function(pk){
      var token = Authentication.pullCachedToken().token;
      var response = $http({
                        url: DOMAIN + '/api/v1/community/' + pk.toString() + '/content/',
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json',
                                   'Authorization': 'Token ' + token },
                        data: ''
                      });
      return response;
    };

    return{
      getCommunity: getCommunity,
      pushCommunity: pushCommunity,
      joinCommunity: joinCommunity,
      getContentList: getContentList,
    };
}])
