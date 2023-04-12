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
  plugins: [
    "vuepress-plugin-template-code",
    {
      path: "./",
    },
  ],
};
```

## Options

This plugin supports the following configurations.

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) kola

## Contributors ✨

The plug-in reference vuepress-plugin-template-code
Thanks goes to these wonderful people

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
