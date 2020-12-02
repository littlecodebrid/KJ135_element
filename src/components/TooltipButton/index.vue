<template>
    <!-- 带提示的button组件 created by ruxiu.zheng  -->
    <!-- content 提示文字 -->
    <!-- placement 提示的位置 -->
    <!-- effect 提示的主题 -->
    <!-- icon 按钮的icon -->
    <!-- type 按钮的类型 -->
    <!-- shape 按钮的形状 -->
    <!-- button-content 按钮的文字 -->
    <div id="tooltip-button">
        <!-- 按钮是圆形的，且没有描述文字 -->
        <el-tooltip class="item" :effect="effect" :content="content" :placement="placement" v-if="shape === 'circle-no-button-content'">
            <el-button :icon="icon" circle @click="handleClick"></el-button>
        </el-tooltip>
        <!-- 按钮是圆形的，有描述文字 -->
        <el-tooltip class="item" :effect="effect" :content="content" :placement="placement" v-else-if="shape === 'circle-button-content'">
            <el-button :icon="icon" circle @click="handleClick">{{button_content}}</el-button>
        </el-tooltip>
        <!-- 按钮是方形的，没有描述文字 -->
        <el-tooltip class="item" :effect="effect" :content="content" :placement="placement" v-else-if="shape === 'square-no-button-content'">
            <el-button :icon="icon" @click="handleClick"></el-button>
        </el-tooltip>  
        <!-- 按钮是方形的，有描述文字 -->
        <el-tooltip class="item" :effect="effect" :content="content" :placement="placement" v-else-if="shape === 'square-button-content'">
            <el-button :icon="icon" @click="handleClick">{{button_content}}</el-button>
        </el-tooltip>
        <!-- 按钮是圆角的，没有描述文字 -->
        <el-tooltip class="item" :effect="effect" :content="content" :placement="placement" v-else-if="shape === 'round-no-button-content'">
            <el-button :icon="icon" round @click="handleClick"></el-button>
        </el-tooltip>
        <!-- 按钮是圆角的，有描述文字 -->
        <el-tooltip class="item" :effect="effect" :content="content" :placement="placement" v-else-if="shape === 'round-button-content'">
            <el-button :icon="icon" round @click="handleClick">{{button_content}}</el-button>
        </el-tooltip>      
    </div> 
</template>
<script>
export default {
    name: 'aeolus-tooltip-button',
    props: ['content', 'placement', 'effect', 'icon', 'type', 'shape', 'button_content'],
    methods: {
        handleClick(){
            this.$emit("click")
        }
    }
}
</script>
<style scoped>
#tooltip-button {
    display: inline-block;
}
</style>