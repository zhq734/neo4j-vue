<script type="text/ecmascript-6">
  import { StyledRowToggle, StyledCaret } from './styled'
  import Vue from 'vue'

  const getHeightFromElem = (rowElem) => (rowElem && rowElem.base) ? rowElem.base.clientHeight : 0

  export default{
    components:{

    },
    data(){
      return{
        state: {}
      }
    },
    props: {
      rowElem: null,
      onClick: Function,
      contracted: {
        type: Boolean,
        default: false
      },
      containerHeight: {
        type: Number,
        default: 0
      }
    },
    created() {
    },
    mounted() {
      this.componentDidMount();
    },
    updated() {
      this.componentDidUpdate();
    },
    beforeDestroy() {
      this.componentWillUnmount();
    },
    methods: {
      updateDimensions () {
        Vue.set(this.state, 'rowHeight', getHeightFromElem(this.rowElem));
      },

      componentDidMount () {
        this.updateDimensions()
        window.addEventListener('resize', this.updateDimensions.bind(this))
      },
      componentWillUnmount () {
        window.removeEventListener('resize', this.updateDimensions.bind(this))
      },

      componentDidUpdate (prevProps, prevState) {
        const rowHeight = getHeightFromElem(this.rowElem)
        if (this.state.rowHeight !== rowHeight) {
          this.updateDimensions()
        }
      }
    },
    render () {
      if (this.containerHeight * 1.1 < this.state.rowHeight) {
        return (
          <StyledRowToggle nativeOnClick={this.onClick}>
            <StyledCaret class={this.contracted ? 'fa fa-caret-left' : 'fa fa-caret-down'} />
          </StyledRowToggle>
        )
      } else {
        return null
      }
    }
  }
</script>
