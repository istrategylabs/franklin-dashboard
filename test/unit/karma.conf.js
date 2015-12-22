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

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    colors: true,

    plugins : [
            'karma-chrome-launcher',
            'karma-jasmine'
            ]

  });
};