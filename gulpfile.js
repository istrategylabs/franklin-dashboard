var gulp           = require('gulp');
var gutil          = require('gulp-util');
var del            = require('del');
var concat         = require('gulp-concat');
var browserSync    = require('browser-sync').create();
var autoprefixer   = require('autoprefixer');
var postcss        = require('gulp-postcss');
var sass           = require('gulp-sass');
var sourcemaps     = require('gulp-sourcemaps');
var nunjucksRender = require('gulp-nunjucks-render');
var source         = require('vinyl-source-stream');
var buffer         = require('vinyl-buffer');
var browserify     = require('browserify');
var watchify       = require('watchify');
var rev            = require('gulp-rev');
var revReplace     = require('gulp-rev-replace');
var uglify         = require('gulp-uglify');
var minifyCss      = require('gulp-minify-css');
var htmlmin        = require('gulp-htmlmin');
var gulpif         = require('gulp-if');
var runSequence    = require('run-sequence');
var ngConstant = require('gulp-ng-constant');
 
process.env.GITHUB_CLIENT_ID = '7047f9d9d20fa9a9ab46';
process.env.GITHUB_CLIENT_SECRET = '0253c07b5c8149f7c7d02e93a3389842452304c1';


function bundle(options) {
  options = options || {};
  var bundler = browserify('./src/js/franklin-dashboard.js', { entry: true, debug: true })
  .transform('babelify', { presets: ['es2015'] });

  function rebundle() {
    return bundler.bundle()
      .on('error', function(err) { gutil.log(gutil.colors.red(err.message)); this.emit('end'); })
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('./public/js/'));
  }

  if (options.watch) {
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
  return bundle({ watch: true });
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
  return gulp.src(['./src/templates/**/*.html', './src/js/**/*.html', '!**/_*'])
  .pipe(nunjucksRender())
  .pipe(gulp.dest('./public/'));
});

gulp.task('extras', function() {
  return gulp.src('./src/**/*.{txt,json,xml,jpeg,jpg,png,gif,svg}')
  .pipe(gulp.dest('./public/'));
});

gulp.task('config', function () {
  return ngConstant({
      name: 'franklin-dashboard.config',
      constants: { 
        ENV: {
          GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
          GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID
        }
      },
      wrap: "commonjs",
      stream: true
    })
    .pipe(gulp.dest('./src/js/config/'));
});

gulp.task('start', ['nunjucks', 'sass', 'extras', 'watchify'], function() {
  browserSync.init({
    server: 'public',
    files: './public/**/*'
  });

  gulp.watch('./src/scss/**/*.scss', ['sass']);
  gulp.watch('./src/**/*.html', ['nunjucks']);
  gulp.watch('./src/**/*.{txt,json,xml,jpeg,jpg,png,gif,svg}', ['extras']);
});

gulp.task('rev', ['default', 'banner'], function() {
  return gulp.src(['./public/**/*', '!**/*.html'], { base: './public' })
  .pipe(rev())
  .pipe(gulp.dest('./public/'))
  .pipe(rev.manifest())
  .pipe(gulp.dest('./public/'));
});

gulp.task('rev:replace', ['rev'], function() {
  var manifest = gulp.src('./public/rev-manifest.json');
  return gulp.src('./public/**/*')
  .pipe(revReplace({ manifest: manifest }))
  .pipe(gulp.dest('./public/'));
});

gulp.task('banner', ['browserify'], function() {
  return gulp.src(['banner.txt', './public/js/bundle.js'])
  .pipe(concat('bundle.js'))
  .pipe(gulp.dest('./public/js/'));
});

gulp.task('minify', ['rev:replace'], function() {
  return gulp.src(['./public/**/*'], { base: './public/' })
  // Only target the versioned files with the hash
  // Those files have a - and a 10 character string
  .pipe(gulpif(/-\w{10}\.js$/, uglify()))
  .pipe(gulpif(/-\w{10}\.css$/, minifyCss()))
  .pipe(gulpif('*.html', htmlmin({
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true
  })))
  .pipe(gulp.dest('./public/'));
});

gulp.task('clean', function() {
  return del('./public/');
});

gulp.task('default', ['config', 'browserify', 'nunjucks', 'sass', 'extras']);

gulp.task('build-dev', function(done) {
  runSequence('clean',
              ['default', 'start'],
              done);
});

gulp.task('build', function(done) {
  runSequence('clean',
              ['default', 'banner', 'rev:replace', 'minify'],
              done);
});
