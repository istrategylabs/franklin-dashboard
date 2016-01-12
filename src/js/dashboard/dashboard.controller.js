'use strict';

function DashboardComponent(franklinAPIService, $scope,
  $auth, toastr, $state, $modal, detailRepoService, franklinReposModel) {

  /* jshint validthis: true */
  const dc = this;

  //variables
  dc.username = '';
  dc.showLoader = false;
  dc.deployedRepos = [];
  //Scope used because of foundation modal directive
  $scope.deployableRepos = [];

  //Functions
  dc.getFranklinRepos = getFranklinRepos;
  dc.getDeployableRepos = getDeployableRepos;
  dc.listFranklinRepos = listFranklinRepos;
  dc.listDeployableRepos = listDeployableRepos;
  dc.logout = logout;
  dc.showRepoDetail = showRepoDetail;

  dc.getFranklinRepos();

  //watch changes in franklin repos model
  $scope.$watch(franklinReposModel.getFranklinRepos,
    (newValue, oldValue) => dc.deployedRepos = newValue
  );

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

    if (data.length) {
      dc.username = data[0].owner.name;
      franklinReposModel.setFranklinRepos(data);
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
          if (data.length) {
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

    //hide loader
    dc.showLoader = false;

    //when the modal is closed, update franklin repos list
    modalInstance.result.then(function(repo) {
      //TODO: add only new repo - get info from API?
      dc.getFranklinRepos();
    }, function(data) {
      if (data.statusText) {
        toastr.error(data.statusText, "Repo regristation failed");
      }
      console.log("Modal was closed");
    });
  };

  function showRepoDetail(repo) {
    detailRepoService.setSelectedRepo(repo);
    $state.go('logged.detailInfo');
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
