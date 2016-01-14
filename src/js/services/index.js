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
  //If used independently should init satellizer $authProvider

  .service('franklinAPIService', FranklinAPIService)
  .factory('detailRepoService', DetailRepoService)
  .factory('franklinReposModel', FranklinReposModel);
