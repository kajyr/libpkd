var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');

var lib = {
	source: './src/**/*.coffee',
}


gulp.task('build', function() {
	gulp.src(lib.source)
		.pipe(concat('index.js'))
		.pipe(coffee({bare: false}).on('error', gutil.log))
		.pipe(gulp.dest('./'))
});

gulp.task('w', ['build'], function() {
	gulp.watch(lib.source, ['build']);
});

gulp.task('default', ['build']);