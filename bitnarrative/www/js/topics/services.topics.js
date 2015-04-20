/**
* bit.controllers.content Module
*
* Content handling controllers
*/
angular.module('bitnarrative.services.topics', [])

.factory('Topic', ['$http', '$state', 'localStorageService', 'Authentication', 'DOMAIN',
  function($http, $state, localStorageService, Authentication, DOMAIN){

    var getTopicList = function(){
      var token = Authentication.pullCachedToken().token;
      var response = $http({
                        url: DOMAIN + '/api/v1/topics/',
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json',
                                   'Authorization': 'Token ' + token },
                        data: ''
                      });
      return response;
    };

    var getTopic = function(pk){
      var token = Authentication.pullCachedToken().token;
      var response = $http({
                        url: DOMAIN + '/api/v1/topic/' + pk + '/',
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json',
                                   'Authorization': 'Token ' + token },
                        data: ''
                      });
      return response;
    };

    var getCommunityList = function(pk){
      var token = Authentication.pullCachedToken().token;
      var response = $http({
                        url: DOMAIN + '/api/v1/topic/' + pk.toString() + '/communities/',
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json',
                                   'Authorization': 'Token ' + token },
      });
      return response;
    }

    return{
      getTopicList: getTopicList,
      getTopic: getTopic,
      getCommunityList: getCommunityList,
    };
}])
