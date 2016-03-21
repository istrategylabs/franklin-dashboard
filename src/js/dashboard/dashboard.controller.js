'use strict';

function DashboardComponent(franklinAPIService, $scope,
    $auth, toastr, $state, $modal, detailRepoService, franklinReposModel,
    $document, $location) {


    /* jshint validthis: true */
    const dc = this;

    const variables = {
        username: '',
        showLoader: false,
        deployedRepos: []
    }

    const functions = {
        getFranklinRepos,
        getDeployableRepos,
        listFranklinRepos,
        listDeployableRepos,
        logout,
        showRepoDetail,
        error
    };

    Object.assign(dc, variables, functions);

    //Scope used because of foundation modal directive
    $scope.deployableRepos = [];


    dc.getFranklinRepos();


    //watch changes in franklin repos model
    $scope.$watch(franklinReposModel.getFranklinRepos,
        (newValue, oldValue) => dc.deployedRepos = newValue,
        true);

    /**************************************************************************/

    function getFranklinRepos() {

        let repos = franklinAPIService.userRepos.getFranklinRepos();
        repos.$promise.then(dc.listFranklinRepos);
    };

    function getDeployableRepos() {

        dc.showLoader = true;
        let repos = franklinAPIService.userRepos.getDeployableRepos();
        repos.$promise.then(dc.listDeployableRepos,
            function(error) {
                //hide loader
                dc.showLoader = false;
                toastr.error(error.detail ? error.detail : error, 
                    "Get deployable repos failed");
            });
    };

    function listFranklinRepos(data) {
        if ($state.current.name == 'logged') {
            $state.go("logged.franklinRepos");
        }

        //TODO: push if it doesn't exits
        dc.deployedRepos = franklinReposModel.getFranklinRepos();
        //TODO: get username
        if (data.length) {
            franklinReposModel.setFranklinRepos(data);
        }
    };

    function listDeployableRepos(data) {

        //TODO: push if it doesn't exits
        $scope.deployableRepos = [];
        let modalInstance = $modal.open({
            templateUrl: 'dashboard/deployable-repos/deployable-repos.html',
            controller: 'DeployableReposComponent',
            controllerAs: 'dmc',
            scope: $scope,
            resolve: {
                deployableRepos: function() {
                    if (data.length) {
                        $scope.deployableRepos = data;
                    }
                    return $scope.deployableRepos;
                }
            }
        });

        //hide loader
        dc.showLoader = false;

        //when the modal is closed, update franklin repos list
        modalInstance.result.then(function(repo) {
            let payload = {
                github_id: repo.github_id
            };
            //get detail info repo from franklin 
            //TODO: remove this once we get info from register itself
            let responseRepo = franklinAPIService.userRepos.getRepo(payload);
            responseRepo.$promise.then((res) => {
                franklinReposModel.addFranklinRepo(res);
            }, dc.error);

        }, function(data) {
            if (data.statusText) {
                toastr.error(data.statusText, "Repo regristation failed");
            }
            console.log("Modal was closed");
        });
    };

    function showRepoDetail(repo) {

        let payload = {
            github_id: repo.github_id
        };
        //get detail info repo from franklin 
        let response = franklinAPIService.userRepos.getRepo(payload);
        response.$promise.then((data) => {
            Object.assign(repo, data);
            detailRepoService.setSelectedRepo(repo);
            $location.path(`/dashboard/detail/${repo.github_id}`);
        }, dc.error);
    };

    function logout() {

        $auth.logout().then(() => {
            $state.go('logout');
        });
    };

    function error(error, message) {
        toastr.error(error.data ? error.data.error : error.detail ? 
            error.detail : error, message);
    };
};

export {
    DashboardComponent
}
