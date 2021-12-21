# vue-electron-builder1

Electron Vue project built using official steps - works as website and electron app. Deploy to all architectures incl. heroku. Raspberry Pi .deb is a problem however

Also contains Vuetify UI components.

Deployed to Heroku https://vue-electron-builder1.herokuapp.com/#/

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

# ANDY NOTES

built with the steps

    nvm use 16
    npm ls -g
    npm uninstall -g vue-cli
    npm install -g @vue/cli

Creating a Project (standard vue)
https://cli.vuejs.org/guide/creating-a-project.html#vue-create

    vue create hello-world
    cd vue-electron-builder1
    yarn serve

To manage ALL your vue projects

    vue ui

## Vue CLI Plugin Electron Builder
https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/#installation
Within the project dir

    vue add electron-builder
    yarn electron:serve

yes can edit and its all hot reloaded

### to build deployables

    yarn electron:build

for all platforms - works on a mac!

    yarn electron:build --linux deb --win nsis

## Interesting Observations

- Running yarn serve seems independent of vue ui serve
- The vue ui server displays tasks for electron build, serve as well as normal build, serve - which is nice

## Raspberry Pi

vue.config.js 

```js
module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        // options placed here will be merged with default configuration and passed to electron-builder
        linux: {
          category: "Education",
          target: [
            {
              target: "deb",
              arch: [
                "armv7l"
              ]
            }
          ]
        },
        deb: {
          fpm: ["--architecture", "armhf"]
        }
      }
    }
  }
}
```

    vue-cli-service electron:build --linux

or just

    yarn electron:build --linux

built but doesn't install.

See Mac Notes 'electron' for more.

# Workflows

![workflows](doco/vue-electron-builder1-workflows.png)

## Github Actions Summary

must use `use_vue_cli: true` in your github workflow yml

    - name: Build/release Electron app
      uses: samuelmeuli/action-electron-builder@v1
      with:
        github_token: ${{ secrets.github_token }}
        use_vue_cli: true       <-------- 
        release: ${{ startsWith(github.ref, 'refs/tags/v') }}

See my project /Users/Andy/Devel/electron-dec-2021/vue-electron-builder1/.github/workflows/buildem.yml

### Note:

Hopefully this solves all my problems!  Yes it does. 🎉  See https://github.com/samuelmeuli/action-electron-builder/issues/66
It causes this invocation

    $ /Users/runner/work/vue-electron-builder1/vue-electron-builder1/node_modules/.bin/vue-cli-service electron:build --mac

instead of the problematic

    $ /Users/runner/work/vue-electron-builder1/vue-electron-builder1/node_modules/.bin/electron-builder --mac

which in retrospect makes sense since we are using VUE with electron, not using plain electron.  
Cos this `samuelmeuli/action-electron-builder@v1` plugin is all about ELECTRON, not specifically VUE.  Though it is nice 
enough to give us this special VUE option.

    use_vue_cli: true

