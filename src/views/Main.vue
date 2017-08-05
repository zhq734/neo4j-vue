<template>
  <div class="kgWidget">
    <div class="kgHead">
      <div style="margin-left:30px;">
        <span>输入查询语句进行查询:</span>
        <input type="text" style="width:700px;" v-model="query" @keyup.enter="executeQuery"/>
      </div>
    </div>
    <div class="flexRow kgWidgetContainer">
      <div class="editBox flexColumn">
        <Visualization @clickNode="handleClickNode" :records="records" :clearAll="clearAll"></Visualization>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import { Visualization } from 'components/D3Visualization'
  import { v1 as neo4j } from 'neo4j-driver-alias'
  import { setting } from 'config/index'

  export default {
    components: {
      Visualization
    },
    data() {
      return {
        query: 'MATCH p=()-[r:REVIEWED]->() RETURN p LIMIT 25',
        records: [],
        clearAll: false
      }
    },
    mounted() {
      this.driver = neo4j.driver(setting.neo4jUrl, neo4j.auth.basic(setting.neo4jUserName, setting.neo4jPassword));
      this.executeQuery();
    },
    methods: {
      handleClickNode(item) {
      },
      executeQuery() {
        let me = this;
        me.records = [];
        this.clearAll = true;
        var session = this.driver.session();

        let query = this.query;
        if (query == '') return;

        session.run(query, {}).then(function (result) {
          me.clearAll = false;
          me.records = result.records;
          session.close();
        }).catch(function (error) {
          console.log('查询语句不合法');
        });
      }
    },
    watch: {
      records: {
        handler: function(val, oldVal) {

        },
        deep: true
      }
    }
  }

