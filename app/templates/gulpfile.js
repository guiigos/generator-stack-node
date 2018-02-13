const path = require('path');
const gulp = require('gulp');
const util = require('gulp-util');
const clean = require('gulp-clean');
const babel = require('gulp-babel');
const apidoc = require('gulp-apidoc');
const nodemon = require('gulp-nodemon');
const runSequence = require('run-sequence');

var nodemonConfig;

gulp.task('default', () => {
  util.log(util.colors.yellow('gulp dev'), util.colors.magenta('generates the whole routine of homologation.'));
  util.log(util.colors.yellow('gulp pro'), util.colors.magenta('generates the whole routine of production.'));
});

gulp.task('dev', (done) => {

  /*
  * # command bash
  * $ set NODE_ENV=development&&set DEBUG=debug:server&&nodemon --exec babel-node src --presets env
  */

  nodemonConfig = {
    script: 'src/index.js',
    env: {
      NODE_ENV: 'development',
      DEBUG: 'debug:server'
    },
    watch: ['src'],
    exec: `${path.normalize('./node_modules/.bin/babel-node')}`
  };

  runSequence('nodemon', done);
});

gulp.task('pro', (done) => {

  /*
  * # command bash
  * $ set NODE_ENV=production&&nodemon dist/index.js
  */

  nodemonConfig = {
    script: 'dist/index.js',
    env: {
      NODE_ENV: 'production'
    },
    tasks: ['build'],
    watch: ['src']
  };

  runSequence('build', 'nodemon', done);
});

gulp.task('build', (done) => {
  runSequence('clean', 'compile', 'apidoc', done);
});

gulp.task('compile', (done) => {

  /*
  * # command bash
  * $ babel src --source-maps --copy-files --out-dir dist --watch --presets env
  */

  gulp.src('src/**/*.*')
    .pipe(babel({
      ignore: /^[^.]+$|\.(?!(js)$)([^.]+$)/
    }))
    .pipe(gulp.dest('dist'))
    .on('end', done);
});

gulp.task('apidoc', (done) => {

   /*
  * # command bash
  * $ apidoc --input src/ --output dist/doc/ --file-filters .\/node_modules\/
  */

  apidoc({
    src: "src/",
    dest: "dist/doc/",
    config: "./",
    options: {
      excludeFilters: ["node_modules/"]
    }
  }, done);
});

gulp.task('clean', () => {

  /*
  * # command bash
  * $ rimraf dist
  */

  return gulp
    .src('dist', { read: false })
    .pipe(clean({ force: true }));
});

gulp.task('nodemon', () => {
  if (!nodemonConfig) util.log(util.colors.red('No settings for the nodemon.'));
  else return nodemon(nodemonConfig);
});
