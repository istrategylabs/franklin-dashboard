'use strict';

function DashboardComponent(franklinAPIService, $scope, $location,
  $auth, toastr, ENV, $httpParamSerializer, $state, $modal) {
  /* jshint validthis: true */
  let dc = this;
  dc.username = "";
  dc.deployedRepos = [];

  dc.getFranklinRepos = getFranklinRepos;
  /*dc.getDeployableRepos = getDeployableRepos;*/
  dc.listFranklinRepos = listFranklinRepos;
  /*dc.listDeployableRepos = listDeployableRepos;*/
  dc.logout = logout;

  dc.getFranklinRepos();

  function getFranklinRepos() {
    let repos = franklinAPIService.userRepos().getFranklinRepos();
    repos.$promise.then(dc.listFranklinRepos);
  };

  /*function getDeployableRepos() {
    let repos = franklinAPIService.userRepos().getDeployableRepos();
    repos.$promise.then(dc.listDeployableRepos);
  };*/

  function listFranklinRepos(data) {
    //TODO: push if it doesn't exits
    dc.deployedRepos = [];
    if (data.length > 0) {
      dc.username = data[0].owner.name;
      for (let repo of data) {
        dc.deployedRepos.push({
          "name": repo.name,
          "environment": repo.environments.length > 0 ? repo.environments[0].name : "",
          "status": repo.environments.length > 0 ? repo.environments[0].status : "",
          "owner": repo.owner.name
        });
      };
    }
  };

  /*function listDeployableRepos(data) {
    //TODO: push if it doesn't exits
    dc.deployableRepos = [];
    let modalInstance = $modal.open({
      templateUrl: 'listDeployableRepos.html',
      controller: 'DashboardComponent',
      resolve: {
        deployableRepos: function() {
          if (data.length > 0) {
            dc.username = data[0].owner.name;
            for (let repo of data) {
              dc.deployableRepos.push({
                "name": repo.name,
                "url": repo.url,
                "owner": repo.owner.name
              });
            };
          }
          return dc.deployableRepos;
        }
      }
    });
  };*/

  function logout() {
    $auth.logout().then(() => {
      $state.go('logout');
    });
  };

};

export {
  DashboardComponent
}
