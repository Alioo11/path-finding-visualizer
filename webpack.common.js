const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    entry : "./src/index.js",
    mode :"development",
    output:{
        filename: "js/main-[contenthash].js",
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
                test: /\.(jpe?g|png|gif)$/,
                type: 'asset/resource',
                generator: {
                    filename: `img/[ext]/[name]_[hash][ext]`
                }
            }
        ]
    },
    plugins : [new HtmlWebpackPlugin({
        template:"./index.html"
    })]
}