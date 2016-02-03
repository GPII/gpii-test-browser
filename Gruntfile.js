"use strict";

module.exports = function (grunt) {
    grunt.initConfig({
        jshint: {
            src: ["src/**/*.js", "tests/**/*.js"],
            buildScripts: ["Gruntfile.js"],
            options: {
                jshintrc: true
            }
        },
        jsonlint: {
            src: ["src/**/*.json", "tests/**/*.json"]
        }
    });

    grunt.registerTask("lint", "Apply jshint and jsonlint", ["jshint", "jsonlint"]);

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-jsonlint");
    grunt.loadNpmTasks("grunt-shell");
};
