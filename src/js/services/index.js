'use strict';

import angular from 'angular';
import 'angular-resource';
import '../config';

import FranklinAPIService from './franklinAPI.service';
import DetailRepoService from './detail-repo.service';
import FranklinReposModel from './franklin-repos.model';

angular.module('franklin-dashboard.services', ['ngResource',
    'franklin-dashboard.config',
    'satellizer'
  ])
  .config(($authProvider, ENV) => {
    //satellizer configuration
    $authProvider.github({
      clientId: ENV.GITHUB_CLIENT_ID,
      url: ENV.FRANKLIN_API_URL + '/auth/github/'
    });
  })
  .service('franklinAPIService', FranklinAPIService)
  .factory('detailRepoService', DetailRepoService)
  .factory('franklinReposModel', FranklinReposModel);
