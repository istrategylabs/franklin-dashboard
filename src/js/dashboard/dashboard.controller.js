'use strict';

function DashboardComponent(franklinAPIService, $scope,
  $auth, toastr, $state, $modal, detailRepoService, franklinReposModel) {

  /* jshint validthis: true */
  const dc = this;

  const variables = {
    username: '',
    showLoader: false,
    deployedRepos: []
  }

  const functions = {
    getFranklinRepos,
    getDeployableRepos,
    listFranklinRepos,
    listDeployableRepos,
    logout,
    showRepoDetail,
    error
  };

  Object.assign(dc, variables, functions);

  //Scope used because of foundation modal directive
  $scope.deployableRepos = [];

  dc.getFranklinRepos();

  //watch changes in franklin repos model
  $scope.$watch(franklinReposModel.getFranklinRepos, (newValue, oldValue) => dc.deployedRepos = newValue);

  /**************************************************************************/

  function getFranklinRepos() {
    let repos = franklinAPIService.userRepos.getFranklinRepos();
    repos.$promise.then(dc.listFranklinRepos);
  };

  function getDeployableRepos() {
    dc.showLoader = true;
    let repos = franklinAPIService.userRepos.getDeployableRepos();
    repos.$promise.then(dc.listDeployableRepos,
      function(error) {
        //hide loader
        dc.showLoader = false;
        toastr.error(error, "Get deployable repos failed");
      });
  };

  function listFranklinRepos(data) {

    $state.go("logged.franklinRepos");

    //TODO: push if it doesn't exits
    dc.deployedRepos = franklinReposModel.getFranklinRepos();

    if (data.repos.length) {
      dc.username = data.user.username;
      franklinReposModel.setFranklinRepos(data.repos);
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
          if (data.repos.length) {
            let repos = data.repos;
            for (let repo of repos) {
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

    //hide loader
    dc.showLoader = false;

    //when the modal is closed, update franklin repos list
    modalInstance.result.then(function(repo) {
      franklinReposModel.addFranklinRepo(repo);
    }, function(data) {
      if (data.statusText) {
        toastr.error(data.statusText, "Repo regristation failed");
      }
      console.log("Modal was closed");
    });
  };

  function showRepoDetail(repo) {

    let payload = {
      github_id: repo.github_id
    };
    //get detail info repo from franklin 
    let response = franklinAPIService.userRepos.getRepo(payload);
    response.$promise.then((data) => {
      Object.assign(repo, data.repo);
      detailRepoService.setSelectedRepo(repo);
      $state.go('logged.detailInfo');
    }, dc.error);
  };

  function logout() {
    $auth.logout().then(() => {
      $state.go('logout');
    });
  };

  function error(error, message) {
    toastr.error(error, message);
  };

};

export {
  DashboardComponent
}
