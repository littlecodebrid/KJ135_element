<template>
    <el-form :model="model" ref="form" :inline="inline" :label-width="labelWidth" :size="size" class="demo-dynamic">
        <!-- 多项 -->
        <div v-if="model.domains">
            <el-form-item  v-for="(domain, index) in model.domains" :key="domain.key">
                <el-form-item v-for="item in list" :key="item.id" :prop="item.dataIndex" :label="item.type === 'submit-button' || item.type === 'add-button' || item.type === 'cut-button' ? null : item.label+index" :rules="item.rules">
                    <!-- 输入框 -->
                    <el-input v-if="item.type === 'input'" v-model="model[item.dataIndex]" :type="item.input_type" :placeholder="'请输入'+item.label" @change="handleChange" :style="{width: contentWidth}" >
                        <template slot="append">.com</template>
                    </el-input>
                    <!-- 选择器 -->
                    <el-select v-if="item.type === 'select'" v-model="model[item.dataIndex]" :placeholder="'请选择'+item.label" @change="handleChange" :style="{width: contentWidth}">
                        <el-option v-for="option in item.options" :key="option.id" :label="option.label" :value="option.value"></el-option>
                    </el-select>
                    <!-- 单选框 -->
                    <el-radio-group v-if="item.type === 'radio'" v-model="model[item.dataIndex]" @change="handleChange" :style="{width: contentWidth}">
                        <el-radio v-for="option in item.options" :key="option.id" :label="option.label">{{option.name}}</el-radio>
                    </el-radio-group>
                    <!-- 多选框 -->
                    <el-checkbox-group v-if="item.type === 'checkbox'" v-model="model[item.dataIndex]" @change="handleChange" :style="{width: contentWidth}">
                        <el-checkbox v-for="option in item.options" :key="option.id" :label="option.label" :name="option.name"></el-checkbox>
                    </el-checkbox-group>
                    <!-- 日期选择框 -->
                    <el-date-picker v-if="item.type === 'date-picker'" v-model="model[item.dataIndex]" placeholder="请选择日期" @change="handleChange" :style="{width: contentWidth}"></el-date-picker>
                    <!-- 提交按钮 -->
                    <el-button v-if="item.type === 'submit-button'" @click="handleSubmit">{{item.name}}</el-button>
                    <!-- 新增按钮 -->
                    <el-button v-if="item.type === 'add-button'" @click="handleAdd">{{item.name}}</el-button>
                    <!-- 减少按钮 -->
                    <el-button v-if="item.type === 'cut-button'" @click="handleCut(domain)">{{item.name}}</el-button>
                </el-form-item>
            </el-form-item>
        </div>
        <!-- 一项 -->
        <div v-else>
            <el-form-item v-for="item in list" :key="item.id" :prop="item.dataIndex" :label="item.type === 'submit-button' ?  null : item.label" :rules="item.rules">
                <!-- 输入框 -->
                 <el-input v-if="item.type === 'input'"  v-model="model[item.dataIndex]" :type="item.input_type" :placeholder="'请输入'+item.label" @change="handleChange" :style="{width: contentWidth}">
                    <template v-if="item.append" slot="append">{{item.append}}</template>
                </el-input>
                <!-- 选择器 -->
                <el-select v-if="item.type === 'select'" v-model="model[item.dataIndex]" :placeholder="'请选择'+item.label" @change="handleChange" :style="{width: contentWidth}">
                    <el-option v-for="option in item.options" :key="option.id" :label="option.label" :value="option.value"></el-option>
                </el-select>
                <!-- 单选框 -->
                <el-radio-group v-if="item.type === 'radio'" v-model="model[item.dataIndex]" @change="handleChange" :style="{width: contentWidth}">
                    <el-radio v-for="option in item.options" :key="option.id" :label="option.label">{{option.name}}</el-radio>
                </el-radio-group>
                <!-- 多选框 -->
                <el-checkbox-group v-if="item.type === 'checkbox'" v-model="model[item.dataIndex]" @change="handleChange" :style="{width: contentWidth}">
                    <el-checkbox v-for="option in item.options" :key="option.id" :label="option.label" :name="option.name"></el-checkbox>
                </el-checkbox-group>
                <!-- 日期选择框 -->
                <el-date-picker v-if="item.type === 'date-picker'" v-model="model[item.dataIndex]" placeholder="请选择日期" @change="handleChange" :style="{width: contentWidth}"></el-date-picker>
                <!-- 两个日期选择框 -->
                <div v-if="item.type === 'double-date-picker'" >
                    <el-date-picker v-model="model[item.dataIndex1]" type="datetime" placeholder='开始日期' @change="handleChange1(item.dataIndex1, item.dataIndex2)" :picker-options="item.pickerOptions1" :style="{width: item.width}"></el-date-picker>
                    <el-date-picker v-model="model[item.dataIndex2]"  type="datetime" placeholder='结束日期' @change="handleChange2(item.dataIndex1, item.dataIndex2)" :picker-options="item.pickerOptions2" :style="{width: item.width}"></el-date-picker>
                </div>
                <!-- 上下左右四个选择框 -->
                <div v-if="item.type === 'roi'" class="roi">
                    <el-input  v-model="model[item.dataIndex1]" :type="item.input_type" @change="handleChange" :style="{width: item.width}" class="nPosition">
                        <template v-if="item.prepend1" slot="prepend">{{item.prepend1}}</template>
                    </el-input>
                    <el-input  v-model="model[item.dataIndex2]" :type="item.input_type" @change="handleChange" :style="{width: item.width}" class="sPosition">
                        <template v-if="item.prepend2" slot="prepend">{{item.prepend2}}</template>
                    </el-input>
                    <el-input  v-model="model[item.dataIndex3]" :type="item.input_type" @change="handleChange" :style="{width: item.width}" class="rPosition">
                        <template v-if="item.prepend3" slot="prepend">{{item.prepend3}}</template>
                    </el-input>
                    <el-input  v-model="model[item.dataIndex4]" :type="item.input_type" @change="handleChange" :style="{width: item.width}" class="wPosition">
                        <template v-if="item.prepend4" slot="prepend">{{item.prepend4}}</template>
                    </el-input>
                </div>
                <!-- 提交按钮 -->
                <el-button v-if="item.type === 'submit-button'" @click="handleSubmit" :icon="item.icon" :type="item.button_type" :style="{'margin-left': item.marginLeft}">{{item.name}}</el-button>
                <!-- 清空按钮 -->
                <el-button v-if="item.type === 'clear-button'" @click="handleClear" :icon="item.icon" :type="item.button_type" :style="{'margin-left': item.marginLeft}">{{item.name}}</el-button>
            </el-form-item>
        </div>
        
    </el-form>
