<template>
    <!-- 测试svg图标使用 -->
    <!-- 图标外层容器节点，内部需要与use标签结合使用 -->
    <svg :style="{ width, height }">
        <!-- xlink:href执行哪一个图标，属性值务必#icon-图标名字 -->
        <!-- use标签fill属性可以设置图标哦颜色 -->
        <!-- 我不清楚为什么这里无法修改颜色？ -->
        <use :xlink:href="symbolId" :fill="color"></use>
    </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// 定义父组件传递过来的接口
interface Props {
    prefix?: string, // xlink:href属性值前缀
    name: string, // 提供图标名字
    color?: string, // 接收父组件传递颜色
    width?: string, // 接收父组件传递过来的图标宽度|高度
    height?: string
}

const props = withDefaults(defineProps<Props>(), {
    prefix: '#icon'
})

const symbolId = computed(() => `${props.prefix}-${props.name}`)
</script>

<style scoped></style>