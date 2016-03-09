'use strict';

describe('DashboardComponent', function() {
  var $authMock;
  var toastrMock;
  var $stateMock;
  var $modalMock;
  var franklinAPIServiceMock;
  var $scope;
  var $q;
  var $rootScope;
  var franReposModel;
  //var mockPromises;

  //Promises
  var passLogoutPromise;
  var franklinReposDeferred;
  var deployableReposDeferred;
  var registerRepoDeferred;
  var selectedRepoDeferred;

  //Controller  
  var createController;

  //Mock data
  var mockFranklinResponse = [{
    "name": "proj",
    "github_id": 54435345,
    "owner": {
      "name": "isl",
      "github_id": 45435345
    },
    "environments": [{
      "name": "Production",
      "url": "",
      "status": "registered"
    }]
  }];
  var deployableReposResolve = [{
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
  var newRepoMock = {
    "name": "proj1",
    "github_id": 54543,
    "owner": {
      "name": "isl",
      "id": 3454543
    }
  };
  var updatedFranklinReposMock = [{
    "name": "proj",
    "github_id": 54435345,
    "owner": {
      "name": "isl",
      "github_id": 45435345
    },
    "environments": [{
      "name": "Production",
      "url": "",
      "status": "registered"
    }]
  }, {
    "name": "proj1",
    "github_id": 54543,
    "owner": {
      "name": "isl",
      "id": 3454543
    }
  }];

  // DEFINE MOCK SERVICES
  beforeEach(function() {
    module('franklin-dashboard');

    //module('mockPromises');

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
    $modal, franklinAPIService, franklinReposModel) {

    $q = _$q_;
    franReposModel = franklinReposModel;
    spyOn(franReposModel, 'addFranklinRepo').and.callThrough();
    spyOn(franReposModel, 'getFranklinRepos').and.callThrough();

    $authMock = $auth;
    spyOn($auth, 'logout').and.callThrough();

    toastrMock = toastr;
    $modalMock = $modal;
    //mockPromises = mockPromises;
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

    it('Should get Franklin Repos', function() {
      expect(franklinAPIServiceMock.userRepos.getFranklinRepos)
        .toHaveBeenCalled();
    });

    it('should set the response from FranklinApiService to controller.',
      function() {
        $rootScope.$apply();
        expect(JSON.stringify(DashboardComponent.deployedRepos))
          .toEqual(JSON.stringify(mockFranklinResponse));
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

    it('Should show error message after failing getting the deployable repos',
      function() {
        DashboardComponent.getDeployableRepos();

        deployableReposDeferred.reject("error");
        $rootScope.$apply();

        //Loader Should be hidden
        expect(DashboardComponent.showLoader).toBe(false);

        //After getting deployable repos modal Should open
        expect(toastrMock.error).toHaveBeenCalled();
      });

    it('Should logout', function() {
      passLogoutPromise = true;

      DashboardComponent.logout();
      $rootScope.$apply();

      //After auth logout it Should change state
      expect($stateMock.go).toHaveBeenCalledWith('logout');
    });
  });

  describe('DashboardComponent: register repo', function() {

    beforeEach(function() {
      DashboardComponent = createController();
      franklinReposDeferred.resolve(mockFranklinResponse);
    });

    it('Should not get the entire franklin repo list again after registering',
      function() {

        //it should call get Franklin Repos to update list
        expect(franklinAPIServiceMock.userRepos.getFranklinRepos)
          .toHaveBeenCalled();

        DashboardComponent.getDeployableRepos();

        deployableReposDeferred.resolve(deployableReposResolve);
        $rootScope.$apply();

        //Loader should be hidden
        expect(DashboardComponent.showLoader).toBe(false);

        //After getting deployable repos modal should open
        expect($modalMock.open).toHaveBeenCalled();

        //we select one repo from modal
        selectedRepoDeferred.resolve(newRepoMock);
        $rootScope.$apply();

        //we assumed here that modal calls register repo from franklin api
        //and it succeded 

        //should add new repo to existing deployable repos list
        expect(franReposModel.addFranklinRepo).toHaveBeenCalledWith(newRepoMock);

        //franklin repo list should be updated
        expect(JSON.stringify(DashboardComponent.deployedRepos))
          .toEqual(JSON.stringify(updatedFranklinReposMock));

        //shouldnt get all repos again
        expect(franklinAPIServiceMock.userRepos.getFranklinRepos.calls.count())
          .toEqual(1);
      });
  });
});
