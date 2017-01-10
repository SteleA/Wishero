var gulp            = require('gulp');
var minifyHTML      = require('gulp-minify-html');


//copy files dist
gulp.task('copyDist', ['cleanDist'], function () {
  gulp.src(['./public/app/**/*.html'])
  .pipe(minifyHTML())
  .pipe(gulp.dest('./dist/public/app'));

  gulp.src(['./public/index.html'])
  .pipe(minifyHTML())
  .pipe(gulp.dest('./dist/public'));

  gulp.src(['./public/app/js/**'])
  .pipe(gulp.dest('./dist/public/js'));

  gulp.src(['./public/assets/**'])
  .pipe(gulp.dest('./dist/public/assets'));

  // gulp.src(['./public/bower_components/**'])
  // .pipe(gulp.dest('./dist/public/bower_components'));

  gulp.src(['./public/css/**'])
  .pipe(gulp.dest('./dist/public/css'));

  gulp.src(['./public/js/**'])
  .pipe(gulp.dest('./dist/public/js'));

  gulp.src(['./public/favicon.*'])
  .pipe(gulp.dest('./dist/public/'));

  gulp.src(['./package.json'])
  .pipe(gulp.dest('./dist'));

  // gulp.src(['./node_modules/**'])
  // .pipe(gulp.dest('./dist/node_modules'));

  gulp.src(['./server/**'])
  .pipe(gulp.dest('./dist/server'));
});
