module.exports = function (grunt) {

  grunt.initConfig({
    open: {
      demo: {
        path: './demo/index.html',
      },
    },
    concat: {
      dist: {
        src: ['src/*.js'],
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
        files: 'src/**/*.sass',
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
    },
  });

  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', []);
  grunt.registerTask('demo', ['open']);
  grunt.registerTask('js-build', ['concat', 'uglify']);
  grunt.registerTask('css-build', ['sass']);
  grunt.registerTask('build', ['js-build', 'css-build']);
  grunt.registerTask('dev', ['build', 'watch', 'open']);

};
