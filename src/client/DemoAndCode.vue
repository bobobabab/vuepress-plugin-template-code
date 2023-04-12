<template>
  <div>
    <section class="demo-and-code-wrapper">
      <!-- <slot name="demo" /> -->
      <component :is="componentName" v-if="componentName" v-bind="$attrs" />
    </section>
    <div class="description" v-html="decodeDesc"></div>
    <div class="code-box-actions">
      <button
        type="submit"
        class="code-box-code-action"
        :data-tip="isShowCode ? 'Hide' : 'Show'"
        @click="onClickControl"
      >
        <component :is="isShowCode ? 'showCode' : 'hideCode'" />
      </button>
      <button
        type="submit"
        class="code-box-code-action"
        :data-tip="isCopy ? 'Copied' : 'Copy'"
        @click="copyToClipboard"
      >
        <component :is="isCopy ? 'copySuccess' : 'copy'" />
      </button>
      <OnlineEdit
        v-for="platform in platforms"
        :key="platform"
        v-show="showOnlineBtns[platform]"
        v-bind="parsedCode"
        :platform="platform"
        :vueVersion="vueVersion"
      />
    </div>

    <div class="code-wrapper" ref="codeWrapper" :style="codeWrapperStyle">
      <div :class="`language-${language} ext-${language}`">
        <pre
          :class="`language-${language}`"
        ><code v-html="highlightCode" /></pre>
      </div>
    </div>
  </div>
</template>

<script>
import showCode from "./icons/showCode.vue";
import hideCode from "./icons/code.vue";
import copy from "./icons/copy.vue";
import copySuccess from "./icons/success.vue";
import OnlineEdit from "./OnlineEdit.vue";
import { JS_RE, CSS_RE, HTML_RE, PLATFORMS } from "./constants";
import { parseAndDecode, getMatchedResult } from "./utils";

export default {
  name: "DemoAndCode",
  components: {
    OnlineEdit,
    showCode,
    hideCode,
    copy,
    copySuccess,
  },
  props: {
    description: {
      type: String,
      required: true,
    },
    componentName: {
      type: String,
      required: true,
    },
    htmlStr: { type: String, default: "" },
    language: { type: String, default: "vue" },
    showText: { type: String, default: "show code" },
    hideText: { type: String, default: "hide code" },
    jsLibsStr: { type: String, default: "[]" },
    cssLibsStr: { type: String, default: "[]" },
    vueVersion: { type: String, default: "^2.6.14" },
    jsfiddleStr: { type: String, default: "{}" },
    onlineBtnsStr: { type: String, default: "{}" },
    codesandboxStr: { type: String, default: "{}" },
    highlightCodeStr: { type: String, default: "" },
    // minHeight: {
    //   type: Number,
    //   default: 200,
    //   validator: val => val >= 0,
    // },
  },
  data() {
    return {
      scrollTop: 0,
      platforms: PLATFORMS,
      codeHeight: 9999,
      navbarHeight: 0,
      isCopy: false,
      isShowCode: true,
      isShowControl: true,
    };
  },
  computed: {
    // button text
    // controlText: (vm) => vm.isShowCode ? vm.hideText : vm.showText,
    decodeDesc: (vm) => decodeURIComponent(vm.description),
    highlightCode: (vm) => decodeURIComponent(vm.highlightCodeStr),
    decodedHtmlStr: (vm) => decodeURIComponent(vm.htmlStr),
    showOnlineBtns: (vm) => parseAndDecode(vm.onlineBtnsStr),
    // icon animation
    // iconStyle: (vm) => ({
    //   transform: vm.isShowCode ? 'rotate(0)' : 'rotate(-180deg)',
    // }),
    // animation
    // codeWrapperStyle: (vm) => ({
    //   'max-height': vm.isShowCode ? `${vm.codeHeight}px` : `${vm.minHeight}px`,
    // }),
    codeWrapperStyle: (vm) => ({
      display: vm.isShowCode ? `block` : `none`,
    }),
    // sticky
    // codeControlStyle: (vm) => ({
    //   top: vm.isShowCode ? `${vm.navbarHeight}px` : '0',
    //   cursor: vm.isShowControl ? 'pointer' : 'auto',
    // }),
    parsedCode: (vm) => {
      const js = getMatchedResult(JS_RE)(vm.decodedHtmlStr) || "";
      const css = getMatchedResult(CSS_RE)(vm.decodedHtmlStr) || "";
      const html =
        getMatchedResult(HTML_RE)(vm.decodedHtmlStr) ||
        vm.decodedHtmlStr
          .replace(JS_RE, "")
          .replace(CSS_RE, "")
          .replace(HTML_RE, "")
          .trim();

      const jsLibs = parseAndDecode(vm.jsLibsStr);
      const cssLibs = parseAndDecode(vm.cssLibsStr);
      const jsfiddleOptions = parseAndDecode(vm.jsfiddleStr);
      const codesandboxOptions = parseAndDecode(vm.codesandboxStr);

      return {
        js,
        css,
        html,
        jsLibs,
        cssLibs,
        codesandboxOptions,
        jsfiddleOptions,
      };
    },
  },
  methods: {
    onClickControl() {
      this.isShowCode = !this.isShowCode;

      if (!this.isShowCode) {
        this.getDomRect();
        window.scrollTo({ top: this.scrollTop, behavior: "smooth" });
      }
    },
    getDomRect() {
      const navbar = document.querySelector("header.navbar");
      const { codeWrapper } = this.$refs;

      const { top: codeTop, height: codeHeight } =
        codeWrapper.getBoundingClientRect();
      const { height: navbarHeight } = navbar
        ? navbar.getBoundingClientRect()
        : { height: 0 };

      this.scrollTop = window.scrollY + codeTop - navbarHeight - 35;
      this.codeHeight = codeHeight;
      this.navbarHeight = navbarHeight;
    },
    copyToClipboard() {
      this.isCopy = true;
      const el = document.createElement("textarea");
      el.value = this.decodedHtmlStr;
      el.setAttribute("readonly", "");
      el.style.position = "absolute";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      const selected =
        document.getSelection().rangeCount > 0
          ? document.getSelection().getRangeAt(0)
          : false;
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      if (selected) {
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(selected);
      }
      setTimeout(() => {
        this.isCopy = false;
      }, 1000);
    },
  },

  mounted() {
    this.getDomRect();
    this.isShowCode = false;

    if (this.codeHeight < this.minHeight) {
      this.isShowControl = false;
    }
  },
};
</script>

