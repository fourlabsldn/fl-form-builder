/*globals module*/
module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    open: {
      demo: {
        path: './demo/index.html',
      },
      test: {
        path: './_SpecRunner.html',
      },
    },
    concat: {
      dist: {
        src: [
          'src/controller-head.js',
          'src/utils/utils.js',
          'src/utils/*.js',
          'src/**/*.js',
          'src/controller-tail.js',
        ],
        dest: 'dist/fl-form-builder.js',
      },
    },
    sass: {
      dist: {
        options: {
          style: 'expanded',
        },
        files: {
          'dist/fl-form-builder.css': 'src/**/*.scss',
        },
      },
    },
    uglify: {
      main: {
        options: {
          sourceMap: true,
          sourceMapName: 'dist/fl-form-builder.map',
        },
        files: {
          'dist/fl-form-builder.min.js': ['dist/fl-form-builder.js'],
        },
      },
    },
    watch: {
      css: {
        files: 'src/**/*.scss',
        tasks: ['css-build'],
        options: {
          livereload: true,
        },
      },
      js: {
        files: 'src/**/*.js',
        tasks: ['js-build'],
        options: {
          livereload: true,
        },
      },
      demo: {
        files: 'demo/**/*.*',
        options: {
          livereload: true,
        },
      },
      tests: {
        files: 'tests/**/*.*',
        options: {
          livereload: true,
        },
      },
    },
    jasmine: {
      main: {
        src: 'dist/fl-form-builder.js',
        options: {
          specs: 'tests/**/*-specs.js',
          helpers: './tests/helpers/*.js',
          vendor: [
            'bower_components/x-div/js/x-div-tester.js'
          ]
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  grunt.registerTask('default', []);
  grunt.registerTask('demo', ['open:demo']);
  grunt.registerTask('js-build', ['concat', 'uglify']);
  grunt.registerTask('css-build', ['sass']);
  grunt.registerTask('build', ['js-build', 'css-build']);
  grunt.registerTask('dev', ['build', 'jasmine:main:build', 'open', 'watch']);
  grunt.registerTask('test', ['jasmine']);
  grunt.registerTask('test-debug', ['jasmine:main:build', 'open']);
};
