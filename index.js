const defaults = {
  clean: true,
  target: 'electron-main'
}

const modifyConfig = (config, fn) => {
  if (Array.isArray(config)) {
    config.forEach(c => fn(c))
  } else {
    fn(config)
  }
}

module.exports = (api, options) => {
  api.chainWebpack(webpackConfig => {
    webpackConfig.target('electron-renderer')
    webpackConfig.node
      .merge({
        // prevent webpack from injecting mocks because
        // Electron runs in a native Node.js environment.
        __dirname: false,
        __filename: false
      })
  })

  api.registerCommand(
    'electron',
    {
      description: 'build for electron',
      usage: 'vue-cli-service electron [options]',
      options: {
        '--mode': `specify env mode (default: production)`,
        '--dest': `specify output directory (default: ${options.outputDir})`,
        '--formats': `list of output formats for library builds (default: ${defaults.formats})`,
        '--no-clean': `do not remove the dist directory before building the project`,
        '--watch': `watch for changes`
      }
    },
    async args => {
      for (const key in defaults) {
        if (args[key] == null) {
          args[key] = defaults[key]
        }
      }
      await build(args, api, options)
    }
  )
}

async function build (args, api, options) {
  const fs = require('fs-extra')
  const path = require('path')
  const chalk = require('chalk')
  const webpack = require('webpack')
  const formatStats = require('@vue/cli-service/lib/commands/build/formatStats')
  const validateWebpackConfig = require('@vue/cli-service/lib/util/validateWebpackConfig')
  const {
    log,
    done,
    logWithSpinner,
    stopSpinner
  } = require('@vue/cli-shared-utils')

  log()
  const mode = api.service.mode
  logWithSpinner(`Building Electron for ${mode}...`)

  const targetDir = api.resolve(args.dest || options.outputDir)

  // resolve raw webpack config
  const webpackConfig = require('./lib/resolveElectronConfig')(api, args, options)

  // check for common config errors
  validateWebpackConfig(webpackConfig, api, options, args.target)

  // apply inline dest path after user configureWebpack hooks
  // so it takes higher priority
  if (args.dest) {
    modifyConfig(webpackConfig, config => {
      config.output.path = targetDir
    })
  }

  if (args.watch) {
    modifyConfig(webpackConfig, config => {
      config.watch = true
    })
  }

  if (args.clean) {
    await fs.remove(targetDir)
  }

  return new Promise((resolve, reject) => {
    webpack(webpackConfig, async (err, stats) => {
      stopSpinner(false)
      if (err) {
        return reject(err)
      }

      if (stats.hasErrors()) {
        return reject(new Error(`Build failed with errors.`))
      }

      const pkg = require(api.resolve('./package.json'))
      await fs.writeFile(`${targetDir}/package.json`, `{
  "name": "${pkg.name}",
  "version": "${pkg.version}",
  "productName": "${pkg.productName || pkg.name}",
  "author": "${pkg.author || pkg.name}",
  "main": "main.electron.js"
}`)

      if (!args.silent) {
        const targetDirShort = path.relative(
          api.service.context,
          targetDir
        )
        log(formatStats(stats, targetDirShort, api))
        if (!args.watch) {
          done(`Build complete. The ${chalk.cyan(targetDirShort)} directory is ready to be deployed.`)
        } else {
          done(`Build complete. Watching for changes...`)
        }
      }

      resolve()
    })
  })
}

module.exports.defaultModes = {
  electron: 'production'
}
