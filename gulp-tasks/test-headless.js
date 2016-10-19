const gulp = require('gulp');
const organiser = require('gulp-organiser');
const jasmine = require('gulp-jasmine');

module.exports = organiser.register((task) => {
  gulp.task(task.name, () => {
    console.log(task.src);
    gulp.src(task.src)
    .pipe(jasmine({
      includeStackTrace: true,
    }));
  });
});
