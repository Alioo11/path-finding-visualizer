const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require("webpack-merge")
const common = require ("./webpack.common")


module.exports = merge.merge(common ,{
    mode: "development",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
        clean: true
    },
    devServer: {
        compress: true,
        port: 9000,
      },
})