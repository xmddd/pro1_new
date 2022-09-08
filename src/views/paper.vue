<template>
  <div class="scroll-y">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span><h2>瓶颈技术挖掘</h2></span>
        </div>
      </template>
      <div style="margin: 10px">
        <el-row>
          <el-col :span="16">
            <div class="kg-box">
              <el-card v-loading="loading">
                <div id="box">
                  <div
                    id="tipsWrapper"
                    v-show="showTips"
                    class="hover-box"
                    @mouseover="hoverTips"
                    @mouseout="mouseoutTips"
                    :style="{ left: tipContainerX, top: tipContainerY }"
                  >
                    <div
                      style="
                        font-family: PingFang SC;
                        margin-left: 10px;
                        width: 80%;
                        border-bottom: 1px solid whitesmoke;
                        margin-bottom: 3px;
                        padding-bottom: 3px;
                      "
                    >
                      <div style="font-weight: bold">
                        {{ currentHoverData.name }}
                      </div>
                      <div v-if="currentHoverData.group == 'paper'">
                        <div style="">
                          国家：<span
                            v-for="country in currentHoverData.countries"
                            :key="country"
                            >{{ country + " " }}</span
                          >
                        </div>
                        <div style="">
                          领域：<span
                            v-for="concept in currentHoverData.concepts"
                            :key="concept"
                            >{{ concept + " " }}</span
                          >
                        </div>
                      </div>
                      <div v-if="currentHoverData.group == 'concept'"></div>
                    </div>
                  </div>
                  <div id="cy"></div>
                  <div class="legend"></div>
                </div>
              </el-card>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="action-box">
              <el-card v-loading="loading">
                <el-row style="margin-bottom: 20px">
                  <el-col :span="18">
                    <el-select
                      v-model="dataset"
                      collapse-tags
                      style="margin: 0 20px"
                      placeholder="请选择数据集"
                    >
                      <el-option
                        v-for="item in datasets"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="6">
                    <el-button type="primary" round @click="ChooseDataset">
                      选择
                    </el-button>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="18">
                    <el-select
                      v-model="country"
                      collapse-tags
                      style="margin: 0 20px"
                      placeholder="请选择国家"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="6">
                    <el-button type="primary" round @click="filter">
                      筛选
                    </el-button>
                  </el-col>
                </el-row>
              </el-card>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import cytoscape from "cytoscape";
import popper from "cytoscape-popper";
// import tippy, {sticky} from 'tippy.js';
import axios from "axios";

cytoscape.use(popper);

