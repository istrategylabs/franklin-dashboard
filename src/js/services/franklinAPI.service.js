'use strict';

export default ['$resource', 'ENV', 'localStorageService',
  function($resource, ENV, localStorageService) {

    const _self = this;
    const tokenKey = "token";

    _self.authFranklinUser = authFranklinUser;
    _self.userRepos = userRepos;
    _self.isUserLogged = isUserLogged;
    _self.getToken = getToken;
    _self.saveToken = saveToken;
    _self.refreshToken = refreshToken;
    _self.isTokenHealthy = isTokenHealthy;

    //get user deployed repos from franklin and deployables from github 
    function userRepos() {
      return $resource(ENV.FRANKLIN_API_URL, {}, {
        getFranklinRepos: {
          method: 'GET',
          url: ENV.FRANKLIN_API_URL + '/user/repos/deployed/',
          headers: {
             'Content-Type': 'pplication/json;charset=UTF-8',
             'Authorization': 'Bearer ' + _self.getToken()
          },
          //workaround to satellizer adding auth header to http request          
          skipAuthorization: true
        },
      });
    };

    //sends github access_token to franklin API and retrieves franklin token
    function authFranklinUser() {
      return $resource(ENV.FRANKLIN_API_URL, {}, {
        franklinToken: {
          method: 'POST',
          url: ENV.FRANKLIN_API_URL + '/auth/convert-token/',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          //workaround to satellizer adding auth header to http request          
          skipAuthorization: true
        },
      });
    };

    function isUserLogged() {
      return localStorageService.get(tokenKey) !== null && _self.isTokenHealthy();
    };

    function getToken() {
      return localStorageService.get(tokenKey);
    };

    function saveToken(newToken) {
      return localStorageService.set(tokenKey, newToken);
    };

    function deleteToken() {
      return localStorageService.remove(tokenKey);
    }

    //TODO: call franklin API and get new token
    function refreshToken() {
      return true;
    };

    //TODO: check if token exists and is not expired
    function isTokenHealthy() {
      return true;
    };

  }
];
