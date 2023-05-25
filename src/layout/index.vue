<template>
    <div class="layout_container">
        <!-- 左侧菜单 -->
        <div class="layout_slider">
            <Logo></Logo>
        </div>
        <!-- 顶部导航 -->
        <div class="layout_tabbar">456</div>
        <!-- 内容展示区域 -->
        <div class="layout_main">789</div>
    </div>
</template>

<script setup lang="ts">
import Logo from '@/layout/Logo/index.vue'


</script>

<style scoped lang="scss">
.layout_container {
    width: 100%;
    height: 100vh;

    .layout_slider {
        width: $base-menu-width;
        height: 100vh;
        background-color: $base-menu-background;
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