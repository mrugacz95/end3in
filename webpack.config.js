var config = {
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],

    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
};

var end3in = Object.assign({}, config, {
    entry: './src/main.ts',
    output: {
        path: `${__dirname}/dist/`,
        filename: `end3in.js`,
        libraryTarget: 'var',
        library: 'end3in',
    },
    optimization: {
        minimize: false,
    },
})
var demo = Object.assign({}, config, {
    entry:  './demo/demo.ts',
    output: {
        path: `${__dirname}/dist/`,
        filename: `demo.js`
    }
})
module.exports = [end3in, demo]