'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
let uglify = require('gulp-uglify-es').default;
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
// MINIFY JS
// =============================================================================

gulp.task('minifyjs', function (cb) {
  pump([
        gulp.src(['./src/js/*.js']),

        uglify(),
        gulp.dest('./dist/js')
    ],
    cb
  );
});

gulp.task('minifyjs:watch', function () {
  gulp.watch('./src/js/**/*.js', ['minifyjs']);
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

gulp.task('default', ['sass:watch', 'minifyjs:watch', 'serve']);

