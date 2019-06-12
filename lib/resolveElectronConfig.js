const Config = require('webpack-chain')

module.exports = (api, args, options) => {
  const webpackConfig = new Config()
  const targetDir = api.resolve(args.dest || options.outputDir)

  webpackConfig
    .mode(api.service.mode)
    .devtool(options.productionSourceMap ? 'source-map' : false)
    .context(api.service.context)
    .target('electron-main')

  webpackConfig.output
    .path(api.resolve(options.outputDir))
    .filename('[name].electron.js')
    .publicPath(options.publicPath)

  if (api.hasPlugin('typescript')) {
    webpackConfig
      .entry('main')
      .add('./src/main/main.ts')

    webpackConfig.resolve
      .extensions.merge(['.js', '.ts'])

    const tsRule = webpackConfig.module.rule('ts').test(/\.ts$/)

    if (api.hasPlugin('babel')) {
      tsRule
        .use('babel-loader')
        .loader('babel-loader')
    }
    tsRule
      .use('ts-loader')
      .loader('ts-loader')
      .options({ transpileOnly: true })
  } else {
    webpackConfig
      .entry('main')
      .add('./src/main/main.js')
  }

  webpackConfig.node
    .merge({
      // prevent webpack from injecting mocks because
      // Electron runs in a native Node.js environment.
      __dirname: false,
      __filename: false
    })

  // respect inline build destination in copy plugin
  if (args.dest && webpackConfig.plugins.has('copy')) {
    webpackConfig.plugin('copy').tap(args => {
      args[0][0].to = targetDir
      return args
    })
  }

  return webpackConfig.toConfig()
}
