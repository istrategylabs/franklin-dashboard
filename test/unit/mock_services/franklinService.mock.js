angular.module('franklinAPIServiceMock', [])
  .factory('franklinAPIService', function() {

    var getFranklinRepos = function() {};

    var getDeployableRepos = function() {};

    var registerRepo = function() {};

    return {
      userRepos: {
        getFranklinRepos: getFranklinRepos,
        getDeployableRepos: getDeployableRepos,
        registerRepo: registerRepo
      }
    };
  });
