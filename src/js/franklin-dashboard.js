'use strict';

import angular from "angular";
import packageJson from "../../package.json";

//import angular-route from "angular-route";
//import satellizer from "satellizer";
//import ngConstants from "./config/ngConstants";

import {
    LoginComponent
}
from "./login/login.controller";

require('angular-animate');
require('angular-toastr');
require('satellizer');
require('./config/ngConstants');
require('angular-ui-router');

const app = angular
    .module('franklin-dashboard', ['ngAnimate', 'toastr', 'satellizer', 'franklin-dashboard.config', 'ui.router'])
    .constant('VERSION', packageJson.version)
    .config(($authProvider, ENV, $stateProvider, $urlRouterProvider, toastrConfig) => {

        //angular routing depending on login status
        $stateProvider
          .state('logged', {
            url: '/dashboard',
            templateUrl: 'dashboard/dashboard.html',
            resolve: {
              loginRequired: loginRequired
            }
          })
          .state('login', {
            url: '/login',
            templateUrl: 'login/login.html',
            resolve: {
              skipIfLoggedIn: skipIfLoggedIn
            }
          });

        $urlRouterProvider.otherwise('/dashboard');

        //Github login configuration
        $authProvider.withCredentials = false;
        $authProvider.github({
            clientId: ENV.GITHUB_CLIENT_ID,
            url: 'http://ab763639.ngrok.io/auth/github/'// franklin-api url
        });

        //Auxiliar functions to routing
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

        //toastr configuration - error messages
        angular.extend(toastrConfig, {
            positionClass: 'toast-bottom-center',
            closeButton: false,
            closeHtml: '<button>&times;</button>',
            extendedTimeOut: 10000,
            tapToDismiss: true,
            timeOut: 10000,
          });

        console.log(`Hello, franklin-dashboard version ${packageJson.version}`);
    })
    .controller('LoginComponent', LoginComponent);
