'use strict';

function DashboardComponent(franklinAPIService, $scope, $location,
  $auth, toastr, ENV, $httpParamSerializer, $state) {
  /* jshint validthis: true */
  let dc = this;
  dc.username = "";
  dc.deployedRepos = [];

  dc.getFranklinRepos = getFranklinRepos;
  dc.listFranklinRepos = listFranklinRepos;
  dc.logout = logout;

  dc.getFranklinRepos();

  function getFranklinRepos() {
    let repos = franklinAPIService.userRepos().getFranklinRepos();
    repos.$promise.then(dc.listFranklinRepos);
  };

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

  function logout() {
    $auth.logout().then(() => {
      $state.go('logout');
    });
  };

};

export {
  DashboardComponent
}
