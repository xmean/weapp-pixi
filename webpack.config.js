var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'weapp-pixi.js',
        library: 'weapp-pixi',
        libraryTarget: 'umd'
    },
    externals: {
        'pixi.js': 'pixi.js',
        // 'spark-md5' : 'spark-md5',
        // 'xmldom' : 'xmldom',
        // 'weapp-pixi-adapter': 'weapp-pixi-adapter'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    configFile: './babel.config.js'
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            }
        ]
    },
    stats: {
        colors: true
    },
    devtool: 'source-map'
};