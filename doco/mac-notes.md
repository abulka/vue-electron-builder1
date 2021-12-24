# Mac Notes

> Copied from mac notes after i got snaps building and upublishing

# New Dec 2021 information - Electron + Vue - ULTIMATE STACK for building apps and website too

My project [https://github.com/abulka/vue-electron-builder1](https://github.com/abulka/vue-electron-builder1) has followed these steps incl. Github actions and Heroku deployment 🏡

    nvm use 16

    npm ls -g

    npm uninstall -g vue-cli

    npm install -g @vue/cli

For [yarn](https://yarnpkg.com/getting-started/install),

    npm i -g corepack

unless you are using node 16 then you can simply

    corepack enable

## Creating a Project (standard vue)

https://cli.vuejs.org/guide/creating-a-project.html#vue-create

    vue create hello-world

    cd vue-electron-builder1

    yarn serve

## To manage ALL your vue projects

    vue ui

# Vue CLI Plugin Electron Builder

https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/#installation

Within the project dir

    vue add electron-builder

    yarn electron:serve

yes can edit and its all hot reloaded
to build deployables

    yarn electron:build

## for all platforms - works on a mac!

    yarn electron:build --linux deb --win nsis

See my project

`/Users/Andy/Devel/electron-dec-2021/vue-electron-builder1`

## Interesting Observations

*   Running yarn serve seems independent of vue ui serve
*   The vue ui server displays tasks for electron build, serve as well as normal build, serve - which is nice

**Adding vuetify - Dec 2021**

https://vuetifyjs.com/en/getting-started/installation/#vue-ui-install

[Get started with Vuetify — Vuetify (vuetifyjs.com)](https://vuetifyjs.com/en/getting-started/installation/#vue-ui-install)

install via CLI or via vue ui - with the latter just choose vue-cli-plugin-vuetify and the project package.json will be updated, as will the index.html and App.vue - so watch out for stuff to be clobbered!

**Interesting Observations**

*   electron serve still works fine and vuetify appears ok within electron
*   electron build still works fine and e.g. builds a perfectly ok working .deb

**Adding Vue Router**

Official library to support multiple virtual pages in a Single-Page App. Each route renders a different component.

Again, clobbers files with its new stuff.

Had to manually put back the v-app tag to get colours and styles back after adding the vue router plugin via `vue ui` plugins.

```html
<template>

 <v-app>  <-- why was this clobbered or not created. required for styling etc. I put it back.

  <div id="app">

   <div id="nav">

    <router-link to="/">Home</router-link> |

    <router-link to="/about">About</router-link>

   </div>

   <router-view />

  </div>

 </v-app>

</template>
```
see https://stackoverflow.com/questions/50003226/vuetify-colors-are-not-showing-up

[**vuetify.js - Vuetify: colors are not showing up - Stack Overflow**](https://stackoverflow.com/questions/50003226/vuetify-colors-are-not-showing-up)

**Interesting Observations**

*   electron serve still works fine and **vuetify + router** appears ok within electron
*   electron build still works fine and e.g. builds a perfectly ok working .dmg etc.

# **Building for Raspberry Pi**

    electron-builder build --linux --armv7

Actually installing the .deb is the problem:

    $ sudo apt install ./vue-electron-builder1_0.1.0_armv7l.deb

```
[sudo] password for andy:

Reading package lists... Done

Building dependency tree... Done

Reading state information... Done

Note, selecting 'vue-electron-builder1:armhf' instead of './vue-electron-builder1_0.1.0_armv7l.deb'

Some packages could not be installed. This may mean that you have

requested an impossible situation or if you are using the unstable

distribution that some required packages have not yet been created

or been moved out of Incoming.

The following information may help to resolve the situation:

The following packages have unmet dependencies:

vue-electron-builder1:armhf : Depends: libgtk-3-0:armhf but it is not installable

               Depends: libnotify4:armhf but it is not installable

               Depends: libnss3:armhf but it is not installable

               Depends: libxss1:armhf but it is not installable

               Depends: libxtst6:armhf but it is not installable

               Depends: libatspi2.0-0:armhf but it is not installable

               Depends: libuuid1:armhf but it is not installable

               Depends: libsecret-1-0:armhf but it is not installable

               Recommends: libappindicator3-1:armhf but it is not installable

E: Unable to correct problems, you have held broken packages.
```

Try….

[https://github.com/electron-userland/electron-builder/issues/1230](https://github.com/electron-userland/electron-builder/issues/1230)

Okay so I made progress on this. The problem is that although the packaged Electron app for Armv7l will run just fine on a Pi, the Pi primarily uses the Armhf architecture. When electron-builder generates a deb or snap file from the packaged application, it lists the target architecture as armv7l.

If you want it to install on a Pi, the target arch of the snap or deb must be armhf. I've not tried this with snap packages, but I fixed our debs using the config:

```
...

linux:

 target:

  - target: deb

   arch:

    - armv7l

deb:

 fpm: ['--architecture', 'armhf']

electronVersion: 3.0.13
```
FPM is used by electron-builder to generate deb files, and so by overriding the --architecture option of FPM, you can put the armv7l package into an armhf deb file, and it works just fine.

Again, not tested with snaps, but hopefully this will help others somewhat.

_tried - not sure how to add that fragment into package.json_

_added to vue.config.js but not sure if that's correct_

```
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

ran with

    vue-cli-service electron:build --linux

or just

    yarn electron:build --linux

Note you can add these different launch options to package.json scripts

    "electron:build:andylinux": "vue-cli-service electron:build --linux",

Note that adding

    "armv7l", "x64"

to the above vue.config.jsconfig _does_ trigger a linux x64 build as well as the ARM build - so the _config seems to be working_. However now the x64 build fails because of the weird fpm: stuff. Once that is removed, the x64 build works OK. I wonder if there is way to have extra flags _only_ for the ARM build?

Anyway, in the end, I got same error re Depends: libnotify4:armhf but it is not installable

Asked question [https://github.com/electron-userland/electron-builder/issues/1230](https://github.com/electron-userland/electron-builder/issues/1230) waiting for an answer 👈

fail

### Try...

Tried building on Pi itself - regular running of electron is fine, the building of the .deb results in the same unmet dependencies error, despite following [this](https://github.com/hovancik/stretchly/blob/trunk/.drone.yml)

    sudo apt update && apt-get install --no-install-recommends -y ruby-full bsdtar rpm libopenjp2-tools

    sudo gem install fpm -v 1.10.1

    export USE_SYSTEM_FPM="true"

and building within vue ui on Raspberry Pi itself.

fail

### At least...

    dist_electron/linux-armv7l-unpacked/

runs ok on Raspberry Pi

# **Deploy to Heroku**

    yarn build

creates dist/ directory which you can serve and use.

To deploy to heroku, use the steps [https://cli.vuejs.org/guide/deployment.html#heroku](https://cli.vuejs.org/guide/deployment.html#heroku) quite simple

    heroku login [optional]

    heroku create vue-electron-builder1

    heroku buildpacks:add heroku/nodejs

    heroku buildpacks:add https://github.com/heroku/heroku-buildpack-static

    git push heroku master

Deployed 🎉

[https://vue-electron-builder1.herokuapp.com/#/](https://vue-electron-builder1.herokuapp.com/#/)

# **Building Different Targets**

Both locally and on Github Actions

*   Numerous target formats:
    *   All platforms:7z,zip,tar.xz,tar.7z,tar.lz,tar.gz,tar.bz2,dir(unpacked directory).
    *   [macOS](https://www.electron.build/configuration/mac):dmg,pkg,mas.
    *   [Linux](https://www.electron.build/configuration/linux):[AppImage](http://appimage.org/),[snap](http://snapcraft.io/), debian package (deb),rpm,freebsd,pacman,p5p,apk.
    *   [Windows](https://www.electron.build/configuration/win):nsis(Installer),nsis-web(Web installer),portable(portable app without installation), AppX (Windows Store), MSI, Squirrel.Windows.

Defaults

*   win is nsis which is inno setup format. Note that portable is an all in one exe. Note msi requires a windows machine to build and app name can't have - and _ in the name.
*   mac its dmg
*   linux is snap

You can tweak the deployable artifact type, which is called a **target** (e.g. .deb vs snap or .exe vs .msi). Here is how:

## Summary:

For local builds you can specify the OS you want to build for

*   **vue-cli-service electron:build** will build for current OS only e.g. Mac on my iMac
*   **vue-cli-service electron:build --linux** will build for linux
*   **vue-cli-service electron:build --linux --mac** will build for mac and linux
*   **vue-cli-service electron:build --linux --mac --win** will build for mac and linux

You can either

*   Use vue.config.jswhich is an optional config file which can further refine which targets you want to produce - see examples below. The format is a bit mysterious but I figured it out.
*   Pass a list of targets after each OS e.g. **vue-cli-service electron:build --win portable** which _will take precedence_ over what you have in vue.config.js

Local builds on a Mac seem to be able to build deployable files for all platforms! They don't really compile anything, they just download pre-compiled files and blend the electron and javascript files into them somehow. Still, its impressive. Example:

    yarn run electron:build:andy

where package.json has, under the "scripts" object,

    "electron:build:andy": "vue-cli-service electron:build --win portable",

Look in dist_electron/ directory for the result.

For GitHub Actions builds

*   The workflow .yml file controls which OS's are being built for
*   For targets (e.g. .deb vs snap or .exe vs .msi) you need to rely on the vue.config.jsand can specify multiple targets.
    *   Specifying these options inside package.json itself is deprecated.
    *   Attempting to pass OS arguments via the yml workflow samuelmeuli/action-electron-builder@v1 option args (which is a way of passing params to electron builder _All args you pass to__electron:build__will be forwarded to electron-builder,_) e.g. args: "--linux deb --win nsis msi --mac" will fail with a messed up invocation e.g. vue-cli-service electron:build --linux -p always --linux deb 7z --win nsis msi --mac. Plus, it doesn't make sense to specify OS as this is done in the workflow file.

> Super Summary: 🐬 Create a vue.config.jsfile to specify all the targets you want to create. This will be respected by both local and github builds. Then for local builds just **yarn run electron:build** to build for current OS. To build for other OS's create a scripts entry in package.json e.g. "electron:build:andylinux": "vue-cli-service electron:build --linux", and invoke **yarn run electron:build:andylinux**. To _override_ OS targets locally create a scripts entry in package.json **vue-cli-service electron:build --win portable** which _will take precedence_ over what you have in vue.config.js. For GitHub actions, simply rely on your vue.config.jsfile - all the scripts in package.json are irrelevant. The current OS in the matrix of jobs will be built for, taking into account the vue.config.js

## Detail:

**Local Electron Builds - Building Different Targets**

I noticed that on a local machine e.g. macbook air or iMac that

    yarn electron:build

only builds for the current platform

    yarn electron:build --linux

only builds linux, and because I have vue.config.js as

```js
module.exports = {

  transpileDependencies: [

   'vuetify'

  ],

  pluginOptions: {

   electronBuilder: {

    builderOptions: {

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
```

only the deb is created, rather than the snap. Though you can avoid the above config and pass parameters saying what styles of build you want

    yarn electron:build --linux deb --win nsis

builds .deb (rather than default snap) for linux and windows (nsis rather than default setup.exe) but _not_ mac. To include mac you would need to add --mac dmg or something.

    yarn run electron:build:andymac

which is the same as

    vue-cli-service electron:build --mac

and the mac build works ok, even without the above vue.config.js settings.

I created the script entry

    yarn run electron:build:andyall

which is

    vue-cli-service electron:build --linux --win --mac

builds everything, locally, into dist_electron/

You can add additional target styles like this

  vue-cli-service electron:build --linux deb --win nsis msi --mac

nsis is the default, which creates an .exe setup installer (nsis stands for good old inno).

> _Tip:_ _All args you pass to__electron:build__will be forwarded to electron-builder, so just set your script to__vue-cli-service electron:build --linux_

> _Tip:_ _The file_ vue.config.jsis an optional config file that will be automatically loaded by@vue/cli-serviceif it's present in your project root (next topackage.json). See [doco](https://cli.vuejs.org/config/#vue-config-js)

Here is the secret vue-config.js format for _multi-target_ building

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

       target: "msi",

      }

     ]

    },

   }

  }

 }

}
```

If you want to build multiple target artifacts (e.g. both a `deb` and a `7z`) for an OS, each OS's `target` actually takes an array of objects - each with its own `target`, `arch` and other keys e.g.

`builderOptions: { linux: { category: "Education", target: [ { target: "deb", arch: [ "x64" ] }, { target: "7z", } ] }, win: { target: [ { target: "nsis", } ] } }`

I made a [stackoverflow comment](https://stackoverflow.com/questions/43324385/electron-electron-builder-config) about this in Dec 2021.

## **GitHub Action Builds - Building Different Targets**

I think.... to specify target styles via github actions, I think you have to use the vue.config.js settings approach, because we are instead using the samuelmeuli/action-electron-builder@v1 github plugin which has no other way.

Actually you might be able to use the samuelmeuli/action-electron-builder@v1 github plugin option


    args:

      description: Other arguments to pass to the `electron-builder` command, e.g. configuration overrides

      required: false

      default: ""

in the .yml workflow file. So possibly

    args: "--linux deb --win nsis msi --mac"

todo

Note: This

    args: "-p always --linux deb 7z --win nsis msi --mac"

resulted in the erroneous

    $ /home/runner/work/vue-electron-builder1/vue-electron-builder1/node_modules/.bin/vue-cli-service electron:build --linux -p always --linux deb 7z --win nsis msi --mac

# **Github Actions**

**Summary - must use use_vue_cli: true in your github workflow yml**

```yml
  - name: Build/release Electron app

   uses: samuelmeuli/action-electron-builder@v1

   with:

    github_token: ${{ secrets.github_token }}

    use_vue_cli: true    <--------

    release: ${{ startsWith(github.ref, 'refs/tags/v') }}
```

See my project /Users/Andy/Devel/electron-dec-2021/vue-electron-builder1/.github/workflows/buildem.yml

[https://www.electron.build/](https://www.electron.build/) is electron builder

[https://github.com/nklayman/vue-cli-plugin-electron-builder](https://github.com/nklayman/vue-cli-plugin-electron-builder) is the vue plugin, invokes electron builder in a special way

[https://github.com/samuelmeuli/action-electron-builder](https://github.com/samuelmeuli/action-electron-builder) is github action electron plugin, with support for the use_vue_cli option to be passed, which triggers the invocation of the above vue plugin, which then in turn triggers electron builder. Without the use_vue_cli in your workflow yml file, a plain electron builder invocation is made, which won't handle vue stuff properly.

🤓🤓🤓🤓

*   samuelmeuli (author of the samuelmeuli/action-electron-builder plugin) says: Config parsing is done by electron-builder, not this action. All the action does is run the electron-builder command with the correponding platform flag and set some environment variables. e.g. electron-builder --mac
*   andy: And if the **use_vue_cli** option is true then I suppose "All the samuelmeuli action does" is run the vue-cli command "with the correponding platform flag" etc. e.g. vue-cli-service electron:build --mac

## **Github Actions Publishing**

1.  increment the package.json version
2.  tag the commit with e.g. 0.1.3
3.  push tags

Releasing works OK when you tag - you get a proper release created, with all os builds picked out nicely. This is because of the plugin line

    release: ${{ startsWith(github.ref, 'refs/tags/v') }}

success

Summary: Ensure your workflow has the 'release' and 'args' options, with the latter set to '-p always'. Increment package.json version, tag and push tags. Resulting files seem to always be a draft release, have to manually mark as published using the Github UI.

Critical: When making a release, via tagging, you might get

    ReleaseAsset\",\"code\":\"already_exists

As [this post](https://github.com/electron-userland/electron-builder/issues/3559) says: This isn't a bug. The release you are trying to push already exists on github. You either have to bump yourpackage.jsonversion or delete the old release from github to overwrite the version.

Solution is to increment package.json version as well as the tag - keep then in sync. e.g. package.json has 1.0.1 and tag is v1.0.1

### Though Later...

Meanwhile doing a tag release of 0.1.3 didn't work - built but nothing released? It caused invocation

    $ /home/runner/work/vue-electron-builder1/vue-electron-builder1/node_modules/.bin/vue-cli-service electron:build --linux

    $ /Users/runner/work/vue-electron-builder1/vue-electron-builder1/node_modules/.bin/vue-cli-service electron:build --mac

etc

(notice no deb parameter, so presumabkly relying on vue.config.js settings.

Result

    • skipped publishing file=vue-electron-builder1_0.1.3_amd64.deb reason=release doesn't exist and not created because "publish" is not "always" and build is not on tag tag=v0.1.3 version=0.1.3

fail

### Hmm try enabling

  -p always

Result

    • uploading    file=vue-electron-builder1_0.1.4_amd64.deb provider=GitHub  
    • creating GitHub release reason=release doesn't exist tag=v0.1.4 version=0.1.4

success

### **What does -p always do?**

Adding

```yml
  - name: Build/release Electron app

   uses: samuelmeuli/action-electron-builder@v1

   with:

    ...

    args: "-p always" <-------- You actually need this to do releases, see above

    release: ${{ startsWith(github.ref, 'refs/tags/v') }}
```

cause the invocation of

    node_modules/.bin/vue-cli-service electron:build --mac -p always

but no release or artifact is created? Probably because of the release option being what it is. So what does "-p always" then do? 

?????

Official [electron builder doco on this pubish flag](https://www.electron.build/configuration/publish.html#how-to-publish) suggests not setting it, and allowing the release system to do its thing when there is a tag push,

abandoned

Solution: You need this option otherwise releases won't happen - see above.

### resurrected

Perhaps publishing is to a draft and releasing is moving that draft artifact to releases 🤯

Perhaps can use -p onTag to save building on every push

    args: "-p onTag"

No - **onTag** is not enough, even if you tag and push - I didn't get a release!

Note,

    vue-cli-service electron:build --mac -p always

cannot be run locally since it requires a GitHub Personal Access Token to be set etc.

# **Snapcraft**

Easy enough to build even on my iMac

    "electron:build:andy": "vue-cli-service electron:build --linux snap",

thus

    yarn run electron:build:andy

since it hasn't gone through the trusted snap store, have to install with

    snap install **--dangerous** '/home/andy/Desktop/vue-electron-builder1_0.1.8_amd64.snap'

remove with

    snap remove vue-electron-builder1

## **Via snapstore**

doco [https://github.com/samuelmeuli/action-electron-builder#snapcraft](https://github.com/samuelmeuli/action-electron-builder#snapcraft)

    sudo snap install snapcraft --classic

    snapcraft login

    snapcraft --help

    snapcraft register vue-electron-builder1 <-- must be named the same as app "name": "vue-electron-builder1" in package.json

    snapcraft export-login --snaps vue-electron-builder1 --channels edge - <-- generates the token

paste the token you get (huge, multi-line) into the _vue-electron-builder1_ github repo settings / secret called

    snapcraft_token

Tip: If you are building/releasing your Linux app for Snapcraft (which iselectron-builder's default), you will additionally need to install and sign in to Snapcraft. This can be done using anaction-snapcraftstep **before** theaction-electron-builderstep:

Ensure that vue.config.js has snap as a target

```js
builderOptions: {

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

       target: "snap",

      }

     ]

    },

    win: {
```

It is electron builder which does all the hard work of uploading to snapcraft - check the resulting snap appears in the edge channel on

https://snapcraft.io/snaps

[**My published snaps — Linux software in the Snap Store (snapcraft.io)**](https://snapcraft.io/snaps)

### Snap USERS can

    snap install --edge vue-electron-builder1

or if they already have it

    sudo snap refresh --edge vue-electron-builder1

to test (and later switch back to stable by passing --stable flag).

remove with

    snap remove vue-electron-builder1

force check out the latest - _works with whatever channel you are on stable or edge_

    snap refresh

## To publish
To publish from edge to stable. Snap version will be uploaded to edge, not stable. So note the revision number of the edge version e.g. 19

    snap info vue-electron-builder1

and move the release from edge to stable, in a linux terminal or [via UI](https://snapcraft.io/pynsource/releases).

    snapcraft release vue-electron-builder1 20 stable

# **Working out notes... re Github Action building**

This was a tedious process to figure out:

**Run electron-builder manually - reproducing what github actions invokes:**

    node_modules/.bin/electron-builder --mac

still get

    ⨯ Application entry file "background.js" in the "/Users/Andy/Devel/electron-dec-2021/vue-electron-builder1/dist/mac/vue-electron-builder1.app/Contents/Resources/app.asar" does not exist.

even though I have

```js
 pluginOptions: {

  electronBuilder: {

   // https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/504

   mainProcessFile: 'src/background.js',
```

in vue.config.js as per official doco [Configuration | Vue CLI Plugin Electron Builder (nklayman.github.io)](https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/configuration.html#webpack-configuration)

Why? perhaps the config file is not picked up when invoking electron-builder in this way?

fail

So try

    yarn run electron:build:andymac

which is the same as

    vue-cli-service electron:build --mac

and the mac build works ok, even without the above vue.config.js settings.

success

I suspect vue-cli-service is not being called on github

The vue-cli-plugin-electron-builder plugin seems to call electron-builder directly and things break.

Wow, changing package.json from

    "main": "background.js",

to

    "main": "src/background.js",

allows

    node_modules/.bin/electron-builder --mac

to succeed (local iMac build). 

success

This is promising, will try pushing this to Github...

success (github)

However now the local build fails, via our trusty

    vue-cli-service electron:build --mac

This exact situation discussed

https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/188

    [Application entry file "electron/bundled/background.js" in the "....app.asar" does not exist · Issue #188 · nklayman/vue-cli-plugin-electron-builder (github.com)](https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/188)

fail (local)

### **Summary**

SUCCESS ON GITHUB

only possible if change package.json to

    "main": "src/background.js",

which breaks local running and serving via yarn run electron:build etc.

Building the Electron app…

    yarn run v1.22.15
```
  $ /Users/runner/work/vue-electron-builder1/vue-electron-builder1/**node_modules/.bin/electron-builder --mac**

 • electron-builder version=22.14.5 os=20.6.0

 • artifacts will be published if draft release exists reason=CI detected

 • packaging    platform=darwin arch=x64 electron=13.6.3 appOutDir=dist/mac

 • downloading   url=https://github.com/electron/electron/releases/download/v13.6.3/electron-v13.6.3-darwin-x64.zip size=79 MB parts=6

 • downloaded   url=https://github.com/electron/electron/releases/download/v13.6.3/electron-v13.6.3-darwin-x64.zip duration=1.431s

 • default Electron icon is used reason=application icon is not set

 • skipped macOS application code signing reason=cannot find valid "Developer ID Application" identity or custom non-Apple code signing certificate, see https://electron.build/code-signing allIdentities=   0 identities found

                        Valid identities only

  0 valid identities found

 • building    target=macOS zip arch=x64 file=dist/vue-electron-builder1-0.1.0-mac.zip

 • building    target=DMG arch=x64 file=dist/vue-electron-builder1-0.1.0.dmg

 • building block map blockMapFile=dist/vue-electron-builder1-0.1.0.dmg.blockmap

 • publishing   publisher=Github (owner: abulka, project: vue-electron-builder1, version: 0.1.0)

 • uploading    file=vue-electron-builder1-0.1.0.dmg.blockmap provider=GitHub

 • uploading    file=vue-electron-builder1-0.1.0.dmg provider=GitHub

 • skipped publishing file=vue-electron-builder1-0.1.0.dmg.blockmap reason=release doesn't exist and not created because "publish" is not "always" and build is not on tag tag=v0.1.0 version=0.1.0

 • skipped publishing file=vue-electron-builder1-0.1.0.dmg reason=release doesn't exist and not created because "publish" is not "always" and build is not on tag tag=v0.1.0 version=0.1.0

 • building block map blockMapFile=dist/vue-electron-builder1-0.1.0-mac.zip.blockmap

 • uploading    file=vue-electron-builder1-0.1.0-mac.zip.blockmap provider=GitHub

 • skipped publishing file=vue-electron-builder1-0.1.0-mac.zip.blockmap reason=release doesn't exist and not created because "publish" is not "always" and build is not on tag tag=v0.1.0 version=0.1.0

 • uploading    file=vue-electron-builder1-0.1.0-mac.zip provider=GitHub

 • skipped publishing file=vue-electron-builder1-0.1.0-mac.zip reason=release doesn't exist and not created because "publish" is not "always" and build is not on tag tag=v0.1.0 version=0.1.0

 • skipped publishing file=latest-mac.yml reason=release doesn't exist and not created because "publish" is not "always" and build is not on tag tag=v0.1.0 version=0.1.0

Done in 91.44s.
```

### **dist/ vs dist_electron observations**

Adding

    files: ['dist_electron/**/*'],

to vue.config.js is understood locally by the command

    vue-cli-service electron:build --mac

and breaks the build, with the path error again. Nor does it help locally with the

    node_modules/.bin/electron-builder --mac

invocation.

Trying on github actions

package.json

    "main": "background.js",

vue.config.js is

```js
 mainProcessFile: 'src/background.js',

 builderOptions: {

  files: ['dist_electron/**/*'],
```

Result is


    Application entry file "background.js" in the "/Users/runner/work/vue-electron-builder1/vue-electron-builder1/dist/mac/vue-electron-builder1.app/Contents/Resources/app.asar" does not exist. Seems like a wrong configuration.

fail

And trying the same thing on Github except changing it to

    files: ['dist/**/*'],

makes no difference, result is

    Application entry file "background.js" in the "/Users/runner/work/vue-electron-builder1/vue-electron-builder1/dist/mac/vue-electron-builder1.app/Contents/Resources/app.asar" does not exist. Seems like a wrong configuration.

fail

I'm noticing something with the dist vs dist_electron paths. The

    node_modules/.bin/electron-builder --mac

invocation seems to put stuff in dist/ but changing the config to

    files: ['dist/**/*'],

doesn't help either.

Noticing on Github Actions that it calls

    yarn build

which is really

    vue-cli-service build

(note you cannot invoke the vue-cli-service directly, you seem to have to invoke via yarn)

which simply creates the

    dist/

directory which is the pure website - NON ELECTRON. Then on Github Actions it proceeds to call

    /Users/runner/work/vue-electron-builder1/vue-electron-builder1/node_modules/.bin/electron-builder --mac

and builds everything in dist/ (not dist_electron/) for example

    file=dist/vue-electron-builder1-0.1.0.dmg

and invoking locally (temporarily modifying package.json to "main": "src/background.js", so that the command will work)

    node_modules/.bin/electron-builder --mac

does the same thing - creating everything in dist/

It may not be a problem, just an interesting observation.

From the github [issue discussion 188](https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/188), the author of **vue-cli-plugin-electron-builder** says:

> _Ahh, it's because you are runningelectron-buildermanually. This plugin automatically runs electron-builder for your with the proper config, and outputs to_**_dist_electron_**_. You can remove your custom electron-builder calls and then you should be fine, just use output indist_electron._

Andy note: But this is false - on Github the output is definately going into dist/ not dist_electron/

He also says

> _All args you pass to__electron:build__will be forwarded to electron-builder, so just set your script to__vue-cli-service electron:build --linux_

vue_cli perhaps? YES 🎉

https://github.com/samuelmeuli/action-electron-builder/issues/66

[**A wrong configuration · Issue #66 · samuelmeuli/action-electron-builder (github.com)**](https://github.com/samuelmeuli/action-electron-builder/issues/66)

So I tried

     use_vue_cli: true

with the normal setting of

```json
package.json

 "main": "background.js",
```

and most everything commented out in vue.config.js

Result is

success

It looks like specifying this option to the github action plugin **vue-cli-plugin-electron-builder** causes this invocation

    $ /Users/runner/work/vue-electron-builder1/vue-electron-builder1/node_modules/.bin/vue-cli-service electron:build --mac

instead of the problematic

    /Users/runner/work/vue-electron-builder1/vue-electron-builder1/node_modules/.bin/electron-builder --mac

which in retrospect makes sense since we are using vue with electron, not using plain electron.

**So I made a post about my Github Action Electron Vue struggle and Solution:** 👈

## My Post
https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/188

[Application entry file "electron/bundled/background.js" in the "....app.asar" does not exist · Issue #188 · nklayman/vue-cli-plugin-electron-builder (github.com)](https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/188)

You may be getting all the errors mentioned in this issue when building your Vue based Electron app using**GitHub Actions**using the famous[https://github.com/samuelmeuli/action-electron-builder](https://github.com/samuelmeuli/action-electron-builder)GitHub Actions plugin. Thus your googling may lead you here. The errors are:

*   ...resources/app.asar" does not exist. Seems like a wrong configuration.error
*   dist/vsdist_electron/problems
*   package.json problems re"main": "background.js",vs"main": "src/background.js",
*   vue.config.jsproblems remainProcessFile: 'src/background.js',andfiles: ['dist_electron/**/*'],etc.

As[samuelmeuli/action-electron-builder#66](https://github.com/samuelmeuli/action-electron-builder/issues/66)says, you simply need to adduse_vue_cli: trueto your Github Actions workflowymlfile. Keep your package.json containing the default"main": "background.js", and you don't need to do anything tovue.config.js.

```yml
- name: Build/release Electron app

 uses: samuelmeuli/action-electron-builder@v1

 with:

  github_token: ${{ secrets.github_token }}

  use_vue_cli: true    # <-------- you need this

  release: ${{ startsWith(github.ref, 'refs/tags/v') }}
```

**Detail**

In a Github Actions workflowymlfile, specifying theuse_vue_cli: trueoption to the[samuelmeuli/action-electron-builder@v1](https://github.com/samuelmeuli/action-electron-builder)causes this good invocation e.g.:

    $ /Users/runner/work/vue-electron-builder1/vue-electron-builder1/node_modules/.bin/vue-cli-service electron:build --mac

instead of the problematic, plain electron-builder invocation, which builds in thedist/directory instead ofdist_electron/

    $ /Users/runner/work/vue-electron-builder1/vue-electron-builder1/node_modules/.bin/electron-builder --mac

Look in your Github Action build logs to see which command is being invoked.

We want Vue with Electron via the Vue plugin[vue-cli-plugin-electron-builder](https://github.com/nklayman/vue-cli-plugin-electron-builder), not just plain Electron without Vue. Thesamuelmeuli/action-electron-builder@v1plugin is all about building all sorts of Electron apps on Github, not specifically Vue based Electron apps. Though that Github action plugin is nice enough to give us this special Vue option.

    use_vue_cli: true

Remember:

*   [https://www.electron.build/](https://www.electron.build/)is electron builder
*   [https://github.com/nklayman/vue-cli-plugin-electron-builder](https://github.com/nklayman/vue-cli-plugin-electron-builder)is the vue plugin, invokes electron builder in a special way
*   [https://github.com/samuelmeuli/action-electron-builder](https://github.com/samuelmeuli/action-electron-builder)is a github action electron plugin, with support for theuse_vue_clioption to be specified, which triggers the invocation of the above vue plugin, which then in turn triggers invoking electron builder in a special way, with extra configs or something. Without theuse_vue_cliin your workflowymlfile, a plain electron builder invocation is made, which won't handle vue stuff properly.

Hope this info helps someone, as it took me a while to figure out.

# END MAC NOTES
