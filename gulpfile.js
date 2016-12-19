/* eslint-disable quote-props */
// List all available tasks

const src = 'src';
const dest = 'dist';
const path = require('path');

const reactConfig = {
  external: ['react', 'react-dom'],
  format: 'umd',
};


const organiser = require('gulp-organiser');
organiser.registerAll('./gulp-tasks', {
  sass: {
    src: path.join(src, 'styles/**/*.scss'),
    dest,
  },
  'transpile-react': {
    watch: path.join(src, '/**/*.js'),
    'application': {
      src: path.join(src, 'js', 'index.js'),
      dest,
      rename: 'fl-form-builder.js',
      config: Object.assign({}, reactConfig, { moduleName: 'FormBuilder' }),
    },
    'demo-image-type': {
      src: './examples/custom-type/src/ImageCards.js',
      dest: './examples/custom-type/dist',
      config: Object.assign({}, reactConfig, { moduleName: 'ImageCards' }),
    },
    'demo-date-type': {
      src: './examples/date-type/src/DateField.js',
      dest: './examples/date-type/dist',
      config: Object.assign({}, reactConfig, { moduleName: 'DateField' }),
    },
    tests: {
      src: path.join(src, 'js', '**/*.js'),
      dest: path.join(dest, '__test-files__'),
      config: Object.assign({}, reactConfig, { moduleName: 'FormBuilderTests' }),
    },
  },
  'browser-sync': {
    src: '.', // it doesn't matter, it's just so the task object is not ignored.
    reloadOn: ['transpile-react', 'sass'], // reload page when these tasks happen
    startPath: 'examples/custom-type/index.html',
    baseDir: './',
  },
  'test-headless': {
    src: '__tests__/*.test.js',
  },
  'watch': {
    'flow': {
      src: '.',
      taskNames: ['run-cmd:flow'],
    },
    'transpile-react:application': {
      src: '.',
      taskNames: ['run-cmd:flow'],
    },
  },
  'run-cmd': {
    'flow': {
      watch: path.join('src', 'js/**/*.js'),
      src: '.',
      cmd: 'flow',
    },
  },
});
