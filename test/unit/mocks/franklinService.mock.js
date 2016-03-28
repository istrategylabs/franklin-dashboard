angular.module('franklinAPIServiceMock', [])
    .factory('franklinAPIService', function() {

        var getFranklinRepos = function() {};

        var getDeployableRepos = function() {};

        var registerRepo = function() {};

        var getRepo = function() {};

        var deleteRepo = function() {};

        return {
            userRepos: {
                getFranklinRepos,
                getDeployableRepos,
                registerRepo,
                getRepo,
                deleteRepo
            }
        };
    });
