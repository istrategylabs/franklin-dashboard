'use strict';

describe('GithubReposComponent', function() {

    var {
        setup,
        franklinAPIServiceMock,
        $mockDataService,
        registerRepoDeferred,
        $modalInstanceMock
    } = require('../setup.test.js');

    setup();

    //Controller  
    var createGithubController;
    var $rootScope;
    var $scope;
    var $q;
    //Test Controller
    var GithubReposComponent;

    // CREATE CONTROLLER FUNCTION
    beforeEach(inject(function(_$rootScope_, $controller) {

        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();

        $scope.deployableRepos = $mockDataService().deployableRepos;

        createGithubController = function() {
            return $controller('GithubReposComponent', {
                $scope: $scope,
                franklinAPIService: franklinAPIServiceMock(),
                $modalInstance: $modalInstanceMock(),
            });
        };
    }));

    describe('GithubReposComponent: register repo', function() {

        beforeEach(function() {
            GithubReposComponent = createGithubController();
        });

        it('should register repo', function() {

            GithubReposComponent.registerRepo($mockDataService().githubRepo, 0);

            expect(franklinAPIServiceMock().userRepos.registerRepo).toHaveBeenCalled();

            registerRepoDeferred().resolve({});
            $rootScope.$apply();

            expect($modalInstanceMock().close).toHaveBeenCalled();
        });

        it('should dismiss modal when registration fails', function() {
            GithubReposComponent.registerRepo($mockDataService().githubRepo, 0);

            expect(franklinAPIServiceMock().userRepos.registerRepo).toHaveBeenCalled();

            registerRepoDeferred().reject({});
            $rootScope.$apply();

            expect($modalInstanceMock().dismiss).toHaveBeenCalled();
        });
    });

});
