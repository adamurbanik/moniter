var gulp = require('gulp');
var eslint = require('gulp-eslint');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var del = require('del');
var babel = require("gulp-babel");
var gulpUncache = require('gulp-uncache');

var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();

var destDirs = {
  dev: './public',
  build: './dist'
};

var destDir = '';

var paths = {
  scripts: ['**/*.js', '!node_modules/**', '!bower_components/**', '!Gulpfile.js'],
  styles: ['./app/assets/css/**/*.scss'],
  html: ['./app/**/*.html'],
  images: ['./app/assets/images/**/*'],
  js: [
    './app/app.js',
    './app/**/*.js'
  ],
  fonts: ['./app/assets/fonts/*.ttf']
};

gulp.task('styles', function () {
  return gulp.src(paths.styles)
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('app.css'))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(destDir + '/assets/css/'));
});

gulp.task('css-vendor', function () {
  return gulp
    .src([
      './bower_components/angular-material/angular-material.min.css',
      './bower_components/angular-material-data-table/dist/md-data-table.min.css',
      './node_modules/mdPickers/dist/mdPickers.min.css'
    ])
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest(destDir + '/assets/css/'));
});

gulp.task('bower', function () {
  return gulp.src([
    './bower_components/lodash/dist/lodash.min.js',
    './bower_components/angular/angular.js',
    './bower_components/angular-translate/angular-translate.js',
    './bower_components/angular-resource/angular-resource.js',
    './bower_components/angular-cookies/angular-cookies.js',
    './bower_components/angular-animate/angular-animate.js',
    './bower_components/angular-aria/angular-aria.js',
    './bower_components/angular-messages/angular-messages.js',
    './bower_components/angular-material/angular-material.js',
    './bower_components/angular-ui-router/release/angular-ui-router.js',
    './bower_components/tinymce-dist/tinymce.js',
    './bower_components/tinymce-dist/themes/modern/theme.min.js',
    './bower_components/angular-ui-tinymce/src/tinymce.js',
    './bower_components/ng-flow/dist/ng-flow-standalone.js',
    './bower_components/angularUtils-pagination/dirPagination.js',
    './bower_components/angular-cookies/angular-cookies.min.js',
    './bower_components/angular-material-data-table/dist/md-data-table.min.js',
    './bower_components/moment/min/moment.min.js',
    './node_modules/mdPickers/dist/mdPickers.js',
    './bower_components/angular-permission/dist/angular-permission.min.js',
    './bower_components/angular-permission/dist/angular-permission-ui.min.js',
    './jetmail/assets/libraries/papaparse.min.js',
    './bower_components/d3/d3.min.js',
    './bower_components/dom-to-image/dist/dom-to-image.min.js',
    './bower_components/jspdf/dist/jspdf.min.js'

  ])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(destDir + '/assets/js/'));
});

gulp.task('js', function () {
  return gulp.src(paths.js)
    .pipe(concat('app.js'))
    .pipe(gulp.dest(destDir + '/assets/js/'));
});

gulp.task('html', function () {
  return gulp.src(paths.html)
    .pipe(gulp.dest(destDir));
});

gulp.task('images', function () {
  return gulp.src(paths.images)
    .pipe(gulp.dest(destDir + '/assets/images/'));
});

gulp.task('fonts', function () {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest(destDir + '/assets/fonts/'));
});

gulp.task('babel', function () {
  return gulp.src(destDir + '/assets/js/app.js')
    .pipe(babel())
    .pipe(gulp.dest(destDir + '/assets/js/'));
});

gulp.task('clear', () => del(destDir, { force: true }));

gulp.task('path-dev', () => destDir = destDirs.dev);
gulp.task('path-build', () => destDir = destDirs.build);

gulp.task('default', ['path-dev'], function (done) {

  browserSync.init({
    server: {
      baseDir: "./public"
    }
  });

  runSequence('clear', 'css-vendor', 'bower', 'js', 'html', 'styles', 'images', 'fonts', function () {
    ['styles', 'images', 'html', 'js', 'fonts'].forEach(function (taskName) {
      gulp.watch(paths[taskName], [taskName]);
    });
    gulp.watch('public/**/*').on('change', browserSync.reload);
  });
});