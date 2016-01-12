'use strict';

function ConfirmModalComponent($scope, $modalInstance, title, message) {

  const cmc = this;
  cmc.message = $scope.modalMessage;
  cmc.title = $scope.modalTitle;

  cmc.solve = solve;
  cmc.error = error;


  /**************************************************************************/

  function error(data) {
    $scope.$dismiss(data);
  }

  function solve(data) {
    $scope.$close(data);
  }
}

export {
  ConfirmModalComponent
}
