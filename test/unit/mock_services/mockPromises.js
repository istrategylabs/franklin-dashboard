angular.module('mockPromises', [])
  .factory('$promises', ['$q', function($q) {

    var passLogoutPromise = $q.defer();
    var franklinReposDeferred = $q.defer();
    var deployableReposDeferred = $q.defer();
    var registerRepoDeferred = $q.defer();
    var selectedRepoDeferred = $q.defer();

    console.log("new promises");

    return {
      passLogoutPromise : passLogoutPromise,
      franklinReposDeferred : franklinReposDeferred,
      deployableReposDeferred : deployableReposDeferred,
      registerRepoDeferred : registerRepoDeferred,
      selectedRepoDeferred : selectedRepoDeferred
    };
  }]);
