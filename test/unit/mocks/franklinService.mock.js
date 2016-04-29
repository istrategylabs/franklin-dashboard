angular.module('franklinAPIServiceMock', [])
    .factory('franklinAPIService', function() {

        var getFranklinRepos = function() {};

        var getDeployableRepos = function() {};

        var registerRepo = function() {};

        var getRepo = function() {};

        var deleteRepo = function() {};

        var getUserInfo = function() {};

        return {
            userRepos: {
                getFranklinRepos,
                getDeployableRepos,
                registerRepo,
                getRepo,
                deleteRepo,
                getUserInfo
            }
        };
    });
