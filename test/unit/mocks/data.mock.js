'use strict';

angular.module('mockData', [])
    .factory('mockDataService', function() {

        var deployedRepo = [{
            "name": "gossip-tweet",
            "github_id": 34545,
            "owner": {
                "name": "isl",
                "github_id": 45454
            },
            "build": {}
        }];

        var githubRepo = {
            "full_name": "isl/proj1",
            "name": "proj1",
            "id": 345435,
            "owner": {
                "id": 45435,
                "login": "isl"
            },
            "html_url": "https://github.com/dfdf/sdfds"
        };

        var deployableRepos = [
            githubRepo, {
            "full_name": "isl/proj2",
            "name": "proj2",
            "id": 23232,
            "owner": {
                "id": 232323,
                "login": "isl"
            },
            "html_url": "https://github.com/isl/tweet"
        }];

        var newRepo = {
            "name": "proj1",
            "github_id": 345435,
            "owner": {
                "name": "isl",
                "github_id": 232323
            },
            "build": {}
        };

        var completeRepo = {
            "name": "proj1",
            "github_id": 345435,
            "owner": {
                "name": "isl",
                "github_id": 232323
            },
            "environments": [{
                "name": "Staging",
                "url": "proj1-staging.franklinstatic.com",
                "build": {}
            }, {
                "name": "Production",
                "url": "proj1.franklinstatic.com",
                "build": {}
            }],
            "default_branch": "master",
            "build": {}
        };

        var updatedFranklinRepos = [{
            "name": "gossip-tweet",
            "github_id": 34545,
            "owner": {
                "name": "isl",
                "github_id": 45454
            },
            "build": {}
        }, {
            "name": "proj1",
            "github_id": 345435,
            "owner": {
                "name": "isl",
                "github_id": 232323
            },
            "environments": [{
                "name": "Staging",
                "url": "proj1-staging.franklinstatic.com",
                "build": {}
            }, {
                "name": "Production",
                "url": "proj1.franklinstatic.com",
                "build": {}
            }],
            "default_branch": "master",
            "build": {}
        }];

        var userInfo = {
            'username': 'name',
        };

        return {
            deployedRepo,
            deployableRepos,
            newRepo,
            completeRepo,
            updatedFranklinRepos,
            githubRepo,
            userInfo
        };
    });
