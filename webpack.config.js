module.exports = {
    mode: "development",
    entry: "./src/index.ts",
    output: {
        filename: "roll20.js"
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.ts$/, loader: "ts-loader" }
        ]
    }
};