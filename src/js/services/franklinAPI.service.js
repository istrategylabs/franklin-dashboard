'use strict';

export default ['$resource', 'ENV', '$auth',
  function($resource, ENV, $auth) {

    const _self = this;
    const tokenKey = "token";

    _self.userRepos = userRepos;

    //get user deployed repos from franklin and deployables from github 
    function userRepos() {
      return $resource(ENV.FRANKLIN_API_URL, {}, {
        getFranklinRepos: {
          method: 'GET',
          url: ENV.FRANKLIN_API_URL + '/user/repos/deployed/',
          headers: {
             'Authorization': 'Bearer ' + $auth.getToken()
          },
          //workaround to satellizer adding auth header to http request          
          skipAuthorization: true,
          isArray : true
        },
      });
    };

  }
];
