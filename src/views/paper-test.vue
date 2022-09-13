<template>
    <div class="scroll-y">
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
          <span>
            <h2>瓶颈技术挖掘</h2>
          </span>
                </div>
            </template>
            <div style="margin: 10px">
                <el-row>
                    <el-col :span="16">
                        <div class="kg-box">
                            <el-card v-loading="loading">
                                <div id="box">
                                    <div
                                        v-show="showTips" id="tipsWrapper" class="hover-box" :style="{ left: tipContainerX, top: tipContainerY }"
                                        @mouseover="hoverTips" @mouseout="mouseoutTips">
                                        <div
                                            style="
                        font-family: PingFang SC;
                        margin-left: 10px;
                        width: 80%;
                        border-bottom: 1px solid whitesmoke;
                        margin-bottom: 3px;
                        padding-bottom: 3px;
                      ">
                                            <div style="font-weight: bold">
                                                {{ currentHoverData.name }}
                                            </div>
                                            <div v-if="currentHoverData.group == 'paper'">
                                                <div style="">
                                                    国家：<span v-for="country in currentHoverData.countries" :key="country">{{ country + " "
                          }}</span>
                                                </div>
                                                <div style="">
                                                    领域：<span v-for="concept in currentHoverData.concepts" :key="concept">{{ concept + " "
                          }}</span>
                                                </div>
                                            </div>
                                            <div v-if="currentHoverData.group == 'concept'"></div>
                                        </div>
                                    </div>
                                    <div id="cy"></div>
                                    <div class="legend">
                                        <img src="@/assets/legend1_beta.jpg" style="height: 100%" />
                                    </div>
                                </div>
                            </el-card>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="action-box">
                            <el-card v-loading="loading">
                                <el-row>
                                    <el-col :span="18">
                                        <el-select v-model="dataset" collapse-tags style="margin: 0 20px" placeholder="请选择数据集">
                                            <el-option v-for="item in datasets" :key="item.value" :label="item.label" :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-button type="primary" round @click="ChooseDataset">
                                            选择
                                        </el-button>
                                    </el-col>
                                </el-row>

                                <!-- <el-row>
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
                                </el-row> -->
                            </el-card>
                        </div>
                        <div style="margin-top: 20px">
                            <el-card>
                                <el-steps :space="300" :active="active" align-center finish-status="success">
                                    <el-step title="步骤 1" description="选择数据集"></el-step>
                                    <el-step title="步骤 2" description="鼠标移动到节点上可以查看详细信息"></el-step>
                                    <el-step title="步骤 3" description="点击国家节点开始挖掘瓶颈技术"></el-step>
                                </el-steps>
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
    import euler from "cytoscape-euler";
    // import tippy, {sticky} from 'tippy.js';
    import axios from "axios";
    cytoscape.use(popper);
    cytoscape.use(euler);
    export default {
        name: "ProjectFeasibility",
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
                bg: {},
            };
        },
        mounted() {
            // this.createCytoscape();
            axios.get('/bg-img.json').then(
                res => {
                    console.log(res)
                    this.bg["paper_img"] = res.data['paper_img'];
                    this.bg["concept_img"] = res.data['concept_img'];
                    this.bg["country_img"] = res.data['country_img'];
                }
            )
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
                    e.target.renderedPosition().y + e.target.height() + 15 + "px";
            },
            addMouseOverOutEvent() {
                this.cy.on("mouseover", "node", (e) => {
                    this.active = 2;
                    this.showTips = true;
                    this.currentHoverData = e.target.data();
                    this.$nextTick(() => {
                        this.moveTipsContainer(e);
                    });
                });
                this.cy.on("mouseout", "node", () => {
                    this.showTips = false;
                    // console.log(e.target.height(), e.target.width());
                });
            },
            addMouseClickEvent() {
                this.cy.on("click", "node[group='country']", (e) => {
                    this.active = 3;
                    this.showTips = false;
                    this.loading = true;
                    let node = e.target;
                    // console.log(node.data().id);
                    this.filter(node.data().id);
                    this.loading = false;
                });
            },
            ChooseDataset() {
                // console.log(this.dataset);
                this.loading = true;
                if (this.dataset == 1)
                    axios.get("/1_dataset_beta.json").then((res) => {
                        this.raw_data = res.data;
                        this.raw_data["name"] = "demo";
                        this.data = this.raw_data;
                        console.log(this.raw_data);
                        this.loading = false;
                        this.active = 1;
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
                    // var num =
                    //     255 - this.map(this.data.pagerank_results[id], min, max, 100, 250);
                    // var color = `rgb(${num},${num},${num})`;
                    // let color = "#AAAAAA"
                    let countries = [];
                    let concepts = [];
                    if (this.data.paper_country[id] != undefined)
                        for (var country_id of this.data.paper_country[id][0]) {
                            countries.push(this.data.country_name[country_id]);
                        }
                    if (this.data.paper_concept[id] != undefined)
                        for (var concept_id of this.data.paper_concept[id][0]) {
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
                            // "background-color": color,
                            "background-color": "white",
                            shape: "round-rectangle",
                            width: 25,
                            height: 25,
                            padding: 1,
                            "background-image": this.bg["paper_img"],
                            'background-fit': 'cover',
                        },
                    });
                }
            },
            add_paper_paper_edges() {
                for (var id in this.data.paper_paper) {
                    var refered_paper_list = this.data.paper_paper[id][0];
                    let max = Math.max(...this.data.paper_paper[id][1])
                    let min = Math.min(...this.data.paper_paper[id][1])
                    for (let i = 0; i < refered_paper_list.length; i++) {
                        let refered_id = refered_paper_list[i]
                        let width
                        if (min == max)
                            width = 2; else
                            width = this.map(this.data.paper_paper[id][1][i], min, max, 1, 3)
                        this.edges.push({
                            data: {
                                source: id,
                                target: refered_id,
                                group: "paper-paper",
                            },
                            style: {
                                width: width
                            }
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
                            // "background-image": this.bg["concept_img"]
                        },
                    });
                }
            },
            add_paper_concept_edges() {
                for (var id in this.data.paper_concept) {
                    var refered_paper_list = this.data.paper_concept[id][0];
                    let max = Math.max(...this.data.paper_concept[id][1])
                    let min = Math.min(...this.data.paper_concept[id][1])
                    for (let i = 0; i < refered_paper_list.length; i++) {
                        let refered_id = refered_paper_list[i]
                        let width
                        if (min == max)
                            width = 2; else
                            width = this.map(this.data.paper_concept[id][1][i], min, max, 1, 3)
                        this.edges.push({
                            data: {
                                source: id,
                                target: refered_id,
                                group: "paper-concept",
                            },
                            style: {
                                width: width
                            }
                        });
                    }
                }
            },
            add_country_nodes() {
                for (var id in this.data.country_name) {
                    this.nodes.push({
                        data: {
                            id: id,
                            group: "country",
                            name: this.data.country_name[id],
                        },
                        style: {
                            "background-color": "white",
                            shape: "round-rectangle",
                            width: 25,
                            height: 25,
                            padding: 1,
                            "background-image": this.bg["country_img"],
                            'background-fit': 'cover',
                        },
                    });
                }
            },
            add_paper_country_nodes() {
                for (var id in this.data.paper_country) {
                    var refered_paper_list = this.data.paper_country[id][0];
                    let max = Math.max(...this.data.paper_country[id][1])
                    let min = Math.min(...this.data.paper_country[id][1])
                    for (let i = 0; i < refered_paper_list.length; i++) {
                        let refered_id = refered_paper_list[i]
                        let width
                        if (min == max)
                            width = 2; else
                            width = this.map(this.data.paper_country[id][1][i], min, max, 1, 3)
                        this.edges.push({
                            data: {
                                source: id,
                                target: refered_id,
                                group: "paper-country",
                            },
                            style: {
                                width: width
                            }
                        });
                    }
                }
            },
            createCytoscape() {
                this.nodes = [];
                this.edges = [];
                this.add_paper_nodes();
                this.add_paper_paper_edges();
                this.add_concept_nodes();
                this.add_paper_concept_edges();
                this.add_country_nodes();
                this.add_paper_country_nodes();
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
                        name: "cose",
                        animate: false,
                        fit: true,
                        padding: 5,
                        nodeOverlap: 30,
                        // randomize: true,
                        idealEdgeLength: function (edge) {
                            if (edge.data().group == "paper-paper") {
                                return 60;
                            } else {
                                return 100;
                            }
                        },
                    },
                    minZoom: 0.3,
                    style: [
                        {
                            selector: "node",
                            style: {
                                // content: "data(id)",
                                "text-opacity": 0.5,
                                height: 20,
                                width: 20,
                                "pie-size": "100%",
                                "text-valign": "bottom",
                                "text-halign": "cneter",
                                // 'pie-1-background-color': '#E8747C',
                                // 'pie-1-background-size': 'mapData(occupy, 0, 10, 0, 100)',
                            },
                        },
                        {
                            selector: "edge",
                            style: {
                                // width: 2,
                                label: "data(label)",
                                // "target-arrow-fill": "hollow", //箭头填充 空心
                                // "line-color": "#9dbaea",
                                // "target-arrow-color": "#9dbaea",
                                "curve-style": "bezier",
                            },
                        },
                        {
                            selector: 'edge[group="paper-paper"]',
                            style: {
                                "target-arrow-shape": "triangle",
                                "line-color": "#99CC33",
                                "target-arrow-color": "#99CC33",
                            },
                        },
                        {
                            selector: 'edge[group="paper-concept"]',
                            style: {
                                "line-color": "#FF9900",
                                "target-arrow-color": "#FF9900",
                            },
                        },
                        {
                            selector: 'edge[group="paper-country"]',
                            style: {
                                "line-color": "#FFCC00",
                                "target-arrow-color": "#FFCC00",
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
                this.addMouseClickEvent();
            },
            filter(country) {
                this.cy.destroy();
                this.createCytoscape();
                if (country == "") return;
                // this.data = {};
                var paper_list = [];
                for (var id in this.raw_data.paper_name) {
                    // console.log(id);
                    // console.log(this.countries);
                    // console.log(this.raw_data.paper_country[id][0]);
                    if (
                        this.raw_data.paper_country[id] == undefined ||
                        this.raw_data.paper_country[id][0].indexOf(country) == -1
                    ) {
                        paper_list.push(id);
                        this.cy.$id(id).style("opacity", 0.1);
                        this.cy.$id(id).connectedEdges().style("opacity", 0.1)
                    }
                }
                for (id in this.raw_data.country_name) {
                    this.cy.$id(id).style("opacity", 0.1)
                    this.cy.$id(id).connectedEdges().style("opacity", 0.1)
                }
                // console.log(paper_list);
                // var layout = this.cy.layout({ name: "circle" });
                // console.log(this.cy.$id(id).neighborhood())
                // let collection = this.cy.$(country)
                let collection1 = this.cy.$id(country).incomers("node");
                let collcetion2 = this.cy.elements("node[group = 'concept']");
                let collection = (collection1.union(collcetion2))
                collection.forEach((ele) => {
                    ele.style("content",ele.data().name)
                });
                let layout = collection.layout({
                        name: 'circle'
                    },
                );
                // this.cy.resize();
                layout.run();
                // this.cy.animate({
                //   center: { eles: this.cy.$id(country) },
                //   zoom: 1
                // }, {
                //   duration: 1000
                // })
                this.ChangeConceptColor(country);
            },
            ChangeConceptColor(country) {
                // console.log(country, this.data.country_concept_score[country]);
                var max = 0,
                    min = 100;
                for (var concept in this.data.country_concept_score[country]) {
                    var score = this.data.country_concept_score[country][concept];
                    max = max > score ? max : score;
                    min = min < score ? min : score;
                }
                // console.log(min, max);
                for (concept in this.data.country_concept_score[country]) {
                    score = this.data.country_concept_score[country][concept];
                    var num = 255 - this.map(score, min, max, 100, 255);
                    var color = `rgb(255,${num},${num})`;
                    // console.log(country, concept, color);
                    this.cy.$id(concept).style({
                        "background-color": color,
                    });
                }
            },
        },
    };
</script>

<style scoped lang="scss">
    .box-card {
        // min-height: 600px;
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
        height: 570px;
    }
    #cy {
        width: 100%;
        height: 500px;
    }
    .legend {
        width: 183px;
        height: 70px;
        margin-left: 75%;
        margin-top: 10px;
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
