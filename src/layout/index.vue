<template>
    <div class="layout_container">
        <!-- 左侧菜单 -->
        <div class="layout_slider">
            <Logo></Logo>
            <!-- 滚动条 -->
            <el-scrollbar class="scrollbar">
                <!-- 菜单组件 -->
                <el-menu background-color="#001529" text-color="white">
                    <!-- 根据动态生成菜单组件 -->
                    <Menu :menuList="userStore"></Menu>
                </el-menu>
            </el-scrollbar>
        </div>
        <!-- 顶部导航 -->
        <div class="layout_tabbar">456</div>
        <!-- 内容展示区域 -->
        <div class="layout_main">789</div>
    </div>
</template>

<script setup lang="ts">
// 引入左侧菜单logo子组件
import Logo from '@/layout/logo/index.vue'
// 引入菜单子组件
import Menu from '@/layout/menu/index.vue'
// 获取用户相关的小仓库
import useUserStore from '@/sotre/module/user'
const userStore = useUserStore()

</script>

<style scoped lang="scss">
.layout_container {
    width: 100%;
    height: 100vh;

    .layout_slider {
        width: $base-menu-width;
        height: 100vh;
        background-color: $base-menu-background;

        .scrollbar {
            width: 100%;
            height: calc(100vh - $base-menu-logo-height);
        }
    }

    .layout_tabbar {
        position: fixed;
        top: 0;
        right: 0;
        width: calc(100% - $base-menu-width);
        height: $base-table-height;
        background-color: skyblue;
    }

    .layout_main {
        position: absolute;
        left: $base-menu-width;
        top: $base-table-height;
        width: calc(100% - $base-menu-width);
        height: calc(100vh - $base-table-height);
        background-color: pink;
        padding: 20px;
        overflow: auto;
    }
}
</style>