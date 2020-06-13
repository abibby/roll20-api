module.exports = {
    mode: "development",
    entry: "./src/index.ts",
    output: {
        filename: "roll20.js"
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [
            { test: /\.ts$/, loader: "ts-loader" }
        ]
    }
};