var gulp            = require('gulp');
var jshint 					= require('gulp-jshint');

//JSlint
gulp.task('lint', function() {
  return gulp.src(['./public/app/**.js', './public/app/**/**.js', '!./public/app/**/*.spec.js', './server/**/**.js', './server/*.js'])
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
});

gulp.task('lintBuild', function() {
  return gulp.src(['./public/app/**.js', './public/app/**/**.js', '!./public/app/**/*.spec.js', './server/**/**.js', './server/*.js'])
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
  .pipe(jshint.reporter('fail'));
});
