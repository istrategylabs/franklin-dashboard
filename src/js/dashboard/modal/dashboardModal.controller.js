'use strict';

function DashboardModalComponent($scope, $modalInstance, franklinAPIService) {

  const dmc = this;
  dmc.registeredRepo = {};

  const functions = {
    registerRepo,
    cancel,
    solve,
    error
  };
  
  Object.assign(dmc, functions);

  /**************************************************************************/

  function cancel() {
    $modalInstance.dismiss('cancel');
  };

  function error(data) {
    $modalInstance.dismiss(data);
  }

  function solve(data) {
    $modalInstance.close(dmc.registeredRepo);
  }

  function registerRepo(repo) {
    //create POST payload
    dmc.registeredRepo = {
      name: repo.name,
      github_id: repo.github_id,
      owner: {
        name: repo.owner.name,
        github_id: repo.owner.github_id
      }
    };
    //register repo in Franklin API
    let response =
      franklinAPIService.userRepos.registerRepo(dmc.registeredRepo);
    response.$promise.then(dmc.solve, dmc.error);
  }
}

export {
  DashboardModalComponent
}
