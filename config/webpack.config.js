const path = require('path');
const webpack = require('webpack');
const ROOT = process.cwd(); // 根目录
const ENV = process.env.NODE_ENV;
const IsDev = (ENV === 'dev') ? true : false;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PostcssConfigPath = './config/postcss.config.js';
const Glob = require('glob');
const HappyPack = require('happypack');
const HappyThreadPool = HappyPack.ThreadPool({ size: (IsDev ? 4 : 10) });



let tempHtml = htmlEntry('./src/view/**/*.html'),
    tempJs = jsEntry('./src/js/**/*.js'),
    configPlugins = [
        new HappyPack({
            id: 'js',
            threadPool: HappyThreadPool,
            loaders: ['babel-loader']
        }),
        new HappyPack({
            id: 'styles',
            threadPool: HappyThreadPool,
            loaders: ['style-loader', 'css-loader', 'less-loader', 'postcss-loader']
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common'
        }),
        new ExtractTextPlugin({
            filename: 'css/[name].css?[contenthash:8]',
            allChunks: true
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ];

// html plugin批量导入
tempHtml.forEach(function(v) {
    configPlugins.push(new HtmlWebpackPlugin(v));
});
// 开发环境不压缩 js
// 配置
const config = {
    entry: tempJs,
    output: {
        filename: 'js/[name].js?[chunkhash:8]',
        chunkFilename: 'js/[name].js?[chunkhash:8]',
        path: path.resolve(ROOT, 'dist'),
        publicPath: '/'
    },
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader?id=js',
                    options: {
                        presets: ['env']
                    }
                }
            },
            {
                test: /\.(less|css)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader?id=styles',
                    use: [{
                            loader: 'css-loader?id=styles',
                            options: {
                                minimize: !IsDev
                            }
                        },
                        {
                            loader: 'less-loader?id=styles'
                        },
                        {
                            loader: 'postcss-loader?id=styles',
                            options: {
                                config: {
                                    path: PostcssConfigPath
                                }
                            }
                        }
                    ]
                })
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 100,
                        publicPath: '',
                        name: '/img/[name].[ext]?[hash:8]'
                    }
                }]
            },
            {
                test: /\.(eot|svg|ttf|woff)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 100,
                        publicPath: '',
                        name: '/font/[name].[ext]?[hash:8]'
                    }
                }]
            },
            {
                test: /\.(htm|html)$/i,
                loader: 'html-withimg-loader?min=false'
            }
        ]
    },
    resolve: {
        alias: {
            views: path.resolve(ROOT, './src/view')
        }
    },
    plugins: configPlugins,
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        proxy: {
            '/api': {
                target: 'https://app.piaoyoubang.com/',
                pathRewrite: { '^/api': '' },
                changeOrigin: true,
                secure: false,
            }

        },
        contentBase: [
            path.join(ROOT, 'src/')
        ],
        hot: false,
        host: 'localhost',
        port: 3005
    }
};

/**
 * 根据目录获取js入口
 */
function jsEntry(globPath) {
    let entries = {};
    Glob.sync(globPath).forEach(function(entry) {
        let basename = path.basename(entry, path.extname(entry)),
            pathname = path.dirname(entry);
        // js/lib/*.js 不作为入口
        if (!entry.match(/\/js\/lib\/common\\/)) {
            entries[pathname.split('/').splice(3).join('/') + '/' + basename] = pathname + '/' + basename;
        }
    });
    return entries;
}

/**
 * 根据目录获取 html 入口
 */
function htmlEntry(globPath) {
    let entries = [];
    Glob.sync(globPath).forEach(function(entry) {
        let basename = path.basename(entry, path.extname(entry)),
            pathname = path.dirname(entry),
            minifyConfig = IsDev ? '' : {
                removeComments: true,
                collapseWhitespace: true,
                minifyCSS: true,
                minifyJS: true
            };
        entries.push({
            filename: entry.split('/').splice(2).join('/'),
            template: entry,
            chunks: ['common', pathname.split('/').splice(3).join('/') + '/' + basename],
            minify: minifyConfig
        });

    });
    return entries;
}

module.exports = config;