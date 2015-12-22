'use strict';

export default ['$resource', 'ENV', '$auth',
  function($resource, ENV, $auth) {

    const _self = this;
    const tokenKey = 'token';

    //manage user repos within Franklin 
    _self.userRepos = $resource(ENV.FRANKLIN_API_URL, {}, {
      //call API to get franklin registered repos
      getFranklinRepos: {
        method: 'GET',
        url: ENV.FRANKLIN_API_URL + '/user/repos/deployed/',
        headers: {
          'Authorization': 'Bearer ' + $auth.getToken()
        },
        isArray: true
      },
      //call API to get franklin deployable repos
      getDeployableRepos: {
        method: 'GET',
        url: ENV.FRANKLIN_API_URL + '/user/repos/deployable/',
        headers: {
          'Authorization': 'Bearer ' + $auth.getToken()
        },
        isArray: true
      },
      //call API to register a franklin repo
      registerRepo: {
        method: 'POST',
        url: ENV.FRANKLIN_API_URL + '/register/',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + $auth.getToken()
        },
        isArray: true
      }
    });

  }
];
