'use strict';

describe('DetailComponent', function() {
  var $scope;
  var $rootScope;

  //Controller  
  var createController;
  var detailRepoServiceMock;

  var mockRepo = {
    "name": "proj1",
    "environments": [{
      "name": "Production",
      "url": "",
      "status": "REG"
    }],
    "owner": "isl"
  };

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

    });
  });

  //INJECT MOCK SERVICES
  beforeEach(inject(function(detailRepoService) {
    detailRepoServiceMock = detailRepoService;

    spyOn(detailRepoServiceMock, 'getSelectedRepo')
      .and.callFake(function() {
        return mockRepo;
      });

    spyOn(detailRepoServiceMock, 'setSelectedRepo')
      .and.callThrough();

  }));

  // CREATE CONTROLLER FUNCTION
  beforeEach(inject(function(_$rootScope_, $controller) {

    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();

    createController = function() {
      return $controller('DetailComponent', {
        $scope: $scope,
        detailRepoService: detailRepoServiceMock,
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
      expect(JSON.stringify(DetailComponent.repo)).toEqual(JSON.stringify(mockRepo));
    });
  });

});
