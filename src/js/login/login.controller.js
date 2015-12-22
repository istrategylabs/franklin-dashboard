'use strict';

function LoginComponent($scope, $auth, toastr, $state) {

  /* jshint validthis: true */
  let lc = this;

  lc.authenticate = authenticate;

  /**************************************************************************/

  function authenticate(provider) {

    //authenticate with github
    //$auth gets github code and saves it on local storage 
    //with key 'satellizer-token'
    $auth.authenticate(provider)
      .then(function() {
        $state.go('logged');
      })
      .catch(function(error) {
        $auth.logout().then(() => {
          $state.go('logout');
        });
        console.log("Login FAILED: " + JSON.stringify(error));
        toastr.error("Try reloading the page", "Github login failed");
      });
  };
};

export {
  LoginComponent
}
