<template>
    <div class="login_container">
        <el-row>
            <el-col :span="12" :xs="0"></el-col>
            <el-col :span="12" :xs="24">
                <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginForms">
                    <h1>Hello</h1>
                    <h2>欢迎来到这里~</h2>
                    <el-form-item prop="username">
                        <el-input :prefix-icon="User" v-model="loginForm.username"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" :prefix-icon="Lock" v-model="loginForm.password"
                            :show-password="true"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="default" class="login_btn" @click="login" :loading="loading">
                            登录
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElNotification, FormRules } from 'element-plus'
import useUserStore from '@/sotre/module/user'
import { User, Lock } from '@element-plus/icons-vue'
import { getTime } from '@/utils/time'

const loginForm = reactive({
    username: 'admin',
    password: '123456'
})

const useStore = useUserStore()
// 获取路由器
const $router = useRouter()
// 定义变量控制按钮加载效果
const loading = ref(false)
// 获取el-form组件
const loginForms = ref()

// 登录按钮的回调
const login = async () => {
    // 保证全部的表单项校验通过再发请求
    await loginForms.value.validate()
    // 开始加载
    loading.value = true
    // 点击登录需要做什么？
    // 通知仓库发登录请求
    // 请求成功跳转到首页->展示数据的地方
    // 请求失败->弹出登录失败的信息
    try {
        // 保证登陆成功
        await useStore.userLogin(loginForm)
        // 编程式导航
        $router.push('/')
        // 登录成功的提示信息
        ElNotification({
            type: 'success',
            message: `欢迎回来`,
            title: `Hi ${getTime()}好~`
        })
        // 登录成功加载效果也消失
        loading.value = false
    } catch (error) {
        // 登录失败加载效果小时
        loading.value = false
        // 登录失败的提示信息
        ElNotification({
            type: 'error',
            message: (error as Error).message
        })
    }

}

// 自定义校验规则函数
const validatorUserName = (_: any, value: any, callback: any) => {
    // rule：即为校验规则对象
    // value：即为表单元素文本内容
    // callback：如果符合条件callback放行通过
    // 如果不符合条件callback方法，注入错误提示信息
    if (value.length >= 5) {
        callback()
    } else {
        callback(new Error('账号长度至少五位'))
    }
}
const validatorPassword = (_: any, value: any, callback: any) => {
    if (value.length >= 6) {
        callback()
    } else {
        callback(new Error('密码长度至少六位'))
    }
}

// 定义表单校验需要配置的对象 FormRules 表单验证是类型，有提示
const rules = reactive<FormRules>({
    // 规则对象属性：required：代表这个字段务必要校验
    // min：文本长度至少多少位
    // max：文本长度最多多少位
    // message：错误提示信息
    // trigger：触发校验表单的时机 change->文本发生变化出发校验，blur：失去焦点时触发
    username: [
        // { required: true, message: '用户名不能为空', trigger: 'blur' },
        // { required: true, min: 4, max: 10, message: '账号长度至少6位', trigger: 'change' }
        { trigger: 'change', validator: validatorUserName }
    ],
    password: [
        // { required: true, min: 6, max: 15, message: '密码至少6位', trigger: 'change' }
        { trigger: 'change', validator: validatorPassword }
    ]
})

</script>

<style scoped lang="scss">
.login_container {
    width: 100%;
    height: 100vh;
    background: url('@/assets/images/background.jpg') no-repeat center;
    background-size: cover;

    .login_form {
        position: relative;
        top: 30vh;
        width: 80%;
        background: url('@/assets/images/login_form.png') no-repeat;
        background-size: cover;
        padding: 20px;

        h1 {
            color: #fff;
            font-size: 40px;
        }

        h2 {
            color: #fff;
            font-size: 20px;
            margin: 20px 0;
        }

        .login_btn {
            width: 100%;
        }
    }
}
</style>