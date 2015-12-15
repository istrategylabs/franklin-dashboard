
'use strict';

function DashboardDirective() {
    var directive = {
        link: link,
        restrict: 'EA',
        controller: 'DashboardComponent',
        controllerAs: 'dc',
    };
    return directive;

    function link($scope, element, attrs, crtl) {
        crtl.element = element;
    }
}

export {
  DashboardDirective
}
