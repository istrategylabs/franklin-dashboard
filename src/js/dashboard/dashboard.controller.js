'use strict';

function DashboardComponent(franklinAPIService, $scope, $location,
  $auth, toastr, ENV, $httpParamSerializer, $state, $modal) {
  /* jshint validthis: true */
  const dc = this;
  dc.username = '';
  dc.showLoader = false;
  dc.deployedRepos = [];
  $scope.deployableRepos = []; //Scope used because of foundation modal directive

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
    dc.showLoader = true;
    let repos = franklinAPIService.userRepos().getDeployableRepos();
    repos.$promise.then(dc.listDeployableRepos);
  };

  function listFranklinRepos(data) {
    //TODO: push if it doesn't exits
    dc.deployedRepos = [];

    if (data.length > 0) {
      dc.username = data[0].owner.name;
      for (let repo of data) {
        const numEnv = repo.environments.length;
        const firstEnv = repo.environments[0];

        dc.deployedRepos.push({
          name: repo.name,
          environment:  numEnv > 0 ? firstEnv.name : '',
          status: numEnv > 0 ? firstEnv.status : '',
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
      controllerAs: 'dmc',
      scope: $scope,
      resolve: {
        deployableRepos: function() {
          if (data.length > 0) {
            dc.username = data[0].owner.name;
            for (let repo of data) {
              $scope.deployableRepos.push({
                name: repo.name,
                url: repo.url,
                github_id: repo.id,
                owner: {
                  name: repo.owner.name,
                  github_id: repo.owner.id
                }
              });
            };
          }
          return $scope.deployableRepos;
        }
      }
    });

    dc.showLoader = false;

    modalInstance.result.then(function(repo) {
      dc.getFranklinRepos()
      // dc.deployedRepos.push({
      //   name: repo.name,
      //   environment: '',
      //   status: '',
      //   owner: repo.owner.name
      // });

    }, function(data) {
      toastr.error(data.statusText, "Repo regristation failed");
      console.log("Modal was closed");
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
