module.exports = function(grunt) {
  grunt.initConfig({
    jip: {
      options: {
        // any options supported by jip
      }
    }
  });

  // DO NOT USE grunt.loadTasks('../tasks') on your gruntfile. It'll only
  // work here because this example is already inside the plugin folder.
  // Instead use grunt.loadNpmTasks('jasmine-istanbul-phantom');
  grunt.loadTasks('../tasks');

  grunt.registerTask('default', ['jip']);
};