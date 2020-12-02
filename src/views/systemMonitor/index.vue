<template>
  <div id="cache-manage" class="flex flex-start wrap">
    <div id="status-bar">
      <el-row style="vertical-align: center">
        <el-col :span=4 class="header-text">{{$t('monitor.monitor-status-header')}}<span class="statusSpan">{{monitor.monitored}}</span></el-col>
        <el-col :span=4 class="header-text">{{$t('monitor.system-status-header')}}<span class="statusSpan">{{monitor.status}}</span></el-col>
        <el-col style="float: right;" :span=4><el-button>{{$t('monitor.jump-to-zabbix')}}</el-button></el-col>
      </el-row>
    </div>
    <monitor-toplogy />
    <monitor-host />
    <monitor-storage />
    <monitor-service />
    <monitor-problem />
  </div>
</template>
<script>
  /* eslint-disable */
  import MonitorHost from './components/monitorHost'
  import MonitorToplogy from './components/monitorToplogy'
  import MonitorStorage from './components/monitorStorage'
  import MonitorService from './components/monitorService'
  import MonitorProblem from './components/monitorProblem'

  export default {
    name: 'system-monitor',
    components: {MonitorHost, MonitorToplogy, MonitorStorage, MonitorService, MonitorProblem },
    data() {
      return {
        monitor:{
          monitored: '监控中',
          status: '正常',
          updateTime: '2020-05-20 11:11:11'
        }
      }
    },
    created(){

    },
    mounted(){
      this.init()
      // let _this = this
      // this.timer = setInterval(function(){
      //     _this.init()
      // }, 60000)
    },
    beforeDestroy(){
      // clearInterval(this.timer)
    },
    methods: {
      async init(){

      },
      handleChangeItem (){
        console.log('改变model值', this.configBasicModel)

      },

      async handleRefresh (item) {  //刷新
        let resp = await refreshCache({cacheName: item.cacheName })
        this.$message({
          message: '刷新成功',
          type: 'success'
        })
      }
    }


  }
</script>
<style scoped>
  .header-text{
    background-color: #f0f5f0;
    margin: 5px;
    padding: 5px;
    border-radius: 4px;
  }
  #status-bar{
    display: block;
    width: 100%;
    padding: 5px 5px 5px 10px;
  }
  .statusSpan{
    float: right;
  }
</style>
