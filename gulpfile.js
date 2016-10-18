// List all available tasks

const src = 'src';
const dest = 'dist';
const path = require('path');

const reactConfig = {
  external: ['react', 'react-dom'],
  format: 'umd',
  moduleName: 'FormBuilder',
};

const organiser = require('gulp-organiser');
organiser.registerAll('./gulp-tasks', {
  sass: {
    src: path.join(src, 'styles/**/*.scss'),
    dest,
  },
  'transpile-react': {
    watch: path.join(src, '/**/*.js'),
    application: {
      src: path.join(src, 'js', 'fl-form-builder.js'),
      dest,
      config: reactConfig,
    },
    demo: {
      src: './demo/ImageCards.js',
      dest,
      config: reactConfig,
    },
    tests: {
      src: path.join(src, 'js', '**/*.js'),
      dest: path.join(dest, '__test-files__'),
      config: reactConfig,
    },
  },
  'browser-sync': {
    src: '.', // it doesn't matter, it's just so the task object is not ignored.
    reloadOn: ['transpile-react', 'sass'], // reload page when these tasks happen
    startPath: 'demo/index.html',
    baseDir: './',
  },
  'test-headless': {
    src: path.join(dest, '__tests__', '**/*.test.js'),
  },
});
