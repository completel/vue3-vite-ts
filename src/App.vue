<template>
  <h1 class="box">hello world</h1>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { reqLogin } from '@/api/user'

onMounted(() => {
  reqLogin({ username: 'admin', password: '123456' })
})

</script>

<style scoped lang="scss">
h1 {
  color: $baseColor;
}
</style>
