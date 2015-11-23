
(function() {
	'use strict';

	angular
	.module('franklin-dashboard')
	.controller('LoginComponent', [LoginComponent, '$scope']);

	function LoginComponent($scope, $location, $auth) {
		var lc = this;
		lc = {
			authenticate : authenticate
		};

		function authenticate(provider){

			$auth.authenticate(provider)
			.then(function() {
				console.log('You have successfully signed in with ' + provider + '!');
				$location.path('/');
			})
			.catch(function(error) {
					if (error.error) {
		            // Popup error - invalid redirect_uri, pressed cancel button, etc.
		            console.error(error.error);
		        } else if (error.data) {
		            // HTTP response error from server
		            console.error(error.data.message, error.status);
		        } else {
		        	console.error(error);
		        }
		    });
		}
	};
})();