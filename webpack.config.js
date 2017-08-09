const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');


const config = {
    context: __dirname,
    entry: {
        bundle: './frontend/app.js',
    },
    output: {
        filename: 'app.bundle.js',
        path: __dirname+'/static/build',
        library: 'bundle'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    // target: 'node',
    node: {
        fs: 'empty'
    },
    module: {
        loaders: [
            // {
            //     test: /\.(js|jsx)?$/,
            //     exclude: [/node_modules/],
            //     loader: "babel-loader",
            //     // loader: 'istanbul-instrumenter-loader',
            //     query: {
            //         presets: ['react']
            //     }
            // },
            // {
            //     test: /\.scss$/,
            //     loader: ExtractTextPlugin.extract('style-loader', 'css-loader!resolve-url!sass-loader?sourceMap')
            // },
            // {
            //     test: /\.css$/,
            //     loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            // },
            // {
            //     test: /\.woff2?$|\.ttf$|\.eot$|\.svg$|\.png|\.jpe?g|\.gif$/,
            //     loader: 'file-loader'
            // }
        ],
        rules: [
            {
                test: /\.(js|jsx)?$/,
                // exclude: [/node_modules/],
                include: [
                    path.resolve(__dirname, "frontend"),
                    // path.resolve(__dirname, "node_modules\\reactjs-percentage-circle\\src"),
                ],
                loader: "babel-loader",
                query: {
                    presets: ['react','es2015']
                }
            },
            {
                test: /\.css$/,
                // include: [
                //     path.resolve(__dirname, "frontend"),
                //     path.resolve(__dirname, "node_modules\\reactjs-percentage-circle\\src"),
                // ],
                use: [ 'style-loader', 'css-loader' ]
            },
        ]
    },
    // plugins: [
    //     new ExtractTextPlugin('./frontend/css/app.css', {
    //         allChunks: true
    //     })
    // ]
};

module.exports = config;