<template>
  <div>
    <el-button @click="drawer = true" type="primary" style="margin-left: 16px">
      点我打开
    </el-button>

    <el-drawer
      title="我是标题"
      v-model="drawer"
      size="260px"
    >
    </el-drawer>

    <div style="width:100px;height:100px;background-color: rgba(255,200,200,1);"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
    };
  },
};
</script>

<style scoped></style>
