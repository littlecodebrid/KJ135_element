<template>
    <div id="cache-manage" class="flex flex-start wrap">
        <el-card class="box-card" v-for="(item , index) in cacheList" :key="index" v-cloak>
            <div slot="header" class="flex space-between card-header">
                <span v-cloak>{{item.displayName}}存储状态</span>
                <div>
                    <aeolus-tooltip-button content="刷新" placement="top" effect="dark" icon="el-icon-refresh" shape="circle-no-button-content" v-on:click="handleRefresh(item)"></aeolus-tooltip-button>
                    <aeolus-tooltip-button content="清理" placement="top" effect="dark" icon="el-icon-news" shape="circle-no-button-content" v-on:click="handleClean(item)"></aeolus-tooltip-button>
                    <aeolus-tooltip-button content="配置" placement="top" effect="dark" icon="el-icon-edit-outline" shape="circle-no-button-content" v-on:click="handleConfig(item)"></aeolus-tooltip-button>
                    <aeolus-tooltip-button content="查看日志" placement="top" effect="dark" icon="el-icon-tickets" shape="circle-no-button-content" v-on:click="handleCheckLog(item)"></aeolus-tooltip-button>
                </div>
            </div>
            <div>
                <span v-if="item.cacheGeneral.normal === 1" :style="{color: 'green'}">存储状态：正常</span>
                <span v-else :style="{color: 'red'}">存储状态：异常 --- 异常信息：{{item.cacheGeneral.exceptionText}}</span>
            </div>
            <div><span>更新时间：{{item.cacheGeneral.logTime}}</span></div>
            <aeolus-pie :id="item.cacheName" :data="item.cacheData"  v-cloak></aeolus-pie>
            <aeolus-progress :data="item.dataMsg"  v-cloak></aeolus-progress>
        </el-card>
        <!-- 新增一项配置 -->
        <el-button class="box-add" @click="handleConfig({})" icon="el-icon-plus"></el-button>
        <!-- 总体配置信息 -->
        <el-dialog title="配置信息" :visible.sync="configDialogVisible" top="20px" :before-close="handleCloseGeneral">
            <el-card header="配置磁盘信息">
                <aeolus-form ref="disk" :list="configBasicFormList" :model="configBasicModel" v-on:submit="submitGeneralCache" labelWidth="100px" contentWidth="250px" :inline="true"></aeolus-form>
                <el-button style="float: right; margin-bottom: 10px" type="primary" @click="handleSubmitDisk">提交</el-button>
            </el-card>
            <el-card header="配置各类缓存数据信息" :style="{'margin-top': '10px'}">
                <el-button @click="handleEditCacheData({}, 'add')">新增一条缓存数据配置信息</el-button>
                <el-table :data="cacheData" :style="{'margin-top': '10px'}" border>
                    <el-table-column v-for="item in cacheDataFormList" :key="item.id" :prop="item.dataIndex" :label="item.label"></el-table-column>
                    <el-table-column fixed="right" label="操作" width="100">
                        <template slot-scope="scope">
                            <el-button @click="handleEditCacheData(scope.row, 'edit')" type="text" size="small">编辑</el-button>
                            <el-button type="text" size="small" @click="handleDeleteDataCache(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
            <span slot="footer" class="dialog-footer" top="40px">
                <el-button @click="configDialogVisible = false; init()">确定</el-button>
            </span>
        </el-dialog>
        <!-- 各缓存数据配置信息 -->
        <el-dialog title="缓存数据配置信息" :visible.sync="cacheDataVisible" :before-close="handleCloseData" width="800px">
            <aeolus-form ref="data" :list="cacheDataFormList" :model="cacheDataModel" labelWidth="150px" contentWidth="200px" :inline="true" v-on:submit="submitCacheData"></aeolus-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cacheDataVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSubmitCacheData">提交</el-button>
            </span>
        </el-dialog>
        <!-- 日志 -->
        <el-dialog title="日志信息" :visible.sync="logVisible">
            <el-table :data="logData" :style="{'margin-top': '10px', height: '500px', overflow: 'scroll'}" border>
                <el-table-column v-for="item in logDataFormList" :key="item.id" :prop="item.dataIndex" :label="item.label"></el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<script>
