<template>
  <StyledSvgWrapper>
    <svg class='neod3viz' ref="graphInit"/>
    <div v-if="true" style="position: absolute; right: 0px; bottom: 12px;">
      <div
        style="float:right;margin-right:5px;font-size:25px;cursor:pointer;"
        :class="[state.zoomInLimitReached ? 'faded zoom-in' : 'zoom-in']"
        @click="zoomInClicked">
        +
      </div>
      <div
        style="float:left;margin-right:10px;font-size:25px;cursor:pointer;"
        :class="[state.zoomOutLimitReached ? 'faded zoom-out' : 'zoom-out']"
        @click="zoomOutlicked">
        -
      </div>
    </div>
  </StyledSvgWrapper>
</template>
<script type="text/ecmascript-6">
  import {StyledSvgWrapper} from './styled'
  import {createGraph, mapNodes, mapRelationships, getGraphStats} from '../mapper'
  import {GraphEventHandler} from '../GraphEventHandler'
  import { dim } from '../constants'
  import '../lib/visualization/index'
  import Vue from 'vue'

  export default{
    data(){
      return{
        state: {
          zoomInLimitReached: true,
          zoomOutLimitReached: false
        }
      }
    },
    components:{
      StyledSvgWrapper
    },
    props: {
      fullscreen: {
        type: Boolean,
        default: false
      },
      frameHeight: {
        type: Number,
        default: 0
      },
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
      graphStyle: {
        type: Object,
        default() {
          return {};
        }
      },
      onItemMouseOver: Function,
      getNodeNeighbours: Function,
      onItemSelect: Function,
      onGraphModelChange: Function,
      getAutoCompleteCallback: Function,
      assignVisElement: Function
    },
    created() {
    },
    mounted() {
      this.graphInit();
      this.componentDidMount();
    },
    updated() {
      this.componentDidUpdate();
    },
    methods: {
      reloadPanel(forceReload) {
        if (forceReload && this.graph) {
          this.graph.resetGraph()
        }
        this.componentDidMount();
      },
      graphInit () {
        this.svgElement = this.$refs.graphInit;
      },

      zoomInClicked (el) {
        let limits = this.graphView.zoomIn(el);
        Vue.set(this.state, 'zoomInLimitReached', limits.zoomInLimit);
        Vue.set(this.state, 'zoomOutLimitReached', limits.zoomOutLimit);
      },

      zoomOutlicked (el) {
        let limits = this.graphView.zoomOut(el);
        Vue.set(this.state, 'zoomInLimitReached', limits.zoomInLimit);
        Vue.set(this.state, 'zoomOutLimitReached', limits.zoomOutLimit);
      },

      getVisualAreaHeight () {
        let areaHeight = 0;
        if (this.frameHeight && this.fullscreen) {
          areaHeight = this.frameHeight - (dim.frameStatusbarHeight + dim.frameTitlebarHeight * 2)
        } else {
          areaHeight = this.frameHeight - (dim.frameStatusbarHeight + dim.frameTitlebarHeight * 2) || this.svgElement.parentNode.offsetHeight
        }

        if (areaHeight < 0) {
          areaHeight = 0 - areaHeight;
        }
        return areaHeight;
      },

      componentDidMount () {
        if (this.svgElement != null) {

          if (!this.graphView) {
            let NeoConstructor = neo.graphView
            let measureSize = () => {
              return {width: this.svgElement.offsetWidth, height: this.getVisualAreaHeight()}
            }

            this.graph = createGraph(this.nodes, this.relationships)
            this.graphView = new NeoConstructor(this.svgElement, measureSize, this.graph, this.graphStyle)

            new GraphEventHandler(this.graph,
              this.graphView,
              this.getNodeNeighbours,
              this.onItemMouseOver,
              this.onItemSelect,
              this.onGraphModelChange
            ).bindEventHandlers()
            this.graphView.resize()
            this.graphView.update()

            this.state.currentStyleRules = this.graphStyle.toString()
            this.onGraphModelChange(getGraphStats(this.graph))
          } else {
            this.graphView.update()
            this.state.currentStyleRules = this.graphStyle.toString()
          }

          this.graph && this.setGraph && this.setGraph(this.graph)
          this.getAutoCompleteCallback && this.getAutoCompleteCallback(this.addInternalRelationships.bind(this))
          this.assignVisElement && this.assignVisElement(this.svgElement, this.graphView)
        }
      },

      addInternalRelationships (internalRelationships) {
        if (this.graph) {
          this.graph.addInternalRelationships(mapRelationships(internalRelationships, this.graph))
          this.graphView.update()
        }
      },

      componentDidUpdate () {
        if (this.state.shouldResize) {
          this.graphView.resize()
        }
      }
    },
    watch: {
      nodes: {
        handler: function(val, oldVal) {
          if (oldVal.toString() !== val.toString() && this.graphView) {
            this.graph.addNodes(mapNodes(val))
            this.graphView.update()
            this.onGraphModelChange(getGraphStats(this.graph))
          }
        },
        deep: true
      },
      relationships: {
        handler: function(val, oldVal) {
          if (oldVal.toString() !== val.toString() && this.graphView) {
            this.graph.addRelationships(mapRelationships(val, this.graph))
            this.graphView.update()
            this.onGraphModelChange(getGraphStats(this.graph))
          }
        },
        deep: false
      },
      graphStyle: {
        handler: function(val, oldVal) {
          if (this.graphView) {
            this.graphView.update()
            Vue.set(this.state, 'currentStyleRules', val.toString());
          }
        },
        deep: false
      },
      fullscreen: {
        handler: function(val, oldVal) {
          Vue.set(this.state, 'shouldResize', true);
        }
      },
      frameHeight: {
        handler: function(val, oldVal) {
          Vue.set(this.state, 'shouldResize', true);
        }
      }
    }
  }
</script>
