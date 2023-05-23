<template>
  <h1 class="box">hello world</h1>
</template>

<script setup lang="ts">
import request from './utils/request';
import { onMounted } from 'vue';

// 当组件挂在完毕
onMounted(() => {
  request({
    url: '/user/login',
    method: 'post',
    data: {
      username: 'admin',
      password: '123456'
    }
  }).then(res => console.log(res));

})
</script>

<style scoped lang="scss">
h1 {
  color: $baseColor;
}
</style>