/* eslint-disable */
import echarts from 'echarts'
import AeolusProgress from '@/components/Progress'   //进度条组件
import AeolusTooltipButton from '@/components/TooltipButton'   //带提示的按钮组件
import AeolusForm from '@/components/Form'    //form表单组件
import AeolusPie from '@/components/Pie'   //饼图组件
import { available, dataCleanStrategy, priority } from '@/utils/publicObj'
import { getSelect, getRadio, byteConvert, exceptionConvert } from '@/utils/publicFunc'
import { getAllGeneralCache, getAllGeneralCacheDeatil, addGeneralCache, addDataCache, editDataCache, getDataCache, delDataCache, refreshCache, cleanCache, cacheLog, getGeneralCache } from '@/api/cache'
import { parseTime } from '@/utils'
import { constants } from 'crypto';
import { constantRoutes } from '../../../mock/role/routes';
var parser = require('cron-parser')
const color = ['#03b8cd', '#cdd96d', '#8a559b', '#f8a348', '#67c7bc', '#71b385', '#c23531', '#2f4554', '#61a0a8', '#d48265']
export default {
    name: 'cache-manage',
    components: { AeolusForm, AeolusProgress, AeolusPie, AeolusTooltipButton },
    data() {
        var validateNumber = (rule, value, callback) => {
            if (/^\d+(\.\d{1,2})?$/.test(value) == false && /^\d+$/.test(value) == false) {
                callback(new Error("请输入非负整数或浮点数，浮点数最多保留两位小数"));
            }else{
                //校验通过
                callback();
            }
        }
        var validateInteger = (rule, value, callback) => {
            if (/^\d+$/.test(value) == false) {
                callback(new Error("请输入非负整数"));
            }else{
                //校验通过
                callback();
            }
        }
        var validateWaterline = (rule, value, callback) => {
            if (Number(value) < Number(this.cacheDataModel.waterLine)) {
                callback()
            } else {
                callback('截止清理水线值应小于清理水线值')
            }
        }
        var validate0_9 = (rule,value,callback) => {
            //校验1-9数字的正则
            if(/^[1-9]{1}$/.test(value) == false){
                callback(new Error("请输入1-9之间的数字"));
            }else{
                //校验通过
                callback();
            }
        }
        return {
            cacheList: [],
            configDialogVisible: false,
            cacheDataVisible: false,
            logVisible:false,
            configBasicFormList: [  //总配置
                {id: 1, label: '缓存名称', type: 'input', dataIndex: 'cacheName', rules: [
                    { required: true, message: '请输入缓存名称', trigger: 'blur' },
                ]},
                {id: 2, label: '显示名称', type: 'input', dataIndex: 'displayName', rules: [
                    { required: true, message: '请输入显示名称', trigger: 'blur' },
                ]},
                {id: 3, label: '清理周期' , type: 'input', dataIndex: 'cleanTime', rules: [
                    { required: true, message: '请输入清理周期', trigger: 'blur' },
                    { validator: function(rule,value,callback){
                        try {
                            var interval = parser.parseExpression(value).next().toString()
                            callback()
                        } catch (err){
                            callback(err.message)
                        }
                        }, trigger: ['blur', 'change']
                    },
                ]},
                {id: 4, label: '挂载点', type: 'input', dataIndex: 'mountPoint', rules: [
                    { required: true, message: '请输入挂载点', trigger: 'blur' },
                ]},
                {id: 5, label: '清理流程名', type: 'input', dataIndex: 'cleanProcessName', rules: [
                    { required: true, message: '请输入清理流程名', trigger: 'blur' },
                ]},
                {id: 7, label: '是否可用', type: 'radio', dataIndex: 'available', options: getRadio(available), rules: [
                    { required: true, message: '请选择是否可用', trigger: ['change', 'blur'] },
                ]},
            ],
            configBasicModel: { cacheName: '', displayName: '', cleanTime: '', mountPoint: '', cleanProcessName: '',  available: ''},
            cacheDataFormList: [  //各类缓存配置
                {id: 1, label: '数据类型', type: 'input', dataIndex: 'dataType', rules: [
                    { required: true, message: '请输入数据类型', trigger: 'blur' },
                ]},
                {id: 16, label: '数据目录', type: 'input', dataIndex: 'dataPath', rules: [
                    { required: true, message: '请输入数据目录', trigger: 'blur' },
                ]},
                {id: 2, label: '容量', type: 'input', dataIndex: 'quota',  append: 'GB', rules: [
                    { required: true, message: '请输入容量', trigger: 'blur' },
                    { validator: validateNumber, trigger: ['blur', 'change']
                    },
                ]},
                {id: 3, label: '清理水线', type: 'input', dataIndex: 'waterLine', append: '%', rules: [
                    { required: true, message: '请输入清理水线', trigger: 'blur' },
                    { validator: validateNumber, trigger: ['blur', 'change']
                    },
                ]},
                {id: 4, label: '截止清理水线', type: 'input', dataIndex: 'stopWaterline', append: '%', rules: [
                    { required: true, message: '请输入截止清理水线', trigger: 'blur' },
                    { validator: validateNumber, trigger: ['blur', 'change']},
                    { validator: validateWaterline, trigger: ['blur', 'change']},
                ]},
                {id: 5, label: '清理优先级', type: 'input', dataIndex: 'priority', rules: [
                    { required: true, message: '请输入清理优先级', trigger: 'blur' },
                    { validator: validate0_9, trigger: ['blur', 'change']},
                ]},
                {id: 6, label: '清理策略', type: 'select', dataIndex: 'dataCleanStrategy', options: getSelect(dataCleanStrategy), rules: [
                    { required: true, message: '请选择清理策略', trigger: ['blur', 'change'] },
                ]},
                {id: 7, label: '驻留时间', type: 'input', dataIndex: 'stayHours', append: '小时', rules: [
                    { required: true, message: '请输入驻留时间', trigger: 'blur' },
                    { validator: validateInteger, trigger: ['blur', 'change']}
                ]},
                {id: 8, label: '访问次数', type: 'input', dataIndex: 'accessTimes', rules: [
                    { required: true, message: '请输入访问次数', trigger: 'blur' },
                ]},
                {id: 9, label: '是否可用', type: 'radio', dataIndex: 'available', options: getRadio(available), rules: [
                    { required: true, message: '请选择是否可用', trigger: ['change', 'blur'] },
                ]},
                {id: 10, label: '清理插件名称', type: 'input', dataIndex: 'cleanPlugin', rules: [
                    { required: true, message: '请输入清理插件名称', trigger: 'blur' },
                ]},
                {id: 11, label: '清理插件的参数', type: 'input', dataIndex: 'pluginConfig', rules: [
                    { required: true, message: '请输入清理插件的参数', trigger: 'blur' },
                ]},
                {id: 12, label: '数据类型描述', type: 'input', input_type: 'textarea', dataIndex: 'description'},
            ],
            cacheDataModel: { dataType: '', quota: '', waterLine: '', stopWaterline: '', priority: '', dataCleanStrategy: '',
                stayHours: '', accessTimes: '', available: '', cleanPlugin: '', pluginConfig: '', description: '' },
            cacheData: [],
            logData: [],
            logDataFormList: [
                {id: 1, label: '当前容量', dataIndex: 'currentSize'},
                {id: 4, label: '状态', dataIndex: 'normal'},
                {id: 2, label: '异常信息', dataIndex: 'exceptionText'},
                {id: 3, label: '日志时间', dataIndex: 'logTime'},
            ],
            cacheDataTag: ''
        }
    },
    created(){
       
    },
    mounted(){
        this.init()
        let _this = this
        this.timer = setInterval(function(){
            _this.init()
        }, 60000)
    },
    beforeDestroy(){
        clearInterval(this.timer)
    },
    methods: {
        async init(){
            // 获取所有总体缓存
            let resp = await getAllGeneralCache({json: ''})
            const arr = []
            resp.map( async val => {
                let cacheDetailResp = await getAllGeneralCacheDeatil({cacheName: val.cacheName})
                let cacheGeneralResp = await getGeneralCache({cacheName: val.cacheName})
                if (cacheDetailResp.data){
                    const cacheTotalArr = []     //用来存储总的数据缓存
                    const cacheDetailArr = []  //用来存储除总的外数据缓存
                    cacheDetailResp.data.data.map((cacheDetailVal, index) => {
                        for (var i in cacheDetailVal) {
                            if (i === 'dataType') {
                                cacheDetailVal['name'] = cacheDetailVal[i]
                                cacheDetailVal['label'] = cacheDetailVal[i]
                            }
                            if (i === 'ratio') {
                                cacheDetailVal['value'] = cacheDetailVal[i]
                                cacheDetailVal['proportion'] = cacheDetailVal[i] + '%'
                            }
                            if (i === 'waterline') cacheDetailVal['baseline'] = cacheDetailVal[i] + '%'
                            if (i === 'quota' && cacheDetailVal[i]) {
                                cacheDetailVal['content'] = byteConvert(cacheDetailVal['currentSize']) + '/' + byteConvert(cacheDetailVal[i])
                            }
                            console.log('index', index)
                            cacheDetailVal['color'] = color[index]
                        }
                        cacheDetailArr.push(cacheDetailVal) 
                    })
                    console.log('val', val)
                    cacheTotalArr.push({
                        label: "总空间",  content: byteConvert(cacheDetailResp.data.general.currentSize)+ '/' + byteConvert(cacheDetailResp.data.general.totalSize) , children: cacheDetailArr
                    })
                    val.cacheData = cacheDetailArr
                    val.dataMsg =  [...cacheTotalArr, ...cacheDetailArr]
                }
                for (var i in cacheGeneralResp.data){
                    if (i === 'exceptionText')
                        cacheGeneralResp.data[i] = cacheGeneralResp.data[i] ? exceptionConvert(cacheGeneralResp.data[i]) : ''
                }
                val.cacheGeneral =  cacheGeneralResp.data
                arr.push(val)
            })
            this.cacheList = arr 
        },
        handleChangeItem (){
            console.log('改变model值', this.configBasicModel)
            
        },
        async submitGeneralCache () {  // 添加或修改总的缓存 
            for (var i in  this.configBasicModel){
               if (i === 'creationTime') this.configBasicModel[i]= null
               if (i === 'available') this.configBasicModel[i]= Number(this.configBasicModel[i])
            }
            console.log('提交总的缓存的参数：', this.configBasicModel)
            let resp = await addGeneralCache(this.configBasicModel)
            console.log(resp)
        },
        handleCloseGeneral(){  //关闭总的缓存弹窗
            console.log('关闭之前')
            this.init()
            this.$refs.disk.$refs.form.resetFields()
            this.configDialogVisible = false    
        },
        async submitCacheData(){  //添加或修改数据缓存
            for (var i in  this.cacheDataModel){
                if (i === 'creationTime') this.cacheDataModel[i]= null
                if (i === 'available' || i === 'accessTimes' || i=== 'stayHours' || i === 'waterLine' || i === 'stopWaterline') 
                    this.cacheDataModel[i]= Number(this.cacheDataModel[i])
                if (i === 'quota')
                    this.cacheDataModel[i]= Number(this.cacheDataModel[i]) * 1024 * 1024 *1024
               this.cacheDataModel['cacheName'] = this.configBasicModel.cacheName
            }
            console.log('要提交的缓存数据参数：', this.cacheDataModel)
            let resp
            if (this.cacheDataTag === 'add') {
                resp = await addDataCache(this.cacheDataModel)
            } else if (this.cacheDataTag === 'edit') {
                resp = await editDataCache(this.cacheDataModel)
            }
            this.cacheDataVisible = false
            this.$message({
                message: '操作成功',
                type: 'success'
            })
            this.dataCacheDeatil(this.configBasicModel.cacheName)
        },
        handleCloseData(){  //关闭各类数据缓存弹窗
            this.$refs.data.$refs.form.resetFields()
            this.cacheDataVisible = false
            this.dataCacheDeatil(this.configBasicModel.cacheName)
        },
        async handleDeleteDataCache(data){  //删除数据缓存
            console.log('要删除数据缓存的参数：', data)
            let resp = await delDataCache({id: data.id})
            this.$message({
                message: '删除成功',
                type: 'success'
            })
            this.dataCacheDeatil(this.configBasicModel.cacheName)
        },
        async handleRefresh (item) {  //刷新
            let resp = await refreshCache({cacheName: item.cacheName })
            this.$message({
                message: '刷新成功',
                type: 'success'
            })
        },
        async handleClean (item) {  //清理
            let resp = await cleanCache({cacheName: item.cacheName })
            this.$message({
                message: '清理成功',
                type: 'success'
            })
            this.init()
        },
        async dataCacheDeatil(data){  //查看所有数据缓存
            let resp = await getDataCache({json: data})
            this.cacheData = resp
        },
        async handleConfig(item) {  //配置总的缓存(新增或修改)
            for (var i in item){
                if (i=== 'available') item[i] = String(item[i])
            }
            this.configBasicModel  = item
            this.configDialogVisible = true
            if (item.cacheName)
                this.dataCacheDeatil(item.cacheName)
            else 
               this.cacheData = []
        },
        async handleCheckLog (item) {  //查看日志
            console.log('查看日志')
            let resp = await cacheLog({cacheName: item.cacheName})
            resp.data.forEach(val => {
                if(val.normal === 1)
                    val.normal = '正常'
                else 
                   val.normal = '异常' 
            })
            this.logData = resp.data
            this.logVisible = true
        },
        handleSubmitCacheData(){  //确实提交缓存数据
            this.$refs['data'].handleSubmit()
        },
        handleSubmitDisk(){   //确定提交一块盘的数据
            this.$refs['disk'].handleSubmit()
        },
        handleEditCacheData(item, tag){  //编辑或新增数据缓存
            for (var i in item){
                if (i=== 'available') item[i] = String(item[i])
                if (i === 'quota')
                    item[i]= Math.floor(Number(item[i]) / (1024 * 1024 * 1024) * 100) / 100
            }
            this.cacheDataModel = item
            this.cacheDataVisible = true
            this.cacheDataTag = tag
        }
    }
    

}
</script>
<style scoped>
#cache-manage {
    width: 100%
}
#progress-total {
    display: inline-block;
    height: 20px;
    width: 100%;
    background-color: darkgray;
    margin-bottom: 10px;
}
.box-card{
    margin: 10px;
    width: 30%;
    height: 600px
}
.card-header {
    height: 40px;
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
