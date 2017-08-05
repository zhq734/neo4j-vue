<template>
  <div
    id='svg-vis'
    :style="[{'height': '100%'},
    {'padding-top': (legendRowHeight * 2) + 1 + 'px'},
    {'padding-bottom': forcePaddingBottom ? forcePaddingBottom + 2 * pMarginTop + 'px' : '39px'}]">
    <LegendComponent
      v-if="state.freezeLegend"
      ref="LegendComponent"
      :stats="stats"
      :graphStyle="neoGraphStyle()"
      :graphStyleString="state.graphStyleString"
      :onSelectedLabel="onSelectedLabel"
      :onSelectedRelType="onSelectedRelType" />
    <LegendComponent
      v-else
      ref="LegendComponent"
      :stats="stats"
      :graphStyle="state.graphStyle"
      :graphStyleString="state.graphStyleString"
      :onSelectedLabel="onSelectedLabel"
      :onSelectedRelType="onSelectedRelType" />

    <GraphComponent
      ref="GraphComponent"
      :fullscreen="fullscreen"
      :frameHeight="frameHeight"
      :relationships="state.relationships"
      :nodes="state.nodes"
      :getNodeNeighbours="getNodeNeighbours"
      :onItemMouseOver="onItemMouseOver"
      :onItemSelect="onItemSelect"
      :graphStyle="state.graphStyle"
      :onGraphModelChange="onGraphModelChange"
      :assignVisElement="assignVisElement"
      :getAutoCompleteCallback="getAutoCompleteCallback"
      :setGraph="setGraph" />
    <InspectorComponent
      ref="InspectorComponent"
      :fullscreen="fullscreen"
      :hoveredItem="hoveredItem"
      :selectedItem="selectedItem"
      :graphStyle="state.graphStyle"
      :graphStyleString="state.graphStyleString"
      :updateStyle="updateStyle"
      :onExpandToggled="onInspectorExpandToggled" />
  </div>
