const path = require("path");
//const CompressionWebpackPlugin = require('compression-webpack-plugin')
//const productionGzipExtensions = ['js', 'css']

 
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  publicPath: "./",
  productionSourceMap: false,
  lintOnSave:false,
  devServer: {
    proxy: {
      "/chat": {
       //target: "http://192.168.0.100",
        target: "http://192.168.50.135:8080",
       //    target:"http://118.31.110.200",
     // target:"http://192.168.50.163:8080",
     //   target: "http://192.168.20.100:8000",
      //  target:"http://yaoyang.iok.la",
        changeOrigin: true,
        pathRewrite: {
          '^/chat': '/chat'
        }
      }
    }
  },
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: false,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {},
    // 启用 CSS modules for all css / pre-processor files.
    modules: false
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('vue$','vue/dist/vue.esm.js' )
      .set("@", resolve("/src"))
      .set("assets", resolve("/src/assets"))
      .set("components", resolve("/src/components"))
      .set("public", resolve("/public"));
  },
};
