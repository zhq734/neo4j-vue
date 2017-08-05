<template>
  <div
    :style="[{'width': '100%'},
    {'height': fullscreen ? '100vh' : (dim.frameBodyHeight - (dim.frameTitlebarHeight * 2)) + 'px'},
    {'display': extendStyle.display}]">
    <ExplorerComponent
      ref="ExplorerComponent"
      :maxNeighbours="maxNeighbours"
      :initialNodeDisplay="initialNodeDisplay"
      :graphStyleData="graphStyleData"
      :updateStyle="updateStyle"
      :getNeighbours="getNeighbours"
      :nodes="state.nodesAndRelationships.nodes"
      :relationships="state.nodesAndRelationships.relationships"
      :fullscreen="fullscreen"
      :frameHeight="frameHeight"
      :assignVisElement="assignVisElement"
      :getAutoCompleteCallback="(callback) => { this.autoCompleteCallback = callback }"
      :setGraph="setGraph"
      @clickNode="handleClickNode"
    ></ExplorerComponent>
  </div>
</template>
<script type="text/ecmascript-6">
  import bolt from './services/bolt/bolt'
  import ExplorerComponent from './components/Explorer'
  import { dim } from './constants'
  import Vue from 'vue'
  import { v1 as neo4j } from 'neo4j-driver-alias'
  import { setting } from 'config/index'

  export default{

    data(){
      return{
        dim: dim,
        state: {
          nodesAndRelationships: {
            nodes: [],
            relationships: []
          },
          justInitiated: true
        },
        graphStyleData: {},
        frameHeight: 500,
        graph: {}
      }
    },
    props: {
      clearAll: {
        type: Boolean,
        default: false
      },
      fullscreen: {
        type: Boolean,
        default: false
      },
      extendStyle: {
        type: Object,
        default() {
          return {}
        }
      },
      maxNeighbours: {
        type: Number,
        default: 1000
      },
      initialNodeDisplay: '',
      assignVisElement: Function,
      records: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    components:{
      ExplorerComponent
    },
    created() {
    },
    mounted() {
      let me = this;
      this.frameHeight = $(this.$el).height() * 1.2;

      this.driver = neo4j.driver(setting.neo4jUrl, neo4j.auth.basic(setting.neo4jUserName, setting.neo4jPassword));

      me.componentWillMount();
    },
    methods: {
      handleClickNode(item) {
        this.$emit('clickNode', item);
      },
      updateStyle(graphStyleData) {
        if (JSON.stringify(graphStyleData) == JSON.stringify(this.graphStyleData)) return;

        let inlineGraphStyleData = {};
        for (let nodeKey in this.graphStyleData) {
          inlineGraphStyleData[nodeKey] = this.graphStyleData[nodeKey];
        }

        for (var nodeKey in graphStyleData) {
          let node = inlineGraphStyleData[nodeKey];
          if (!node) node = {};
          for (var propKey in graphStyleData[nodeKey]) {
            node[propKey] = graphStyleData[nodeKey][propKey];
          }

          inlineGraphStyleData[nodeKey] = node;
        }

        this.graphStyleData = inlineGraphStyleData;
        this.$refs.ExplorerComponent.reloadPanel();
      },
      componentWillMount () {
        if (this.records && this.records.length > 0) {
          this.populateDataToStateFromProps(this)
        }
      },

      shouldComponentUpdate (nextProps) {
        return nextProps.extendStyle !== this.extendStyle ||
          nextProps.records !== this.records ||
          nextProps.graphStyleData !== this.graphStyleData
      },

      populateDataToStateFromProps (props) {
        Vue.set(this.state, 'nodesAndRelationships', bolt.extractNodesAndRelationshipsFromRecordsForOldVis(props.records));
      },

      mergeToList (list1, list2) {
        return list1.concat(list2.filter(itemInList2 => list1.findIndex(itemInList1 => itemInList1.id === itemInList2.id) < 0))
      },

      autoCompleteRelationships (existingNodes, newNodes) {
        if (this.autoComplete) {
          const existingNodeIds = existingNodes.map(node => parseInt(node.id))
          const newNodeIds = newNodes.map(node => parseInt(node.id))

          this.getInternalRelationships(existingNodeIds, newNodeIds)
            .then((graph) => {
              this.autoCompleteCallback && this.autoCompleteCallback(graph.relationships)
            })
            .catch((e) => {})
        }
      },

      getNeighbours (id, currentNeighbourIds = []) {

        const query = `MATCH path = (a)--(o)
                   WHERE id(a) = ${id}
                   AND NOT (id(o) IN[${currentNeighbourIds.join(',')}])
                   RETURN path, size((a)--()) as c
                   ORDER BY id(o)
                   LIMIT ${this.maxNeighbours - currentNeighbourIds.length}`
        return new Promise((resolve, reject) => {

          var session = this.driver.session();

          session.run(query, {})
            .then((result) => {
              let count = result.records.length > 0 ? parseInt(result.records[0].get('c').toString()) : 0
              const resultGraph = bolt.extractNodesAndRelationshipsFromRecordsForOldVis(result.records, false)
              this.autoCompleteRelationships(this.graph._nodes, resultGraph.nodes)
              resolve({...resultGraph, count: count})
              session.close();
            }).catch((error) => {
              console.log(error);
            });
        })
      },

      getInternalRelationships (existingNodeIds, newNodeIds) {
        newNodeIds = newNodeIds.map(bolt.neo4j.int)
        existingNodeIds = existingNodeIds.map(bolt.neo4j.int)
        existingNodeIds = existingNodeIds.concat(newNodeIds)
        const query = 'MATCH (a)-[r]->(b) WHERE id(a) IN $existingNodeIds AND id(b) IN $newNodeIds RETURN r;'
        return new Promise((resolve, reject) => {

          var session = this.driver.session();

          session.run(query, {})
            .then((result) => {
              resolve({...bolt.extractNodesAndRelationshipsFromRecordsForOldVis(result.records, false)})
              session.close();
            }).catch((error) => {
              reject({nodes: [], rels: []})
            });
        })
      },

      setGraph (graph) {
        this.graph = graph
        this.autoCompleteRelationships([], this.graph._nodes)
      }
    },
    watch: {
      records: {
        handler: function(val, oldVal) {
          this.populateDataToStateFromProps(this);
        },
        deep: true
      },
      state: {
        handler: function(val, oldVal) {
        },
        deep: true
      },
      'extendStyle.display': {
        handler: function(val, oldVal) {
          Vue.set(this.state, 'justInitiated', false);
        },
        deep: true
      },
      clearAll: {
        handler: function(val, oldVal) {
          if (val) {
            this.$refs.ExplorerComponent.reloadPanel(true);
          }
        }
      }
    }
  }
</script>
<style>

</style>
