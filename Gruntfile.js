/*!
 *   Copyright 2014-2015 CoNWeT Lab., Universidad Politecnica de Madrid
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        bower: {
            install: {
                options: {
                    layout: function (type, component, source) {
                        return type;
                    },
                    targetDir: './build/lib/lib'
                }
            }
        },

        eslint: {
            source: {
                files: [{
                    expand: true,
                    cwd: 'src/js',
                    src: [
                        '**/*.js'
                    ]
                }]
            },
            test: {
                options: {
                    configFile: ".eslint-jasminerc"
                },
                files: [{
                    expand: true,
                    cwd: 'src/test',
                    src: [
                        '**/*.js'
                    ]
                }]
            }
        },

        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'src/lib',
                    src: '*',
                    dest: 'build/src/lib'
                }]
            }
        },

        compress: {
            widget: {
                options: {
                    mode: 'zip',
                    archive: 'build/<%= pkg.vendor %>_<%= pkg.name %>_<%= pkg.version %>-dev.wgt'
                },
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: [
                        'DESCRIPTION.md',
                        'css/**/*',
                        'doc/**/*',
                        'images/**/*',
                        'index.html',
                        'config.xml'
                    ]
                }, {
                    expand: true,
                    cwd: 'build/lib',
                    src: [
                        'lib/**/*'
                    ]
                }, {
                    expand: true,
                    cwd: 'build/src',
                    src: [
                        'lib/**/*'
                    ]
                }, {
                    expand: true,
                    cwd: '.',
                    src: [
                        'LICENSE'
                    ]
                }]
            }
        },

        clean: {
            build: {
                src: ['build']
            },
            temp: {
                src: ['build/src']
            }
        },

        replace: {
            version: {
                overwrite: true,
                src: ['src/config.xml'],
                replacements: [{
                    from: /version=\"[0-9]+\.[0-9]+\.[0-9]+(([ab]|rc)?[0-9]+)?(-dev)?\"/g,
                    to: 'version="<%= pkg.version %>"'
                }]
            }
        },

        // ES6
        karma: {
            headless: {
                configFile: 'karma.conf.js',
                options: {
                    browsers: ['PhantomJS']
                }
            },

            all: {
                configFile: 'karma.conf.js',
                options: {
                    browsers: ['PhantomJS', 'Firefox']
                }
            },

            debug: {
                configFile: 'karma.conf.js',
                options: {
                    singleRun: false
                }
            }
        },

        shell: {
            webpackproduction: {
                command: './node_modules/.bin/webpack --config webpack-production.config.js --progress --profile --colors'
            },
            webpacktest: {
                command: './node_modules/.bin/webpack --config webpack-production-no-minimize.config.js --progress --profile --colors --devtool "#cheap-module-eval-source-map"'
            }
        }
    });

    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-text-replace');

    grunt.registerTask('test', [
        'eslint',
        'karma:headless',
    ]);

    grunt.registerTask('webpack', 'shell:webpackproduction');
    grunt.registerTask('webpacktest', 'shell:webpacktest');

    grunt.registerTask('build', [
        'clean:temp',
        'webpacktest',
        'copy:main',
        'replace:version',
        'compress:widget'
    ]);

    grunt.registerTask('buildminify', [
        'clean:temp',
        'webpack',
        'copy:main',
        'replace:version',
        'compress:widget'
    ]);

    grunt.registerTask('default', [
        'bower:install',
        'test',
        'buildminify'
    ]);

    grunt.registerTask('fast', [
        'bower:install',
        'test',
        'build'
    ]);
};
