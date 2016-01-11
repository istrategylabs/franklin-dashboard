'use strict';

export default function() {

  const _self = this;
  
  _self.selectedRepo = {};

  _self.getSelectedRepo = getSelectedRepo;
  _self.setSelectedRepo = setSelectedRepo;

  return _self;

  /*********************************************************/

  function getSelectedRepo() {
    return _self.selectedRepo;
  }

  function setSelectedRepo(repo) {
    _self.selectedRepo = repo;
  }

};
