<template>
    <div class="logo" v-if="setting.logoHidden">
        <img :src="setting.logo" alt="">
        <h2>{{ setting.title }}</h2>
    </div>
</template>

<script setup lang="ts">
// 引入设置标题与logo配置文件
import setting from '@/setting';
</script>

<script lang="ts">
export default {
    name: 'Logo'
}
</script>

<style scoped lang="scss">
.logo {
    display: flex;
    align-items: center;
    width: 100%;
    height: $base-menu-logo-height;
    color: #fff;
    padding: 10px;

    img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }

    h2 {
        font-size: $base-logo-title-fontSize;
        margin-left: 10px;
    }
}
</style>