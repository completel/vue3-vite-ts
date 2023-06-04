<template>
    <div>
        <el-card class="box-card">
            <!-- 卡片顶部添加品牌按钮 -->
            <el-button type="primary" icon="Plus" @click="addTrademark">添加品牌</el-button>
            <!-- 表格组件用于展示平台数据 -->
            <!-- 
            table
            ---border：可以设置表格纵向是否有边框
            table-column
            ---label：某一个列表
            ---width：设置这列宽度
            ---align：设置这一列对齐方式        
        -->
            <el-table border style="margin: 10px 0" :data="trademarkArr">
                <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
                <!-- table-column：默认展示数据用div -->
                <el-table-column label="品牌名称">
                    <template #="{ row }">
                        <span>{{ row.tmName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="品牌logo">
                    <template #="{ row }">
                        <img :src="newImgUrl(row)" style="height: 100px; width: 100px" />
                    </template>
                </el-table-column>
                <el-table-column label="品牌操作">
                    <template #="{ row }">
                        <el-button type="primary" icon="Edit" @click="updateTrademark(row)"></el-button>
                        <el-popconfirm :title="`你确定要删除已有品牌${row.tmName}吗？`" width="250px" icon="Delete"
                            @confirm="removeTrademark(row.id)">
                            <template #reference>
                                <el-button type="danger" icon="delete"></el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页器组件
                pagination
                v-model:current-page：设置分页器当前页码
                v-model:page-size：设置每页展示数据的条数
                :page-sizes：用于设置下拉菜单的数据
                :background：设置分页器按钮的背景颜色
                layout：可以设置分页器六个子组件布局调整
        -->
            <el-pagination @current-change="getHasTrademark" @size-change="sizeChange" v-model:current-page="pageNo"
                v-model:page-size="limit" :page-sizes="[3, 5, 7, 9, 11]" :pager-count="9" :background="true"
                layout="prev, pager, next, jumper, ->, sizes, total" :total="total" />
        </el-card>
        <!-- 对话款组件：再添加品牌与修改已有品牌业务的时候使用结构 -->
        <!-- 
        v-model:属性用户控制对话框的显示与隐藏 true显示 false隐藏
        title：设置对话框左上角标题
    -->
        <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id ? '修改品牌' : '添加品牌'">
            <el-form style="width: 80%" :model="trademarkParams" :rules="rules" ref="formRef">
                <el-form-item label="品牌名称" label-width="100px" prop="tmName">
                    <el-input placeholder="请您输入品牌名称" v-model="trademarkParams.tmName"></el-input>
                </el-form-item>
                <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
                    <!-- 
                    action：图片上传路径书写/api，代理服务武器不发送这次post请求
                -->
                    <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload" :show-file-list="false"
                        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
            </el-form>
            <!-- 具名插槽:footer -->
            <template #footer>
                <el-button type="primary" @click="confirm">确定</el-button>
                <el-button type="primary" @click="cancel">取消</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { reqHasTrademark, reqAddOrUpdateTrademark, reqDeleteTrademark } from '@/api/product/trademark/index'
import type { Records, TradeMarkResponseData, TradeMark, ResponseData } from '@/api/product/trademark/type'
import { ElMessage, UploadProps } from 'element-plus'

// 当前页码
let pageNo = ref<number>(1)
// 定义每一页展示多少条数据
let limit = ref<number>(3)
// 存储已有品牌数据总数
let total = ref<number>(0)
// 存储已有品牌的数据
let trademarkArr = ref<Records>()
// 控制对话框显示与隐藏
let dialogFormVisible = ref<boolean>(false)
// 定义收集新增品牌数据
let trademarkParams = reactive<TradeMark>({
    tmName: '',
    logoUrl: ''
})
// 获取el-form组件实例
let formRef = ref()

// 获取已有品牌的接口封装为一个函数：在任何情况下获取数据，调用函数即可
const getHasTrademark = async (pager = 1) => {
    pageNo.value = pager
    const result: TradeMarkResponseData = await reqHasTrademark(pageNo.value, limit.value)
    if (result.code == 200) {
        // 存储已有品牌总个数
        total.value = result.data.total
        trademarkArr.value = result.data.records
    }

}
// 分页器当前页码发生变化会被触发
// 对于当前组件页码发生变化自定义事件，组件pagination父组件回传了数据（当前的页码）
// const changePageNo = () => {
//     // 当前页码发生变化的时候再次发请求获取对应的已有品牌的数据
//     getHasTrademark()
// }
// 当下拉菜单发生变化的时候会触发此方法
// 这个自定义事件，分页器组件会将下拉惨淡选中数据返回
const sizeChange = () => {
    getHasTrademark()
}

// 添加品牌按钮的回调
const addTrademark = () => {
    // 对话框显示
    dialogFormVisible.value = true
    // 清除收集数据
    trademarkParams.logoUrl = ''
    trademarkParams.tmName = ''
    trademarkParams.id = 0
    // 第一种写法
    // formRef.value?.clearValidate('tmName')
    // formRef.value?.clearValidate('logoUrl')

    nextTick(() => {
        formRef.value.clearValidate('tmName')
        formRef.value.clearValidate('logoUrl')
    })
}
// 修改已有按钮的回调
const updateTrademark = (row: TradeMark) => {
    // 清空校验规则错误提示信息
    nextTick(() => {
        formRef.value.clearValidate('tmName')
        formRef.value.clearValidate('logoUrl')
    })
    // 对话框显示
    dialogFormVisible.value = true
    // 展示已有品牌的数据 ES6写法
    Object.assign(trademarkParams, row)
    // trademarkParams.logoUrl = row.logoUrl
    // trademarkParams.tmName = row.tmName
    // trademarkParams.id = row.id
}
// 对话框底部框隐藏
const cancel = () => {
    // 对话框隐藏
    dialogFormVisible.value = false
}
const confirm = async () => {
    try {
        // 在发起请求前，要对整个表单校验
        // 调用这个方法进行全部表单校验，如果表单校验全部通过，在执行后面语句
        await formRef.value.validate()
        const result = await reqAddOrUpdateTrademark(trademarkParams)
        // 添加品牌成功
        if (result.code == 200) {
            // 对话框隐藏
            dialogFormVisible.value = false
            // 弹出提示信息
            ElMessage({
                type: 'success',
                message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功'
            })
            // 再次发请求获取已有的全部品牌数据
            getHasTrademark(trademarkParams.id ? pageNo.value : 1)
        } else {
            // 添加品牌失败
            ElMessage({
                type: 'error',
                message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败'
            })
            dialogFormVisible.value = false
        }
    } catch (error) {
        ElMessage({
            type: 'warning',
            message: '记得添加图片logo'
        })
    }

}

// 上传图片组件->上传图片之前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    // 钩子是在图片上传成功之前触发，上传文件之前可以约束文件类型与大小
    // 要求：上传文件格式png|jpg|gif| 4M
    if (rawFile.type == 'image/png' || rawFile.type == 'image/jpeg' || rawFile.type == 'image/gif') {
        if (rawFile.size / 1024 / 1024 < 4) {
            return true
        } else {
            ElMessage({
                type: 'warning',
                message: '上传图片大小必须小于4MB'
            })
            return false
        }
    } else {
        ElMessage({
            type: 'warning',
            message: '上传文件格式务必是PNG|JPG|GIF格式'
        })
        return false
    }
}
// 图片上传成功的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
    // response：即为当前这次上传图片post请求服务器返回的数据
    // 收集上传图片的地址，添加一个新的品牌的时候带给服务器
    trademarkParams.logoUrl = response.data
    // 图片上传成功，清除掉对应图片校验结果
    formRef.value.clearValidate('logoUrl')
}

