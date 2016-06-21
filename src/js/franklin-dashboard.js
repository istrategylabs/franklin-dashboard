'use strict';

/* Dependencies */
import angular from 'angular';
import packageJson from '../../package.json';
import 'angular-ui-router';
import 'angular-animate';
import 'angular-toastr';
import 'satellizer';
import 'angular-foundation/mm-foundation.min';
import 'angular-foundation/mm-foundation-tpls.min';


/* Franklin Dashboard modules */
import './config';
import './services';
import {
  DashboardComponent, GithubReposComponent, DetailComponent
}
from './dashboard';
import {
  LoginComponent
}
from './login/login.controller';
import {
  ConfirmModalComponent
}
from './common';

const franklinApp = angular
  .module('franklin-dashboard', [
    'ngAnimate',
    'toastr',
    'satellizer',
    'franklin-dashboard.config',
    'ui.router',
    'franklin-dashboard.services',
    'mm.foundation'
  ])
  .controller('LoginComponent', [
    '$scope',
    '$auth',
    'toastr',
    '$state',
    'franklinAPIService',
    LoginComponent
  ])
  .controller('DashboardComponent', [
    'franklinAPIService',
    '$scope',
    '$auth',
    'toastr',
    '$state',
    '$modal',
    'detailRepoService',
    'franklinReposModel',
    '$document',
    '$location',
     DashboardComponent
  ])
  .controller('GithubReposComponent', [
    '$scope',
    '$modalInstance',
    'franklinAPIService',
    'franklinReposModel',
    GithubReposComponent
  ]).controller('DetailComponent', [
    '$scope',
    'detailRepoService',
    'franklinAPIService',
    '$modal',
    '$state',
    'toastr',
    'franklinReposModel',
    '$window',
    'environmentsService', DetailComponent
  ]).controller('ConfirmModalComponent', [
    '$scope',
    '$modal', ConfirmModalComponent
  ]);

//get github client id from franklin-api
getClientId().then(bootstrapApplication, error);

//call to franklin-api to get client-id
function getClientId() {

  let initInjector = angular.injector(["ng", 'franklin-dashboard.config']);
  let $http = initInjector.get("$http");
  let ENV = initInjector.get("ENV");

  return $http.get(`${ENV.FRANKLIN_API_URL}/v1/auth/github/`);
}

//bootstrap franklin-dashboard angular app
function bootstrapApplication(response) {

  angular.element(document).ready(function() {

    franklinApp
      .constant("GITHUB_CONFIG", response.data)
      .constant('VERSION', packageJson.version)
      .config(($authProvider, ENV, $stateProvider, $urlRouterProvider,
        toastrConfig, $resourceProvider, $interpolateProvider) => {

        //change angular interpolation for 
        $interpolateProvider.startSymbol('[[').endSymbol(']]');

        //angular routing depending on login status
        $stateProvider
          .state('logged', {
            url: '/dashboard',
            templateUrl: 'dashboard/dashboard.html',
            resolve: {
              loginRequired: loginRequired
            }
          })
          .state('logged.franklinRepos', {
            url: '/',
            templateUrl: 'dashboard/franklin-repos.html'
          })
          .state('logged.detailInfo', {
            url: '/detail/:githubId',
            templateUrl: 'dashboard/repos/repo-detail.html',
            resolve: {
              loginRequired: loginRequired
            }
          })
          .state('logout', {
            url: '/login',
            templateUrl: 'login/login.html',
            resolve: {
              skipIfLoggedIn: skipIfLoggedIn
            }
          });

        $urlRouterProvider.otherwise('/login');

        $resourceProvider.defaults.stripTrailingSlashes = false;

        //Github login configuration
        $authProvider.withCredentials = false;

        //configure satellizer with client_id from franklin-api
        $authProvider.github({
          clientId: response.data.client_id,
          url: ENV.FRANKLIN_API_URL + '/v1/auth/github/',
          //Ask permission for hooks, deploy keys, private repos
          scope: ['user:email', 'admin:repo_hook', 'repo'],
          redirectUri: window.location.origin
        });


        //toastr configuration - error messages
        angular.extend(toastrConfig, {
          closeButton: false,
          closeHtml: '<button>&times;</button>',
          extendedTimeOut: 10000,
          positionClass: 'toast-bottom-center',
          tapToDismiss: true,
          timeOut: 10000,
        });

        //Auxiliar functions for routing
        function skipIfLoggedIn($q, $auth, $location) {
          if (!$auth.isAuthenticated()) {
            return true;
          } else {
            //is logged in, redirect to dashboard
            $location.path('/dashboard');
            return;
          }
        }

        function loginRequired($q, $auth) {
          let deferred = $q.defer();
          if ($auth.isAuthenticated()) {
            deferred.resolve();
          } else {
            deferred.reject();
          }
          return deferred.promise;
        }
        console.log(`Hello, franklin-dashboard version ${packageJson.version}`);
      });

    //finally bootstrap angular app
    angular.bootstrap(document, ["franklin-dashboard"]);
  });
}

function error(errorData) {
  //TODO: redirect to 404?
  console.error(errorData);
}
