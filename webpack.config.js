// module.exports = {
//     entry: '',               // 入口文件
//     output: {},              // 出口文件
//     module: {},              // 处理对应模块
//     plugins: [],             // 对应的插件
//     devServer: {},           // 开发服务器配置
//     mode: 'development'      // 模式配置
// }

const path = require('path');
// 插件都是一个类，所以我们命名的时候尽量用大写开头
let HtmlWebpackPlugin = require('html-webpack-plugin');

// 拆分css样式的插件
let ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
let CleanWebpackPlugin = require('clean-webpack-plugin');

let webpack = require('webpack');

let styleLess = new ExtractTextWebpackPlugin('css/style.css');
let resetCss = new ExtractTextWebpackPlugin('css/reset.css');

module.exports = {
    // 1.写成数组的方式就可以打出多入口文件，不过这里打包后的文件都合成了一个
    // entry: ['./src/index.js', './src/login.js'],
    // 2.真正实现多入口和多出口需要写成对象的方式
    entry: {
        index: './src/index.js',
        login: './src/login.js'
    },
    output: {
        // 1. filename: 'bundle.js',
        // 2. [name]就可以将出口文件名和入口文件名一一对应
        // filename: '[name].js',      // 打包后会生成index.js和login.js文件
        // 添加hash可以防止文件缓存，每次都会生成4位的hash串
        filename: '[name].[hash:4].js', 
        path: path.resolve('dist')
    },
    resolve: {
        // 别名
        alias: {
            // $: './src/jquery.js'
        },
        // 省略后缀
        extensions: ['.js', '.json', '.css']
    },
    module: {
        rules: [
            {
                test: /\.css$/,     // 解析css
                // 第一种方式
                // use: ['style-loader', 'css-loader'] // 从右向左解析
                // 第二种方式
                /* 
                    也可以这样写，这种方式方便写一些配置参数
                    use: [
                        {loader: 'style-loader'},
                        {loader: 'css-loader'}
                    ]
                */
                // 第三种方式
                // use: ExtractTextWebpackPlugin.extract({
                //     // 将css用link的方式引入就不再需要style-loader了
                //     use: 'css-loader'
                // })
                // 第四种方式
                use: resetCss.extract({
                    use: ['css-loader', 'postcss-loader'],
                })
            },
            {
                test: /\.less$/,
                use: styleLess.extract({
                    use: ['css-loader', 'postcss-loader'],
                })
            },
            {
                test: /\.(jpe?g|png|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,    // 小于8k的图片自动转成base64格式，并且不会存在实体图片
                            outputPath: 'images/'   // 图片打包后存放的目录
                        }
                    }
                ]
            },
            {
                test: /\.(htm|html)$/,
                use: 'html-withimg-loader'
            },
            {
                test: /\.(eot|ttf|woff|svg)$/,
                use: 'file-loader'
            },
            {
                test:/\.js$/,
                use: 'babel-loader',
                include: /src/,          // 只转化src目录下的js
                exclude: /node_modules/  // 排除掉node_modules，优化打包速度
            },
        ]
    },
    // 提取公共代码
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {   // 抽离第三方插件
                    test: /node_modules/,   // 指定是node_modules下的第三方包
                    chunks: 'initial',
                    name: 'vendor',  // 打包后的文件名，任意命名    
                    // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
                    priority: 10    
                },
                utils: { // 抽离自己写的公共代码，utils这个名字可以随意起
                    chunks: 'initial',
                    name: 'utils',  // 任意命名
                    minSize: 0    // 只要超出0字节就生成一个新包
                }
            }
        }
    },
    plugins: [
        // 拆分后会把css文件放到dist目录下的css/style.css
        // new ExtractTextWebpackPlugin('css/style.css'),
        styleLess, 
        resetCss,
        // 通过new一下这个类来使用插件
        new HtmlWebpackPlugin({
            // 用哪个html作为模板
            // 在template目录下创建一个index.html页面当做模板来用
            template: './template/index.html',
            filename: 'index.html',
            chunks: ['index', 'vendor'],   // 对应关系,index.js对应的是index.html
            hash: true, // 会在打包好的bundle.js后面加上hash串
        }),
        new HtmlWebpackPlugin({
            // 用哪个html作为模板
            // 在template目录下创建一个login.html页面当做模板来用
            template: './template/login.html',
            filename: 'login.html',
            chunks: ['login', 'utils'],   // 对应关系,login.js对应的是login.html
            hash: true, // 会在打包好的bundle.js后面加上hash串
        }),
        // 打包前先清空
        new CleanWebpackPlugin('dist'),
        // 热替换，热替换不是刷新
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        contentBase: './dist',
        host: 'localhost',      // 默认是localhost
        port: 3000,             // 端口
        open: true,             // 自动打开浏览器
        hot: true               // 开启热更新
    },
    mode: 'development'
}


