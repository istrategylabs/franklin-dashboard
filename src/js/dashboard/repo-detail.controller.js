'use strict';

function DetailComponent($scope, detailRepoService) {

  /* jshint validthis: true */
  const dec = this;
  dec.repo = detailRepoService.getSelectedRepo();

  /**************************************************************************/

};

export {
  DetailComponent
}
