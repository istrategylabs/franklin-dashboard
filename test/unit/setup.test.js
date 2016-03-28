 var $authMock;
 var toastrMock;
 var $stateMock;
 var $modalMock;
 var franklinAPIServiceMock;
 var $scope;
 var $q;
 var $rootScope;
 var franReposModel;
 var $mockDataService;
 var detailRepoServiceMock;
 var $modalInstanceMock;

 //Promises
 var franklinReposDeferred;
 var getRepoDeferred;
 var deployableReposDeferred;
 var registerRepoDeferred;
 var modalDeferred;
 var deleteRepoDeferred;

 var setup = function() {

     // DEFINE MOCK SERVICES
     beforeEach(function() {

         angular.mock.module('franklin-dashboard');

         angular.mock.module('mockData');

         angular.mock.module('franklinAPIServiceMock');

         angular.mock.module(function($provide) {

             $provide.factory('$auth', ['$q', function($q) {
                 function logout() {
                     return $q.resolve();
                 }
                 return {
                     logout: logout
                 };

             }]);

             $provide.service('$state', function() {
                 this.go = jasmine.createSpy('go')
                     .and.callFake(function(name) {
                         this.current.name = name;
                     })
                 this.current = {
                     name: "logged"
                 },
                 this.params = {}
             });

             $provide.service('toastr', function() {
                 this.error = jasmine.createSpy('error');
             });

             $provide.service('$modal', function() {
                 this.open = jasmine.createSpy('open')
                     .and.callFake(function() {
                         modalDeferred = $q.defer();
                         return {
                             result: modalDeferred.promise
                         };
                     })
             });

             $provide.service('$modalInstance', function() {
                 this.dismiss = jasmine.createSpy('dismiss');
                 this.close = jasmine.createSpy('close');
             });

             $provide.factory('detailRepoService', function() {

                 function getSelectedRepo() {};
                 function setSelectedRepo(repo) {};

                 return {
                     getSelectedRepo: getSelectedRepo,
                     setSelectedRepo: setSelectedRepo
                 };
             });
         });

     });

     //INJECT MOCK SERVICES
     beforeEach(inject(function(_$q_, $auth, toastr, $state,
         $modal, franklinAPIService, franklinReposModel, mockDataService,
         detailRepoService, $modalInstance) {

         $q = _$q_;

         franReposModel = franklinReposModel;
         spyOn(franReposModel, 'addFranklinRepo').and.callThrough();
         spyOn(franReposModel, 'getFranklinRepos').and.callThrough();

         $authMock = $auth;
         spyOn($auth, 'logout').and.callThrough();

         toastrMock = toastr;
         $modalMock = $modal;
         $mockDataService = mockDataService;
         $stateMock = $state;
         $modalInstanceMock = $modalInstance;

         detailRepoServiceMock = detailRepoService;

         spyOn(detailRepoServiceMock, 'getSelectedRepo')
             .and.callFake(function() {
                 return $mockDataService.completeRepo;
             });

         spyOn(detailRepoServiceMock, 'setSelectedRepo')
             .and.callThrough();

         //Mock franklinAPI service, spy on functions
         franklinAPIServiceMock = franklinAPIService;

         franklinReposDeferred = $q.defer();
         deployableReposDeferred = $q.defer();
         registerRepoDeferred = $q.defer();
         getRepoDeferred = $q.defer();
         deleteRepoDeferred = $q.defer();


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

         spyOn(franklinAPIServiceMock.userRepos, 'getRepo')
             .and.callFake(function() {
                 return {
                     $promise: getRepoDeferred.promise
                 };
             });

         spyOn(franklinAPIServiceMock.userRepos, 'deleteRepo')
             .and.callFake(function() {
                 return {
                     $promise: deleteRepoDeferred.promise
                 };
             });
     }));
 }

 module.exports = {
     setup,
     $authMock: function() {  return $authMock;  },
     toastrMock: function() { return toastrMock; },
     $stateMock: function() { return $stateMock; },
     $modalMock: function() { return $modalMock; },
     detailRepoServiceMock: function() { return detailRepoServiceMock; },
     franklinAPIServiceMock: function() { return franklinAPIServiceMock; },
     franReposModel: function() { return franReposModel; },
     $mockDataService: function() { return $mockDataService; },
     $modalInstanceMock: function() { return $modalInstanceMock; },
     franklinReposDeferred: function() { return franklinReposDeferred; },
     getRepoDeferred: function() { return getRepoDeferred;  },
     deployableReposDeferred: function() { return deployableReposDeferred; },
     registerRepoDeferred: function() { return registerRepoDeferred; },
     modalDeferred: function() { return modalDeferred;  },
     deleteRepoDeferred: function() { return deleteRepoDeferred; }
 }
