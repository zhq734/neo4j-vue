<script type="text/ecmascript-6">
  import {legendRowHeight, StyledLegendRow, StyledTokenRelationshipType, StyledLegendInlineListItem, StyledLegend, StyledLegendContents, StyledLabelToken, StyledTokenCount, StyledLegendInlineList} from './styled'
  import RowExpandToggleComponent from './RowExpandToggle'
  import Vue from 'vue'

  export default{
    components:{
      RowExpandToggleComponent,
      StyledLegendRow,
      StyledTokenRelationshipType,
      StyledLegendInlineListItem,
      StyledLegend,
      StyledLegendContents,
      StyledLabelToken,
      StyledTokenCount,
      StyledLegendInlineList
    },
    data(){
      return{
        legendRowHeight: legendRowHeight,
        state: {
          typeRowContracted: true,
          labelRowContracted: true
        }
      }
    },
    props: {
      stats: {
        type: Object,
        default() {
          return {}
        }
      },
      graphStyle: {
        type: Object,
        default() {
          return {};
        }
      },
      graphStyleString: '',
      onSelectedLabel: Function,
      onSelectedRelType: Function
    },
    created() {
    },
    mounted() {
      this.setLabelRowELem();
      this.setTypeRowELem();
    },
    methods: {
      setTypeRowELem () {
        if (this.$refs.setTypeRowELem) {
          Vue.set(this.state, 'typeRowElem', this.$refs.setTypeRowELem);
        }
      },
      setLabelRowELem () {
        if (this.$refs.setLabelRowELem) {
          Vue.set(this.state, 'labelRowELem', this.$refs.setLabelRowELem);
        }
      },
      getLegendPanel() {
        const mapLabels = (labels) => {
          const labelList = Object.keys(labels).map((legendItemKey, i) => {
            const styleForItem = this.graphStyle.forNode({labels: [legendItemKey]})
            const onClick = () => { this.onSelectedLabel(legendItemKey, Object.keys(labels[legendItemKey].properties)) }
            const style = {'backgroundColor': styleForItem.get('color'), 'color': styleForItem.get('text-color-internal')}
            return (
              <StyledLegendInlineListItem key={i}>
                <StyledLegendContents class='contents' style="">
                  <StyledLabelToken
                      nativeOnClick={ onClick }
                      style={style} class='token token-label'>
                    {legendItemKey}
                    <StyledTokenCount class='count'>({labels[legendItemKey].count})</StyledTokenCount>
                  </StyledLabelToken>
                </StyledLegendContents>
              </StyledLegendInlineListItem>
            )
          })
          return (
            <StyledLegendRow class={this.state.labelRowContracted ? 'contracted' : ''}>
              <StyledLegendInlineList class='list-inline' ref='setLabelRowELem'>
                <RowExpandToggleComponent
                  contracted={ this.state.labelRowContracted }
                  rowElem={ this.state.labelRowELem }
                  containerHeight={ legendRowHeight }
                  onClick={() => { this.state.labelRowContracted = !this.state.labelRowContracted; }} />
                {labelList}
              </StyledLegendInlineList>
            </StyledLegendRow>
            )
          }

        const mapRelTypes = (legendItems) => {
          const relTypeList = Object.keys(legendItems).map((legendItemKey, i) => {
            const styleForItem = this.graphStyle.forRelationship({type: legendItemKey})
            const onClick = () => { this.onSelectedRelType(legendItemKey, Object.keys(legendItems[legendItemKey].properties)) }

            const style = {'backgroundColor': styleForItem.get('color'), 'color': styleForItem.get('text-color-internal')}
            return (
              <StyledLegendInlineListItem key={i}>
                <StyledLegendContents class='contents'>
                  <StyledTokenRelationshipType
                    nativeOnClick={ onClick }
                    style={style} class='token token-relationship-type'>
                    {legendItemKey}
                  <StyledTokenCount class='count'>({legendItems[legendItemKey].count})</StyledTokenCount>
                  </StyledTokenRelationshipType>
                </StyledLegendContents>
              </StyledLegendInlineListItem>
            )
          })
          return (
            <StyledLegendRow class={this.state.typeRowContracted ? 'contracted' : ''}>
              <StyledLegendInlineList class='list-inline' ref='setTypeRowELem'>
                <RowExpandToggleComponent
                  contracted={this.state.typeRowContracted}
                  rowElem={this.state.typeRowElem}
                  containerHeight={legendRowHeight}
                  onClick={() => { this.state.typeRowContracted = !this.state.typeRowContracted; }} />
                  {relTypeList}
              </StyledLegendInlineList>
            </StyledLegendRow>
          )
        }

        let relTypes = mapRelTypes(this.stats.relTypes);
        return (
          <StyledLegend class={relTypes ? '' : 'one-row'}>
            {mapLabels(this.stats.labels)}
            {relTypes}
          </StyledLegend>
        )
      }
    },
    watch: {
      stats: {
        handler: function(val, oldVal) {

        },
        deep: true
      },
      graphStyle: {
        handler: function(val, oldVal) {

        },
        deep: true
      },
      graphStyleString: {
        handler: function(val, oldVal) {
          this.$forceUpdate();
        },
        deep: true
      }
    },
    render () {
      return this.getLegendPanel();
    }
  }
</script>