</template>
<script type="text/ecmascript-6">
  import GraphComponent from './Graph'
  import neoGraphStyle from '../graphStyle'
  import InspectorComponent from './Inspector'
  import LegendComponent from './Legend'
  import Vue from 'vue'

  const deduplicateNodes = (nodes) => {
    return nodes.reduce((all, curr) => {
      if (all.taken.indexOf(curr.id) > -1) {
        return all
      } else {
        all.nodes.push(curr)
        all.taken.push(curr.id)
        return all
      }
    }, {nodes : [], taken : []}).nodes
  }

  export default{
    components : {
      GraphComponent,
      InspectorComponent,
      LegendComponent
    },
    data(){
      return {
        neoGraphStyle: neoGraphStyle,
        legendRowHeight : 32,
        forcePaddingBottom : 20,
        pMarginTop: 6,
        stats: {labels : {}, relTypes : {}},
        selectedItem: {},
        hoveredItem: {},
        graphStyle: {}
      }
    },
    props : {
      graphStyleData : Object,
      nodes : {
        type : Array,
        default() {
          return []
        }
      },
      relationships : {
        type : Array,
        default() {
          return []
        }
      },
      fullscreen : {
        type : Boolean,
        default : false
      },
      frameHeight : {
        type : Number,
        default : 0
      },
      assignVisElement : Function,
      getAutoCompleteCallback : {
        type : Function
      },
      setGraph : Function,
      updateStyle: Function,
      getNeighbours: Function
    },
    created() {
      let state = {}

      state.stats = {labels : {}, relTypes : {}}
      state.graphStyle = neoGraphStyle();
      if (!$.isEmptyObject(this.graphStyleData)) {
        state.graphStyle.loadRules(this.graphStyleData)
      } else {
        state.graphStyle.resetToDefault()
      }
      state.graphStyleString = state.graphStyle.toString();
      let nodes = deduplicateNodes(this.nodes)
      state.relationships = this.relationships
      state.nodes = nodes
      state.relationships = this.relationships
      if (nodes.length > parseInt(this.initialNodeDisplay)) {
        state.nodes = nodes.slice(0, this.initialNodeDisplay)
        state.relationships = this.relationships.filter((item) =>
          state.nodes.filter((node) =>
          node.id === item.startNodeId).length > 0 && state.nodes.filter((node) =>
            node.id === item.endNodeId).length > 0)
        state.selectedItem = {
          type : 'status-item',
          item : `Not all return nodes are being displayed due to Initial Node Display setting. Only ${this.initialNodeDisplay} of ${nodes.length} nodes are being displayed`
        }
      }

      this.state = state;
    },
    mounted() {
    },
    methods : {
      reloadPanel(forceReload) {
        this.$refs.GraphComponent.reloadPanel(forceReload);
      },
      getNodeNeighbours (node, currentNeighbours, callback) {
        if (currentNeighbours.length > this.maxNeighbours) {
          callback({nodes : [], relationships : []})
        }
        this.getNeighbours(node.id, currentNeighbours).then((result) => {
          let nodes = result.nodes
          if (result.count > (this.maxNeighbours - currentNeighbours.length)) {
            this.selectedItem = {
              type : 'status-item',
              item : `Rendering was limited to ${this.maxNeighbours} of the node's total ${result.count + currentNeighbours.length} neighbours due to browser config maxNeighbours.`
            }
            Vue.set(this.state, 'selectedItem', {
              type : 'status-item',
              item : `Rendering was limited to ${this.maxNeighbours} of the node's total ${result.count + currentNeighbours.length} neighbours due to browser config maxNeighbours.`
            })
          }
          callback({nodes : nodes, relationships : result.relationships})
        }, () => {
          callback({nodes : [], relationships : []})
        })
      },

      onItemMouseOver (item) {
        this.hoveredItem = item;
      },

      onItemSelect (item) {
        this.selectedItem = item;
        switch(item.type) {
          case 'node':
            this.$emit('clickNode', item.item)
            break;
          case 'relationship':
            this.$emit('clickNode', null)
            break;
          case 'canvas':
            this.$emit('clickNode', null)
            break;
        }
      },

      onGraphModelChange (stats) {
        this.stats = stats;
        Vue.set(this.state, 'graphStyleString', this.state.graphStyle.toString());
        this.updateStyle(this.state.graphStyle.toSheet())
      },

      onSelectedLabel (label, propertyKeys) {
        this.selectedItem = {
          type : 'legend-item',
          item : {
            selectedLabel : {label : label, propertyKeys : propertyKeys},
            selectedRelType : null
          }
        };
      },

      onSelectedRelType (relType, propertyKeys) {
        this.selectedItem = {
          type : 'legend-item',
          item : {
            selectedLabel : null,
            selectedRelType : {relType : relType, propertyKeys : propertyKeys}
          }
        }
      },

      onInspectorExpandToggled (contracted, inspectorHeight) {
        this.inspectorContracted = contracted;
        this.forcePaddingBottom = inspectorHeight;
      }
    },
    watch : {
      nodes: {
        handler: function(val, oldVal) {
          Vue.set(this.state, 'nodes', deduplicateNodes(val));
        },
        deep: true
      },
      relationships: {
        handler: function(val, oldVal) {
          Vue.set(this.state, 'relationships', val);
        },
        deep: true
      },
      graphStyleData : {
        handler : function(val, oldVal) {
          if (val) {
            this.state.graphStyle.loadRules(val);
            Vue.set(this.state, 'graphStyleString', this.state.graphStyle.toString());
          } else {
            this.state.graphStyle.resetToDefault()
            Vue.set(this.state, 'graphStyleString', this.state.graphStyle.toString());
          }
        },
        deep : true
      },
      freezeLegend: {
        handler: function(val, oldVal) {
          if (val) {
            this.state.freezeLegend = false;
            Vue.set(this.state, 'graphStyleString', this.state.graphStyle.toString());
            this.updateStyle(this.state.graphStyle.toSheet())
          }
        },
        deep: true
      }
    }
  }
</script>
