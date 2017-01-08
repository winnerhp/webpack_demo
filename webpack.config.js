var webpack = require('webpack');
var path = require('path');

var HtmlwebpackPlugin = require('html-webpack-plugin');
var HtmlwebpackRandomExtendPlugin = require('html-webpack-random-extend-plugin');
var UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
var DedupePlugin = require('webpack/lib/optimize/DedupePlugin');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var WebpackMd5Hash = require('webpack-md5-hash');
var autoprefixer = require('autoprefixer');
var ResolverPlugin = webpack.ResolverPlugin;
var DirectoryDescriptionFilePlugin = webpack.ResolverPlugin.DirectoryDescriptionFilePlugin;

var ttConfig = require('./toutiao.config.js'),
    ttentry = ttConfig.entry,
    tthtml = ttConfig.html,
    ttcommonlib = ttConfig.commonlib;

var cdnPrefix = ttConfig.cdnPrefix
    ? ttConfig.cdnPrefix
    : ['//s3.pstatp.com/toutiao/','//s3a.pstatp.com/toutiao','//s3b.pstatp.com/toutiao'];


var isLocal = process.env.NODE_ENV.toString() == 'development' ? true : false;

var project_name = path.parse(__dirname).name,
    src_path = path.resolve(__dirname,'src'),
    output_path = path.join(__dirname,'./output'),
    page_path = path.resolve(src_path,'page'),
    component_path = path.resolve(src_path,'component');

var plugins = [
    // 对bower_components中模块的支持
    new ResolverPlugin( 
        [ new DirectoryDescriptionFilePlugin( 'bower.json', [ 'main' ] ) ], 
        [ 'normal', 'loader' ] 
    ),
    new WebpackMd5Hash()
];

// for React single config
(function() {
    if(!isLocal) {
        plugins.push(new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }))
    }
})();

// html模版配置
!(function(htmls) {
    htmls.forEach(function(item) {
        var params = {
            filename : isLocal ? item.template : 'template/'+project_name+'/'+item.template,
            template : path.join(page_path,item.template),
            chunks : item.chunks,
            inject: true,
            minify: {
              removeComments: true
            }
        }
        plugins.push(new HtmlwebpackPlugin(params))
    })
})(tthtml)

// entry js配置
!function(entries) {
    for(var i in entries) {
        if(typeof(entries[i]) == 'string' ) {
            ttentry[i] = path.join(page_path,entries[i])
        }
    }
}(ttentry)

// css 配置
var pkgcss = new ExtractTextPlugin(isLocal ? "css/[name].css" : "resource/"+project_name+"/css/[name].[chunkhash:8].css");
plugins.push(pkgcss);

// 公共js配置
!function(commonjs) {
    commonjs.forEach(function(item) {
        var params = {
            name: item.name,
            filename: isLocal ? 'js/'+item.name+'.js' : 'resource/'+project_name+'/js/'+item.name+'.[hash:8].js',
            chunks: item.chunks
        }
        plugins.push(new CommonsChunkPlugin(params))
    })
}(ttcommonlib)

// 插件配置

if(ttConfig.plugins) plugins.concat(ttConfig.plugins);

if(!isLocal) {
    require('shelljs').rm('-rf','./output');
    plugins = plugins.concat([
        new HtmlwebpackRandomExtendPlugin({cdnPrefix: cdnPrefix}),
        new DedupePlugin(),
        new UglifyJsPlugin({compress: {warnings: false}})
    ])
}

module.exports = {

    devtool: isLocal ? '#source-map' : false,

    entry : ttentry,
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,
        color: false,
        port: 8080,
        host: '0.0.0.0',
        contentBase: './output',
        proxy: {
            '/mock/*': {
                target: 'http://127.0.0.1:8080',
                secure: false,
            }
        }
    },
    output : {
        filename : isLocal ? "js/[name].js" : "resource/"+project_name+"/js/[name].[chunkhash:8].js",
        chunkFilename: isLocal ? "js/[id].bundle.js" : "resource/"+project_name+"/js/[id].bundle.[chunkhash:8].js",
        path :  output_path,
        publicPath : '/'
    },
    module : {
        loaders: [
            {
                test: /\.(js|jsx|es6)$/,
                exclude: /node_modules/,
                loader: 'babel-loader?presets[]=es2015&presets[]=react'
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader?minimize!postcss-loader!less-loader')
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader?minimize!postcss-loader')
            },
            {
                test: /\.(jpeg|jpg|png|gif)$/,
                loader: isLocal ? 'url?limit=4096&name=images/[name].[ext]' : 'url?limit=4096&name=resource/'+project_name+'/images/[name].[hash:8].[ext]'
            }
        ]
    },
    postcss: function() {
        return [ autoprefixer({ browsers: ['iOS 7','> 5%'] }) ]
    },
    plugins : plugins,
    resolve : {
        exclude: [process.cwd() + '/node_modules'],
        root: [process.cwd() + '/node_modules'],
        modulesDirectories: [ 'node_modules', 'bower_components' ],
        extensions: ['', '.js', '.jsx', '.json', '.tsx', '.ts', '.es6','.vue'],
        alias: ttConfig.alias
    },
    externals: ttConfig.externals
}