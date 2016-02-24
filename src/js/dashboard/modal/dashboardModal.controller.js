'use strict';

function DashboardModalComponent($scope, $modalInstance, franklinAPIService,
    franklinReposModel) {

    const dmc = this;
    dmc.registeredRepo = {};
    dmc.showLoader = false;

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
        $modalInstance.close(dmc.registeredRepo);
        dmc.showLoader = false;
    }

    function registerRepo(repo) {
        dmc.showLoader = true;
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
