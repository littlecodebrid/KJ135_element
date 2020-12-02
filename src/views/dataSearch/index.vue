<template>
<div class="flex">
    <div class="flex column" :style="{width: '70%'}">
        <el-card :style="{margin: '10px'}" shadow="hover">
            <aeolus-form :list="searchFormList" :model="searchFormModel" labelWidth="100px" contentWidth="150px" :inline="true" size="mini" v-on:submit="handleSubmit" v-on:change="handleChange"></aeolus-form>
        </el-card>
        <el-card :style="{margin: '10px'}" shadow="hover">
            <el-table ref="dataTable" :data="dataSource"  border @row-click="handleClickRow" :style="{width: '100%'}" highlight-current-row >
                <el-table-column v-for="(item, index) in column" :key="index" :prop="item.dataIndex" :label="item.label" :min-width="item.width"></el-table-column>
            </el-table>
            <el-pagination :total="total" :current-page="this.pageNum" :page-size="this.pageSize" @current-change="handleChangePage" background  layout="total,prev,pager,next,jumper" small :style="{margin: '10px', float: 'right'}"></el-pagination>
            <div class="clear"></div>
            <el-col :span="8" v-for="(item , index) in detail" :key="index">
                {{item.label}} : {{item.value}}
            </el-col>
        </el-card>
    </div>
    <div>
        <el-button type="primary" :disabled="checkList.length === 0" v-if="sceneList.length !== 0 && searchFormModel.dataType !== 'Raw'" :style="{'margin-top': '10px'}" @click="handleDownload">下载</el-button>
        <el-checkbox-group v-model="checkList" @change="handleCheckList">
            <el-card  shadow="hover" v-for="item in sceneList" :key="item.productID" :style="{'margin-top': '10px'}"> 
                <el-checkbox  :label="item.productID">{{kb}}</el-checkbox>
                <el-col v-if="searchFormModel.dataType === 'Raw'">景编号：{{item.sceneID}}</el-col>
                <el-col v-if="searchFormModel.dataType === 'Raw'">开始时间：{{item.startTime}}</el-col>
                <el-col v-if="searchFormModel.dataType !== 'Raw'">产品编号：{{item.productID}}</el-col>
                <el-col>完成时间：{{item.catalogTime}}</el-col>
                <el-col v-if="searchFormModel.dataType === 'Raw'">产品数量：{{item.productNum}}</el-col>
                <div class="clear"></div>
                <div :style="{height: '200px', width: '99%', border: '1px solid #eee', background: 'black'}">
                    <img :src="item.path" :style="{height: '198px', width: '99%'}" v-on:error.once="dosomething($event)">
                </div>
            </el-card>
        </el-checkbox-group>
        
    </div>
