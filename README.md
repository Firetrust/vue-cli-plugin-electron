# @firetrust/vue-cli-plugin-electron

> electron plugin for vue-cli

To package your application, you have the freedom to choose between [electron-packager](https://github.com/electron-userland/electron-packager), [electron-forge](https://github.com/electron-userland/electron-forge), [electron-builder](https://github.com/electron-userland/electron-builder) or your favourite packager.

## Injected Commands

- **`vue-cli-service electron`**

  ```
  Usage: vue-cli-service electron [options]

  Options:

    --mode      specify env mode (default: production)
    --dest      specify output directory (default: dist)
    --no-clean  do not remove the dist directory before building the project
    --watch     watch for changes
  ```

  Builds electron, `npx electron dist` to run.

## Installing in an Already Created Project

``` sh
vue add @firetrust/vue-cli-plugin-electron
```
