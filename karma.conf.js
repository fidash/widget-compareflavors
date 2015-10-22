/* global module */
var path = require("path");
module.exports = function (config) {
    "use strict";
    config.set({
        autoWatch: true,
        singleRun: true,

        frameworks: ["jasmine-jquery", "jasmine"],

        files: [
            {
                pattern: "src/test/fixtures/*.html",
                watched: true,
                included: false,
                served: true
            },

            "node_modules/babel-core/browser-polyfill.js",
            "node_modules/mock-applicationmashup/lib/vendor/mockMashupPlatform.js",
            "src/test/js/*.spec.js"
        ],

        proxies: {
            "/base": "/base/src"
        },

        browsers: ["PhantomJS"],

        preprocessors: {
            "src/test/js/*.spec.js": ["webpack"]
        },

        webpack: {
            // webpack configuration
            module: {
                preLoaders: [
                    // transpile all files except testing sources with babel as usual
                    {
                        test: /\.js$/,
                        exclude: [
                            path.resolve("node_modules/")
                        ],
                        loader: "babel"
                    },
                    // transpile and instrument only testing sources with isparta
                    {
                        test: /\.js$/,
                        include: path.resolve("src/js/"),
                        loader: "isparta"
                    }
                ]
            },
            resolve: {
                modulesDirectories: [
                    "",
                    "src",
                    "node_modules"
                ]
            }
        },

        webpackMiddleware: {
            // webpack-dev-middleware configuration
            noInfo: true
        },

        // https://github.com/usrz/javascript-karma-verbose-reporter ??
        // https://github.com/mlex/karma-spec-reporter ??
        reporters: ["coverage", "nested"],
        colors: true,

        nestedReporter: {
            color: {
                should: "red",
                browser: "yellow"
            },
            icon: {
                failure: "✘ ",
                indent: "ட ",
                browser: ""
            }
        },

        coverageReporter: {
            instrumenters: {isparta: require("isparta")},
            instrumenter: {
                "src/js/*.js": "isparta"
            },

            reporters: [
                {
                    type: "text-summary"
                },
                {
                    type: "cobertura",
                    dir: "build/coverage",
                    subdir: normalizationBrowserName("xml")
                },
                {
                    type: "json",
                    dir: "build/coverage",
                    subdir: normalizationBrowserName("json")
                },
                {
                    type: "html",
                    dir: "build/coverage/",
                    subdir: normalizationBrowserName("html")
                }
            ]
        }
    });

    function normalizationBrowserName(extra) {
        return function (browser) {
            return browser.toLowerCase().split(/[ /-]/)[0] + "/" + extra;
        };
    }
};