<style lang="css">
html {
  scroll-behavior: smooth;
}

template {
  display: block;
}
</style>

<style lang="scss" scoped>
.description {
  border-top: 1px dashed #f0f0f0;
  //   padding-top: 1em;
}
.code-box-actions {
  display: flex;
  justify-content: center;
  padding: 12px 0;
  border-top: 1px dashed #f0f0f0;
  opacity: 0.7;
  transition: opacity 0.3s;
  .code-box-code-action {
    position: relative;
    border-color: transparent;
    outline: none;
    background-color: transparent;
    svg {
      width: 16px;
      height: 16px;
      // margin-left: 16px;
      color: #00000073;
      cursor: pointer;
      transition: all 0.24s;
      // &:first-child{
      //     margin-left: 0;
      // }
    }

    &:before,
    &:after {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
    &:hover {
      &:before {
        top: -30px;
        padding: 6px;
        content: attr(data-tip);
        color: #fff;
        border-radius: 4px;
        background-color: rgba(0, 0, 0, 0.8);
        line-height: 1;
      }
      &:after {
        top: -5px;
        content: "";
        border: 5px solid transparent;
        border-top-color: rgba(0, 0, 0, 0.8);
      }
    }
  }
}
.demo-and-code-wrapper {
  padding: 10px 0;

  // for vuepress-plugin-code-copy
  .code-copy {
    position: absolute;
    top: 20px;
    right: 0;

    opacity: 1;

    svg {
      right: 10px;
    }
  }

  .code-control {
    position: sticky;
    z-index: 9;

    display: flex;
    justify-content: space-between;

    width: 100%;
    height: 50px;
    margin-bottom: -0.85rem;

    text-align: center;

    background-color: #fff;

    font-size: 20px;
    line-height: 50px;

    .control-btn {
      display: flex;
      flex: 1;
      justify-content: center;
    }

    // .arrow-icon {
    //   display: inline-block;
    //   align-self: center;

    //   margin-left: 5px;

    //   transition: transform .3s ease-in-out;

    //   border-top: none;
    //   border-right: 6px solid transparent;
    //   border-bottom: 6px solid #2c3e50;
    //   border-left: 6px solid transparent;
    // }
  }

  .code-wrapper {
    overflow: hidden;

    transition: max-height 0.6s ease-in-out;
  }
}

@media (max-width: 419px) {
  .demo-and-code-wrapper {
    margin: 0 -1.5rem;

    .code-wrapper {
      overflow: auto;
    }

    div[class*="language-"] {
      margin: 0 !important;
    }
  }
}
</style>
