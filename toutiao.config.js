// 入口
/*
    从page/下开始写路径
    eg: react_one 实际读取路径是  project-name/src/page/react_one/react_one.js
    公共库 reactlib 含有的js文件用数组形式书写，可直接引用node_modules，也可引用 实际路径，
    eg： reactlib 中的 ‘react’ 也可以直接写成 './src/assets/js/react.min.js'
*/
var entry = {
    react_one: 'react_one/react_one.js',
    react_two: 'react_two/react_two.js',
    reactlib: ['react','react-router','react-dom']
}
// 公共 js库 配置
/*
    此处name为上面entry里面的key，
    如 reactlib 这个公共js库，被 react_one和react_two同时用到，在chunks里需加上 'react_one','react_two'
*/
var commonlib = [
    {
        name: 'reactlib',
        chunks: ['react_one','react_two']
    }
];
// 配置模版路径
/*
    配置模版路径，从src/page/开始写,
    chunks 配置当前templage所需js块，值为  entry 的 key
*/
var html = [
    {
        template: 'react_one/react_one.html',
        chunks: ['reactlib','react_one']
    },
    {
        template: 'react_two/react_two.html',
        chunks: ['reactlib','react_two']
    }
];


//  !!!  entry , commonlib , html !!! 必需项

// 下面就是一些扩展配置，此处我只用到resolve.alias，方便简洁路径引用 ！！非必需配置！！
var path = require('path');
var alias = {
    component : path.join(__dirname,'./src/component')
};
var externals = {};
var plugins = [];

module.exports = {
    entry: entry,
    html: html,
    commonlib: commonlib,
    alias: alias,
    externals: externals,
    plugins: plugins
}