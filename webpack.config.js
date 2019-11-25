const path = require("path")

module.exports = {
    entry: {
        clicker: "./bin/js/popup.js",
        options: "./bin/js/options.js",
        contentScript: "./bin/js/contentScript.js",
        background: "./bin/js/background.js"
    },
    output: {
        path: path.resolve(__dirname, "bin", "dist"),
        filename: "[name].bundle.js"
    },
    watch: true

}