const path = require("path")

module.exports = {
    entry: {
        clicker: "./bin/js/clicker.js",
        options: "./bin/js/options.js"
    },
    output: {
        path: path.resolve(__dirname, "bin", "dist"),
        filename: "[name].bundle.js"
    },
    watch: true

}