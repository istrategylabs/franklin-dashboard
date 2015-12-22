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
  DashboardComponent,
  DashboardModalComponent,
  DashboardDirective
}
from './dashboard';
import {
  LoginComponent
}
from './login/login.controller';


angular
  .module('franklin-dashboard', [
    'ngAnimate',
    'toastr',
    'satellizer',
    'franklin-dashboard.config',
    'ui.router',
    'franklin-dashboard.services',
    'mm.foundation'
  ])
  .constant('VERSION', packageJson.version)
  .config(($authProvider, ENV, $stateProvider, $urlRouterProvider, toastrConfig,
    $resourceProvider, $interpolateProvider) => {

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
      .state('logout', {
        url: '/login',
        templateUrl: 'login/login.html',
        resolve: {
          skipIfLoggedIn: skipIfLoggedIn
        }
      });

    $urlRouterProvider.otherwise('/dashboard');

    $resourceProvider.defaults.stripTrailingSlashes = false;

    //Github login configuration
    $authProvider.withCredentials = false;

    $authProvider.github({
      clientId: ENV.GITHUB_CLIENT_ID,
      url: ENV.FRANKLIN_API_URL + '/auth/github/',
      //Ask permission for hooks, deploy keys, private repos
      scope: ['user:email', 'admin:repo_hook', 'repo'],
      redirectUri: window.location.origin
    });


    //toastr configuration - error messages
    angular.extend(toastrConfig, {
      positionClass: 'toast-bottom-center',
      closeButton: false,
      closeHtml: '<button>&times;</button>',
      extendedTimeOut: 10000,
      tapToDismiss: true,
      timeOut: 10000,
    });

    //Auxiliar functions for routing
    function skipIfLoggedIn($q, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.reject();
      } else {
        deferred.resolve();
      }
      return deferred.promise;
    }

    function loginRequired($q, $location, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.resolve();
      } else {
        $location.path('/login');
        //deferred.reject();
      }
      return deferred.promise;
    }

    console.log(`Hello, franklin-dashboard version ${packageJson.version}`);
  })
.controller('LoginComponent', [
     '$scope',
     '$auth',
     'toastr',
     '$state',
     LoginComponent
   ])
   .controller('DashboardComponent', [
     'franklinAPIService',
     '$scope',
     '$auth',
     'toastr',
     '$state',
     '$modal', DashboardComponent
   ])
  .directive('dashboard', DashboardDirective)
  .controller('DashboardModalComponent', [
    '$scope',
    '$modalInstance',
    'franklinAPIService',
    DashboardModalComponent
  ]);
