const { defaultTheme } = require("@vuepress/theme-default");
const { viteBundler } = require("@vuepress/bundler-vite");
const demoCodePlugin = require("../../src/node/index.js");

const { path } = require("@vuepress/utils");
module.exports = {
  host: "0.0.0.0",
  title: "vuepress-plugin-template-code",
  description: "编写组件库文档的增加 Vue 展示和代码示例",
  port: 6688,
  locales: {
    "/": {
      lang: "zh-CN",
    },
  },
  bundler: viteBundler({
    // ssr: {
    //     noExternal: ["element-plus"],
    // },
  }),
  theme: "@vuepress/theme-default",
  theme: defaultTheme({
    navbar: [
      {
        text: "首页",
        link: "/",
      },
      {
        text: "指南",
        children: [
          "/guide/get-started.md",
          "/guide/install.md",
          "/guide/demo.md",
        ],
      },
      {
        text: "GitHub",
        link: "https://github.com/bobobabab/vuepress-plugin-template-code",
      },
    ],
    sidebar: {
      "/guide/": [
        {
          text: "指南",
          isGroup: true,
          children: [
            {
              text: "介绍",
              children: [
                "/guide/get-started.md",
                "/guide/install.md",
                "/guide/demo.md",
              ],
            },
          ],
        },
      ],
    },
  }),
  plugins: [
    [
      demoCodePlugin({
        path: path.resolve(__dirname, "../examples"),
      }),
    ],
  ],
  markdown: {
    lineNumbers: true,
  },
};
