module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  pluginOptions: {
    electronBuilder: {
      
      // Don't need this.
      // https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/504
      // mainProcessFile: 'src/background.js',

      builderOptions: {
        // options placed here will be merged with default configuration and passed to electron-builder

        // Don't need these.
        // files: ['dist_electron/**/*'],
        // files: ['dist/**/*'],

        linux: {
          category: "Education",
          target: [
            {
              target: "deb",
              arch: [
                "x64"
              ]
            },
            {
              target: "7z",
            }

          ]
        },
        win: {
          target: [
            {
              target: "nsis",
            },
            // msi only possible on a real windows machine and name of app cannot have underscores
            // {
            //   target: "msi",
            // }
            {
              target: "portable",
            }
          ]
        },
      }
    }
  }
}
