/* global module:false */
module.exports = function(grunt) {

    // closure compiler externs
    var externs = ['lazy.ext.js'];

    // Grunt configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/*! 🔬 Style.Tools */'
        },

        // IIFE
        iife: {
            "lazy": {
                options: {
                    useStrict: true,
                    prependSemicolon: false,
                    trimCode: true,
                    args: ['window', 'document'],
                    params: ['win', 'doc', 'undefined']
                },
                files: {
                    "tmp/lazy-iife.js": [
                        'src/lazy.js'
                    ]
                }
            },

            "lazy-tiny": {
                options: {
                    useStrict: true,
                    prependSemicolon: false,
                    trimCode: true,
                    args: ['window', 'document'],
                    params: ['win', 'doc', 'undefined']
                },
                files: {
                    "tmp/lazy-tiny-iife.js": [
                        'src/lazy-tiny.js'
                    ]
                }
            },

           "lazy-poly": {
                options: {
                    useStrict: true,
                    prependSemicolon: false,
                    trimCode: true,
                    args: ['window', 'document'],
                    params: ['win', 'doc', 'undefined']
                },
                files: {
                    "tmp/lazy-poly-iife.js": [
                        'src/lazy.js',
                        'src/lazy-async-polyfill.js'
                    ]
                }
            },

           "lazy-data-attr": {
                options: {
                    useStrict: true,
                    prependSemicolon: false,
                    trimCode: true,
                    args: ['window', 'document'],
                    params: ['win', 'doc', 'undefined']
                },
                files: {
                    "tmp/lazy-data-attr-iife.js": [
                        'src/lazy.js',
                        'src/lazy-data-attr-head.js',
                        'src/lazy-data-attr.js'
                    ]
                }
            },

           "lazy-data-attr-poly": {
                options: {
                    useStrict: true,
                    prependSemicolon: false,
                    trimCode: true,
                    args: ['window', 'document'],
                    params: ['win', 'doc', 'undefined']
                },
                files: {
                    "tmp/lazy-data-attr-poly-iife.js": [
                        'src/lazy.js',
                        'src/lazy-data-attr-head.js',
                        'src/lazy-async-polyfill.js',
                        'src/lazy-data-attr.js'
                    ]
                }
            },

            "lazy-webp": {
                options: {
                    useStrict: true,
                    prependSemicolon: false,
                    trimCode: true,
                    args: ['window', 'document'],
                    params: ['win', 'doc', 'undefined']
                },
                files: {
                    "tmp/lazy-webp-iife.js": [
                        'src/lazy.js',
                        'src/lazy-ext:webp.js'
                    ]
                }
            },

           "lazy-webp-poly": {
                options: {
                    useStrict: true,
                    prependSemicolon: false,
                    trimCode: true,
                    args: ['window', 'document'],
                    params: ['win', 'doc', 'undefined']
                },
                files: {
                    "tmp/lazy-webp-poly-iife.js": [
                        'src/lazy.js',
                        'src/lazy-ext:webp.js',
                        'src/lazy-async-polyfill.js'
                    ]
                }
            },

           "lazy-webp-data-attr": {
                options: {
                    useStrict: true,
                    prependSemicolon: false,
                    trimCode: true,
                    args: ['window', 'document'],
                    params: ['win', 'doc', 'undefined']
                },
                files: {
                    "tmp/lazy-webp-data-attr-iife.js": [
                        'src/lazy.js',
                        'src/lazy-ext:webp.js',
                        'src/lazy-data-attr-head.js',
                        'src/lazy-data-attr.js'
                    ]
                }
            },

           "lazy-webp-data-attr-poly": {
                options: {
                    useStrict: true,
                    prependSemicolon: false,
                    trimCode: true,
                    args: ['window', 'document'],
                    params: ['win', 'doc', 'undefined']
                },
                files: {
                    "tmp/lazy-webp-data-attr-poly-iife.js": [
                        'src/lazy.js',
                        'src/lazy-ext:webp.js',
                        'src/lazy-data-attr-head.js',
                        'src/lazy-async-polyfill.js',
                        'src/lazy-data-attr.js'
                    ]
                }
            },

           "lazybg": {
                options: {
                    useStrict: true,
                    prependSemicolon: false,
                    trimCode: true,
                    args: ['window', 'document'],
                    params: ['win', 'doc', 'undefined']
                },
                files: {
                    "tmp/lazybg-iife.js": [
                        'src/lazybg.js'
                    ]
                }
            },

           "polyfill": {
                options: {
                    useStrict: true,
                    prependSemicolon: false,
                    trimCode: true,
                    args: ['window', 'document'],
                    params: ['win', 'doc']
                },
                files: {
                    "tmp/intersectionobserver-polyfill.js": [
                        'src/intersectionobserver-polyfill.js'
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
                js: [
                    'src/gcc-define.js',
                    'tmp/lazy-iife.js'
                ],
                jsOutputFile: 'dist/lazy.js',
                maxBuffer: 30000,
                noreport: true,
                options: {
                    compilation_level: 'ADVANCED_OPTIMIZATIONS',
                    language_in: 'ECMASCRIPT5_STRICT',
                    externs: externs,
                    define: ['WEBP_EXTENSION=false']
                }
            },
            "lazy-tiny": {
                closurePath: '../../closure-compiler',
                js: [
                    'src/gcc-define.js',
                    'tmp/lazy-tiny-iife.js'
                ],
                jsOutputFile: 'dist/lazy-tiny.js',
                maxBuffer: 30000,
                noreport: true,
                options: {
                    compilation_level: 'ADVANCED_OPTIMIZATIONS',
                    language_in: 'ECMASCRIPT5_STRICT',
                    externs: externs,
                    define: ['WEBP_EXTENSION=false']
                }
            },
            "lazy-poly": {
                closurePath: '../../closure-compiler',
                js: [
                    'src/gcc-define.js',
                    'tmp/lazy-poly-iife.js'
                ],
                jsOutputFile: 'dist/lazy+polyfill.js',
                maxBuffer: 30000,
                noreport: true,
                options: {
                    compilation_level: 'ADVANCED_OPTIMIZATIONS',
                    language_in: 'ECMASCRIPT5_STRICT',
                    externs: externs,
                    define: ['WEBP_EXTENSION=false']
                }
            },
            "lazy-data-attr": {
                closurePath: '../../closure-compiler',
                js: [
                    'src/gcc-define.js',
                    'tmp/lazy-data-attr-iife.js'
                ],
                jsOutputFile: 'dist/lazy+data-attr.js',
                maxBuffer: 30000,
                noreport: true,
                options: {
                    compilation_level: 'ADVANCED_OPTIMIZATIONS',
                    language_in: 'ECMASCRIPT5_STRICT',
                    externs: externs,
                    define: ['WEBP_EXTENSION=false']
                }
            },
            "lazy-data-attr-poly": {
                closurePath: '../../closure-compiler',
                js: [
                    'src/gcc-define.js',
                    'tmp/lazy-data-attr-poly-iife.js'
                ],
                jsOutputFile: 'dist/lazy+data-attr+polyfill.js',
                maxBuffer: 30000,
                noreport: true,
                options: {
                    compilation_level: 'ADVANCED_OPTIMIZATIONS',
                    language_in: 'ECMASCRIPT5_STRICT',
                    externs: externs,
                    define: ['WEBP_EXTENSION=false']
                }
            },


            "lazy-webp": {
                closurePath: '../../closure-compiler',
                js: [
                    'src/gcc-define.js',
                    'tmp/lazy-webp-iife.js'
                ],
                jsOutputFile: 'dist/lazy+webp.js',
                maxBuffer: 30000,
                noreport: true,
                options: {
                    compilation_level: 'ADVANCED_OPTIMIZATIONS',
                    language_in: 'ECMASCRIPT5_STRICT',
                    externs: externs,
                    define: ['WEBP_EXTENSION=true']
                }
            },
            "lazy-webp-poly": {
                closurePath: '../../closure-compiler',
                js: [
                    'src/gcc-define.js',
                    'tmp/lazy-webp-poly-iife.js'
                ],
                jsOutputFile: 'dist/lazy+webp+polyfill.js',
                maxBuffer: 30000,
                noreport: true,
                options: {
                    compilation_level: 'ADVANCED_OPTIMIZATIONS',
                    language_in: 'ECMASCRIPT5_STRICT',
                    externs: externs,
                    define: ['WEBP_EXTENSION=true']
                }
            },
            "lazy-webp-data-attr": {
                closurePath: '../../closure-compiler',
                js: [
                    'src/gcc-define.js',
                    'tmp/lazy-webp-data-attr-iife.js'
                ],
                jsOutputFile: 'dist/lazy+webp+data-attr.js',
                maxBuffer: 30000,
                noreport: true,
                options: {
                    compilation_level: 'ADVANCED_OPTIMIZATIONS',
                    language_in: 'ECMASCRIPT5_STRICT',
                    externs: externs,
                    define: ['WEBP_EXTENSION=true']
                }
            },
            "lazy-webp-data-attr-poly": {
                closurePath: '../../closure-compiler',
                js: [
                    'src/gcc-define.js',
                    'tmp/lazy-webp-data-attr-poly-iife.js'
                ],
                jsOutputFile: 'dist/lazy+webp+data-attr+polyfill.js',
                maxBuffer: 30000,
                noreport: true,
                options: {
                    compilation_level: 'ADVANCED_OPTIMIZATIONS',
                    language_in: 'ECMASCRIPT5_STRICT',
                    externs: externs,
                    define: ['WEBP_EXTENSION=true']
                }
            },

            "polyfill": {
                closurePath: '../../closure-compiler',
                js: 'tmp/intersectionobserver-polyfill.js',
                jsOutputFile: 'dist/intersectionobserver-polyfill.js',
                maxBuffer: 30000,
                noreport: true,
                options: {
                    compilation_level: 'SIMPLE_OPTIMIZATIONS',
                    language_in: 'ECMASCRIPT5_STRICT',
                    externs: externs
                }
            },

            "lazybg": {
                closurePath: '../../closure-compiler',
                js: [
                    'src/gcc-define.js',
                    'tmp/lazybg-iife.js'
                ],
                jsOutputFile: 'dist/lazybg.js',
                maxBuffer: 30000,
                noreport: true,
                options: {
                    compilation_level: 'ADVANCED_OPTIMIZATIONS',
                    language_in: 'ECMASCRIPT5_STRICT',
                    externs: externs,
                    define: ['WEBP_EXTENSION=false']
                }
            },

            "lazybg-webp": {
                closurePath: '../../closure-compiler',
                js: [
                    'src/gcc-define.js',
                    'tmp/lazybg-iife.js'
                ],
                jsOutputFile: 'dist/lazybg+webp.js',
                maxBuffer: 30000,
                noreport: true,
                options: {
                    compilation_level: 'ADVANCED_OPTIMIZATIONS',
                    language_in: 'ECMASCRIPT5_STRICT',
                    externs: externs,
                    define: ['WEBP_EXTENSION=true']
                }
            }
        }
    });

    // Load Dependencies
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.registerTask('build', [
        'iife',
        'closure-compiler:lazy',
        'closure-compiler:lazy-tiny',
        'closure-compiler:lazy-poly',
        'closure-compiler:lazy-data-attr',
        'closure-compiler:lazy-data-attr-poly',

        'closure-compiler:lazy-webp',
        'closure-compiler:lazy-webp-poly',
        'closure-compiler:lazy-webp-data-attr',
        'closure-compiler:lazy-webp-data-attr-poly',

        'closure-compiler:lazybg',
        'closure-compiler:lazybg-webp'
    ]);

    grunt.registerTask('lazy', [
        'iife:lazy',
        'closure-compiler:lazy'
    ]);


    grunt.registerTask('webp', [
        'iife:lazy-webp',
        'closure-compiler:lazy-webp',
        'closure-compiler:lazybg-webp'
    ]);

    grunt.registerTask('lazybg', [
        'iife:lazybg',
        'closure-compiler:lazybg'
    ]);

    grunt.registerTask('tiny', [
        'iife:lazy',
        'closure-compiler:lazy-tiny'
    ]);

    grunt.registerTask('polyfill', [
        'iife:polyfill',
        'closure-compiler:polyfill'
    ]);

    grunt.registerTask('default', ['']);
};