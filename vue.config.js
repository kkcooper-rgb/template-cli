const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  pages: {
    index: {
        entry: `src/${process.env.VUE_APP_BUILD_TARGET_FILE || 'main'}_${process.env.VUE_APP_BUILD_TARGET_TYPE || 'pc'}.js`,
        template: 'public/index.html',
        filename: 'index.html',
        chunks: ['index']
    }
  },
  filenameHashing: false,
  publicPath: "./",
  outputDir: "dist",
  productionSourceMap: false,
  transpileDependencies: true
})