// 品牌自定义规则校验方法
const validatorTmName = (_: any, value: string, callback: any) => {
    // 是当表单元素触发blur的时候，会触发此方法
    // 自定义校验规则
    if (value.trim().length >= 2) {
        callback()
    } else {
        // 校验未通过返回的错误提示信息
        callback(new Error('品牌名称大于等于2位'))
    }
}
// 品牌logo图片的自定义校验规则方法
const validatorLogoUrl = (_: any, value: any, callback: any) => {
    // 如果图片上传
    if (value) {
        callback()
    } else {
        // 返回错误信息
        callback(new Error('logo图片必须上传'))
    }
}

// 表单校验规则对象
const rules = {
    tmName: [
        // required：这个字段务必校验，表单项前面出来五角星
        // trigger：代表触发校验规则时机[blur、 change]
        { required: true, trigger: 'blur', validator: validatorTmName }
    ],
    logoUrl: [{ required: true, validator: validatorLogoUrl }]
}

// 气泡确认框确定按钮回调
const removeTrademark = async (id: number) => {
    // 点击确定按钮删除已有品牌id
    const result: ResponseData = await reqDeleteTrademark(id)
    if (result.code == 200) {
        // 删除成功提示信息
        ElMessage({
            type: 'success',
            message: '删除品牌成功'
        })
        // 再次获取已有的信息
        getHasTrademark(trademarkArr.value!.length > 1 ? pageNo.value : pageNo.value - 1)
    } else {
        ElMessage({
            type: 'error',
            message: '删除品牌失败'
        })
    }
}

// 计算属性：如没有http前缀则在前面加上
const newImgUrl = computed(() => {
    return (row: TradeMark): string => {
        if (row.logoUrl == null) {
            return ''
        } else {
            return row.logoUrl.includes('http') ? row.logoUrl : `http://${row.logoUrl}`
        }
    }
})

// 组件挂载完毕钩子--发一次请求，获取第一页、一页3个数据
onMounted(() => {
    // 当前页码每一页的数据发生变化的时候，当前页码归1
    getHasTrademark()
})

</script>

<style scoped>
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>