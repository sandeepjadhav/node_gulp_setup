'use strict';

const gulp = require('gulp'),
  _ = require('lodash'),
  fs = require('fs'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  plugins = gulpLoadPlugins({
    rename: { 'gulp-angular-templatecache': 'templateCache' }
  });
  // Set NODE_ENV to 'development'
gulp.task('env:dev', function (done) {
  process.env.NODE_ENV = 'development';
  return done();
});

gulp.task('createDir', function (done) {
  var requiredDirs = [
    'logs'
  ];

  for (var i = 0; i < requiredDirs.length; i++) {
    if (!fs.existsSync(requiredDirs[i])) {
      fs.mkdirSync(requiredDirs[i]);
    }
  }
  return done();
});

// CSS linting task
gulp.task('csslint', function () {
  return gulp.src(['styles.css'])
    .pipe(plugins.csslint('.csslintrc'))
    .pipe(plugins.csslint.formatter());
});
// ESLint JS linting task
gulp.task('eslint', function () {
  var assets = _.union(
    ['server.js']
  );

  return gulp.src(assets)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format());
});

gulp.task('lint', gulp.parallel(gulp.series('csslint', 'eslint')));

// Nodemon task
gulp.task('nodemon', function (done) {

  return plugins.nodemon({
    script: 'server.js',
    ext: 'js,html',
    verbose: true,
    watch: _.union(['server.js'])
  }).on('start', done);
});
// Watch Files For Changes
gulp.task('watch', function (done) {
  // Start livereload
  plugins.refresh.listen();
  // Add watch rules
  gulp.watch(['server.js'], gulp.series('eslint')).on('change', plugins.refresh.changed);

  done();
});

gulp.task('default', gulp.series('env:dev', gulp.parallel('createDir'), 'lint', gulp.parallel('nodemon', 'watch')));
