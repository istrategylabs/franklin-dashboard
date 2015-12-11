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
    if (data.length > 0) {
      dc.username = data[0].owner.name;
      for (var i = data.length - 1; i >= 0; i--) {
        var repo = data[i];
        dc.deployedRepos.push({
          "name": repo.name,
          "environment": repo.environments.length > 0 ? repo.environments[0].name : "",
          "status": repo.environments.length > 0 ? repo.environments[0].status : ""
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
