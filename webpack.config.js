module.exports = {
    entry: './src/main.js',
    output: {
        path: `${__dirname}/build/`,
        filename: "end3in.js"
    },
    optimization: {
		// We no not want to minimize our code.
		minimize: false,
        usedExports: true,
        sideEffects: true
	},
};