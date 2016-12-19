const gulp = require('gulp');
const shell = require('gulp-shell');
const organiser = require('gulp-organiser');

module.exports = organiser.register((task) => {
  const { cmd } = task;
  gulp.task(task.name, shell.task(cmd));
});
