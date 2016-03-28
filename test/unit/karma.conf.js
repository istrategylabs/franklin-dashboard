module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      '../../node_modules/angular/angular.js',
      '../../node_modules/angular-route/angular-route.js',
      '../../node_modules/angular-mocks/angular-mocks.js',
      '../../public/js/**/*.js',
      './**/*.js'
    ],

    autoWatch : true,

    frameworks: ['browserify', 'jasmine'],

    browsers : ['Chrome'],

    colors: true,

    preprocessors: {
      './**/*.js': [ 'browserify' ]
    },

    browserify: {
      debug: true,
    },

    plugins : [
            'karma-chrome-launcher',
            'karma-jasmine',
            'karma-browserify'
            ]

  });
};