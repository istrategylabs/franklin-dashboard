'use strict';

describe('DetailComponent', function() {

    var {
        setup,
        $authMock,
        toastrMock,
        $stateMock,
        $modalMock,
        franklinAPIServiceMock,
        detailRepoServiceMock,
        franReposModel,
        $mockDataService,
        franklinReposDeferred,
        modalDeferred,
        deleteRepoDeferred
    } = require('../setup.test.js');

    var $scope;
    var $q;
    var $rootScope;
    var createDetailController;

    setup();

    // CREATE CONTROLLER FUNCTION
    beforeEach(inject(function(_$rootScope_, $controller) {

        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();

        createDetailController = function() {
            return $controller('DetailComponent', {
                $scope: $scope,
                detailRepoService: detailRepoServiceMock(),
                franklinAPIService: franklinAPIServiceMock(),
                $modal: $modalMock(),
                $state: $stateMock(),
                toast: toastrMock()
            });
        };
    }));

    //Test Controller
    var DetailComponent;

    beforeEach(function() {
        DetailComponent = createDetailController();
    });

    describe('DetailComponent: initial state', function() {

        it('should get selected repo and save it in the Controller', function() {
            expect(detailRepoServiceMock().getSelectedRepo).toHaveBeenCalled();
            $rootScope.$apply();
            expect(JSON.stringify(DetailComponent.repo))
                .toEqual(JSON.stringify($mockDataService().completeRepo));
        });
    });

    describe('DetailComponent: delete repo', function() {

        it('should show modal with confirmation message', function() {

            DetailComponent.deleteRepo();
            //Confirmation modal should open
            expect($modalMock().open).toHaveBeenCalled();

        });

        it('should call franklin delete repo if confirmed', function() {

            DetailComponent.deleteRepo();

            //select one repo from modal
            modalDeferred().resolve('ok');
            $rootScope.$apply();

            //it should call get Franklin Repos to update list
            expect(franklinAPIServiceMock().userRepos.deleteRepo)
                .toHaveBeenCalled();
        });

        it('should stay in detail page if confirmation canceled', function() {
            DetailComponent.deleteRepo();

            //select one repo from modal
            modalDeferred().resolve('cancel');
            $rootScope.$apply();

            expect($stateMock().go).not.toHaveBeenCalled();

        });

        it('should redirect to franklin repo list if repo deleted', function() {
            DetailComponent.deleteRepo();

            //select one repo from modal
            modalDeferred().resolve('ok');

            //dele repo success 
            deleteRepoDeferred().resolve({});
            $rootScope.$apply();

            //should redirect to franklin repo listing page
            expect($stateMock().go).toHaveBeenCalledWith('logged.franklinRepos');
        });

        it('should show error message when delete repo fails', function() {

            DetailComponent.deleteRepo();

            //select one repo from modal
            modalDeferred().resolve('ok');
            //dele repo fails
            deleteRepoDeferred().reject({data: {error: 'error'}});
            $rootScope.$apply();

            //should show error message 
            expect(toastrMock().error).toHaveBeenCalled();

        });
    });

});
