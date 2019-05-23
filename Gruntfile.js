/* global module:false */
module.exports = function(grunt) {

    // closure compiler externs
    var externs = ['lazy.ext.js'];

    // Grunt configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/*! 📐 Style.Tools */'
        },

        // IIFE
        iife: {
            "lazy": {
                options: {
                    useStrict: true,
                    prependSemicolon: false,
                    trimCode: true,
                    args: ['window'],
                    params: ['window']
                },
                files: {
                    "tmp/lazy-iife.js": [
                        'src/lazy.js'
                    ]
                }
            },

           "lazy-data-config": {
                options: {
                    useStrict: true,
                    prependSemicolon: false,
                    trimCode: true,
                    args: ['window'],
                    params: ['window']
                },
                files: {
                    "tmp/lazy-data-config-iife.js": [
                        'src/lazy.js',
                        'src/lazy-data-config.js'
                    ]
                }
            }
        },

        // closure compiler
        // enhanced with --module / -- chunk
        // @link https://github.com/gmarty/grunt-closure-compiler/pull/61
        "closure-compiler": {

            "lazy": {
                closurePath: '../closure-compiler',
                js: 'tmp/lazy-iife.js',
                jsOutputFile: 'dist/lazy.js',
                maxBuffer: 30000,
                noreport: true,
                options: {
                    compilation_level: 'ADVANCED_OPTIMIZATIONS',
                    language_in: 'ECMASCRIPT5_STRICT',
                    externs: externs
                    //isolation_mode: 'IIFE'
                }
            },
            "lazy-data-config": {
                closurePath: '../closure-compiler',
                js: 'tmp/lazy-data-config-iife.js',
                jsOutputFile: 'dist/lazy-data-config.js',
                maxBuffer: 30000,
                noreport: true,
                options: {
                    compilation_level: 'ADVANCED_OPTIMIZATIONS',
                    language_in: 'ECMASCRIPT5_STRICT',
                    externs: externs
                }
            }
        }
    });

    // Load Dependencies
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.registerTask('build', [
        'iife:lazy',
        'closure-compiler:lazy'
    ]);

    grunt.registerTask('default', ['']);
};