<template>
    <div :id="id" :style="{height: '300px', width: '100%'}"></div>
</template>
<script>
/* eslint-disable */
import echarts from 'echarts'
export default {
    name: 'aeolus-pie',
    props: ["id", "data"],
    watch:{
        data: {
            handler(newValue, oldvalue) {
                console.log('图的id-change', this.id)
                console.log('图的数据-change', newValue)
                this.initChart(this.id, newValue)
            },
            deep: true
        }
    },
    mounted(){
        this.initChart(this.id, this.data)
    },
    methods: {
        initChart(id, data){
            this.chart = echarts.init(document.getElementById(id));
            this.setOptions(data);
        },
        setOptions(data) {
            this.chart.setOption({
                // 图例
                legend: {
                    orient: 'vertical',
                    top: "middle",
                    right: "2%",
                    textStyle: {color: '#000', fontSize: 20},
                    icon: 'rect',
                },
                series: [{
                    radius: ['30%', '60%'],
                    center: ['35%', '50%'],
                    type: 'pie',   //饼图
                    label: {   //饼图文字
                        normal: {
                            show: false,
                            formatter: "{b} {c}%",
                            textStyle: {fontSize: 15},
                            position: 'center'
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    data: data,
                    color: data.map(val => {return val.color})
                }]
            })
        },
    }
}
</script>
<style scoped>
/* #main{
    width:100%;
    height: 300px;
}
#sain{
   width:100%;
    height: 300px; 
} */
</style>