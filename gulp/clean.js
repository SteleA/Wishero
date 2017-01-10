var gulp            = require('gulp');
var clean           = require('gulp-clean');


gulp.task('clean', function () {
  gulp.src(['./public/css/**.css','./public/js/**.js'], {read: false})
  .pipe(clean({force: true}))
});

gulp.task('cleanJS', function () {
  gulp.src(['./public/js/**.js'], {read: false})
  .pipe(clean({force: true}))
});

gulp.task('cleanCSS', function () {
  gulp.src(['./public/css/*.css'], {read: false})
  .pipe(clean({force: true}))
});



//clean dist
gulp.task('cleanDist', function () {
  return gulp.src(['./dist/node_modules','./dist/public','./dist/server','./dist/package.json'], {read: false})
  .pipe(clean({force: true}))
});
