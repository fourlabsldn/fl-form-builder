const gulp = require('gulp');
const organiser = require('gulp-organiser');
const jasmine = require('gulp-jasmine');
const jasmineReporters = require('jasmine-reporters');

module.exports = organiser.register(task => {
  gulp.task(task.name, () => {
    console.log(task.src);
    gulp.src(task.src)
    .pipe(jasmine({
      reporter: new jasmineReporters.TerminalReporter({
        verbosity: 3,
        color: true,
        showStack: true,
      }),
    }));
  });
});
