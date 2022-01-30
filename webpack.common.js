const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    entry : "./src/index.js",
    mode :"development",
    output:{
        filename: "main-[contenthash].js",
        path : path.resolve(__dirname , "dist"),
        clean : true
    },
    module:{
        rules :[
            {
                test : /\.css$/,
                use : ["style-loader" , "css-loader"]
            },
            {
                test : /\.html$/,
                use :['html-loader']
            },
            {
                test : /\.(png | jpg | gif | svg)$/,
                use : {
                    loader : "file-loader",
                    options : {
                        name : "[name].[hash].[ext]",
                        outputPath : "assets"
                    }
                }
            }
        ]
    },
    plugins : [new HtmlWebpackPlugin({
        template:"./index.html"
    })]
}