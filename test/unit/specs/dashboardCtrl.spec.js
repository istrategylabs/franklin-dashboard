'use strict';

describe('DashboardComponent', function() {
  var $authMock,
    toastrMock,
    $stateMock,
    $modalMock,
    franklinAPIServiceMock,
    $scope,
    $q,
    $rootScope;

  //Promises
  var passLogoutPromise,
    franklinReposDeferred,
    deployableReposDeferred,
    registerRepoDeferred,
    selectedRepoDeferred;

  //Controller  
  var createController;

  //Mock data
  var mockFranklinResponse = [{
      "name": "proj1",
      "github_id": 54435345,
      "owner": {
        "name": "isl",
        "github_id": 45435345
      },
      "environments": [{
        "name": "Production",
        "url": "",
        "status": "REG"
      }]
    }, {
      "name": "proj2",
      "github_id": 3543543,
      "owner": {
        "name": "isl",
        "github_id": 345435
      },
      "environments": [{
        "name": "Production",
        "url": "",
        "status": "REG"
      }]
    }, {
      "name": "proj3",
      "github_id": 45445435,
      "owner": {
        "name": "isl",
        "github_id": 45345
      },
      "environments": [{
        "name": "Production",
        "url": "",
        "status": "REG"
      }]
    }],
    savedFranklinRepos = [{
      "name": "proj1",
      "environment": "Production",
      "status": "REG",
      "owner": "isl"
    }, {
      "name": "proj2",
      "environment": "Production",
      "status": "REG",
      "owner": "isl"
    }, {
      "name": "proj3",
      "environment": "Production",
      "status": "REG",
      "owner": "isl"
    }],
    deployedReposResolve = [{
      "name": "proj1",
      "url": "https://github.com/isl/proj1",
      "id": 54543,
      "owner": {
        "name": "isl",
        "id": 3454543
      },
      "permissions": {
        "admin": true
      }
    }, {
      "name": "proj2",
      "url": "https://github.com/isl/proj2",
      "id": 543534534,
      "owner": {
        "name": "isl",
        "id": 45435435
      },
      "permissions": {
        "admin": true
      }
    }];

  // DEFINE MOCK SERVICES
  beforeEach(function() {
    module('franklin-dashboard');

    module('franklinAPIServiceMock');

    module(function($provide) {

      $provide.factory('$auth', ['$q', function($q) {
        function logout() {
          if (passLogoutPromise) {
            return $q.resolve();
          } else {
            return $q.reject();
          }
        }
        return {
          logout: logout
        };

      }]);

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
  beforeEach(inject(function(_$q_, $auth, toastr, $state,
    $modal, franklinAPIService) {

    $q = _$q_;

    $authMock = $auth;
    spyOn($auth, 'logout').and.callThrough();

    toastrMock = toastr;
    $modalMock = $modal;
    $stateMock = $state;

    //Mock franklinAPI service, spy on functions
    franklinAPIServiceMock = franklinAPIService;

    franklinReposDeferred = $q.defer();
    deployableReposDeferred = $q.defer();
    registerRepoDeferred = $q.defer();

    spyOn(franklinAPIServiceMock.userRepos, 'getFranklinRepos')
      .and.callFake(function() {
        return {
          $promise: franklinReposDeferred.promise
        };
      });

    spyOn(franklinAPIServiceMock.userRepos, 'getDeployableRepos')
      .and.callFake(function() {
        return {
          $promise: deployableReposDeferred.promise
        };
      });

    spyOn(franklinAPIServiceMock.userRepos, 'registerRepo')
      .and.callFake(function() {
        return {
          $promise: registerRepoDeferred.promise
        };
      });


  }));

  // CREATE CONTROLLER FUNCTION WITH MOCK SERVICES
  beforeEach(inject(function(_$rootScope_, $controller) {

    $rootScope = _$rootScope_;

    $scope = $rootScope.$new();
    createController = function() {
      return $controller('DashboardComponent', {
        $scope: $scope,
        franklinAPIService: franklinAPIServiceMock,
        $auth: $authMock,
        toastr: toastrMock,
        $state: $stateMock,
        $modal: $modalMock
      });
    };

  }));

  //Test Controller
  var DashboardComponent;

  describe('DashboardComponent: initial state', function() {

    beforeEach(function() {
      DashboardComponent = createController();
      franklinReposDeferred.resolve(mockFranklinResponse);
    });

    it('should get Franklin Repos', function() {
      expect(franklinAPIServiceMock.userRepos.getFranklinRepos)
        .toHaveBeenCalled();
    });

    it('should set the response from FranklinApiService to controller.',
      function() {
        $rootScope.$apply();
        expect(JSON.stringify(DashboardComponent.deployedRepos))
          .toEqual(JSON.stringify(savedFranklinRepos));
      });
  });

  describe('DashboardComponent: Get Deployable Repos', function() {

    beforeEach(function() {
      DashboardComponent = createController();
      franklinReposDeferred.resolve(mockFranklinResponse);
    });

    it('get deployable repos should show loader', function() {
      expect(DashboardComponent.showLoader).toBe(false);
      DashboardComponent.getDeployableRepos();
      expect(DashboardComponent.showLoader).toBe(true);
    });

    it('should open modal with deployable repos and update list after selection',
      function() {
        DashboardComponent.getDeployableRepos();

        deployableReposDeferred.resolve(deployedReposResolve);
        $rootScope.$apply();

        //Loader should be hidden
        expect(DashboardComponent.showLoader).toBe(false);

        //After getting deployable repos modal should open
        expect($modalMock.open).toHaveBeenCalled();

        //we select one repo from modal
        selectedRepoDeferred.resolve({});

        //it should call get Franklin Repos to update list
        expect(franklinAPIServiceMock.userRepos.getFranklinRepos)
          .toHaveBeenCalled();
      });

    it('should show error message after failing getting the deployable repos',
      function() {
        DashboardComponent.getDeployableRepos();

        deployableReposDeferred.reject("error");
        $rootScope.$apply();

        //Loader should be hidden
        expect(DashboardComponent.showLoader).toBe(false);

        //After getting deployable repos modal should open
        expect(toastrMock.error).toHaveBeenCalled();
      });

    it('should logout', function() {
      passLogoutPromise = true;

      DashboardComponent.logout();
      $rootScope.$apply();

      //After auth logout it should change state
      expect($stateMock.go).toHaveBeenCalledWith('logout');
    });
  });

});
