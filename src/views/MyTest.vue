<template>
  <div>
    <el-button @click="drawer = true" type="primary" style="margin-left: 16px">
      点我打开
    </el-button>

    <el-drawer title="我是标题" v-model="drawer" size="260px"> </el-drawer>

    <div
      style="
        width: 100px;
        height: 100px;
        background-color: rgba(255, 200, 200, 1);
      "
    ></div>
    <div id="cy" style="height: 400px; width: 100%"></div>
  </div>
</template>

<script>
import cytoscape from "cytoscape";
export default {
  data() {
    return {
      drawer: false,
    };
  },
  mounted() {
    this.createCytoscape();
  },
  methods: {
    createCytoscape() {
      cytoscape.warnings(false);
      let cy = cytoscape({
        container: document.getElementById("cy"),
        // userPanningEnabled: true, // 是否允许用户事件(例如拖动图形背景)平移图形.平移的程序化更改不受此选项的影响.
        // boxSelectionEnabled: true, // 是否启用了框选择(即拖动框叠加,并将其释放为选择).如果启用,则用户必须点击以平移图表.
        userZoomingEnabled: true, //滚轮缩放
        wheelSensitivity: 0.1,
        // autounselectify: false,
        autoungrabify: false,
        layout: {
          name: "preset",
        },
        minZoom: 0.3,
        elements: {
          nodes: [
            {
              data: {
                id: "1",
              },
              style: {
                "background-color": "black",
                content: "  论文",
              },
              position: {
                x: 50,
                y: 100,
              },
            },
            {
              data: {
                id: "2",
              },
              style: {
                "background-color": "red",
                content: "  领域",
              },
              position: {
                x: 150,
                y: 100,
              },
            },
            {
              data: {
                id: "3",
              },
              style: {
                "background-color": "blue",
                content: "国家",
                // "padding-left": "5px",
              },
              position: {
                x: 250,
                y: 100,
              },
            },
          ],
          edges: [],
          grabbable: true,
        },
        style: [
          {
            selector: "node",
            style: {
              // content: "data(id)",
              "text-opacity": 0.5,
              height: 20,
              width: 20,
              "pie-size": "100%",
              "text-valign": "center",
              "text-halign": "right",
              
              // 'pie-1-background-color': '#E8747C',
              // 'pie-1-background-size': 'mapData(occupy, 0, 10, 0, 100)',
            },
          },
        ],
      });
      // console.log(cy)
      cy.on("click", "node", (e) => {
        console.log(e.target.data());
      });
    },
  },
};
</script>

<style scoped></style>
