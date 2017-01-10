var gulp            = require('gulp');
var inject          = require('gulp-inject');
var mainBowerFiles  = require('main-bower-files');


//Inject JS CSS into index.html
gulp.task('injectIndex', ['bundleJS'], function () {
  return gulp.src('./public/index.html')
  .pipe(inject(gulp.src('./public/js/vendors/*.js', {read: false}), {name: 'bower', relative: true}))
  .pipe(inject(gulp.src('./public/css/vendors/*.css', {read: false}),{name: 'bower', relative: true}))
  .pipe(inject(gulp.src(['./public/css/*.css'], {read: false}), {relative: true}))
  .pipe(inject(gulp.src(['./public/js/*.js', '!./public/app/**/*.spec.js'], {read: false}),{relative: true}))
  .pipe(gulp.dest('./public'));
});


//Inject JS on change into index.html
gulp.task('changeJS', ['bundleJS'], function () {
  gulp.src('./public/index.html')
  .pipe(inject(gulp.src(['./public/js/bundle.js', '!./public/app/**/*.spec.js'], {read: false}),{relative: true}))
  .pipe(gulp.dest('./public'));
});
