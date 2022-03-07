const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const common = require("./webpack.common")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = merge.merge(common , {
    plugins : [
        new HtmlWebpackPlugin({template:"./index.html",}),
        new MiniCssExtractPlugin({ filename: "[name].[contenthash].css" }),
],
    mode: "production",
    output: {
        filename: "main-[contenthash].js",
        path: path.resolve(__dirname, "build"),
        clean: true
    },
    module:{
        rules :[
            {
                test : /\.css$/,
                use : [ MiniCssExtractPlugin.loader ,"css-loader"]
            }
        ]
    }
})