'use strict';

export default ['$resource', 'ENV', '$auth',
  function($resource, ENV, $auth) {

    const _self = this;
    const tokenKey = 'token';

    //manage user repos within Franklin 
    let userRepos = $resource(ENV.FRANKLIN_API_URL, {}, {
      //call API to get franklin registered repos
      getFranklinRepos: {
        method: 'GET',
        url: ENV.FRANKLIN_API_URL + '/projects/',
        headers: {
          'Authorization': 'Bearer ' + $auth.getToken()
        },
        isArray: true
      },
      //call API to get franklin deployable repos
      getDeployableRepos: {
        method: 'GET',
        url: ENV.FRANKLIN_API_URL + '/repos/',
        headers: {
          'Authorization': 'Bearer ' + $auth.getToken()
        },
        isArray: true
      },
      //call API to register a franklin repo
      registerRepo: {
        method: 'POST',
        url: ENV.FRANKLIN_API_URL + '/projects/',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + $auth.getToken()
        }
      },
      deleteRepo: {
        method: 'DELETE',
        url: `${ENV.FRANKLIN_API_URL}/projects/:github_id`,
        params: {
          github_id: "@github_id"
        },
        headers: {
          'Authorization': 'Bearer ' + $auth.getToken()
        }
      },
      getRepo: {
        method: 'GET',
        url: `${ENV.FRANKLIN_API_URL}/projects/:github_id`,
        params: {
          github_id: "@github_id"
        },
        headers: {
          'Authorization': 'Bearer ' + $auth.getToken()
        }
      },
      deployRepo: {
        method: 'POST',
        url: `${ENV.FRANKLIN_API_URL}/projects/:github_id/builds`,
        params: {
          github_id: "@github_id"
        },
        headers: {
          'Authorization': 'Bearer ' + $auth.getToken()
        }
      }
    });

let environments = $resource(ENV.FRANKLIN_API_URL, {}, {      
      promote: {
        method: 'POST',
        url: `${ENV.FRANKLIN_API_URL}/repos/:github_id/environments/:env/promote`,
        params: {
          github_id: "@github_id",
          env: "@env"
        },
        headers: {
          'Authorization': 'Bearer ' + $auth.getToken()
        }
      }
    });


    let resources = {
      userRepos,
      environments
    }

    Object.assign(_self, resources);

  }
];
