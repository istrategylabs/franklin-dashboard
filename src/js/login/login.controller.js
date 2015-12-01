function LoginComponent($scope, $location, $auth, toastr) {
    /* jshint validthis: true */
    let lc = this;
    lc.authenticate = authenticate;

    function authenticate(provider) {

        $auth.authenticate(provider)
            .then(function() {
                console.log('You have successfully signed in with ' + provider + '!');
                $location.path('/');
            })
            .catch(function(error) {
                if (error.error) {
                    // Popup error - invalid redirect_uri, pressed cancel button, etc.
                    toastr.error(error.error);
                } else if (error.data) {
                    // HTTP response error from server
                    toastr.error("Try reloading the page", "Github login failed");
                } else {
                    toastr.error(error);
                }
            });
    };
};

export {
    LoginComponent
}
