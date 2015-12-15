'use strict';

export default ['$resource', 'ENV', '$auth',
  function($resource, ENV, $auth) {

    const _self = this;
    const tokenKey = 'token';

    _self.userRepos = userRepos;

    //manage user repos within Franklin 
    function userRepos() {
      return $resource(ENV.FRANKLIN_API_URL, {}, {
        //call API to get franklin registered repos
        getFranklinRepos: {
          method: 'GET',
          url: ENV.FRANKLIN_API_URL + '/user/repos/deployed/',
          headers: {
            'Authorization': 'Bearer ' + $auth.getToken()
          },
          //workaround to satellizer adding auth header to http request          
          skipAuthorization: true,
          isArray: true
        },
        //call API to get franklin deployable repos
        getDeployableRepos: {
          method: 'GET',
          url: ENV.FRANKLIN_API_URL + '/user/repos/deployable/',
          headers: {
            'Authorization': 'Bearer ' + $auth.getToken()
          },
          //workaround to satellizer adding auth header to http request          
          skipAuthorization: true,
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
          //workaround to satellizer adding auth header to http request          
          skipAuthorization: true,
          isArray: true
        }
      });
    };

  }
];
