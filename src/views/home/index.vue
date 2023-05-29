<template>
    <h1>我是home组件 {{ userStore.username }}</h1>
</template>

<script setup lang="ts">
// 小仓库
import useUserStore from '@/store/module/user'

const userStore = useUserStore()

</script>

<style scoped></style>