</div>
</template>
<script>
import AeolusForm from '@/components/Form'
import { mapActions, mapGetters, mapState } from 'vuex'
import { getSelect, getFilter } from '@/utils/publicFunc'
import { DataType } from '@/utils/publicObj'
import { search, getSegment, getScene, getProduct } from '@/api/sensor'
import { parseTime } from '@/utils'
import config from '../../../public/config'
import { constants } from 'crypto';
let SatelliteID = [], SensorID =[], StationID = [], WorkMode = []
export default {
    name: 'dataSearch',
    components: {AeolusForm},
    watch: {
        dataSource: function(){
            this.$refs.dataTable.setCurrentRow(this.dataSource[0])
        },
        SatelliteID(){
            this.searchFormList[0].options = getSelect(this.SatelliteID)
        },
        SensorID(){
            this.searchFormList[1].options = getSelect(this.SensorID)
        },
        StationID(){
            this.searchFormList[7].options = getSelect(this.StationID)
        },
        WorkMode(){
            this.searchFormList[4].options = getSelect(this.WorkMode)
        }
    },
    computed: {
        ...mapGetters([
            'SatelliteID', 'SensorID', 'StationID', 'WorkMode'
        ])
    },
    async beforeCreate() {
        this.$store.dispatch('sensor/getSatelliteID')
        this.$store.dispatch('sensor/getSensorID')
        this.$store.dispatch('sensor/getStationID')
        this.$store.dispatch('sensor/getWorkMode')
    },
    data(){
        return {
            searchFormList: [
                {id: 1, label: '卫星标识', type: 'select', dataIndex: 'platformID', options: getSelect(this.SatelliteID)},
                {id: 2, label: '载荷标识', type: 'select', dataIndex: 'sensorID', options: getSelect(this.SensorID)},
                {id: 8, label: '数据时间', type: 'double-date-picker', dataIndex1: 'DataStartTime', dataIndex2: 'DataEndTime', width: '220px', pickerOptions1: {}, pickerOptions2: {} },
                {id: 3, label: '数据类型' , type: 'select', dataIndex: 'dataType', options: getSelect(DataType)},
                {id: 4, label: '工作模式', type: 'select', dataIndex: 'workMode', options: getSelect(this.WorkMode)},
                {id: 9, label: '编录时间', type: 'double-date-picker', dataIndex1: 'CatalogStartTime', dataIndex2: 'CatalogEndTime', width: '220px', pickerOptions1: {}, pickerOptions2: {}},
                {id: 5, label: '接收计划号', type: 'input', dataIndex: 'planID'},
                {id: 6, label: '地面站标识', type: 'select', dataIndex: 'stationID', options: getSelect(this.StationID)},   
                {id: 11, label: '段标识', type: 'input', dataIndex: 'segmentID'},
                {id: 12, label: 'ROI', type: 'roi', dataIndex1: 'n', dataIndex2: 's', dataIndex3: 'e', dataIndex4: 'w', width: '50px', prepend1: 'N', prepend2: 'S', prepend3: 'E', prepend4: 'W'},
                {id: 13, name: '清空', type: 'clear-button', icon: 'el-icon-refresh', marginLeft: '30px'},
                {id: 14, name: '搜索', type: 'submit-button', icon: 'el-icon-search', button_type: 'primary'},
            ],
            searchFormModel:{
                platformID: '', sensorID: '', dataType: '', workMode: '', planID: '', stationID: '', DataStartTime: '', DataEndTime: '', CatalogStartTime: '', CatalogEndTime: '', segmentID: '',
                n: 0, s: 0, e: 0, w: 0
            },
            dataSource: [],
            column: [
                {label: '段标识',  dataIndex: 'segmentID', width: '20%'},
                {label: '卫星标识',  dataIndex: 'platformID', width: '5%'},
                {label: '载荷标识',  dataIndex: 'sensorID', width: '5%'},
                {label: '工作模式',  dataIndex: 'workMode', width: '5%'},
                {label: '地面站标识',  dataIndex: 'stationID', width: '6%'},
                {label: '接收计划号',  dataIndex: 'planID', width: '6%'},
                {label: '开始时间',  dataIndex: 'startTime', width: '15%'},
                {label: '结束时间',  dataIndex: 'endTime', width: '15%'},
                {label: '编录时间',  dataIndex: 'catalogTime', width: '10%'},
                {label: '字节数' ,  dataIndex: 'totalBytes', width: '7%'}
            ],
            detail: [
                {label: '景数量', dataIndex: 'sceneNum', value: ''},
                {label: '产品数量', dataIndex: 'productNum', value: ''},
                {label: '编录时间', dataIndex: 'catalogTime', value: ''},
                {label: '最后一次生产时间', dataIndex: 'lastProductTime', value: ''},
                {label: '数据状态', dataIndex: 'dataStatus', value: ''},
            ],
            pageNum: 1,
            pageSize: 10,
            total: 0,
            sceneList: [],
            clickRow: {},
            checkList: [],
            kb: ''
        }
    },
    mounted() {
        this.init(this.searchFormModel)
    },
    methods: {
        async init(data){
            let startTime= []
            let catalogTime = []
            for ( var i in data) {
                if ((i === 'DataStartTime' || i === 'DataEndTime' || i === 'CatalogStartTime' || i === 'CatalogEndTime') && data[i])
                    data[i] = parseTime(data[i])
                if (i === 'DataStartTime' && data[i]) {
                    startTime.push(`>${data[i]}`)
                    delete(data[i])
                }     
                if (i === 'DataEndTime' && data[i]) {
                    startTime.push(`<${data[i]}`)
                    delete(data[i])
                }   
                if (i === 'CatalogStartTime' && data[i]){
                    catalogTime.push(`>${data[i]}`)
                    delete(data[i])
                }     
                if (i === 'CatalogEndTime' && data[i]) {
                    catalogTime.push(`<${data[i]}`)
                    delete(data[i])
                }
                data['startTime'] = startTime
                data['catalogTime'] = catalogTime  
             }
            let resp = await search({
                filter: getFilter(data),
                pageInfo: {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                },
                sort: ""
            })
            if (resp.code === 200){
                this.total = resp.data.total;
                this.dataSource = resp.data.records
                this.handleClickRow(this.dataSource[0])
            } else {
                this.$message({
                    message: resp.exception,
                    type: 'error'
                })
            }
        },
        async handleSubmit(){  //提交搜索数据
            this.init(this.searchFormModel)    
        },
        async handleClickRow(row, column, event){  //点击表格某一行
            this.clickRow = row
            this.checkList = []
            let segmentResp = await getSegment({segmentId: row.segmentID})
            if (segmentResp.code === 200){
                this.detail.forEach(val => {
                    if(val.dataIndex === 'sceneNum') val.value = segmentResp.data.sceneNum
                    if(val.dataIndex === 'productNum') val.value = segmentResp.data.productNum
                    if(val.dataIndex === 'catalogTime') val.value = segmentResp.data.segmentInfo.catalogTime
                    if(val.dataIndex === 'lastProductTime') val.value = segmentResp.data.segmentInfo.lastProductTime
                    if(val.dataIndex === 'dataStatus') val.value = segmentResp.data.segmentInfo.dataStatus
                })
            } else {
                this.$message({
                    message: segmentResp.exception,
                    type: 'error'
                })
            }
            if (this.searchFormModel.dataType === 'RAW') {
               this.renderScene(row) 
            } else {
                this.renderProduct(row)
            }
        },
        handleChange(){  //搜索项发生改变
            if (this.searchFormModel.dataType === 'RAW') {
               this.renderScene(this.clickRow) 
            } else {
               this.renderProduct(this.clickRow)
            }
        },
        handleChangePage(val){  //换页
            this.pageNum = val
            this.init(this.searchFormModel)
        },
        async renderScene(row){  //获取景信息
            this.clickRow = row
            let resp = await getScene({segmentId: row.segmentID})
            if (resp.code === 200){
                this.sceneList = resp.data
            } else {
                this.$message({
                    message: resp.exception,
                    type: 'error'
                })
            }
        },
        async renderProduct(row){   //获取产品信息
            this.clickRow = row
            let resp = await getProduct({segmentId: row.segmentID})
            if (resp.code === 200){
                resp.data.map(val => {
                    val.path = config.baseUrl_data + '/' + val.path
                })
                this.sceneList = resp.data
            } else {
                this.$message({
                    message: resp.exception,
                    type: 'error'
                })
            }
        },
        dosomething(e){  //图片404时
            e.target.src = require('@/assets/404_images/404.png')
        },
        handleCheckList(){ //checkbox切换
            console.log(this.checkList)
        },
        handleDownload(){  //下载

        }
    }
}
</script>
<style scope>
.el-col-24 {
    font-size: 12px;
    padding: 5px
}
.el-col-8{
    padding: 10px
}
.clear{
    clear: both;
    height: 0;
    line-height: 0;
    font-size: 0
}
.el-table {
    width: ''
}
.checkbox_item {
    border: 1px #ccc solid;
    width: 100%;
    border-radius: 5px;
}
</style>


