'use strict';

function DetailComponent($scope, detailRepoService, franklinAPIService,
  $modal, $state, toastr, franklinReposModel) {

  /* jshint validthis: true */
  const dec = this;

  var functions = {
    error: error,
    deleteRepo: deleteRepo,
    deployRepo: deployRepo
  }
  Object.assign(dec, functions);

  dec.repo = detailRepoService.getSelectedRepo();

  //TODO: find a way to send texts that is not scope related
  $scope.modalTitle = 'Delete Repo';
  $scope.modalMessage = 'Are you sure you want to delete this repository?';

  /**************************************************************************/

  function deleteRepo() {

    let modalInstance = $modal.open({
      templateUrl: 'common/confirmationModal.html',
      controller: 'ConfirmModalComponent',
      controllerAs: 'cmc',
      scope: $scope
    });

    modalInstance.result.then(function(answer) {
      if (answer === 'ok') {
        let payload = {
          github_id: dec.repo.github_id
        };
        //delete repo in franklin 
        let response =
          franklinAPIService.userRepos.deleteRepo(payload);
        response.$promise.then(() => {
          franklinReposModel.removeFranklinRepo(dec.repo);
          $state.go("logged.franklinRepos");
        }, dec.error);
      }

    }, dec.error);
  };

  function deployRepo(){
    toastr.info("Not implemented yet", ":(");
  }

  function error(error) {
    if (error && error != 'backdrop click') {
      toastr.error(error, "Failed to delete repository");
    }
  }
};

export {
  DetailComponent
}
