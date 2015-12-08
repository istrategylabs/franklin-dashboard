'use strict';

function DashboardComponent(franklinAPIService, $scope, $location,
  $auth, toastr, ENV, $httpParamSerializer, $state, $modal) {
  /* jshint validthis: true */
  const dc = this;
  dc.element = undefined; //to be defined by directive
  dc.username = '';
  dc.deployedRepos = [];
  $scope.deployableRepos = [];//Scope used because of foundation modal directive

  dc.getFranklinRepos = getFranklinRepos;
  dc.getDeployableRepos = getDeployableRepos;
  dc.listFranklinRepos = listFranklinRepos;
  dc.listDeployableRepos = listDeployableRepos;
  dc.logout = logout;


  dc.getFranklinRepos();

  function getFranklinRepos() {
    let repos = franklinAPIService.userRepos().getFranklinRepos();
    repos.$promise.then(dc.listFranklinRepos);
  };

  function getDeployableRepos() {
    let repos = franklinAPIService.userRepos().getDeployableRepos();
    repos.$promise.then(dc.listDeployableRepos);
  };

  function listFranklinRepos(data) {
    //TODO: push if it doesn't exits
    dc.deployedRepos = [];
    if (data.length > 0) {
      dc.username = data[0].owner.name;
      for (let repo of data) {
        dc.deployedRepos.push({
          name: repo.name,
          environment: repo.environments.length > 0 ? 
          repo.environments[0].name : '',
          status: repo.environments.length > 0 ? 
          repo.environments[0].status : '',
          owner: repo.owner.name
        });
      };
    }
  };

  function listDeployableRepos(data) {
    //TODO: push if it doesn't exits
    $scope.deployableRepos = [];
    let modalInstance = $modal.open({
      templateUrl: 'dashboard/modal/listDeployableRepos.html',
      controller: 'DashboardModalComponent',
      scope: $scope,
      resolve: {
        deployableRepos: function() {
          if (data.length > 0) {
            dc.username = data[0].owner.name;
            for (let repo of data) {
              $scope.deployableRepos.push({
                name: repo.name,
                url: repo.url,
                owner: repo.owner.name
              });
            };
          }
          return $scope.deployableRepos;
        }
      }
    });
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
