var path = require('path');
var webpack = require('webpack');

module.exports = function(config) {
    var entry = (config.dev) ? ['webpack-dev-server/client?http://localhost:3000',
                                'webpack/hot/only-dev-server',
                                './src/js/init'] : './src/js/init';
    var output = {
        path: path.join(__dirname, 'src/lib'),
        filename: (config.dev) ? 'bundle.js' : "app.min.js",
        publicPath: '/static'
    };

    var target = "web";

    var plugins = [];

    if (config.dev) {
        plugins.push(new webpack.HotModuleReplacementPlugin());
    }

    if (config.minimize) {
        plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                compressor: {
                    warnings: false
                }
            }),
            new webpack.optimize.DedupePlugin(),
            new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: JSON.stringify("production")
                }
            }),
            new webpack.NoErrorsPlugin()
        );
    }

    // var preloaders = (config.dev) ? [] : [{
    //     test: /\.js$/,
    //     loader: "source-map-loader"
    // }];

    var devtool = (config.dev) ? "" : "cheap-module-source-map";

    var loaders = (config.dev) ? [{
        test: /\.js$/,
        loaders: ['react-hot', 'babel'],
        include: path.join(__dirname, 'src')
    }] : [{
        test: /\.js$/,
        loaders: ["babel?stage=1"],
        include: path.join(__dirname, 'src/js')
    }];

    return {
        entry: entry,
        output: output,
        target: target,
        devtool: devtool,
        plugins: plugins,
        module: {
            loaders: loaders
        },
        modulesDirectories: ["node_modules"]
    };
};
