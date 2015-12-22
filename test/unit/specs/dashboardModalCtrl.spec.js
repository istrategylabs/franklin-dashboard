'use strict';

describe('DashboardModalComponent', function() {
  var franklinAPIServiceMock,
    $modalInstanceMock,
    $scope,
    $q,
    $rootScope;

  //Promises
  var registerRepoDeferred;

  //Controller  
  var createController;

  var repoMock = {
    "name": "proj1",
    "url": "https://github.com/isl/proj1",
    "github_id": 45678,
    "owner": {
      "name": "isl",
      "github_id": 78945
    }
  };

  // DEFINE MOCK SERVICES
  beforeEach(function() {
    module('franklin-dashboard');

    module('franklinAPIServiceMock');

    module(function($provide) {

      $provide.service('$modalInstance', function() {
        this.dismiss = jasmine.createSpy('dismiss');
        this.close = jasmine.createSpy('close');
      });

    });
  });

  //INJECT MOCK SERVICES
  beforeEach(inject(function(_$q_, $modalInstance, franklinAPIService) {

    $q = _$q_;

    $modalInstanceMock = $modalInstance;

    franklinAPIServiceMock = franklinAPIService;

    registerRepoDeferred = $q.defer();

    spyOn(franklinAPIServiceMock.userRepos, 'registerRepo')
      .and.callFake(function() {
        return {
          $promise: registerRepoDeferred.promise
        };
      });

  }));

  // CREATE CONTROLLER FUNCTION
  beforeEach(inject(function(_$rootScope_, $controller) {

    $rootScope = _$rootScope_;

    $scope = $rootScope.$new();
    createController = function() {
      return $controller('DashboardModalComponent', {
        $scope: $scope,
        franklinAPIService: franklinAPIServiceMock,
        $modalInstance: $modalInstanceMock
      });
    };

  }));

  //Test Controller
  var DashboardModalComponent;

  describe('DashboardModalComponent: register repo', function() {

    beforeEach(function() {
      DashboardModalComponent = createController();
    });

    it('should register repo', function() {
      DashboardModalComponent.registerRepo(repoMock);

      expect(franklinAPIServiceMock.userRepos.registerRepo).toHaveBeenCalled();

      registerRepoDeferred.resolve({});
      $rootScope.$apply();

      expect($modalInstanceMock.close).toHaveBeenCalled();
    });

    it('should dismiss modal when registration fails', function() {
      DashboardModalComponent.registerRepo(repoMock);

      expect(franklinAPIServiceMock.userRepos.registerRepo).toHaveBeenCalled();

      registerRepoDeferred.reject({});
      $rootScope.$apply();

      expect($modalInstanceMock.dismiss).toHaveBeenCalled();
    });
  });

});
