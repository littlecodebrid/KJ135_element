<template>
  <el-card class="box-card" v-cloak>
      <div slot="header" class="flex space-between card-header">
          <span v-cloak>{{header}}</span>
          <div>
              <aeolus-tooltip-button content="刷新" placement="top" effect="dark" icon="el-icon-refresh" shape="circle-no-button-content" v-on:click="handleRefresh()"></aeolus-tooltip-button>
              <slot name='actions'></slot>
          </div>
      </div>
      <slot></slot>
  </el-card>
</template>

<script>

import AeolusTooltipButton from '@/components/TooltipButton'   //带提示的按钮组件


export default {
  name: 'action-panel',
  components: {
    AeolusTooltipButton
  },
  props: {
    header: {
      type: String,
      default: 'Header'
    },

  },
  methods: {
    handleRefresh(){
      this.$emit('refresh', null)
    }
  }
}
</script>
<style lang="scss" scoped>
.box-card{
    margin: 10px;
    width: 48%;
    /* height: 500px */
}
.card-header {
    height: 35px;
    line-height: 40px;
}
.box-add {
    margin: 10px;
    width: 30%;
    height: 600px;
    /* height: 600px; */
    border: 3px dashed;
    text-align: center;
    line-height: 550px;
    font-size: 100px;
    color: #eeeeee;
}
[v-cloak]{
    display: none!important
}
</style>

