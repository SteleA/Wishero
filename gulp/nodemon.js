var gulp            = require('gulp');
var nodemon         = require('gulp-nodemon');

//server reload
gulp.task('nodemon', function (cb) {
  var init = true;
  return nodemon({
    script: 'server/app.js',
    ignore: ['public/']
  }).on('start', function () {
    if(init) cb(); init = false;
  });
});

//server reload
gulp.task('nodemonDist', function (cb) {
  var init = true;
  return nodemon({
    script: 'dist/server/app.js'
  }).on('start', function () {
    if(init) cb(); init = false;
  });
});
