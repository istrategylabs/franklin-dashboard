'use strict';

describe('DetailComponent', function() {

  var toastrMock;
  var $stateMock;
  var $modalMock;
  var franklinAPIServiceMock;
  var $scope;
  var $q;
  var $rootScope;

  //Controller  
  var createController;
  var detailRepoServiceMock;

  //Promises
  var deleteRepoDeferred;
  var selectedRepoDeferred;

  var mockRepo = {
    "name": "proj1",
    "environments": [{
      "name": "Production",
      "url": "proj1.islstatic.com",
      "status": "REG"
    }],
    "owner": "isl"
  };

  // TODO: Refactor mock services to reuse in another file 
  // DEFINE MOCK SERVICES
  beforeEach(function() {
    module('franklin-dashboard');

    module(function($provide) {

      $provide.factory('detailRepoService', function() {

        function getSelectedRepo() {};

        function setSelectedRepo(repo) {};

        return {
          getSelectedRepo: getSelectedRepo,
          setSelectedRepo: setSelectedRepo
        };
      });

      $provide.service('$state', function() {
        this.go = jasmine.createSpy('go');
      });

      $provide.service('toastr', function() {
        this.error = jasmine.createSpy('error');
      });

      $provide.service('$modal', function() {
        this.open = jasmine.createSpy('open')
          .and.callFake(function() {
            selectedRepoDeferred = $q.defer();
            return {
              result: selectedRepoDeferred.promise
            };
          })
      });
    });
  });

  //INJECT MOCK SERVICES
  beforeEach(inject(function(_$q_, toastr, $state,
    $modal, franklinAPIService, detailRepoService) {

    $q = _$q_;

    toastrMock = toastr;
    $modalMock = $modal;
    //mockPromises = mockPromises;
    $stateMock = $state;

    detailRepoServiceMock = detailRepoService;

    spyOn(detailRepoServiceMock, 'getSelectedRepo')
      .and.callFake(function() {
        return mockRepo;
      });

    spyOn(detailRepoServiceMock, 'setSelectedRepo')
      .and.callThrough();


    //Mock franklinAPI service, spy on functions
    franklinAPIServiceMock = franklinAPIService;

    deleteRepoDeferred = $q.defer();

    spyOn(franklinAPIServiceMock.userRepos, 'deleteRepo')
      .and.callFake(function() {
        return {
          $promise: deleteRepoDeferred.promise
        };
      });

  }));

  // CREATE CONTROLLER FUNCTION
  beforeEach(inject(function(_$rootScope_, $controller) {

    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();

    createController = function() {
      return $controller('DetailComponent', {
        $scope: $scope,
        detailRepoService: detailRepoServiceMock,
        franklinAPIService: franklinAPIServiceMock,
        $modal: $modalMock,
        $state: $stateMock,
        toast: toastrMock
      });
    };

  }));

  //Test Controller
  var DetailComponent;

  describe('DetailComponent: initial state', function() {

    beforeEach(function() {
      DetailComponent = createController();
    });

    it('should get selected repo and save it in the Controller', function() {
      expect(detailRepoServiceMock.getSelectedRepo).toHaveBeenCalled();
      $rootScope.$apply();
      expect(JSON.stringify(DetailComponent.repo))
        .toEqual(JSON.stringify(mockRepo));
    });
  });

  describe('DetailComponent: delete repo', function() {

    beforeEach(function() {
      DetailComponent = createController();
    });

    it('should show modal with confirmation message', function() {

      DetailComponent.deleteRepo();

      //Confirmation modal should open
      expect($modalMock.open).toHaveBeenCalled();

    });

    it('should call franklin delete repo if confirmed', function() {

      DetailComponent.deleteRepo();

      //select one repo from modal
      selectedRepoDeferred.resolve('ok');
      $rootScope.$apply();

      //it should call get Franklin Repos to update list
      expect(franklinAPIServiceMock.userRepos.deleteRepo)
        .toHaveBeenCalled();
    });

    it('should stay in detail page if confirmation canceled', function() {
      DetailComponent.deleteRepo();

      //select one repo from modal
      selectedRepoDeferred.reject('cancel');
      $rootScope.$apply();

      expect($stateMock.go).not.toHaveBeenCalled();

    });

    it('should redirect to franklin repo list if repo deleted', function() {
      DetailComponent.deleteRepo();

      //select one repo from modal
      selectedRepoDeferred.resolve('ok');

      //dele repo success 
      deleteRepoDeferred.resolve({});
      $rootScope.$apply();

      //should redirect to franklin repo listing page
      expect($stateMock.go).toHaveBeenCalledWith('logged.franklinRepos');
    });

    it('should show error message when delete repo fails', function() {

      DetailComponent.deleteRepo();

      //select one repo from modal
      selectedRepoDeferred.resolve('ok');
      //dele repo fails
      deleteRepoDeferred.reject('error');
      $rootScope.$apply();

      //should show error message 
      expect(toastrMock.error).toHaveBeenCalled();

    });
  });

});
