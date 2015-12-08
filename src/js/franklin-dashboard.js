'use strict';

/* Dependencies */
import angular from 'angular';
import packageJson from '../../package.json';
import 'angular-ui-router';
import 'angular-animate';
import 'angular-toastr';
import 'satellizer';
// require('../../node_modules/foundation-apps/js/angular/foundation');

/* Franklin Dashboard modules */
require('./config/ngConstants');
import './services';
import { DashboardComponent } from './dashboard/dashboard.controller';
import { LoginComponent } from './login/login.controller';


angular
  .module('franklin-dashboard',
    [
      'ngAnimate',
      'toastr',
      'satellizer',
      'franklin-dashboard.config',
      'ui.router',
      'franklin-dashboard.services'
    ]
  )
  .constant('VERSION', packageJson.version)
  .config(($authProvider, ENV, $stateProvider, $urlRouterProvider, toastrConfig, $resourceProvider) => {


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
        url: ENV.FRANKLIN_API_URL + '/auth/github/'
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
        }
        return deferred.promise;
      }

      console.log(`Hello, franklin-dashboard version ${packageJson.version}`);
  })
  .controller('LoginComponent',
    [
      'franklinAPIService',
      '$scope',
      '$location',
      '$auth',
      'toastr',
      'ENV',
      '$httpParamSerializer',
      '$state',
      LoginComponent
    ]
  )
  .controller('DashboardComponent', ['franklinAPIService', '$scope', '$location',
    '$auth', 'toastr', 'ENV', '$httpParamSerializer', '$state', DashboardComponent]);