</template>
<script>
import { constants } from 'crypto';
import { constantRoutes } from '../../../mock/role/routes';
export default {
    name: 'aeolus-form',
    props: ['list', 'model', 'labelWidth', 'contentWidth', 'inline', 'size'],
    data(){
        console.log(this.model)
        return {
        }
    },
    methods:{
        handleChange(){  //每个item改变时触发
            this.$emit('change')
        },
        handleChange1(date1, date2){
            this.list.map((val) => {
                if (val.dataIndex1 === date1) {
                    val.pickerOptions2 = {
                        disabledDate: (time) => {
                            return this.model[date1] ? time.getTime() <= this.model[date1].getTime() - 86399000 : null
                        }
                    }
                }
            })
            this.$emit('change')
        },
        handleChange2(date1, date2){
            if (this.model[date2]) {
                this.list.map((val) => {
                    if (val.dataIndex1 === date1) {
                        val.pickerOptions1 =  {
                            disabledDate: (time) => {
                                return this.model[date2] ? time.getTime() >= this.model[date2].getTime() + 86399000 : null
                            }
                        }
                    }
                })
            }
            this.$emit('change')
        },
        handleSubmit() {  //验证提交
            this.$refs['form'].validate((valid)=> {
                if (valid) {
                    this.$emit('submit')
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        handleClear(){
            this.$refs['form'].resetFields()
            for (var i in this.model) this.model[i] = ''
        },
        handleAdd(){
            this.$emit('addDomain')
        },
        handleCut(item){
            this.$emit('cutDomain', item)
        }
    }
}
</script>
<style scoped>
.roi {
    position: relative;
    height: 50px;
    width: 200px;
}
.nPosition,
.sPosition,
.rPosition,
.wPosition {
    position: absolute
}
.nPosition {
    top: 0px;
    left: 55px  
}
.sPosition {
    top: 20px;
    left: 110px
}
.rPosition {
    top: 20px;
    left: 0px
}
.wPosition {
   top: 40px;
   left: 55px
}

</style>