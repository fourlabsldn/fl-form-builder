module.exports = function (grunt) {

  grunt.initConfig({
    open: {
      demo: {
        path: './demo/index.html',
      },
    },
  });

  grunt.loadNpmTasks('grunt-open');

  grunt.registerTask('demo', ['open']);
  grunt.registerTask('default', ['jshint']);

};