</script>
<style>
  .kgWidget {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0
  }

  .kgWidget div,
  .kgWidget li,
  .kgWidget spanï¼Œinput,
  .kgWidget ul {
    font-size: 13px
  }

  .kgWidget .fontIcon {
    color: #b0b0b0
  }

  .kgWidget .fontIcon:hover {
    color: #424242
  }

  .kgWidget .borderTop {
    border-top: 1px solid #ccc
  }

  .kgWidget .fullHeight {
    height: 100%
  }

  .kgWidget .bold {
    font-weight: 600
  }

  .kgWidget .canDragEl {
    cursor: -webkit-grab;
    cursor: grab
  }

  .kgWidget.cursorGrabbing,
  .kgWidget.cursorGrabbing * {
    cursor: -webkit-grabbing!important;
    cursor: grabbing!important
  }

  .kgWidget input[type=text],
  .kgWidget textarea {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    resize: none;
    height: 32px;
    line-height: 32px
  }

  .kgWidget textarea {
    height: 30px;
    line-height: 30px
  }

  .kgWidget .confirmMsg {
    text-align: center;
    padding-bottom: 20px;
    padding-top: 20px;
    font-size: 14px;
    font-weight: 700
  }

  .kgWidget .kgWidget {
    height: 100%;
    width: 100%
  }

  .kgWidget .kgWidget:before {
    content: "";
    display: table
  }

  .kgWidget .kgHead {
    position: absolute;
    top: 0;
    left: 0;
    right: 0
  }

  .kgWidget .kgContent,
  .kgWidget .kgHead,
  .kgWidget .kgLeftMenu,
  .kgWidget .kgSettings {
    background: #fff
  }

  .kgWidget .kgLeftMenu {
    height: 100%
  }

  .kgWidget .kgContent,
  .kgWidget .kgContent input,
  .kgWidget .kgLeftMenu,
  .kgWidget .kgLeftMenu input {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none
  }

  .kgWidget .kgContent,
  .kgWidget .kgSettings {
    display: -webkit-box;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column
  }

  .kgWidget .kgContent {
    overflow: hidden
  }

  .kgWidget .kgHead {
    box-shadow: 0 2px 4px rgba(0, 0, 0, .15)
  }

  .kgWidget .kgLeftMenu,
  .kgWidget .handleArea {
    box-shadow: 0 0 6px 1px rgba(0, 0, 0, .15)
  }

  .kgWidget .kgHeadBox,
  .kgWidget .kgWidgetContainer {
    width: 100%;
    /*min-width: 1280px;*/
    margin: 0 auto;
    height: 100%
  }

  .kgWidget .kgHeadBox .goback {
    display: inline-block;
    font-size: 0;
    padding: 0 10px;
    color: #757575;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none
  }

  .kgWidget .kgHeadBox .goback:hover {
    color: #333
  }

  .kgWidget .kgHeadBox .goback i.icon {
    font-size: 20px;
    line-height: 50px
  }

  .kgWidget .kgWidgetContainer {
    box-sizing: border-box;
    padding-top: 60px;
    font-size: 12px
  }

  .kgWidget .kgHead {
    height: 50px;
    line-height: 50px
  }

  .kgWidget .kgHead .kgCancel,
  .kgWidget .kgHead .kgSave {
    display: inline-block;
    margin-left: 10px;
    height: 34px;
    line-height: 34px;
    vertical-align: middle;
    margin-top: 8px;
    width: 88px;
    text-align: center
  }

  .kgWidget .kgHead .kgCancel:not(:hover) {
    color: #ccc!important
  }

  .kgWidget .kgHead .kgSave {
    color: #fff;
    border-radius: 3px
  }

  .kgWidget .kgLeftMenu {
    width: 180px
  }

  .kgWidget .kgContent {
    width: 640px;
    border-right: 1px solid #ccc
  }

  .kgWidget .kgSettings {
    width: 464px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none
  }

  .kgWidget .kgTitle {
    font-size: 14px;
    color: #333;
    height: 40px;
    line-height: 40px;
    box-sizing: border-box
  }

  .kgWidget .flexBox {
    display: -webkit-box;
    display: flex
  }

  .kgWidget .dragPreview {
    position: absolute;
    top: 8px;
    left: 16px
  }

  .limitTxt {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: top;
    max-width: 86px
  }

  .confirmSave .noHeader {
    height: 0
  }

  .confirmSave .dialogContent {
    text-align: center;
    padding: 14px 0;
    padding-right: 20px;
    height: 36px
  }

  .confirmSave .savePrompt {
    display: inline-block;
    vertical-align: middle;
    margin-top: 5px;
    color: #9e9e9e
  }

  .confirmSave .saveLoader {
    display: inline-block;
    vertical-align: middle;
    margin-right: 22px
  }

  .pointerEvents {
    pointer-events: none
  }

  .kgWidget .widgetBox {
    color: #333;
    font-size: 12px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    height: 100%;
    display: -webkit-box;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column
  }

  .kgWidget .editBoxItem {
    padding: 12px 0;
    padding-left: 10px;
    box-sizing: border-box
  }

  .kgWidget .dragHint {
    opacity: .3;
    padding: 0 0 6px 10px
  }

  .kgWidget .dragTitle {
    font-weight: 700;
    padding: 6px 0 6px 10px
  }

  .kgWidget .widgetList {
    -webkit-box-flex: 1;
    flex: 1
  }

  .kgWidget .widgetListLi {
    width: 180px;
    list-style: none;
    position: relative;
    background: #f4f5f7
  }

  .kgWidget .widgetListLi:not(.active) {
    color: #333!important
  }

  .kgWidget .widgetListLi:not(:hover) {
    background: #fff!important
  }

  .kgWidget .widgetListLi:not(:hover) .addBottomWidget {
    display: none
  }

  .kgWidget .widgetListLi .addBottomWidget {
    position: absolute;
    top: 10px;
    right: 16px;
    cursor: pointer
  }

  .kgWidget .widgetListLi .addBottomWidget .iconMenu {
    color: #ddd;
    font-size: 22px
  }

  .kgWidget .widgetListLi .addBottomWidget .iconMenu:hover {
    color: #999
  }

  .kgWidget .widgetListItem {
    padding: 12px 0 12px 10px;
    box-sizing: border-box;
    width: 100%
  }

  .kgWidget .widgetListItem i {
    font-size: 16px;
    color: #9e9e9e;
    width: 25px;
    display: inline-block
  }

  .editBox {
    font-size: 12px;
    color: #333;
    width: 100%;
    -webkit-box-flex: 1;
    flex: 1;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none
  }

  .editBox .bottomLocation {
    -webkit-box-flex: 1;
    flex: 1;
    min-height: 40px
  }

  .editBox .editArea {
    min-height: 361px;
    display: -webkit-box;
    display: flex;
    width: 100%;
    position: relative;
    background: #fff;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column
  }

  .editBox .editWidgetContainer {
    width: 100%;
    padding: 0 14px;
    box-sizing: border-box;
    padding-top: 10px
  }

  .editBox .editWidgetList {
    width: 100%;
    display: -webkit-box;
    display: flex
  }

  .kgWidget .settingsBox {
    font-size: 13px;
    color: #333;
    -webkit-box-flex: 1;
    flex: 1;
  }

  .kgWidget .settingsBox .widgetSettingsBox {
    padding-top: 24px;
    padding-left: 20px
  }

  .kgWidget .settingsBox .widgetSettingsTitle {
    padding-bottom: 22px
  }

  .kgWidget .settingsBox .widgetSettingsTitle .wsLf>span {
    opacity: 1
  }

  .kgWidget .settingsBox .radioGroup {
    display: inline-block;
    vertical-align: middle
  }

  .kgWidget .extraSettings {
    width: 100%;
    border-bottom: 1px solid #ccc
  }

  .kgWidget .extraSettings .filterSettingsTip {
    color: #b0b0b0;
    vertical-align: middle;
    margin-top: -7px;
    font-weight: 400
  }

  .kgWidget .extraSettings .filterSettingsTip:after {
    white-space: normal;
    width: 299px
  }

  .kgWidget .extraSettings .defaultSettings {
    padding-top: 12px
  }

  .kgWidget .extraSettings .extraSettingsTitle {
    font-size: 14px;
    height: 40px;
    margin-left: 20px;
    line-height: 40px
  }

  .kgWidget .extraSettings .filterSettingsBox {
    max-height: 180px;
    min-height: 88px;
    padding-bottom: 7px
  }

  .kgWidget .extraSettings .filterSettingsItem {
    float: left;
    width: 50%;
    margin-bottom: 4px;
    padding-left: 24px;
    box-sizing: border-box
  }

  .kgWidget .icon-dialpad {
    font-size: 18px
  }

  .kgWidget input[type=text],
  .kgWidget textarea {
    padding: 0 10px;
    width: 320px;
    border-radius: 3px;
    border: 1px solid
  }

  .kgWidget input[type=text]:not(.active):not(:hover),
  .kgWidget textarea:not(.active):not(:hover) {
    border-color: #ccc!important
  }

  .kgWidget input[type=text].halfInput,
  .kgWidget textarea.halfInput {
    width: 90px
  }

  .kgWidget textarea.multipleLine {
    height: auto!important;
    padding: 5px 10px;
    line-height: 20px;
    vertical-align: middle
  }

  .kgWidget input[type=radio] {
    margin-right: 10px
  }

  .kgWidget .addOption {
    display: block;
    margin-left: 40px;
    margin-top: 14px;
    cursor: pointer
  }

  .kgWidget .defaultSettings {
    padding-top: 60px;
    text-align: center;
    color: #333;
    opacity: .3;
    font-size: 14px
  }

  .kgWidget .OAOptionsBox {
    padding-left: 20px;
    margin-top: 28px
  }

  .kgWidget .OAOptionsBox .checkboxLabel {
    margin-bottom: 16px;
    display: block
  }

  .kgWidget .iconDelete {
    margin-top: -12px;
    vertical-align: middle;
    font-size: 18px
  }
</style>
