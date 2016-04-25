'use strict';

export default ['$resource', 'ENV', '$auth',
  function($resource, ENV, $auth) {

    const _self = this;
    const tokenKey = 'token';
    const base_url = ENV.FRANKLIN_API_URL + '/v1';

    //manage user repos within Franklin 
    let userRepos = $resource(base_url, {}, {
      //call API to get franklin registered repos
      getUserInfo: {
        method: 'GET',
        url: base_url + '/user/',
        headers: {
          'Authorization': 'Bearer ' + $auth.getToken()
        }
      },
      //call API to get franklin registered repos
      getFranklinRepos: {
        method: 'GET',
        url: base_url + '/projects/',
        headers: {
          'Authorization': 'Bearer ' + $auth.getToken()
        },
        isArray: true
      },
      //call API to get franklin deployable repos
      getDeployableRepos: {
        method: 'GET',
        url: base_url + '/repos/',
        headers: {
          'Authorization': 'Bearer ' + $auth.getToken()
        },
        isArray: true
      },
      //call API to register a franklin repo
      registerRepo: {
        method: 'POST',
        url: base_url + '/projects/',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + $auth.getToken()
        }
      },
      deleteRepo: {
        method: 'DELETE',
        url: `${base_url}/projects/:github_id`,
        params: {
          github_id: "@github_id"
        },
        headers: {
          'Authorization': 'Bearer ' + $auth.getToken()
        }
      },
      getRepo: {
        method: 'GET',
        url: `${base_url}/projects/:github_id`,
        params: {
          github_id: "@github_id"
        },
        headers: {
          'Authorization': 'Bearer ' + $auth.getToken()
        }
      },
      deployRepo: {
        method: 'POST',
        url: `${base_url}/projects/:github_id/builds`,
        params: {
          github_id: "@github_id"
        },
        headers: {
          'Authorization': 'Bearer ' + $auth.getToken()
        }
      }
    });

let environments = $resource(base_url, {}, {      
      promote: {
        method: 'POST',
        url: `${base_url}/projects/:github_id/environments/:env`,
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
