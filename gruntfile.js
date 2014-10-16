module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        ts: {
            dev: {
                src: ["public/assets/scripts/src/main.ts"],
                outDir: 'public/assets/scripts/build/',
                options: {
                    target: 'es5',
                    module: 'amd',
                    sourceMap: false,
                    declaration: false,
                    removeComments: false,
                    noImplicitAny: false
                },
                reference: 'reference.ts'
            },

            prod: {
                src: ["public/assets/scripts/src/main.ts"],
                outDir: 'public/assets/scripts/build/',
                options: {
                    target: 'es5',
                    module: 'amd',
                    sourceMap: false,
                    declaration: false,
                    removeComments: false,
                    noImplicitAny: false,
                    fast: 'never' // disable fast compile
                },
                reference: 'reference.ts'
            }
        },

        requirejs: {
            compile: {
                options: {
                    'logLevel': 0,
                    'findNestedDependencies': true,
                    'baseUrl': 'public/assets/scripts/build',
                    'name': 'main',
                    'optimize': 'uglify2',
                    'uglify2': {
                        output: {
                            beautify: false
                        },
                        compress: {
                            sequences: true, // join consecutive statemets with the “comma operator”
                            properties: true, // optimize property access: a["foo"] → a.foo
                            dead_code: true, // discard unreachable code
                            drop_debugger: true, // discard “debugger” statements
                            unsafe: false, // some unsafe optimizations (see below)
                            conditionals: true, // optimize if-s and conditional expressions
                            comparisons: true, // optimize comparisons
                            evaluate: true, // evaluate constant expressions
                            booleans: true, // optimize boolean expressions
                            loops: true, // optimize loops
                            unused: true, // drop unused variables/functions
                            hoist_funs: true, // hoist function declarations
                            hoist_vars: true, // hoist variable declarations
                            if_return: true, // optimize if-s followed by return/continue
                            join_vars: true, // join var declarations
                            cascade: true, // try to cascade `right` into `left` in sequences
                            side_effects: true, // drop side-effect-free statements
                            warnings: true, // warn about potentially dangerous optimizations/code
                            global_defs: {} // global definitions
                        },
                        warnings: true,
                        mangle: true
                    },
                    'out': 'public/assets/scripts/min/main.js'
                }
            }
        },

        tslint: {
            options: {
                configuration: {
                    'rules': {
                        'class-name': false, // disables strict PascalCase class names etc (disabled cause google.maps.d.ts was being a pain)
                        'curly': true,
                        'eofline': true,
                        'forin': true,
                        'indent': [true, 4],
                        'label-position': true,
                        'label-undefined': true,
                        'max-line-length': [false, 140],
                        'no-arg': true,
                        'no-bitwise': true,
                        'no-console': [true,
                            'debug',
                            'info',
                            // 'time',
                            // 'timeEnd',
                            'trace'
                        ],
                        'no-construct': true,
                        'no-debugger': true,
                        'no-duplicate-key': true,
                        'no-duplicate-variable': true,
                        'no-empty': true,
                        'no-eval': false,
                        'use-strict': true, // dont think this actually works
                        'no-string-literal': false, // lets us do window['whateva'] (since we cant do window.whateva)
                        'no-trailing-whitespace': true,
                        'no-unreachable': true,
                        'one-line': [false //,
                            // 'check-open-brace',
                            // 'check-catch',
                            // 'check-else'
                            // 'check-whitespace'
                        ],
                        'quotemark': [true, 'single'],
                        'radix': true,
                        'semicolon': true,
                        'triple-equals': [true, 'allow-null-check'],
                        'variable-name': false,
                        'whitespace': [false
                            // 'check-branch',
                            // 'check-decl',
                            // 'check-operator',
                            // 'check-separator',
                            // 'check-type'
                        ]
                    }
                }
            },
            files: {
                src: ['public/assets/scripts/src/**/*.ts']
            }
        },

        concat: {
            options: {
                separator: ';',
            },
            dist: {
                files: {
                    'public/assets/scripts/build/plugins.js': ['public/assets/scripts/src/lib/jquery.js',
                                                             'public/assets/scripts/src/lib/threejs/three.js',
                                                             'public/assets/scripts/src/lib/stats.min.js',
                                                             'public/assets/scripts/src/lib/threejs/threex.windowresize.js',
                                                             'public/assets/scripts/src/lib/threejs/threex.fullscreen.js',
                                                             'public/assets/scripts/src/lib/threejs/threex.keyboardstate.js',
                                                             'public/assets/scripts/src/lib/threejs/Detector.js',
                                                             'public/assets/scripts/src/lib/threejs/TrackballControls.js',
                                                             'public/assets/scripts/src/lib/threejs/OrbitControls.js'],
                    'public/assets/scripts/build/require.js': ['public/assets/scripts/src/lib/require.js']
                }
            },
        },

        uglify: {
            options: {
                compress: {
                    dead_code: true
                },
                preserveComments: 'some'
            },
            plugins: {
                files: {
                    'public/assets/scripts/min/require.js': ['public/assets/scripts/build/require.js'],
                    'public/assets/scripts/min/plugins.min.js': ['public/assets/scripts/build/plugins.js']
                }
            }
        },

        compass: {
            dev: {
                options: {
                    config: 'config.rb',
                }
            },
            build: {
                options: {
                    config: 'config.rb',
                }
            },
            clean: {
                options: {
                    clean: true
                }
            }
        },

        play: {
            dev: {
                file: 'sounds/compiled.wav'
            },
            build: {
                file: 'sounds/filesdone.mp3'
            }
        },

        imagemin: {                          // Task
            // static: {                          // Target
            //     options: {                       // Target options
            //         optimizationLevel: 3
            //         // use: [mozjpeg()]
            //     },
            //     files: {                         // Dictionary of files
            //         'dist/img.png': 'src/img.png', // 'destination': 'source'
            //         'dist/img.jpg': 'src/img.jpg',
            //         'dist/img.gif': 'src/img.gif'
            //     }
            // },
            dynamic: {                         // Another target
                files: [{
                    expand: true,                  // Enable dynamic expansion
                    cwd: 'public/assets/work/',                   // Src matches are relative to this path
                    src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
                    dest: 'public/assets/min-work/'                  // Destination path prefix
                }]
            }
        },

        watch: {
            js: {
                files: ['public/assets/scripts/src/**/*.ts'],
                tasks: ['tslint', 'ts:dev', 'play:dev']
            },
            css: {
                files: ['public/assets/styles/sass/**/*.scss'],
                tasks: ['compass:dev']
            },
            cachebust: {
                files: ['public/assets/scripts/src/**/*.ts', 'public/assets/styles/sass/**/*.scss'],
                tasks: ['file-creator', 'play:dev']
            }
        },

        'file-creator': {
            cachebust: {
                'public/cachebust.php': function (fs, fd, done) {
                    fs.writeSync(fd, '<?php\n\n/* Generated by grunt '  + (new Date) +  '*/\n\nreturn ' + (+new Date) + ';\n\n/* Bustin\' makes me feel good */');
                    done();
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-file-creator');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-tslint');
    grunt.loadNpmTasks('grunt-play'); // cause why not

    grunt.registerTask('dev', ['tslint', 'ts:dev', 'compass:dev', 'play:dev', 'watch']);
    grunt.registerTask('build', ['compass:clean', 'compass:build', 'tslint', 'ts:prod', 'requirejs:compile', 'concat', 'uglify', 'file-creator', 'play:build']);
    grunt.registerTask('build-js', ['tslint', 'ts:prod', 'requirejs:compile', 'concat', 'uglify', 'file-creator', 'play:build']);
    grunt.registerTask('build-css', ['compass:clean', 'compass:build', 'file-creator', 'play:build']);


    // no sounds
    grunt.registerTask('dev-nofun', ['tslint', 'ts:dev', 'compass:dev', 'watch']);
    grunt.registerTask('build-nofun', ['compass:clean', 'compass:build', 'tslint', 'ts:prod', 'requirejs:compile', 'concat', 'uglify']);
    grunt.registerTask('build-js-nofun', ['tslint', 'ts:prod', 'requirejs:compile', 'concat', 'uglify']);
    grunt.registerTask('build-css-nofun', ['compass:clean', 'compass:build']);
};