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
                    args: ['window', 'document'],
                    params: ['win', 'doc']
                },
                files: {
                    "tmp/lazy-iife.js": [
                        'src/lazy.js'
                    ]
                }
            },

           "lazy-data-attr": {
                options: {
                    useStrict: true,
                    prependSemicolon: false,
                    trimCode: true,
                    args: ['window', 'document'],
                    params: ['win', 'doc']
                },
                files: {
                    "tmp/lazy-data-attr-iife.js": [
                        'src/lazy.js',
                        'src/lazy-data-attr.js'
                    ]
                }
            }
        },

        // closure compiler
        // enhanced with --module / -- chunk
        // @link https://github.com/gmarty/grunt-closure-compiler/pull/61
        "closure-compiler": {

            "lazy": {
                closurePath: '../../closure-compiler',
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
            "lazy-data-attr": {
                closurePath: '../../closure-compiler',
                js: 'tmp/lazy-data-attr-iife.js',
                jsOutputFile: 'dist/lazy-data-attr.js',
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
        'iife:lazy-data-attr',
        'closure-compiler:lazy',
        'closure-compiler:lazy-data-attr'
    ]);

    grunt.registerTask('default', ['']);
};