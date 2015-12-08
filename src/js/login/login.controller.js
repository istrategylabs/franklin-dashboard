'use strict';

function LoginComponent(franklinAPIService, $scope, $location,
  $auth, toastr, ENV, $httpParamSerializer, $state) {
  /* jshint validthis: true */
  let lc = this;

  lc.authenticate = authenticate;
  lc.authenticateFranklin = authenticateFranklin;
  lc.saveFranklinToken = saveFranklinToken;

  function authenticate(provider) {

    //authenticate with github
    //$auth gets hithub code and saves it on local storage 
    //with key 'satellizer-token'
    $auth.authenticate(provider)
      .then(function() {
        lc.authenticateFranklin();
      })
      .catch(function(error) {
        console.log("Login FAILED: " + JSON.stringify(error));
        toastr.error("Try reloading the page", "Github login failed");
      });
  };

  function authenticateFranklin() {
    //check if user is already logged in at franklin
    if (!franklinAPIService.isUserLogged()) {

      //converts github token to franklin token
      let authPayload = $httpParamSerializer({
        'token': $auth.getToken(),
        'grant_type': "convert_token",
        'backend': "github",
        'client_id': ENV.FRANKLIN_CLIENT_ID,
        'client_secret': ENV.FRANKLIN_CLIENT_SECRET
      });

      //get franklin token
      let authToken = franklinAPIService.authFranklinUser().franklinToken(authPayload);
      authToken.$promise.then(lc.saveFranklinToken);
    }
  };

  //save franklin token in local storage
  function saveFranklinToken(data) {
    if (data.access_token) {
      franklinAPIService.saveToken(data.access_token.replace(/['"]+/g, ''));
    //change state, user logged in
      $state.go('logged');
    } else {
      //if no token is given by franklin, logout
      toastr.error("Try reloading the page", "Franklin login failed");
      $auth.logout().then(() => {
        $state.go('logout');
      });
    }
  };

};

export {
  LoginComponent
}
