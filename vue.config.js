const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/tools/map/',
  chainWebpack(config) {
    config.plugin('html').tap((args) => {
      args[0].title = '百度地图打点工具';
      return args;
    })
  },
})
