import path from "path"
const __dirname = path.resolve();

export default {
    entry: './src/main.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        path: `${__dirname}/build/`,
        filename: "end3in.js",
        library:  {
            type: "var",
            name: "end3in"
        }
    },
    optimization: {
        minimize: false,
        usedExports: true,
        sideEffects: true
    },
};