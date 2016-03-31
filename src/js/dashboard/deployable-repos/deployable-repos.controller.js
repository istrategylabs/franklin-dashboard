'use strict';

function DeployableReposComponent($scope, $modalInstance, franklinAPIService,
    franklinReposModel) {

    const dmc = this;
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
        $modalInstance.close(data);
        dmc.showLoader = false;
    }

    function registerRepo(repo, index) {

        dmc.showLoader = true;
        dmc.showLoaders[index] = true;

        //create POST payload
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
