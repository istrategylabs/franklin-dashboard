'use strict';

export default function() {

  const _self = this;

  let attributes = {
    franklinRepos: [],
    getFranklinRepos: getFranklinRepos,
    setFranklinRepos: setFranklinRepos,
    addFranklinRepo: addFranklinRepo,
    removeFranklinRepo: removeFranklinRepo
  }

  Object.assign(_self, attributes);  

  return _self;

  /*********************************************************/

  function getFranklinRepos() {
    return _self.franklinRepos;
  }

  function setFranklinRepos(repos) {
    _self.franklinRepos = repos;
  }

  function addFranklinRepo(repo) {
    if (!_self.franklinRepos
      .findIndex((r) => r.github_id === repo.github_id)) {
      _self.franklinRepos.push(repo);
    }
  }

  function removeFranklinRepo(repo) {
    let index = _self.franklinRepos
      .findIndex((r) => r.github_id === repo.github_id);
    if (index) {
      _self.franklinRepos.splice(index, 1);
    }
  }

};
