'use strict';
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var pump = require('pump');
var concat = require('gulp-concat');


// =============================================================================
// COMPILE SASS
// =============================================================================

gulp.task('sass', function () {
  return gulp.src('./src/scss/index.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(concat('style.min.css'))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./dist/css'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./src/scss/**/*.scss', ['sass']);
});


// =============================================================================
// SERVE
// =============================================================================

gulp.task('serve', function(){

	browserSync.init({
		server: {
			baseDir: "./dist"
		}
	});

	gulp.watch('./dist/css/**/*.css').on('change', browserSync.reload);
});


// =============================================================================
// DEFAULT
// =============================================================================

gulp.task('default', ['sass:watch', 'serve']);

