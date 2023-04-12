<template>
  <el-button type="primary">Primary Button</el-button>
  <el-button>Default Button</el-button>
  <el-button type="success">success Button</el-button>
  <el-button link>Text Button</el-button>
</template>
<script>
import { reactive, toRefs } from "vue";
export default {
  setup(props, context) {
    let _data = reactive({});
    return {
      ...toRefs(_data),
    };
  },
};
</script>
