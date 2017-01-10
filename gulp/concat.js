var gulp            = require('gulp');
var mainBowerFiles  = require('main-bower-files');
var concat          = require('gulp-concat');
var uglify 					= require('gulp-uglify');
var ngAnnotate 			= require('gulp-ng-annotate');
var minifyCss       = require('gulp-minify-css');
var sourcemaps      = require('gulp-sourcemaps');
var plumber         = require('gulp-plumber');
var rev             = require('gulp-rev');




//concat bower css files
gulp.task('vendorsCSS', function () {

  gulp.src(mainBowerFiles({filter: /\.css$/i}))
  .pipe(minifyCss({compatibility: 'ie8'}))
  .pipe(concat('vendors.css'))
  .pipe(rev())
  .pipe(gulp.dest('./public/css/vendors'))
});

//concat bower js files
gulp.task('vendorsJS',['cleanJS'], function () {
  return gulp.src(mainBowerFiles({filter: /\.js$/i}))
  .pipe(concat('vendors.js'))
  .pipe(uglify())
  .pipe(rev())
  .pipe(gulp.dest('./public/js/vendors'))
});

//concat project js files
gulp.task('bundleJS',['cleanJS'], function () {

  return gulp.src(['./public/app/app.js','./public/app/**/*.js', '!./public/app/**/*.spec.js'])
    .pipe(plumber())
    .pipe(sourcemaps.init())
      .pipe(ngAnnotate())
      .pipe(uglify())
      .pipe(concat('bundle.js'))
    .pipe(sourcemaps.write())
    .pipe(rev())
    .pipe(gulp.dest('./public/js'))
});
