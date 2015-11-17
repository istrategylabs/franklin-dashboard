var angular = require('angular');
require('angular-route');

/**

*/
(function() {
    'use strict';

    var app = angular
        .module('franklin-dashboard', [ 'ngRoute' ])
        .constant('VERSION', require('../../package.json').version)
		.config( function( $routeProvider) {
		 $routeProvider.when('/login', {
		    templateUrl: 'login/login.html',
		  })
		  .otherwise({
		    redirectTo: '/login'
		  });

		    console.log('Hello, franklin-dashboard');
		});
})();


