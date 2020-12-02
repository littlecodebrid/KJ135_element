<template>
    <!-- 进度条组件 created by ruxiu.zheng  -->
    <!-- label: 进度条的名称 -->
    <!-- content: 进度条中显示的文字 -->
    <!-- children: 进度条由几部分组成 -->
    <!-- color: 进度条的不同进度颜色 -->
    <!-- baseline: 进度条的警戒线 -->
    <!-- proportion: 进度条的不同进度占比值 -->
    <div id="progress">
            <div v-for="(item, index) in data" :key="index" class="flex">
                <div class="progress-label">{{item.label}}</div>
                <div class="progress-total" v-if="item.children" v-cloak>
                    <div class="progress-content">{{item.content}}</div>
                    <div 
                        v-for="(childItem, childIndex) in item.children"
                        :key="childIndex"
                        :style="{float: 'left', 'background-color': childItem.color, width: childItem.proportion, height: '100%'}"
                    ></div>
                    <div :style="{position: 'absolute', top: 0, left: item.baseline, height: '100%', 'border-right': '5px solid #AA0000'}" v-if="item.baseline && item.baseline !== '0%'"></div>
                </div>
                <div class="progress-total" v-else v-cloak>
                    <div class="progress-content">{{item.content}}</div>
                    <div 
                        :key="item.id"
                        :style="{float: 'left', 'background-color': item.color, width: item.proportion, height: '100%'}" 
                    ></div>
                    <div :style="{position: 'absolute', top: 0, left: item.baseline, height: '100%', 'border-right': '5px solid #AA0000'}" v-if="item.baseline && item.baseline !== '0%'"></div>
                </div>
            </div>
        </div> 
</template>
<script>
export default {
    name: 'aeolus-progress',
    props: ['data'],
    mounted(){
        console.log('传值', this.data)
    }
}
</script>
<style scoped>
.flex {
    display: flex;
}
.flex-column {
    flex-direction: column;
}
.progress-label{
    width: 150px;
    padding: 0 10px;
    text-align: right;
}
.progress-total {
    display: inline-block;
    height: 20px;
    width: 100%;
    text-align: center;
    position: relative;
    background-color: darkgray;
    margin-bottom: 10px;
}
.progress-content {
    position: absolute;
    height: 20px;
    width: 100%;
    left: 0;
    top: 0;
    text-align: center;
    line-height: 20px;

}
[v-cloak]{
    display: none!important
}
</style>