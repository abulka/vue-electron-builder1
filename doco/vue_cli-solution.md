# My post re the `use_vue_cli: true` solution

https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/188

You may be getting all the errors mentioned in this issue when building your Vue based Electron app using **GitHub Actions** using the famous https://github.com/samuelmeuli/action-electron-builder GitHub Actions plugin. Thus your googling may lead you here. The errors are:

- `...resources/app.asar" does not exist. Seems like a wrong configuration.` error 
- `dist/` vs `dist_electron/` problems
- package.json problems re `"main": "background.js",` vs `"main": "src/background.js",`
- `vue.config.js` problems re `mainProcessFile: 'src/background.js',` and `files: ['dist_electron/**/*'],` etc.

As https://github.com/samuelmeuli/action-electron-builder/issues/66 says, you simply need to add `use_vue_cli: true` to your Github Actions workflow `yml` file. Keep your package.json containing the default `"main": "background.js"`, and you don't need to do anything to `vue.config.js`. 

```yml
- name: Build/release Electron app
  uses: samuelmeuli/action-electron-builder@v1
  with:
    github_token: ${{ secrets.github_token }}
    use_vue_cli: true       # <-------- you need this
    release: ${{ startsWith(github.ref, 'refs/tags/v') }}
```

### Detail

In a Github Actions workflow `yml` file, specifying the `use_vue_cli: true` option to the [samuelmeuli/action-electron-builder@v1](https://github.com/samuelmeuli/action-electron-builder) causes this good invocation e.g.:

    $ /Users/runner/work/vue-electron-builder1/vue-electron-builder1/node_modules/.bin/vue-cli-service electron:build --mac

instead of the problematic, plain electron-builder invocation, which builds in the `dist/` directory instead of `dist_electron/`

    $ /Users/runner/work/vue-electron-builder1/vue-electron-builder1/node_modules/.bin/electron-builder --mac

Look in your Github Action build logs to see which command is being invoked. 

We want Vue with Electron via the Vue plugin [vue-cli-plugin-electron-builder](https://github.com/nklayman/vue-cli-plugin-electron-builder), not just plain Electron without Vue.  The `samuelmeuli/action-electron-builder@v1` plugin is all about building all sorts of Electron apps on Github, not specifically Vue based Electron apps.  Though that Github action plugin is nice enough to give us this special Vue option.

    use_vue_cli: true

Remember:

- https://www.electron.build/ is electron builder
- https://github.com/nklayman/vue-cli-plugin-electron-builder is the vue plugin, invokes electron builder in a special way
- https://github.com/samuelmeuli/action-electron-builder is a github action electron plugin, with support for the `use_vue_cli` option to be specified, which triggers the invocation of the above vue plugin, which then in turn triggers invoking electron builder in a special way, with extra configs or something. Without the `use_vue_cli` in your workflow `yml` file, a plain electron builder invocation is made, which won't handle vue stuff properly. 

Hope this info helps someone, as it took me a while to figure out.

