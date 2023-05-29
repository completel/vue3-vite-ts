<template>
    <!-- 顶部左侧静态 -->
    <el-icon style="margin-right: 20px;" @click="changeIcon">
        <component :is="layoutSettingStore.fold ? 'Fold' : 'Expand'"></component>
    </el-icon>
    <!-- 左侧面包屑 -->
    <el-breadcrumb separator-icon="ArrowRight">
        <!-- 面包屑需要展示路由名字和标题 -->
        <el-breadcrumb-item v-for="(item, index) in $route.matched" :key="index" v-show="item.meta.title" :to="item.path">
            <el-icon>
                <!-- 
                    \// title: '',
                    \// icon: ''
                    在路由器配置项中，将title和icon注释掉，控制台就不会报错了
                    大概原因应该是：v-show只是把layout组件通过display: none; 隐藏了
                    但是图标组件还是去找meta下的icon，所以抛出警告
                    index.vue:19 [Vue warn]: Invalid vnode type when creating vnode: . 
                    at <ElIcon> 
                    解决办法1：在路由器配置项中将icon注释掉
                    解决办法2：在component中加上v-if，如果meta.icon为空，就删除这个标签
                 -->
                <component v-if="item.meta.icon" :is="item.meta.icon"></component>
            </el-icon>
            <!-- 面包屑展示匹配路由的标题 -->
            <span style="margin: 0 5px;">{{ item.meta.title }}</span>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import useLayOutSettingStore from '@/store/module/settins'

// 控制菜单折叠还是打开图标切换的变量
// 获取layout配置相关的仓库库
const layoutSettingStore = useLayOutSettingStore()
// 获取路由对象
const $route = useRoute()

// 点击图标的方法
const changeIcon = () => {
    // 图标进行切换
    layoutSettingStore.fold = !layoutSettingStore.fold
}

</script>

<script lang="ts">
export default {
    name: 'Breadcrumb'
}
</script>

<style scoped>
.el-icon {
    vertical-align: top;
}
</style>