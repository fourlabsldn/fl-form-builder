/* eslint-disable global-require */
const gulp = require('gulp');
const organiser = require('gulp-organiser');
const tasks = [
  require('./sass'),
  require('./transpile-react'),
].map(t => t.name);

module.exports = organiser.register(task => {
  gulp.task(task.name, tasks);
});
