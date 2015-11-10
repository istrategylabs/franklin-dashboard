var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var browserSync = require('browser-sync').create();
var autoprefixer = require('autoprefixer');
var postcss = require('gulp-postcss');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var nunjucksRender = require('gulp-nunjucks-render');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');


function bundle(watch) {
  var bundler = browserify('./src/js/franklin-dashboard.js', { debug: true }).transform(babel);

  function rebundle() {
    return bundler.bundle()
      .on('error', function(err) { throw new gutil.PluginError('browserify', err), this.emit('end'); })
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('./public/js/'));
  }

  if (watch) {
    bundler = watchify(bundler);
    bundler.on('update', function() {
      gutil.log('-> bundling...');
      rebundle();
    });
  }

  return rebundle();
}

gulp.task('browserify', function() {
  return bundle();
});

gulp.task('watchify', function() {
  return bundle(true);
});

gulp.task('sass', function() {
  return gulp.src('./src/scss/**/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(postcss([autoprefixer]))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('./public/css/'));
});

gulp.task('nunjucks', function() {
  nunjucksRender.nunjucks.configure(['./src/templates/'], { watch: false });
  return gulp.src(['./src/templates/**/*.html', '!**/_*'])
  .pipe(nunjucksRender())
  .pipe(gulp.dest('./public/'));
});

gulp.task('start', ['nunjucks', 'sass', 'watchify'], function() {
  browserSync.init({
    server: {
      baseDir: 'public'
    },
    files: [
      'public/js/**/*.js',
      'public/css/**/*.css',
      'public/**/*.html'
    ]
  });

  gulp.watch('./src/scss/**/*.scss', ['sass']);
  gulp.watch('./src/**/*.html', ['nunjucks']);
});

gulp.task('banner', ['browserify'], function() {
  return gulp.src(['banner.txt', './public/js/bundle.js'])
  .pipe(concat('bundle.js'))
  .pipe(gulp.dest('./public/js/'));
});


gulp.task('default', ['build-dev']);

gulp.task('build-dev', ['sass', 'nunjucks', 'watchify', 'start']);
gulp.task('build', ['sass', 'nunjucks', 'browserify', 'banner']);
