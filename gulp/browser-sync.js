var gulp            = require('gulp');
var browserSync     = require('browser-sync').create();


gulp.task('browser-sync',['nodemon', 'injectIndex'], function() {

  browserSync.init(null, {
    proxy: "http://localhost:3000",
    files: ["public/js/**", "public/css/**", "public/index.html", "public/app/**", "!public/app/*.js", "!public/app/**/*.js", "!public/app/*.less", "!public/app/**/*.less"],
    browser: "google chrome",
    port: 4000,
    open: false
  });



});
