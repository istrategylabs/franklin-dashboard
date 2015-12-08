'use strict';

export default ['$resource', 'ENV', 'localStorageService',
  function($resource, ENV, localStorageService) {

    const _self = this;
    const token_key = "token";

    _self.authFranklinUser = authFranklinUser;
    _self.isUserLogged = isUserLogged;
    _self.getToken = getToken;
    _self.saveToken = saveToken;
    _self.refreshToken = refreshToken;
    _self.isTokenHealthy = isTokenHealthy;

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
      return localStorageService.get(token_key) !== null && _self.isTokenHealthy();
    };

    function getToken() {
      return localStorageService.get(token_key);
    };

    function saveToken(new_token) {
      return localStorageService.set(token_key, new_token);
    };

    function deleteToken() {
      return localStorageService.remove(token_key);
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
