var gulp            = require('gulp');
var less            = require('gulp-less');
var path            = require('path');
var sourcemaps      = require('gulp-sourcemaps');
var minifyCss       = require('gulp-minify-css');
var plumber         = require('gulp-plumber');
var rev             = require('gulp-rev');

//Complie less
gulp.task('less', ['cleanCSS'], function () {

  gulp.src('./public/app/*.less')
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(less({
    paths: [ path.join(__dirname, 'less', 'includes') ]
  }))
  .pipe(minifyCss())
  .pipe(sourcemaps.write())
  .pipe(rev())
  .pipe(gulp.dest('./public/css'));


});
