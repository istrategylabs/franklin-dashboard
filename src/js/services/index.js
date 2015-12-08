'use strict';

import angular from 'angular';
require('angular-local-storage');
require('../../../node_modules/angular-resource');
require('../config/ngConstants');

import FranklinAPIService from './franklinAPI.service';

angular.module('franklin-dashboard.services', ['ngResource', 'franklin-dashboard.config',
    'LocalStorageModule'
  ])
.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('franklin-dashboard');
})
  .service('franklinAPIService', FranklinAPIService);
