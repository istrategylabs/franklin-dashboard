'use strict';


var angular = require('angular');
require('angular-route');
require('satellizer');
require('./config/ngConstants');


var app = angular
    .module('franklin-dashboard', [ 'ngRoute', 'satellizer', 'franklin-dashboard.config'])
    .constant('VERSION', require('../../package.json').version)
	.config( function( $routeProvider, $authProvider, ENV) {
	 $routeProvider.when('/login', {
	    templateUrl: 'login/login.html',
	  })
	  .otherwise({
	    redirectTo: '/login'
	  });

	  $authProvider.github({
	     clientId: ENV.GITHUB_CLIENT_ID
	   });

	  console.log('Hello, franklin-dashboard');
	});

require('./login/login.controller');


