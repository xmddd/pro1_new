<template>
  <div id="box">
    <el-select
      v-model="country"
      collapse-tags
      style="margin-left: 20px"
      placeholder="请选择"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-button type="primary" @click="filter">筛选</el-button>
    <h1>{{ data.name }}</h1>
    <div id="cy"></div>
    <el-drawer title="" v-model="paper_drawer" size="260px">
      <h1>{{ paper_info.title }}</h1>
      <div>
        国家：<span v-for="country in paper_info.countries" :key="country">{{
          country + " "
        }}</span>
      </div>
      <div>
        领域：<span v-for="concept in paper_info.concepts" :key="concept">{{
          concept + " "
        }}</span>
      </div>
    </el-drawer>
    <el-drawer title="" v-model="concept_drawer" size="260px">
      <h1>
        {{ concept_info }}
      </h1>
    </el-drawer>
  </div>
</template>

<script>
import cytoscape from "cytoscape";
var cyqtip = require("cytoscape-qtip");
cyqtip(cytoscape);
// cytoscape.use(cyqtip);

export default {
  name: "MyGraph",
  components: {},
  props: {
    raw_data: Object,
    // required: true
  },
  data() {
    return {
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
      cy: {},
    };
  },
  methods: {
    Init() {
      this.data = this.raw_data;
      this.data["name"] = "demo";
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
        // console.log(id, this.data.paper_name[id]);
        var num =
          255 - this.map(this.data.pagerank_results[id], min, max, 100, 250);
        var color = `rgb(${num},${num},${num})`;
        this.nodes.push({
          data: {
            id: id,
            name: this.data.paper_name[id],
            group: "paper",
            countries: this.data.paper_country[id],
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
          // console.log(id, refered_id);
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
        // console.log(id, this.data.concept_name[id]);
        this.nodes.push({
          data: {
            id: id,
            group: "concept",
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

      this.cy.on("click", 'node[group="paper"]', (event) => {
        var node = event.target;
        console.log(node.data());
        // console.log(cy.elements(`node[id = "${node.id()}"]`).id())
        this.paper_info.title = this.data.paper_name[node.id()];

        this.paper_info.countries.length = 0;

        if (this.data.paper_country[node.id()] != undefined)
          for (var country_id of this.data.paper_country[node.id()])
            this.paper_info.countries.push(this.data.country_name[country_id]);
        else this.paper_info.countries = [];
        this.paper_info.concepts.length = 0;
        for (var concept_id of this.data.paper_concept[node.id()])
          this.paper_info.concepts.push(this.data.concept_name[concept_id]);
        this.paper_drawer = true;
      });

      this.cy.on("click", 'node[group="concept"]', (event) => {
        var node = event.target;
        console.log(node.data());
        // console.log(cy.elements(`node[id = "${node.id()}"]`).id())
        this.concept_info = this.data.concept_name[node.id()];
        this.concept_drawer = true;
      });
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
      console.log(min,max)
      for (concept in this.data.country_concept_score[this.country]) {
        score = this.data.country_concept_score[this.country][concept];

        var num = 255 - this.map(score, min, max, 100, 255);
        var color = `rgb(255,${num},${num})`
        console.log(this.country, concept, color);
        this.cy.$id(concept).style({
          "background-color": color,
        });
      }
    },
  },
  mounted() {
    // this.createCytoscape();
    // console.log(this.data)
  },
};
</script>

<style>
#box {
  width: 100%;
  height: 1000px;
}

#cy {
  width: 100%;
  height: 100%;
}

h1 {
  opacity: 0.5;
  font-size: 1em;
}
</style>
