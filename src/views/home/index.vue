<template>
    <div>
        <el-card>
            <div class="box">
                <img :src="userStore.avatar" alt="" class="active">
                <div class="bottom">
                    <h3 class="title">{{ getTime() }}好{{ userStore.username }}</h3>
                    <p class="subtitle">{{ setting.title }}</p>
                </div>
            </div>
        </el-card>
        <div class="brand">
            <p>{{ yiyanData?.hitokoto }}</p>
            <p class="from">《{{ yiyanData?.from }}》</p>
        </div>
        <div class="icon">
            <svg-icon name="welcome" width="500px" height="500px"></svg-icon>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { reqYiYan } from '@/api/home'
// 引入用户相关的仓库，获取当前的头像和名称
import useUserStore from '@/store/module/user'
import { getTime } from '@/utils/time'
import setting from '@/setting'
import type { YiYanResponseData } from '@/api/home/type'

// 收集一言数据
const yiyanData = ref<YiYanResponseData>()
// 获取存储用户信息的仓库对象
const userStore = useUserStore()

// ikuuu一言接口
const getYiYan = async () => {
    try {
        const result = await reqYiYan()
        yiyanData.value = result
    } catch (error: any) {
        ElMessage({
            type: 'error',
            message: error
        })
    }
}

onMounted(() => {
    getYiYan()
})


</script>

<style scoped lang="scss">
.box {
    display: flex;

    .active {
        width: 100px;
        height: 100px;
        border-radius: 50%;
    }

    .bottom {
        margin-left: 20px;

        .title {
            font-size: 26px;
            font-weight: 600;
            margin-bottom: 30px;
        }

        .subtitle {
            color: skyblue;
            font-size: 20px;
            font-style: italic;
        }
    }


}

.brand {
    width: 350px;
    // height: 56px;
    font-size: 16px;
    font-family: "Nunito", "Segoe UI", arial;
    padding: 0 10px;
    margin-top: 20px;

    p {
        line-height: 28px;
    }

    .from {
        text-align: right;
        margin-top: 20px
    }
}

.icon {
    display: flex;
    justify-content: center;
}
</style>