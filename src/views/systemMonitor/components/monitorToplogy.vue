<template>
    <action-panel header="主机拓扑展示" v-on:refresh="handleRefresh">
        <div>
            <graph-g6 ref="g6" :data="graphData"/>
        </div>
    </action-panel>
   
</template>
<script>
/* eslint-disable */
import AeolusForm from '@/components/Form'    //form表单组件
import ActionPanel from '@/components/ActionPanel'    //
import MonitorApiClient from '@/api/monitor/monitor'
import GraphG6 from './graph/GraphG6'
import topology from '@/../public/topology'
export default {
    name: 'monitor-topology',
    components: { AeolusForm,ActionPanel,GraphG6},
    data() {
        
        return {
           api : new MonitorApiClient(),
           dataSource: [],
           tableColumns: [
                {label: '名称',  dataIndex: 'name', width: '8%'},
                {label: '状态',  dataIndex: 'status', width: '5%'},
                {label: 'IP',  dataIndex: 'ip', width: '9%'},
                {label: 'CPU',  dataIndex: 'cpu', width: '5%'},
                {label: '内存',  dataIndex: 'memory', width: '6%'},
                {label: '启动时间',  dataIndex: 'uptime', width: '12%'},
            ],
            graphData: {}
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
        clearInterval(this.timer)
    },
    methods: {
        async init(){
            this.api.getToplogy().then(ret =>{
                this.graphData = ret.data
                this.$refs['g6'].handleData(this.graphData);
            });
            
        
        },
        handleChangeItem (){
            console.log('改变model值', this.configBasicModel)
            
        },

        async handleClickRow(row, column, event){  //点击表格某一行
        
        },
        
        async handleRefresh () {  //刷新
            this.init()
        }
       
    }
    

}
</script>
<style scoped>

</style>
