'use strict';
//Common setup
var {
    setup,
    $authMock,
    toastrMock,
    $stateMock,
    $modalMock,
    franklinAPIServiceMock,
    franReposModel,
    $mockDataService,
    franklinReposDeferred,
    getRepoDeferred,
    deployableReposDeferred,
    registerRepoDeferred,
    modalDeferred
} = require('../setup.test.js');

//Local variables
var createController;
var DashboardComponent;
var $rootScope;
var $scope;      
var $q;

describe('DashboardComponent', function() {

    // DEFINE MOCK SERVICES AND SETUP
    setup();

    // CREATE CONTROLLER FUNCTION WITH MOCK SERVICES
    beforeEach(inject(function(_$rootScope_, $controller) {

        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();

        createController = function() {
            return $controller('DashboardComponent', {
                $scope: $scope,
                franklinAPIService: franklinAPIServiceMock(),
                $auth: $authMock(),
                toastr: toastrMock(),
                $state: $stateMock(),
                $modal: $modalMock(),
            });
        };

    }));

    beforeEach(function() {
        DashboardComponent = createController();
        franklinReposDeferred().resolve($mockDataService().deployedRepo);

    });

    describe('DashboardComponent: initial state', function() {

        it('Should get Franklin Repos', function() {
            expect(franklinAPIServiceMock().userRepos.getFranklinRepos)
                .toHaveBeenCalled();
        });

        it('should set the response from FranklinApiService to controller.',
            function() {
                $rootScope.$apply();
                expect(JSON.stringify(DashboardComponent.deployedRepos))
                    .toEqual(JSON.stringify($mockDataService().deployedRepo));
            });
    });

    describe('DashboardComponent: Get Deployable Repos', function() {

        it('get deployable repos should show loader', function() {
            expect(DashboardComponent.showLoader).toBe(false);
            DashboardComponent.getDeployableRepos();
            expect(DashboardComponent.showLoader).toBe(true);
        });

        it('Should show error message after failing getting the deployable repos',
            function() {
                DashboardComponent.getDeployableRepos();

                deployableReposDeferred().reject("error");
                $rootScope.$apply();

                //Loader Should be hidden
                expect(DashboardComponent.showLoader).toBe(false);

                //After getting deployable repos modal Should open
                expect(toastrMock().error).toHaveBeenCalled();
            });

        it('Should logout', function() {

            DashboardComponent.logout();
            $rootScope.$apply();

            //After auth logout it Should change state
            expect($stateMock().go).toHaveBeenCalledWith('logout');
        });
    });

    describe('DashboardComponent: register repo', function() {

        it('Should not get the entire franklin repo list again after registering',
            function() {

                //it should call get Franklin Repos to update list
                expect(franklinAPIServiceMock().userRepos.getFranklinRepos)
                    .toHaveBeenCalled();

                DashboardComponent.getDeployableRepos();

                deployableReposDeferred().resolve($mockDataService().deployableRepos);
                $rootScope.$apply();

                //Loader should be hidden
                expect(DashboardComponent.showLoader).toBe(false);

                //After getting deployable repos modal should open
                expect($modalMock().open).toHaveBeenCalled();

                //we select one repo from modal
                modalDeferred().resolve($mockDataService().newRepo);
                getRepoDeferred().resolve($mockDataService().completeRepo);
                $rootScope.$apply();

                //we assumed here that modal calls register repo from franklin api
                //and it succeded 

                //should add new repo to existing deployable repos list
                expect(franReposModel().addFranklinRepo).toHaveBeenCalledWith($mockDataService().completeRepo);

                //franklin repo list should be updated
                expect(JSON.stringify(DashboardComponent.deployedRepos))
                    .toEqual(JSON.stringify($mockDataService().updatedFranklinRepos));

                //shouldnt get all repos again
                expect(franklinAPIServiceMock().userRepos.getFranklinRepos.calls.count())
                    .toEqual(1);
            });
    });
});
