<h1 align="center">vuepress-plugin-template-code</h1>

> template-code plugin for vuepress.

With this plugin, you can both display template and code via following syntax.

```md
::: demo
file path
:::
```

## Features

- Only one source code
- Foldable code
- Support online editing
  - ✔ Codepen
  - ✔ JSFiddle
  - ✔ CodeSandbox
- Designed for long code
  - Sticky fold button
  - Auto scroll to top when you fold code

## Install

- First of all, install [vuepress v1.x](https://github.com/vuejs/vuepress)

- Then install the plugin

```bash
$ npm i -D vuepress-plugin-template-code
# OR
$ pnpm i -D vuepress-plugin-template-code
# OR
$ yarn add -D vuepress-plugin-template-code
```

## Usage

Write vuepress config

```js
module.exports = {
  plugins: ["template-code"],
};
```

## Options

This plugin supports the following configurations.

```js
module.exports = {
  plugins: [
    [
      "template-code",
      {
        jsLibs: [
          // umd
          "https://unpkg.com/tua-storage/dist/TuaStorage.umd.js",
        ],
        cssLibs: ["https://unpkg.com/animate.css@3.7.0/animate.min.css"],
        vueVersion: "^3",
        showText: "show code",
        hideText: "hide",
        styleStr: "text-decoration: underline;",
        minHeight: 200,
        onlineBtns: {
          codepen: true,
          jsfiddle: true,
          codesandbox: true,
        },
        jsfiddle: {
          framework: "library/pure", // default
          // framework: 'vue/2.6.11',
        },
        codesandbox: {
          deps: { lodash: "latest" },
          json: "",
          query: "",
          embed: "",
        },
        demoCodeMark: "template-code",
        componentsDir: path.resolve(__dirname, "/"),
      },
    ],
  ],
};
```

### jsLibs

- Type: `Array`
- Default: `[]`

Js libraries for the demo.

### cssLibs

- Type: `Array`
- Default: `[]`

Css libraries for the demo.

### vueVersion

- Type: `String` (semantic versioning syntax)
- Default: `^2.6.14`

The semantic version string of vue. For more information on semantic versioning syntax, see the [npm semver calculator](https://semver.npmjs.com/).

### showText

- Type: `String`
- Default: `show code`

The display text of unfold code button.

### hideText

- Type: `String`
- Default: `hide code`

The display text of fold code button.

### minHeight

- Type: `Number`
- Default: `200`(px)

The height of the code when it is folded.

### onlineBtns

- Type: `Object`
- Default: `{ codepen: true, jsfiddle: true, codesandbox: true }`

Display online edit buttons.

### jsfiddle

- Type: `Object`
- Default: `{ framework: 'library/pure' }`

It passes [jsfiddle options](https://docs.jsfiddle.net/api/display-a-fiddle-from-post).

### codesandbox

- Type: `Object`
- Default: `{ deps: {}, json: '', query: 'module=App.vue'', embed: '' }`

It passes [CodeSandbox options](https://codesandbox.io/docs/importing#define-api).

> `deps` is dependencies

### demoCodeMark

- Type: `String`
- Default: `demo`

### componentsDir

- Type `Function`

  The mark of the plugin, follows the tag after `:::`.

<!-- ## Related

- [vuepress-plugin-demo-block](https://github.com/xiguaxigua/vuepress-plugin-demo-block) -->

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) kola

## Contributors ✨

The plug-in reference vuepress-plugin-template-code
Thanks goes to these wonderful people

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->


<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
