<template>
    <action-panel header="告警信息展示" v-on:refresh="handleRefresh">
        <div>
            <el-table ref="dataTable" :data="dataSource"  border @row-click="handleClickRow" :style="{width: '100%'}" highlight-current-row >
                <el-table-column v-for="(item, index) in tableColumns" :key="index" :prop="item.dataIndex" :label="item.label" :min-width="item.width"></el-table-column>
            </el-table>
        </div>
    </action-panel>
   
</template>
<script>
/* eslint-disable */
import AeolusForm from '@/components/Form'    //form表单组件
import ActionPanel from '@/components/ActionPanel'    //
import MonitorApiClient from '@/api/monitor/monitor'
export default {
    name: 'monitor-host',
    components: { AeolusForm,ActionPanel},
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
            this.api.getHost().then(ret =>{
                this.dataSource = ret.data
            })
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
