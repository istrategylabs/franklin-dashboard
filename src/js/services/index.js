'use strict';

import angular from 'angular';
import 'angular-resource';
import '../config';

import FranklinAPIService from './franklinAPI.service';

angular.module('franklin-dashboard.services', ['ngResource', 'franklin-dashboard.config',
    'satellizer'
  ])
.config(($authProvider, ENV) => {

    $authProvider.github({
        clientId: ENV.GITHUB_CLIENT_ID,
        url: ENV.FRANKLIN_API_URL + '/auth/github/'
      });
})
  .service('franklinAPIService', FranklinAPIService);
