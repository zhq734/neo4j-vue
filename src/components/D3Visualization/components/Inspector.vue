<script type="text/ecmascript-6">
  import {inspectorFooterContractedHeight, StyledInspectorFooterStatusMessage, StyledTokenContextMenuKey, StyledTokenRelationshipType, StyledLabelToken, StyledStatusBar, StyledStatus, StyledInspectorFooter, StyledInspectorFooterRow, StyledInspectorFooterRowListPair, StyledInspectorFooterRowListKey, StyledInspectorFooterRowListValue, StyledInlineList} from './styled'
  import GrassEditor from './GrassEditor'
  import RowExpandToggleComponent from './RowExpandToggle'
  import Vue from 'vue'

  export default{
    components:{
      GrassEditor,
      RowExpandToggleComponent
    },
    data(){
      return{
      }
    },
    props: {
      graphStyle: {
        type: Object,
        default() {
          return {};
        }
      },
      graphStyleString: '',
      onExpandToggled: Function,
      selectedItem: {},
      hoveredItem: {},
      updateStyle: Function,
    },
    created() {
      let state = {}
      state.contracted = true

      this.state = state;
    },
    mounted() {
      this.setFooterRowELem();
    },
    watch: {
    },
    methods: {
      reloadPanel() {

      },
      setFooterRowELem () {
        if (this.$refs.setFooterRowELem) {
          this.footerRowElem = this.$refs.setFooterRowELem;
        }
      },
      componentWillReceiveProps (nextProps) {
        if (this.selectedItem !== nextProps.selectedItem) { // || this.hoveredItem !== nextProps.hoveredItem){
          this.setState({ contracted: true })
          this.onExpandToggled && this.onExpandToggled(true, 0)
        }
      }
    },
    render () {
      let item
      let type
      let inspectorContent

      const mapItemProperties = (itemProperties) => {
        return itemProperties.map((prop, i) => {
          return (
            <StyledInspectorFooterRowListPair class='pair' key={'prop' + i}>
              <StyledInspectorFooterRowListKey class='key'>{prop.key + ': '}</StyledInspectorFooterRowListKey>
              <StyledInspectorFooterRowListValue class='value'>{prop.value.toString()}</StyledInspectorFooterRowListValue>
            </StyledInspectorFooterRowListPair>
          )
        })
      }

      const mapLabels = (itemLabels) => {
        return itemLabels.map((label, i) => {
          const graphStyleForLabel = this.graphStyle.forNode({labels: [label]})
          const style = {'backgroundColor': graphStyleForLabel.get('color'), 'color': graphStyleForLabel.get('text-color-internal')}
          return (
            <StyledLabelToken key={'label' + i} style={style} class={'token' + ' ' + 'token-label'}>{label}</StyledLabelToken>
          )
        })
      }
      if (this.hoveredItem && this.hoveredItem.type !== 'canvas') {
        item = this.hoveredItem.item
        type = this.hoveredItem.type
      } else if (this.selectedItem) {
        item = this.selectedItem.item
        type = this.selectedItem.type
      } else if (this.hoveredItem) {
        item = this.hoveredItem.item
        type = this.hoveredItem.type
      }

      if (item && type) {
        if (type === 'legend-item') {
          inspectorContent = (
            <GrassEditor selectedLabel={item.selectedLabel} selectedRelType={item.selectedRelType} outerUpdateStyle={this.updateStyle} graphStyle={this.graphStyle} graphStyleString={this.graphStyleString}/>
          )
        }
        if (type === 'status-item') {
          inspectorContent = (
            <StyledInspectorFooterStatusMessage class='value'>{item}</StyledInspectorFooterStatusMessage>
        )
        }
        if (type === 'context-menu-item') {
          inspectorContent = (
            <StyledInlineList class='list-inline'>
              <StyledTokenContextMenuKey key='token' class={'token' + ' ' + 'token-context-menu-key' + ' ' + 'token-label'}>{item.label}</StyledTokenContextMenuKey>
              <StyledInspectorFooterRowListPair key='pair' class='pair'>
                <StyledInspectorFooterRowListValue class='value'>{item.content}</StyledInspectorFooterRowListValue>
              </StyledInspectorFooterRowListPair>
            </StyledInlineList>
        )
        } else if (type === 'canvas') {
          const description = `Displaying ${item.nodeCount} nodes, ${item.relationshipCount} relationships.`
          inspectorContent = (
            <StyledInlineList class='list-inline'>
              <StyledInspectorFooterRowListPair class='pair' key='pair'>
                <StyledInspectorFooterRowListValue class='value'>{description}</StyledInspectorFooterRowListValue>
              </StyledInspectorFooterRowListPair>
            </StyledInlineList>
        )
        } else if (type === 'node') {
          inspectorContent = (
            <StyledInlineList class='list-inline'>
              {mapLabels(item.labels)}
              <StyledInspectorFooterRowListPair key='pair' class='pair'>
                <StyledInspectorFooterRowListKey class='key'>{'<id>:'}</StyledInspectorFooterRowListKey>
                <StyledInspectorFooterRowListValue class='value'>{item.id}</StyledInspectorFooterRowListValue>
              </StyledInspectorFooterRowListPair>
              {mapItemProperties(item.properties)}
            </StyledInlineList>
          )
        } else if (type === 'relationship') {
          const style = {'backgroundColor': this.graphStyle.forRelationship(item).get('color'), 'color': this.graphStyle.forRelationship(item).get('text-color-internal')}
          inspectorContent = (
            <StyledInlineList class='list-inline'>
              <StyledTokenRelationshipType key='token' style={style} class={'token' + ' ' + 'token-relationship-type'}>{item.type}</StyledTokenRelationshipType>
              <StyledInspectorFooterRowListPair key='pair' class='pair'>
                <StyledInspectorFooterRowListKey class='key'>{'<id>:'}</StyledInspectorFooterRowListKey>
                <StyledInspectorFooterRowListValue class='value'>{item.id}</StyledInspectorFooterRowListValue>
              </StyledInspectorFooterRowListPair>
              {mapItemProperties(item.properties)}
            </StyledInlineList>
          )
        }
      }

      const toggleExpand = () => {
        this.state.contracted = !this.state.contracted;

        const inspectorHeight = this.footerRowElem.base.clientHeight
        this.onExpandToggled && this.onExpandToggled(this.state.contracted, this.state.contracted ? 0 : inspectorHeight)
      }

      return (
        <StyledStatusBar fullscreen={this.fullscreen} class='status-bar'>
          <StyledStatus class='status'>
            <StyledInspectorFooter class={this.state.contracted ? 'contracted inspector-footer' : 'inspector-footer'}>
              <StyledInspectorFooterRow class='inspector-footer-row' ref='setFooterRowELem'>
                { type === 'canvas' ? null : <RowExpandToggleComponent contracted={this.state.contracted} rowElem={this.footerRowElem} containerHeight={inspectorFooterContractedHeight} nativeOnClick={toggleExpand} /> }
                {inspectorContent}
              </StyledInspectorFooterRow>
            </StyledInspectorFooter>
          </StyledStatus>
        </StyledStatusBar>
      )
    }
  }
</script>
