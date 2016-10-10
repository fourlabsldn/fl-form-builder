// npm install --save-dev gulp path gulp-uglify vinyl-buffer gulp-flatmap rollup-stream rollup-plugin-babel vinyl-source-stream gulp-sourcemaps rollup-plugin-replace rollup-plugin-commonjs rollup-plugin-node-resolve gulp-organiser lodash babel-preset-es2015-rollup babel-preset-react babel-plugin-transform-async-to-generator babel-plugin-external-helpers-2

/**
  Hidden dependencies:
  	babel-preset-es2015-rollup
  	babel-preset-react
  	babel-plugin-transform-async-to-generator
  	babel-plugin-external-helpers-2
 */

// ============================================================================
// Transpile ES7 react code into ES5. Includes support for async await.
// ============================================================================
const gulp = require('gulp');
const path = require('path');
const uglify = require('gulp-uglify');
const buffer = require('vinyl-buffer');
const flatmap = require('gulp-flatmap');
const rollup = require('rollup-stream');
const babel = require('rollup-plugin-babel');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const replace = require('rollup-plugin-replace');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const organiser = require('gulp-organiser');
const { curry } = require('lodash/fp');

const DEFAULT_CONFIG = {
  sourceMap: true,
  // Treat these imports as external dependencies and
  // load them from the given paths
  external: [],
  // Let's use AMD format to serve our files to the front-end
  format: 'amd',
  plugins: [
    // Import modules with jsnext:main
    nodeResolve({	jsnext: true, main: true }),
    // Allow importing commonjs modules
    commonjs(),
    // Transpile our code to ES5
    babel({
      exclude: 'node_modules/**',
      babelrc: false,
      plugins: ['transform-async-to-generator', 'external-helpers-2', 'lodash'],
      presets: ['es2015-rollup', 'react'],
    }),
    // TODO: Change this from 'development' to 'production' during production
    replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
  ],
};

const doTranspilation = curry((rollupConfig, stream, file) => {
  const fileName = path.parse(file.path).base;
  const config = Object.assign({ entry: file.path }, DEFAULT_CONFIG, rollupConfig);

  return rollup(config)
	// point to the entry file.
	.pipe(source(fileName))
	// buffer the output. most gulp plugins, including gulp-sourcemaps, don't support streams.
	.pipe(buffer())
	// tell gulp-sourcemaps to load the inline sourcemap produced by rollup-stream.
	.pipe(sourcemaps.init({ loadMaps: true }))
	// Further modify the file here if needed

  // .pipe(uglify())
	// write the sourcemap alongside the output file.
	.pipe(sourcemaps.write('.'));
});

// Path resolution for these modules must be included in the pages' require.config
module.exports = organiser.register((task) => {
  const rollupConfig = task.config;

  gulp.task(task.name, () => {
    return gulp.src(task.src)
    .pipe(flatmap(doTranspilation(rollupConfig))) // call doTranspilation for each file
    .pipe(gulp.dest(task.dest));
  });
});