export default {
  name: "project-feasibility",
  data() {
    return {
      requirements: "", // 需求文本
      active: 0, // 进度条状态
      textDisabled: false, // 文本框禁用
      result: "未评估", // 预测结果
      showTips: false, // 悬浮窗显示
      // 悬浮窗位置
      tipContainerX: 0,
      tipContainerY: 0,
      currentHoverData: {}, // 悬浮窗显示内容
      loading: false, // 加载数据集
      datasets: [
        {
          value: 1,
          label: "dataset 1",
        },
      ],
      dataset: "",
      paper_drawer: false,
      concept_drawer: false,
      nodes: [],
      edges: [],
      paper_info: {
        title: "",
        countries: [],
        concepts: [],
      },
      concept_info: "",
      country: "",
      options: [],
      data: {},
      raw_data: {},
      cy: {},
    };
  },
  methods: {
    hoverTips() {
      this.showTips = true;
    },
    mouseoutTips() {
      this.showTips = false;
    },
    // 设置提示的位置
    moveTipsContainer(e) {
      this.tipContainerX =
        e.target.renderedPosition().x - e.target.width() / 2 - 60 + "px";
      this.tipContainerY =
        e.target.renderedPosition().y + e.target.height() - 5 + "px";
    },
    addMouseOverOutEvent() {
      this.cy.on("mouseover", "node", (e) => {
        this.showTips = true;
        this.currentHoverData = e.target.data();
        this.$nextTick(() => {
          this.moveTipsContainer(e);
        });
      });
      this.cy.on("mouseout", "node", (e) => {
        this.showTips = false;
        console.log(e);
      });
    },
    ChooseDataset() {
      // console.log(this.dataset);
      this.loading = true;
      if (this.dataset == 1)
        axios.get("/1_dataset.json").then((res) => {
          this.raw_data = res.data;
          this.raw_data["name"] = "demo";
          this.data = this.raw_data;
          console.log(this.raw_data);
          this.loading = false;
          this.Init();
          // this.cy.unmount();
          this.createCytoscape();
        });
    },

    // 初始化国家筛选器
    Init() {
      var id;
      for (id in this.data.country_name) {
        this.options.push({
          value: id,
          label: this.data.country_name[id],
        });
      }
    },
    map(x, x_min, x_max, y_min, y_max) {
      var y = y_min + ((y_max - y_min) / (x_max - x_min)) * (x - x_min);
      return y;
    },
    add_paper_nodes() {
      var max = 0;
      var min = 10000;
      for (var id in this.data.pagerank_results) {
        var rank = this.data.pagerank_results[id];
        max = max > rank ? max : rank;
        min = min < rank ? min : rank;
      }
      for (id in this.data.paper_name) {
        var num =
          255 - this.map(this.data.pagerank_results[id], min, max, 100, 250);
        var color = `rgb(${num},${num},${num})`;
        let countries = [];
        let concepts = [];
        if (this.data.paper_country[id] != undefined)
          for (var country_id of this.data.paper_country[id]) {
            countries.push(this.data.country_name[country_id]);
          }
        if (this.data.paper_concept[id] != undefined)
          for (var concept_id of this.data.paper_concept[id]) {
            concepts.push(this.data.concept_name[concept_id]);
          }
        this.nodes.push({
          data: {
            id: id,
            name: this.data.paper_name[id],
            group: "paper",
            countries: countries,
            concepts: concepts,
            // tooltip: this.data.paper_name[id],
          },
          style: {
            "background-color": color,
          },
        });
      }
    },
    add_paper_paper_edges() {
      for (var id in this.data.paper_paper) {
        var refered_paper_list = this.data.paper_paper[id];

        for (var refered_id of refered_paper_list) {
          this.edges.push({
            data: {
              source: id,
              target: refered_id,
              group: "paper-paper",
            },
          });
        }
      }
    },
    add_concept_nodes() {
      for (var id in this.data.concept_name) {
        this.nodes.push({
          data: {
            id: id,
            group: "concept",
            name: this.data.concept_name[id],
          },
          style: {
            "background-color": "red",
          },
        });
      }
    },
    add_paper_concept_edges() {
      for (var id in this.data.paper_concept) {
        var refered_concept_list = this.data.paper_concept[id];
        // console.log(id, refered_concept_list)
        for (var refered_id of refered_concept_list) {
          // console.log(id, refered_id);
          this.edges.push({
            data: {
              source: id,
              target: refered_id,
              group: "paper-concept",
            },
            // style:{
            //   "line-color": "#9dbaea",
            //   "curve-style": "bezier",
            // }
          });
        }
      }
    },
    add_country_nodes() {},
    createCytoscape() {
      this.nodes = [];
      this.edges = [];
      this.add_paper_nodes();
      this.add_paper_paper_edges();
      this.add_concept_nodes();
      this.add_paper_concept_edges();
      this.add_country_nodes();
      cytoscape.warnings(false);
      this.cy = cytoscape({
        container: document.getElementById("cy"),
        // userPanningEnabled: true, // 是否允许用户事件(例如拖动图形背景)平移图形.平移的程序化更改不受此选项的影响.
        // boxSelectionEnabled: true, // 是否启用了框选择(即拖动框叠加,并将其释放为选择).如果启用,则用户必须点击以平移图表.
        userZoomingEnabled: true, //滚轮缩放
        wheelSensitivity: 0.1,
        // autounselectify: false,
        autoungrabify: false,
        layout: {
          name: "circle",
        },
        minZoom: 0.3,
        style: [
          {
            selector: "node",
            style: {
              // content: "data(id)",
              "text-opacity": 0.5,
              height: 40,
              width: 40,
              "pie-size": "100%",
              "text-valign": "center",
              "text-halign": "left",

              // 'pie-1-background-color': '#E8747C',
              // 'pie-1-background-size': 'mapData(occupy, 0, 10, 0, 100)',
            },
          },
          {
            selector: "edge",
            style: {
              width: 3,
              label: "data(label)",
              "target-arrow-shape": "triangle",
              // "target-arrow-fill": "hollow", //箭头填充 空心
              // "line-color": "#9dbaea",
              // "target-arrow-color": "#9dbaea",
              "curve-style": "bezier",
            },
          },
          {
            selector: 'edge[group="paper-paper"]',
            style: {
              "line-color": "#111111",
              "target-arrow-color": "#111111",
            },
          },
          {
            selector: 'edge[group="paper-concept"]',
            style: {
              "line-color": "red",
              "target-arrow-color": "red",
            },
          },
        ],
        elements: {
          nodes: this.nodes,
          edges: this.edges,
          grabbable: true,
        },
      });

      this.addMouseOverOutEvent();
    },
    filter() {
      this.cy.destroy();
      this.createCytoscape();
      if (this.country == "") return;
      // this.data = {};
      var paper_list = [];
      for (var id in this.raw_data.paper_name) {
        // console.log(id);
        // console.log(this.countries);
        // console.log(this.raw_data.paper_country[id]);
        if (
          this.raw_data.paper_country[id] == undefined ||
          this.raw_data.paper_country[id].indexOf(this.country) == -1
        ) {
          paper_list.push(id);
          this.cy.$id(id).remove();
        }
      }
      console.log(paper_list);
      var layout = this.cy.layout({ name: "circle" });
      // this.cy.resize();
      layout.run();
      this.ChangeConceptColor();
    },
    ChangeConceptColor() {
      console.log(this.country, this.data.country_concept_score[this.country]);

      var max = 0,
        min = 100;
      for (var concept in this.data.country_concept_score[this.country]) {
        var score = this.data.country_concept_score[this.country][concept];
        max = max > score ? max : score;
        min = min < score ? min : score;
      }
      console.log(min, max);
      for (concept in this.data.country_concept_score[this.country]) {
        score = this.data.country_concept_score[this.country][concept];

        var num = 255 - this.map(score, min, max, 100, 255);
        var color = `rgb(255,${num},${num})`;
        console.log(this.country, concept, color);
        this.cy.$id(concept).style({
          "background-color": color,
        });
      }
    },
  },
  mounted() {
    // this.createCytoscape();
  },
};
</script>

<style scoped lang="scss">
.box-card {
  min-height: 500px;
  background-color: #fcfcfc;

  .contain {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    .tip {
      position: absolute;
      background: rgba(0, 0, 0, 0.8);
      width: 100px;
      border-radius: 2px;
      color: rgba(255, 255, 255, 0.82);
      padding: 5px;
      font-size: 12px;
    }
  }
}

.el-button {
  width: 80px;
  height: 35px;
  padding: 0;
  font-size: 18px;
  font-weight: bold;
}

.kg-box {
  width: 98%;
  margin-right: 2%;
}

#box {
  width: 100%;
  height: 310px;
}

#cy {
  width: 100%;
  height: 85%;
}

.legend {
  width: 183px;
  height: 63px;
  margin-left: 65%;
  margin-bottom: 10px;
}

#tipsWrapper {
  box-shadow: 0px 0px 4px #ccc;
  width: 200px;
  padding: 10px 0px;
  display: flex;
  justify-content: center;
  position: absolute;
  background: #f9f9f9;
  z-index: 3;
  border-radius: 8px;
}

.action-box {
  width: 98%;
  margin-left: 2%;
}

.hover-box {
  padding: 5px;
  display: flex;
  flex-direction: column;
}
</style>
