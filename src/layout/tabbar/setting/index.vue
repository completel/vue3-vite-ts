<template>
    <el-button size="small" icon="Refresh" circle @click="updateRefsh"></el-button>
    <el-button size="small" icon="FullScreen" circle @click="fullScreen"></el-button>
    <el-popover placement="bottom" title="主题设置" :width="300" trigger="hover">
        <!-- 表单元素 -->
        <el-form>
            <el-form-item label="主题颜色">
                <el-color-picker v-model="color" @change="getColor" show-alpha :predefine="predefineColors" />
            </el-form-item>
            <el-form-item label="暗黑模式">
                <el-switch v-model="dark" inline-prompt active-icon="MoonNight" inactive-icon="Sunny"
                    @change="changeDark" />
            </el-form-item>
        </el-form>
        <template #reference>
            <el-button size="small" icon="setting" circle></el-button>
        </template>
    </el-popover>
    <img :src="userStore.avatar" class="userAvatar">
    <!-- 下拉菜单 -->
    <el-dropdown>
        <span class="el-dropdown-link">
            {{ userStore.username }}
            <el-icon class="el-icon--right">
                <arrow-down />
            </el-icon>
        </span>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
// 获取骨架的小仓库
import useLayOutSettingStore from '@/store/module/settins'
// 获取用户相关的小仓库
import useUserStore from '@/store/module/user'

// 使用小仓库
const layoutSettingStore = useLayOutSettingStore()
const userStore = useUserStore()
// 获取路由器对象
const $router = useRouter()
// 获取路由对象
const $route = useRoute()
// 默认颜色
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#90ee90',
    '#00ced1',
    '#1e90ff',
    '#c71585',
    'rgba(255, 69, 0, 0.68)',
    'rgb(255, 120, 0)',
    'hsv(51, 100, 98)',
    'hsva(120, 40, 94, 0.5)',
    'hsl(181, 100%, 37%)',
    'hsla(209, 100%, 56%, 0.73)',
    '#c7158577',
])
// 收集开关数据
const dark = ref<boolean>(false)

// 刷新按钮点击事件
const updateRefsh = () => {
    layoutSettingStore.refsh = !layoutSettingStore.refsh
}
// 全屏按钮点击的回调
const fullScreen = () => {
    // DOM对象的一个属性：可以用来判断当前是不是全屏模式[全屏:true，不是全屏:false]
    let full = document.fullscreenElement
    // 切换全屏格式
    if (!full) {
        // 利用文档根节点方法requestFullscreen，实现全屏模式
        document.documentElement.requestFullscreen();
    } else {
        // 变为不是全屏模式->退出全屏模式
        document.exitFullscreen();
    }
}
// 退出登录点击的回调
const logout = async () => {
    // 第一件事：需要向服务器发请求[退出登录接口]
    // 第二件事：仓库当中关于用于相关的数据清空[token|username|avatar]
    // 第三件事：跳转到登录页面
    await userStore.userLogout()
    // 跳转登录页面
    $router.push({
        name: 'login',
        query: { redirect: $route.path }
    })
}
// switch开关的change事件进行暗黑模式的切换
const changeDark = () => {
    // 获取HTML根节点
    const html = document.querySelector('html') as HTMLElement
    // 判断HTML标签是否有类目 dark
    dark.value ? html.className = 'dark' : html.className = ''
}
// 主题颜色的设置
const getColor = () => {
    // 通过js修改根节点的样式对象的属性与属性值
    const html = document.documentElement
    html.style.setProperty('--el-color-primary', color.value)
}

</script>

<script lang="ts">
export default {
    name: 'Setting'
}
</script>

<style scoped lang="scss">
.userAvatar {
    width: 24px;
    height: 24px;
    margin: 0 10px;
    border-radius: 50%;
}
</style>