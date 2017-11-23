var gulp = require('gulp'),
  gulpHandlebars = require('gulp-compile-handlebars'),
  rename = require('gulp-rename'),
  runSequence = require('run-sequence'),
  rimraf = require('rimraf'),
  handlebarsData = require("./handlebarsData.json"),
  browserSync = require('browser-sync').create(),
  sass = require('gulp-sass');

gulp.task('build', (cb) => {
  return runSequence('clean', ['html', 'sass', 'copy-js', 'copy-images'], cb);
});

gulp.task('clean', (cb) => {
  rimraf('./build', {force: true}, cb);
});

gulp.task('html', () => {
  return gulp.src('./src/hbs/pages/*.hbs')
  .pipe(gulpHandlebars(handlebarsData, {
    ignorePartials: true,
      batch: ['./src/hbs/partials']
    }))
    .pipe(rename({extname: '.html'}))
    .pipe(gulp.dest('./build'));
});

gulp.task('sass', () => {
  return gulp.src("src/scss/**/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("build/css"))
    .pipe(browserSync.stream());
});

gulp.task('copy-js', () => {
  return gulp.src(['./src/js/**/*'])
    .pipe(gulp.dest('./build/js'));
});

gulp.task('copy-images', () => {
  return gulp.src(['./src/images/**/*'])
    .pipe(gulp.dest('./build/images'));
});

gulp.task('serve', ['build'], function() {
  browserSync.init({
    server: "./build"
  });

  gulp.watch("src/scss/**/*.scss", ['sass']);
  gulp.watch("src/hbs/**/*.hbs", ['html']);
  gulp.watch("src/js/**/*", ['copy-js']);
  gulp.watch("src/images/**/*", ['copy-images'], browserSync.reload);
  gulp.watch("build/**/*.html").on('change', browserSync.reload);
  gulp.watch("build/js/**/*").on('change', browserSync.reload);
  gulp.watch("build/images/**/*").on('change', browserSync.reload);
});
