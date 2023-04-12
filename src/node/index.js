let markdownItContainer = require("markdown-it-container");
const MarkdownIt = require("markdown-it");
const localMd = MarkdownIt();
const fs = require("fs");
const { hash, path } = require("@vuepress/utils");
const prepareClientAppEnhanceFile = require("./prepareClientAppEnhanceFile");

const chokidar = require("chokidar");
const encodeAndStringify = (obj) => encodeURIComponent(JSON.stringify(obj));

const defaults = {
  onlineBtns: {
    codepen: true,
    jsfiddle: true,
    codesandbox: true,
  },

  // https://docs.jsfiddle.net/api/display-a-fiddle-from-post
  jsfiddle: {
    framework: "library/pure",
  },

  // https://codesandbox.io/docs/importing#define-api
  codesandbox: {
    deps: {}, // dependencies
    json: "",
    query: "module=App.vue",
    embed: "",
  },
};

module.exports = (options = {}) => {
  return (app) => {
    if (!options.path) {
      throw Error(
        "[vuepress-plugin-demo-block-vue3]:not find componentsDir,please BlockDemo({path:__dirname})"
      );
    }
    const {
      jsLibs = [],
      cssLibs = [],
      showText = "show code",
      hideText = "hide code",
      minHeight,
      vueVersion = "^2.6.14",
      demoCodeMark = "demo",
    } = options;
    options = Object.assign(
      {
        components: {},
        componentsDir: options.path,
        componentsPatterns: ["**/*.vue"],
        getComponentName: (filename) =>
          path.trimExt(filename.replace(/\/|\\/g, "-")),
      },
      options
    );
    const optionsHash = hash(options);

    const { componentsDir, componentsPatterns } = options;

    return {
      name: "vuepress-plugin-template-code",
      clientConfigFile: () =>
        prepareClientAppEnhanceFile(app, options, optionsHash),
      //   onInitialized: () =>
      //     prepareClientAppEnhanceFile(app, options, optionsHash),
      extendsMarkdown: (md) => {
        md.use(markdownItContainer, demoCodeMark, { render });
      },
      onWatched: (app, watchers) => {
        if (componentsDir) {
          const componentsWatcher = chokidar.watch(componentsPatterns, {
            cwd: componentsDir,
            ignoreInitial: true,
          });
          componentsWatcher.on("add", () => {
            prepareClientAppEnhanceFile(app, options, optionsHash);
          });
          componentsWatcher.on("unlink", () => {
            prepareClientAppEnhanceFile(app, options, optionsHash);
          });
          watchers.push(componentsWatcher);
        }
      },
    };

    function render(tokens, idx, { highlight }) {
      const {
        component = "DemoAndCode",
        componentsDir,
        getComponentName,
      } = options;
      const componentName = component
        .replace(/^\S/, (s) => s.toLowerCase())
        .replace(/([A-Z])/g, "-$1")
        .toLowerCase();
      const { nesting, info } = tokens[idx];
      const m = info.trim().match(/^demo\s*(.*)$/);

      if (nesting === 1) {
        const description = m && m.length > 1 ? m[1] : "";
        const sourceFileToken = tokens[idx + 2];
        const sourceFile = sourceFileToken.children?.[0].content ?? "";
        let source = "";

        if (sourceFileToken.type === "inline") {
          source = fs.readFileSync(
            path.resolve(`${componentsDir}/${sourceFile}.vue`),
            "utf-8"
          );
        }
        const cptName = getComponentName(sourceFile);
        const language = (info.split(demoCodeMark)[1] || "vue").trim();
        const jsfiddle = Object.assign({}, defaults.jsfiddle, options.jsfiddle);
        const onlineBtns = Object.assign(
          {},
          defaults.onlineBtns,
          options.onlineBtns
        );
        const codesandbox = Object.assign(
          {},
          defaults.codesandbox,
          options.codesandbox
        );

        const jsLibsStr = encodeAndStringify(jsLibs);
        const cssLibsStr = encodeAndStringify(cssLibs);
        const jsfiddleStr = encodeAndStringify(jsfiddle);
        const onlineBtnsStr = encodeAndStringify(onlineBtns);
        const codesandboxStr = encodeAndStringify(codesandbox);
        const htmlStr = encodeURIComponent(source);
        let result = `<${componentName} 
                componentName="${cptName}" 
                description="${encodeURIComponent(localMd.render(description))}"
                htmlStr="${htmlStr}"
                language="${language}"
                showText="${showText}"
                hideText="${hideText}"
                jsLibsStr="${jsLibsStr}"
                cssLibsStr="${cssLibsStr}"
                vueVersion="${vueVersion}"
                jsfiddleStr="${jsfiddleStr}"
                onlineBtnsStr="${onlineBtnsStr}"
                codesandboxStr="${codesandboxStr}"
                highlightCodeStr="${encodeURIComponent(
                  highlight(source, "vue")
                )}"
              >
            `;
        return result;
      }
      return `</${componentName}>`;
    }
  };
};
