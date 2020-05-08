// including plugins
var gulp = require('gulp'),
    webserver = require('gulp-webserver');


var taskServe = 'serve';
gulp.task(taskServe, function() {
  gulp.src('.')
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: false,
      fallback: 'index.html'
    }));
});

gulp.task('server', gulp.series(taskServe));


