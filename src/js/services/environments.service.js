'use strict';

export default function() {

    const _self = this;

    /* Potentially define this as env var */
    _self.possibleEnvs = ['Production', 'Staging', 'Development'];

    let functions = {
        getCurrentEnv,
        getNextEnv,
        forwardEnv,
        rewindEnv,
        setCurrentEnv,
        reorderEnvs
    }

    Object.assign(_self, functions);

    return _self;

    /*********************************************************/

    function setCurrentEnv(repo, index) {
        repo.currentEnvironment = index;
    }

    function getCurrentEnv(repo) {
        return _self.possibleEnvs[repo.currentEnvironment];
    }

    function getNextEnv(repo) {
        if (repo.currentEnvironment < _self.possibleEnvs.length - 1) {
            return _self.possibleEnvs[repo.currentEnvironment + 1];
        } else {
            return false;
        }
    }

    function forwardEnv(repo) {
        if (repo.currentEnvironment < _self.possibleEnvs.length - 1) {
            repo.currentEnvironment++;
        }
    }

    function rewindEnv(repo) {
        if (repo.currentEnvironment > 0) {
            repo.currentEnvironment--;
        }
    }

    function reorderEnvs(repo){
        let newEnvList = [];
        for(let index = 0; index < repo.environments.length; index++){
            let env = repo.environments.find(x => x.name == _self.possibleEnvs[index]);
            newEnvList.push(env);
        }
        repo.environments = newEnvList.reverse();
        

        // var newList = repo.environments.sort((a, b) => {
        //     _self.possibleEnvs.findIndex(x => x == a.name) < 
        //         _self.possibleEnvs.findIndex(x => x == b.name) ? 1 : -1;
        // });
        // repo.environments = newList;
    }
};
