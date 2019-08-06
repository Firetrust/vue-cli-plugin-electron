module.exports = api => {
  api.render('./template')
  api.extendPackage({
    scripts: {
      'electron:serve': 'vue-cli-service electron --mode=development && vue-cli-service serve',
      'electron:build': 'vue-cli-service electron && vue-cli-service build --no-clean'
    },
    vue: {
      publicPath: ''
    },
    devDependencies: {
      electron: '^6.0.0'
    }
  })
}
