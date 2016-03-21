'use strict';

function DetailComponent($scope, detailRepoService, franklinAPIService,
    $modal, $state, toastr, franklinReposModel, $window, environmentsService,
    $stateParams) {

    /* jshint validthis: true */
    const dec = this;
    dec.environmentsService = environmentsService;

    const functions = {
        error,
        deleteRepo,
        deployRepo,
        viewSite,
        newEnv,
        deleteEnv,
        updateRepo,
        promoteRepo
    };

    Object.assign(dec, functions);

    let github_id = $state.params.githubId;
    dec.repo = detailRepoService.getSelectedRepo();

    if (String(dec.repo.github_id) != github_id && github_id) {
        dec.repo.github_id = github_id;
        dec.updateRepo();
    } else {
        //reorder envs - Production first
        environmentsService.reorderEnvs(dec.repo);
        dec.repo.environments.map((env, index) => {
            dec.environmentsService.setCurrentEnv(dec.repo, index);
        });
    }

    /**************************************************************************/

    function deleteRepo() {
        //TODO: find a way to send texts that is not scope related
        $scope.modalTitle = 'Delete Repo';
        $scope.modalMessage = 'Are you sure you want to delete this repository?';

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
            branch: dec.repo.environments[index].build.branch,
            git_hash: dec.repo.environments[index].build.git_hash
        };

        //deploy repo in franklin 
        let response =
            franklinAPIService.userRepos.deployRepo(payload);
        response.$promise.then((data) => {
            dec.updateRepo();
        }, dec.error);
    }

    function viewSite(environment) {
        $window.open('http://' + environment.url, '_blank');
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

    function promoteRepo(index) {
        //TODO: find a way to send texts that is not scope related
        $scope.modalTitle = 'Promote';
        $scope.modalMessage = `Are you sure you want to promote from 
            ${dec.repo.environments[index].name} to 
            ${dec.repo.environments[index + 1].name}?`;

        let modalInstance = $modal.open({
            templateUrl: 'common/confirmationModal.html',
            controller: 'ConfirmModalComponent',
            controllerAs: 'cmc',
            scope: $scope
        });

        modalInstance.result.then(function(answer) {
            if (answer === 'ok') {
                let payload = {
                    github_id: dec.repo.github_id,
                    env: dec.repo.environments[index].name.toLowerCase()
                };
                //promote in franklin 
                let response =
                    franklinAPIService.environments.promote(payload);
                response.$promise.then(() => {
                    dec.updateRepo();
                }, dec.error);
            }

        }, dec.error);
    }

    function updateRepo() {
        let payload = {
            github_id: dec.repo.github_id
        };

        //get detail info repo from franklin 
        let responseRepo = franklinAPIService.userRepos.getRepo(payload);
        responseRepo.$promise.then((data) => {

            Object.assign(dec.repo, data);

            //reorder envs - Production first
            environmentsService.reorderEnvs(dec.repo);

            franklinReposModel.updateFranklinRepo(dec.repo);

            dec.repo.environments.map((env, index) => {
                dec.environmentsService.setCurrentEnv(dec.repo, index);
            });

        }, dec.error);
    }

    function error(error) {
        if (error && error != 'backdrop click') {
            toastr.error(error.data ? error.data.error : error.detail ?
                error.detail : error, "Failed to process repository");
        }
    }

};

export {
    DetailComponent
}
