'use strict';

var gulp  = require('gulp');
var fs    = require('fs');


fs.readdirSync(__dirname + '/gulp').forEach(function (task) {
  require('./gulp/' + task)
});

gulp.task('default', ['injectIndex','nodemon', 'less', 'browser-sync', 'cleanCSS', 'cleanJS', 'vendorsJS', 'bundleJS', 'lint', 'vendorsCSS', 'imagemin'], function(){
  gulp.watch("public/app/**/*.less", ['cleanCSS', 'less', 'injectIndex']);
  gulp.watch(['./public/app/*.js','./public/app/**/*.js'], ['cleanJS', 'changeJS', 'bundleJS', 'injectIndex']);
});

//build for production
gulp.task('build',['cleanDist','copyDist']);

gulp.task('serve:dist', ['nodemonDist']);

gulp.task('test',['lintBuild']);
