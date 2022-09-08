<template>
  <div class="scroll-y">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span><h2>研发需求立项结果预测</h2></span>
        </div>
      </template>
      <div style="margin: 10px">
        <el-row>
          <el-col :span="14">
            <div class="kg-box">
              <el-card v-loading="loading">
                <div id="box">
                  <div id="cy">
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
                          font-weight: bold;
                          margin-left: 10px;
                          width: 80%;
                          border-bottom: 1px solid whitesmoke;
                          margin-bottom: 3px;
                          padding-bottom: 3px;
                        "
                      >
                        <div v-if="currentHoverData.class == 'prj-node'">
                          需求立项标题
                        </div>
                        <div v-else-if="currentHoverData.class == 'paper-node'">
                          相关论文标题
                        </div>
                        <div v-else-if="currentHoverData.class == 'award-node'">
                          关联项目标题
                        </div>
                      </div>
                      <div style="font-family: PingFang SC; margin-left: 10px">
                        {{ currentHoverData.label }}
                      </div>
                    </div>
                  </div>
                  <div class="legend">
                    <img
                      src="../assets/legend.png"
                      style="width: 100%; height: 100%"
                    />
                  </div>
                </div>
              </el-card>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="action-box">
              <div>
                <el-card>
                  <div class="result-box">
                    <div
                      style="
                        font-family: PingFang SC;
                        font-size: large;
                        font-weight: bold;
                      "
                    >
                      需求立项评估结果：
                    </div>
                    <div
                      style="
                        color: #42b983;
                        font-family: PingFang SC;
                        font-size: large;
                        font-weight: bold;
                      "
                    >
                      {{ result }}
                    </div>
                  </div>
                  <div class="project-box">
                    <div class="project-title">
                      <div
                        style="
                          font-family: PingFang SC;
                          font-size: medium;
                          font-weight: bold;
                        "
                      >
                        需求立项标题：
                      </div>
                      <div
                        style="
                          font-family: PingFang SC;
                          font-size: small;
                          margin-top: 3px;
                        "
                      >
                        {{ project_title }}
                      </div>
                    </div>
                    <div class="project-abs">
                      <div
                        style="
                          font-family: PingFang SC;
                          font-size: medium;
                          font-weight: bold;
                        "
                      >
                        需求立项文本：
                      </div>
                      <div
                        style="
                          font-family: PingFang SC;
                          font-size: small;
                          margin-top: 3px;
                        "
                      >
                        <el-input
                          type="textarea"
                          :autosize="{ minRows: 2, maxRows: 4 }"
                          v-model="project_abs"
                        >
                        </el-input>
                      </div>
                    </div>
                  </div>
                </el-card>
              </div>
              <div style="margin-top: 20px">
                <el-card>
                  <div>
                    <div class="step-box">
                      <div>
                        <el-steps
                          :space="300"
                          :active="active"
                          align-center
                          finish-status="success"
                        >
                          <el-step
                            title="步骤 1"
                            description="项目需求选择"
                          ></el-step>
                          <el-step
                            title="步骤 2"
                            description="相关论文寻找"
                          ></el-step>
                          <el-step
                            title="步骤 3"
                            description="关联项目展示"
                          ></el-step>
                          <el-step
                            title="步骤 4"
                            description="立项结果预测"
                          ></el-step>
                        </el-steps>
                      </div>
                      <div v-if="active == 0" class="button-wrapper">
                        <div
                          style="
                            margin-top: 10px;
                            width: 100%;
                            display: flex;
                            flex-direction: row;
                            justify-content: center;
                          "
                        >
                          <el-select
                            v-model="project_id"
                            filterable
                            placeholder="请选择需要预测的项目"
                            size="medium"
                          >
                            <el-option
                              v-for="item in options"
                              :key="item.id"
                              :label="item.title"
                              :value="item.id"
                            >
                            </el-option>
                          </el-select>
                        </div>
                        <el-button
                          type="primary"
                          round
                          style="margin-top: 12px"
                          @click="initNode"
                        >
                          选择
                        </el-button>
                      </div>
                      <div v-else-if="active == 1" class="button-wrapper">
                        <el-button
                          type="primary"
                          round
                          style="margin-top: 12px"
                          @click="searchTopK"
                        >
                          查询
                        </el-button>
                      </div>
                      <div v-else-if="active == 2" class="button-wrapper">
                        <el-button
                          type="primary"
                          round
                          style="margin-top: 12px"
                          @click="searchAward"
                        >
                          查询
                        </el-button>
                      </div>
                      <div v-else-if="active == 3" class="button-wrapper">
                        <el-button
                          type="primary"
                          round
                          style="margin-top: 12px"
                          @click="getConfidence"
                        >
                          预测
                        </el-button>
                      </div>
                      <div v-else-if="active == 4" class="button-wrapper">
                        <el-button
                          type="warning"
                          round
                          style="margin-top: 12px"
                          @click="reload"
                        >
                          重试
                        </el-button>
                      </div>
                    </div>
                  </div>
                </el-card>
              </div>
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
      currentHoverData: {}, // 悬浮窗显示内容
      loading: false, // 加载

      options: [], // 可选展示项目
      project_id: "", // 选中项目id
      projects: {}, // 项目详情
      project_title: "", // 选中项目标题
      project_abs: "", // 选中项目摘要

      topk_paper: [], // 需求对应的topk论文
      paper_project: [], //论文与项目关联
      paper_info: {}, // 论文信息

      // 悬浮窗位置
      tipContainerX: 0,
      tipContainerY: 0,
      nodes: [
        // {
        //     data: {
        //         // id: "需求文本",
        //         // label: "需求文本",
        //         class: "prj-node",
        //     },
        //     position: {
        //         x: 20,
        //         y: 5,
        //     }
        // },
        // {
        //     data: {
        //         // id: "相关论文",
        //         // label: "相关论文",
        //         class: "paper-node",
        //     },
        //     position: {
        //         x: 70,
        //         y: 5,
        //     }
        // },
        // {
        //     data: {
        //         // id: "相关项目",
        //         // label: "相关项目",
        //         class: "award-node",
        //     },
        //     position: {
        //         x: 120,
        //         y: 5,
        //     }
        // },
      ],
      edges: [
        // {
        //     data: {
        //         id: 'e0',
        //         source: 'n2',
        //         target: 'n1'
        //     }
        // },
        // {
        //     data: {
        //         id: 'e1',
        //         source: 'n2',
        //         target: 'n3'
        //     }
        // },
        // {
        //     data: {
        //         id: 'e2',
        //         source: 'n2',
        //         target: 'n0'
        //     }
        // },
        // {
        //     data: {
        //         id: 'e3',
        //         source: 'n1',
        //         target: 'n0'
        //     }
        // },
        // {
        //     data: {
        //         id: 'e4',
        //         source: 'n0',
        //         target: 'n1'
        //     }
        // },
      ],
      projNodeBg: "#FFCC99",
      topkNodeBg: "#99CCFF",
      paperNodeBg: "#FFCCCC",
      edgeNum: 0, // 边序号
      cy: {},
      legend: {},
    };
  },
  methods: {
    // cy初始化
    createCytoscape() {
      cytoscape.warnings(false);
      this.cy = cytoscape({
        // 2. container
        container: document.getElementById("cy"),
        boxSelectionEnabled: false,
        userZoomingEnabled: true, //滚轮缩放
        wheelSensitivity: 0.1,
        autounselectify: true, // 是否可以拖拽
        autoungrabify: true,

        // 3. layout
        layout: {
          name: "preset",

          // preset 该preset布局使节点在您手动指定的位置。
          // grid grid布局使节点在良好隔开的网格。
          // circle 该circle布局使节点在一个圆圈。
          // concentric 该concentric布局定位在同心圆节点，根据您所指定的节点分隔成水平的度量。此布局设置concentric值ele.scratch()。
          // breadthfirst breadthfirst布局使在层次结构中的节点，基于所述图的breadthfirst遍历。默认的自上而下模式
          // random 该random布局使节点在视口内随机位置。

          // ame: 'random', //该random布局使节点在视口内随机位置。
          // fit: true, //如果要适应视区
          // padding: 30, //安装padding
          // animate: false, //如果要转换节点位置
        },
        minZoom: 0.3,

        // 4. style
        style: [
          {
            selector: "node",
            style: {
              content: "data(id)",
              "text-opacity": 0.5,
              height: 40,
              width: 40,
              "pie-size": "100%",
              "text-valign": "center",
              "text-halign": "left",
              "text-max-width": 100,
              "text-wrap": "wrap",
              "text-overflow-wrap": "anywhere",
              "line-height": 1.5,
              // "text-valign": "center",
              // "text-halign": "center",
              "font-size": 0,
              "font-weight": "lighter",
              // 'pie-1-background-color': '#E8747C',
              // 'pie-1-background-size': 'mapData(occupy, 0, 10, 0, 100)',
            },
          },
          {
            selector: "node[class='prj-node']",
            style: {
              shape: "star",
              color: "white",
              width: 25,
              height: 25,
              padding: 4,
              "text-opacity": 1,
              "border-width": 0,
              "background-color": this.projNodeBg,
            },
          },
          {
            selector: "node[class='paper-node']",
            style: {
              shape: "eclipse",
              color: "white",
              width: 20,
              height: 20,
              padding: 4,
              "text-opacity": 1,
              "border-width": 0,
              "background-color": this.topkNodeBg,
            },
          },
          {
            selector: "node[class='award-node']",
            style: {
              shape: "round-rectangle",
              color: "white",
              width: 20,
              height: 20,
              padding: 4,
              "text-opacity": 1,
              "border-width": 0,
              "background-color": this.paperNodeBg,
            },
          },
          {
            selector: ":parent",
            css: {
              "text-valign": "top",
              "text-halign": "center",
              // 'text-halign': 'right',
              // 'text-rotation': '90deg', //文字旋转
            },
          },
          {
            selector: "edge",
            style: {
              width: 2,
              label: "data(label)",
              "target-arrow-shape": "none",
              // "target-arrow-fill": "hollow", //箭头填充 空心
              "line-color": "#4ABDAC",
              // 'target-arrow-color': '#9dbaea',
              "curve-style": "bezier",
            },
          },
        ],
        // 5. elements
        elements: {
          //节点数据
          nodes: this.nodes,
          //
          edges: this.edges,
        },
      });
      // this.legend = cytoscape({
      //     container: document.getElementById('legend'),
      //     boxSelectionEnabled: false,
      //     userZoomingEnabled: false, //滚轮缩放
      //     wheelSensitivity: 0.1,
      //     autounselectify: false, // 是否可以拖拽
      //     autoungrabify: true,
      //
      //     layout: {
      //         name: 'null',
      //     },
      //     style: [
      //         {
      //             selector: "node[class='prj-node']",
      //             style: {
      //                 shape: "star",
      //                 color: "white",
      //                 width: 25,
      //                 height: 25,
      //                 padding: 4,
      //                 "text-opacity": 1,
      //                 "border-width": 0,
      //                 "background-color": this.projNodeBg,
      //             }
      //         },
      //         {
      //             selector: "node[class='paper-node']",
      //             style: {
      //                 shape: "eclipse",
      //                 color: "white",
      //                 width: 20,
      //                 height: 20,
      //                 padding: 4,
      //                 "text-opacity": 1,
      //                 "border-width": 0,
      //                 "background-color": this.topkNodeBg,
      //             }
      //         },
      //         {
      //             selector: "node[class='award-node']",
      //             style: {
      //                 shape: "round-rectangle",
      //                 color: "white",
      //                 width: 10,
      //                 height: 10,
      //                 padding: 4,
      //                 "text-opacity": 1,
      //                 "border-width": 0,
      //                 "background-color": this.paperNodeBg,
      //             }
      //         }
      //     ],
      //     elements: {
      //         //节点数据
      //         nodes: this.nodes,
      //         //
      //         edges: this.edges,
      //     }
      // })
    },

    // 按钮点击事件
    next() {
      this.active++;
      this.textDisabled = true;
    },

    // 初始化第一个节点
    initNode() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.project_title = this.projects[this.project_id]["title"];
        this.project_abs = this.projects[this.project_id]["abstract"];
        this.prjNode = {
          group: "nodes",
          data: {
            id: this.project_id,
            name: "需求立项标题",
            label: this.project_title,
            class: "prj-node",
          },
          position: {
            x: 220,
            y: 150,
          },
        };
        this.cy.add(this.prjNode);
        this.active++;
      }, 500);
    },

    // 查找TopK论文
    searchTopK() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        axios.get("/2_topk.json").then((res) => {
          this.topk_paper = res.data[this.project_id];
        });

        axios.get("/paper_info.json").then((res) => {
          this.paper_info = res.data;

          this.paper_nodes = [];
          let edges = [];

          for (let key in this.topk_paper) {
            let item = this.topk_paper[key];
            let node = {
              group: "nodes",
              data: {
                id: this.paper_info[item]["id"],
                name: "相关论文",
                label: this.paper_info[item]["title"],
                class: "paper-node",
              },
              position: {
                x: 200,
                y: 100,
              },
            };
            this.paper_nodes.push(node);

            let edge = {
              group: "edges",
              data: {
                id: "e" + this.edgeNum,
                source: this.project_id,
                target: this.paper_info[item]["id"],
              },
            };
            this.edgeNum++;
            edges.push(edge);
          }

          this.cy.add(this.paper_nodes);
          this.cy.add(edges);
          // 刷新布局
          let layout = this.cy.layout({ name: "circle" });
          layout.run();

          // 动画
          this.cy.animate(
            {
              center: { eles: this.cy.elements('node[class="prj-node"]') },
              zoom: 1,
            },
            {
              duration: 1000,
            }
          );
        });
        this.active++;
      }, 500);
    },

    // 查找论文-项目关联
    searchAward() {
      axios.get("/2_paper_project.json").then((res) => {
        this.paper_project = res.data[this.project_id];
        for (let key in this.paper_project) {
          let item = this.paper_project[key];
          let type = item["type"];

          if (type == 1) {
            let awardNode = {
              group: "nodes",
              data: {
                id: item["id2"],
                name: "相关项目",
                label: this.projects[item["id2"]]["title"],
                class: "award-node",
              },
              position: {
                x: 200,
                y: 100,
              },
            };
            let edge = {
              group: "edges",
              data: {
                id: "e" + this.edgeNum,
                source: item["id1"],
                target: item["id2"],
              },
            };
            this.edgeNum++;
            this.cy.add(awardNode);
            this.cy.add(edge);
          } else if (type == 0) {
            let node1 = {
              group: "nodes",
              data: {
                id: item["id1"],
                name: "相关论文",
                label: this.paper_info[item["id1"]]["title"],
                class: "paper-node",
              },
              position: {
                x: 200,
                y: 100,
              },
            };

            let node2 = {
              group: "nodes",
              data: {
                id: item["id2"],
                name: "相关论文",
                label: this.paper_info[item["id2"]]["title"],
                class: "paper-node",
              },
              position: {
                x: 200,
                y: 100,
              },
            };
            let edge = {
              group: "edges",
              data: {
                id: "e" + this.edgeNum,
                source: item["id1"],
                target: item["id2"],
              },
            };
            this.edgeNum++;
            try {
              this.cy.add(node1);
            } catch (e) {
              console.log(e);
            }
            try {
              this.cy.add(node2);
            } catch (e) {
              console.log(e);
            }
            this.cy.add(edge);
          }
        }
        let layout = this.cy.layout({ name: "circle" });
        layout.run();

        // 动画
        this.cy.animate(
          {
            center: { eles: this.cy.elements('node[class="prj-node"]') },
            zoom: 1,
          },
          {
            duration: 1000,
          }
        );
      });
      this.active++;
    },

    // 获得立项预测概率
    getConfidence() {
      axios.get("/2_confidence.json").then((res) => {
        this.result = res.data[this.project_id];
        this.$alert(
          "根据您输入的需求标题与需求文本，该项目立项成功率的预测结果为：" +
            this.result,
          "预测结果",
          {
            confirmButtonText: "确定",
          }
        );
      });
      this.active++;
    },

    reload() {
      this.active = 0;
      this.result = "未评估";
      this.cy.unmount();
      this.createCytoscape();
    },

    // 设置提示的位置
    moveTipsContainer(e) {
      this.tipContainerX =
        e.target.renderedPosition().x - e.target.width() / 2 - 80 + "px";
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
    hoverTips() {
      this.showTips = true;
    },
    mouseoutTips() {
      this.showTips = false;
    },
    // load local json files
    loadJson() {
      axios.get("/2_projects.json").then((res) => {
        this.projects = res.data;
        for (let key in res.data) {
          this.options.push(res.data[key]);
        }
      });
    },
  },
  mounted() {
    this.createCytoscape();
    this.addMouseOverOutEvent();
    this.loadJson();
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

.result-box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.project-title {
  margin-top: 5px;
}

.project-abs {
  margin-top: 5px;
}

.button-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>
