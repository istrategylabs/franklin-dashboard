'use strict';

function DeployableReposComponent($scope, $modalInstance, franklinAPIService,
    franklinReposModel) {

    const dmc = this;
    dmc.registeredRepo = {};
    dmc.showLoader = false;
    dmc.showLoaders = new Array($scope.deployableRepos.length);
    dmc.showLoaders.map((x) => x = false);

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
        dmc.showLoader = false;
    };

    function error(data) {
        $modalInstance.dismiss(data);
        dmc.showLoader = false;
    }

    function solve(data) {
        dmc.showLoaders.map((x) => x = false);
        $modalInstance.close(dmc.registeredRepo);
        dmc.showLoader = false;
    }

    function registerRepo(repo, index) {
        dmc.showLoader = true;
        dmc.showLoaders[index] = true;
        //create POST payload
        dmc.registeredRepo = {
            name: repo.name,
            github_id: repo.id,
            owner: {
                name: repo.owner.login,
                github_id: repo.owner.id
            }
        };
        let payload = {
            github: `${repo.full_name}`
        }
        //register repo in Franklin API
        let response =
            franklinAPIService.userRepos.registerRepo(payload);
        response.$promise.then(dmc.solve, dmc.error);
    }
}

export {
    DeployableReposComponent
}
