module.exports = {
    entry: './src/main.js',
    output: {
        path: `${__dirname}/build/`,
        filename: "end3in.js"
    },
    optimization: {
		minimize: false,
        usedExports: true,
        sideEffects: true
	},
};