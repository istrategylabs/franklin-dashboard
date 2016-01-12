angular.module('$modalMock', ['mockPromises'])
  .service('$modal', 'mockPromises', function($modal, mockPromises) {
    console.log("mock modal loaded");
    this.open = jasmine.createSpy('open')
      .and.callFake(function() {
        return {
          result: mockPromises.selectedRepoDeferred.promise
        };
      })
  });
