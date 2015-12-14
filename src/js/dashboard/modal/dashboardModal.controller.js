'use strict';

function DashboardModalComponent($scope, $modalInstance) {
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}

export {
  DashboardModalComponent
}
