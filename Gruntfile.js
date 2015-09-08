GLOBAL.BASE_PATH = __dirname;
GLOBAL.SERVICES_PATH = __dirname + '/server/services';

module.exports = function(grunt) {

    grunt.initConfig({
        watch: {
            scripts: {
                files: ['./server/services/references/**/*.json'],
                tasks: ['references']
            },
            options: {
                spawn: false,
            },
        },       
        references: {
            options:{
                dest: './client/js/references',
                dictionaryDest: './server/services/dictionary',
            }
        },        
    });

    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('references', require('./tasks/references')(grunt));

    grunt.event.on('watch', function(action, filepath) {
        grunt.config("changed_ref_filepath", filepath);
    });

};