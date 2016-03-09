'use strict';

export default function() {

    const _self = this;

    let attributes = {
        franklinRepos: [],
        getFranklinRepos: getFranklinRepos,
        setFranklinRepos: setFranklinRepos,
        addFranklinRepo: addFranklinRepo,
        removeFranklinRepo: removeFranklinRepo,
        updateFranklinRepo: updateFranklinRepo
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
        if (_self.franklinRepos
            .findIndex((r) => r.github_id === repo.github_id) === -1) {
            //TODO: review this when we have more environments
            repo.default_environment = {
                status: repo.environments[0].status
            };
            _self.franklinRepos.push(repo);
        }
    }

    function removeFranklinRepo(repo) {
        let index = _self.franklinRepos
            .findIndex((r) => r.github_id === repo.github_id);
        if (index > -1) {
            _self.franklinRepos.splice(index, 1);
        }
    }

    function updateFranklinRepo(repo) {
        let index = _self.franklinRepos
            .findIndex((r) => r.github_id === repo.github_id);
        if (index > -1) {
            _self.franklinRepos[index] = repo;
            //TODO: review this when we have more environments
            _self.franklinRepos[index].default_environment = {
                status: repo.environments[repo.environments.length - 1].status
            }
        }
    }

};
