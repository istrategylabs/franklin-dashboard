'use strict';

import angular from 'angular';
require('../../../node_modules/angular-resource');
require('../config/ngConstants');

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
