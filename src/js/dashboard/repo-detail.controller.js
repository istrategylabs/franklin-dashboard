'use strict';

function DetailComponent($scope, detailRepoService, franklinAPIService,
    $modal, $state, toastr, franklinReposModel, $window) {

    /* jshint validthis: true */
    const dec = this;

    const functions = {
        error,
        deleteRepo,
        deployRepo,
        viewSite
    };

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

    function deployRepo(index) {

        let payload = {
            github_id: dec.repo.github_id,
            branch: dec.repo.environments[index].current_deploy.default_branch,
            git_hash: dec.repo.environments[index].current_deploy.git_hash
        };

        //deploy repo in franklin 
        let response =
            franklinAPIService.userRepos.deployRepo(payload);
        response.$promise.then((data) => {
            //TODO: remove this once we get info from deploy itself
            let payloadRepo = {
                github_id: dec.repo.github_id
            };
            //get detail info repo from franklin 
            let responseRepo = franklinAPIService.userRepos.getRepo(payloadRepo);
            responseRepo.$promise.then((data) => {
                Object.assign(dec.repo, data.repo);
                franklinReposModel.updateFranklinRepo(dec.repo);
            }, dec.error);
        }, dec.error);

    }

    function viewSite(){
      $window.open('http://' + dec.repo.environments[0].url, '_blank');
    }

    function error(error) {
        if (error && error != 'backdrop click') {
            toastr.error(error, "Failed to process repository");
        }
    }
};

export {
    DetailComponent
}
