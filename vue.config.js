module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  pluginOptions: {
    electronBuilder: {
      
      // https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/504
      // mainProcessFile: 'src/background.js',

      builderOptions: {
        // options placed here will be merged with default configuration and passed to electron-builder

        // files: ['dist_electron/**/*'], // This caused the build error
        // files: ['dist/**/*'], // This caused the build error

        linux: {
          category: "Education",
          target: [
            {
              target: "deb",
              arch: [
                "x64"
              ]
            }
          ]
        },
      }
    }
  }
}
