'use strict';

function DashboardComponent(franklinAPIService, $scope, $location,
  $auth, toastr, ENV, $httpParamSerializer, $state) {
  /* jshint validthis: true */
  let dc = this;
  dc.getFranklinRepos = getFranklinRepos;
  dc.listFranklinRepos = listFranklinRepos;

  dc.getFranklinRepos();

  function getFranklinRepos() {
    let repos = franklinAPIService.userRepos().getFranklinRepos();
    repos.$promise.then(dc.listFranklinRepos);
  };

  function listFranklinRepos(data) {
    alert(data);
  };
};

export {
  DashboardComponent
}
