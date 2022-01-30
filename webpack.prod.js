const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const common = require("./webpack.common")

module.exports = merge.merge(common , {
    mode: "production",
    output: {
        filename: "main-[contenthash].js",
        path: path.resolve(__dirname, "build"),
        clean: true
    }
})