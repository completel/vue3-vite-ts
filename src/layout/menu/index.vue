<template>
  <template v-for="item in menuList" :key="item.path">
    <!-- 没有子路由 -->
    <template v-if="!item.children">
      <!-- 这一块item.meta.hidden 类型未定义 前面加上! -->
      <el-menu-item v-if="!item.meta!.hidden" :index="item.path" @click="goRoute">
        <el-icon>
          <component :is="item.meta!.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.meta!.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 有子路由但是只有一个 -->
    <template v-if="item.children && item.children.length == 1">
      <el-menu-item v-if="!item.children[0].meta!.hidden" :index="item.children[0].path" @click="goRoute">
        <el-icon>
          <component :is="item.children[0].meta!.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.children[0].meta!.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 有子路由且个数大于一个 -->
    <el-sub-menu v-if="item.children && item.children.length > 1" :index="item.path">
      <template #title>
        <el-icon>
          <component :is="item.meta!.icon"></component>
        </el-icon>
        <span>{{ item.meta!.title }}</span>
      </template>
      <Menu :menuList="item.children"></Menu>
    </el-sub-menu>
  </template>
</template>

<script setup lang="ts" >
import { useRouter } from "vue-router"
import type { RouteRecordRaw } from "vue-router"

interface Routers {
  menuList: Array<RouteRecordRaw>
}
// 获取父组件传递过来的全部路由数据
defineProps<Routers>()

// 获取路由器对象
const $router = useRouter()

// 点击菜单的回调
const goRoute = (vc: { index: string; }) => {
  // 开启路由跳转
  $router.push(vc.index)
}

</script>

<script lang="ts">
export default {
  name: 'Menu'
}
</script>

<style scoped></style>