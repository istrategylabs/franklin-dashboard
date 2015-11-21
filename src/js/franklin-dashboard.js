
'use strict';

const angular     = require('angular');
const packageJson = require('../../package.json');

require('angular-route');
require('satellizer');

const app = angular
  .module('franklin-dashboard', ['ngRoute'])
  .constant('VERSION', packageJson.version)
  .config(( $routeProvider) => {
    $routeProvider.when('/login', {
      templateUrl: 'login/login.html',
    })
    .otherwise({
      redirectTo: '/login'
    });
    console.log(`Hello, franklin-dashboard version ${packageJson.version}`);
});

