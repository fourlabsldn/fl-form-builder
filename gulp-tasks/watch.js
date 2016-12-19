// This task will start all tasks in this folder
const gulp = require('gulp');
const organiser = require('gulp-organiser');

module.exports = organiser.register((task, allTasks) => {
  const { taskNames } = task; // config. Tasks to be watched

  const tasksAndSubTasks = allTasks
    .reduce((all, t) => all.concat(t.tasks), []);

  const toWatch = tasksAndSubTasks.filter(t => taskNames.includes(t.name));

  gulp.task(task.name, () => {
    toWatch.forEach(t => {
      console.log(`watching ${t.name}`);
      gulp.watch(t.watch || t.src, [t.name]);
    });
  });
});
