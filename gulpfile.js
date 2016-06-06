/* eslint-env node */
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('rollup-plugin-babel');
const rollup = require('gulp-rollup');
const sass = require('gulp-sass');
const DepLinker = require('dep-linker');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');

const moduleName = 'fl-form-builder';
const paths = {
  demo: {
    src: './demo/index.html',
  },
  js: {
    src: './src/',
    main: './src/main.js',
    dest: './dist/',
  },
  sass: {
    src: 'src/**/*.scss',
    main: './src/sass/main.scss',
    dest: 'dist/',
  },
  tests: {
    src: 'tests/**/*.*',
  },
};

gulp.task('copy-dependencies', () => {
  return DepLinker.copyDependenciesTo(paths.demo.dep);
});

gulp.task('build:src', () => {
  gulp.src(paths.js.main)
  .pipe(sourcemaps.init())
  .pipe(rollup({
    plugins: [
      babel({
        exclude: 'node_modules/**',
        presets: ['es2015-rollup'],
      }),
    ],
  }))
  .pipe(rename({ basename: moduleName }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(paths.js.dest));
});

gulp.task('watch:build:src', () => {
  gulp.watch(paths.js.src, ['build']);
});


gulp.task('build:sass', () => {
  return gulp.src(paths.sass.main)
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(postcss([autoprefixer({ browsers: ['last 15 versions'] })]))
  .pipe(rename({ basename: moduleName }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(paths.sass.dest));
});

gulp.task('watch:build:sass', () => {
  gulp.watch(paths.sass.src, ['build']);
});

gulp.task('build', [
  'build:src',
  'build:sass',
]);

gulp.task('watch', [
  'watch:build:sass',
  'watch:build:src',
]);

gulp.task('build-watch', ['build', 'watch']);
gulp.task('demo', ['copy-dependencies', 'build-watch']);
