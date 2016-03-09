'use strict';

function DetailComponent($scope, detailRepoService, franklinAPIService,
    $modal, $state, toastr, franklinReposModel, $window, environmentsService) {

    /* jshint validthis: true */
    const dec = this;

    const functions = {
        error,
        deleteRepo,
        deployRepo,
        viewSite,
        newEnv,
        deleteEnv,
        updateRepo
    };

    Object.assign(dec, functions);

    dec.repo = detailRepoService.getSelectedRepo();
    dec.environmentsService = environmentsService;

    dec.repo.environments.map((env, index) => {
        dec.environmentsService.setCurrentEnv(dec.repo, index);
    });

    //Production first
    environmentsService.reorderEnvs(dec.repo);

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
            dec.updateRepo();
        }, dec.error);

    }

    function viewSite() {
        $window.open('http://' + dec.repo.environments[0].url, '_blank');
    }

    function newEnv() {
        if (environmentsService.getNextEnv(dec.repo)) {
            let payload = {
                github_id: dec.repo.github_id
            };

            let response =
                franklinAPIService.environments.addEnvironment(payload);
            response.$promise.then(() => {
                //update current env
                dec.environmentsService.forwardEnv(dec.repo);
                dec.updateRepo();

            }, dec.error);
        }
    }

    function deleteEnv() {
        if (dec.repo.environments.length > 1) {
            let payload = {
                github_id: dec.repo.github_id
            };

            let response =
                franklinAPIService.environments.removeEnvironment(payload);
            response.$promise.then(() => {
                //update current env
                dec.environmentsService.rewindEnv(dec.repo);
                dec.updateRepo();

            }, dec.error);
        }
    }

    function error(error) {
        if (error && error != 'backdrop click') {
            toastr.error(error, "Failed to process repository");
        }
    }

    function updateRepo() {

        let payload = {
            github_id: dec.repo.github_id
        };

        //get detail info repo from franklin 
        let responseRepo = franklinAPIService.userRepos.getRepo(payload);
        responseRepo.$promise.then((data) => {
            Object.assign(dec.repo, data.repo);

            //Production first
            environmentsService.reorderEnvs(dec.repo);

            franklinReposModel.updateFranklinRepo(dec.repo);

        }, dec.error);
    }
};

export {
    DetailComponent
}
