// This task will start all tasks in this folder
const gulp = require('gulp');
const organiser = require('gulp-organiser');

module.exports = organiser.register((task, allTasks) => {
  const { taskNames } = task; // config. Tasks to be watched

  const toWatch = allTasks.filter(t => taskNames.includes(t.tasks[0].name));

  gulp.task(task.name, () => {
    toWatch.forEach(t => {
      console.log(`watching ${t.tasks[0].name}`);
      gulp.watch(t.tasks[0].watch || t.tasks[0].src, [t.name]);
    });
  });
});
