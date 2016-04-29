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
    }

    $scope.$watch(dec.repo.build,
        (newValue, oldValue) => { 
            updateIndicators();           
        }, true);

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
            github_id: dec.repo.github_id
        };
        
        //deploy repo in franklin 
        let response =
            franklinAPIService.userRepos.deployRepo(payload);
        response.$promise.then((build) => {
            dec.repo.build = build;
            updateIndicators();

            if(build.status === `success`){
                dec.repo.environments[index].build = build;
            }
            
        }, (error) => {
            if(error.status == 503){
                dec.repo.build = error.data.build;
            }
            dec.error(error);
        });
    }

    function viewSite(environment) {
        $window.open('http://' + environment.url, '_blank');
    }

    function promoteRepo(index) {

        if (dec.environmentsService.envHasBuild(dec.repo.environments[index])) {

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
                        env: dec.repo.environments[index + 1].name.toLowerCase(),
                        git_hash: dec.repo.environments[index].build.git_hash
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

            updateIndicators();

        }, dec.error);
    }

    function updateIndicators(){
        dec.failedBuild = angular.equals({}, dec.repo.build) ? false :
            (dec.repo.build.status ? dec.repo.build.status == `failed` 
            : false);
        dec.showDeployButton = !dec.failedBuild 
            && angular.equals({}, dec.repo.build) ? true : 
            (dec.repo.build.status ? !dec.repo.build.status === 'building' : true);  
    }

    function error(error) {
        if (error && error != 'backdrop click') {
            toastr.error(error.data ? error.data.detail : error.data.error ?
                error.data.error : error, "Failed to process repository");
        }
    }

};

export {
    DetailComponent
}
