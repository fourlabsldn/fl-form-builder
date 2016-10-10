// List all available tasks

const src = 'src';
const dest = 'dist';
const path = require('path');

const organiser = require('gulp-organiser');
organiser.registerAll('./gulp-tasks', {
  sass: {
    src: path.join(src, 'styles/**/*.scss'),
    dest: path.join(dest, 'styles'),
  },
  'transpile-react': {
    watch: path.join(src, 'js', '/**/*.js'),
    src: path.join(src, 'js', 'index.js'),
    dest,
    config: {
      external: ['react', 'react-dom'],
      format: 'amd',
      moduleName: 'FormBuilder',
    },
  },
  'browser-sync': {
    src: '.', // it doesn't matter, it's just so the task object is not ignored.
    reloadOn: ['transpile-react', 'sass'], // reload page when these tasks happen
    startPath: 'demo/index.html',
    baseDir: './',
  },
});
