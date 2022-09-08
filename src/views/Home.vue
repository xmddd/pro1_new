<template>
  <div class="home">
    <input
      v-show="false"
      id="file"
      type="file"
      @change="UploadFile($event)"
      ref="input"
    />
    <div class="title">瓶颈技术挖掘</div>
    <div class="upload" @click="upload">点击上传数据</div>
    <div v-show="show_graph" style="width: 100%">
      <Graph ref="Graph" :raw_data="data"></Graph>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

// import router from "@/router";
import Graph from "./component/Graph.vue";

export default {
  name: "HomeView",
  components: {
    Graph,
  },
  data() {
    return {
      str: "hello",
      data: {
        // name: "none"
      },
      show_graph: false,
    };
  },
  methods: {
    upload() {
      this.$refs.input.click();
    },
    UploadFile: function (e) {
      // console.log(e);
      let file = e.target.files[0];
      // console.log(file);
      // let file = document.getElementById("file").files[0];
      console.log("name:", file.name);
      console.log("size:", file.size);
      var reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (e) => {
        this.data = JSON.parse(e.target.result);
        this.show_graph = true;
        this.$nextTick(() => {
          this.$refs.Graph.Init();
          this.$refs.Graph.createCytoscape();
          // this.$refs.Graph.ChangeConceptColor()
        });
        // router.push({
        //   path: "graph",
        //   params: {
        //     data: this.data,
        //   },
        // });
        // console.log(this.data.name);
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  height: 400px;
  width: 1000px;
  margin: 100px auto;
  border: 2px solid;
  line-height: 400px;
  text-align: center;
  font-size: 30px;
}

.upload {
  height: 200px;
  width: 600px;
  margin: 100px auto;
  border: 2px solid;
  line-height: 200px;
  text-align: center;
  font-size: 30px;
}

.upload:hover {
  cursor: pointer;
  background-color: #b6c2e6;
}
</style>
