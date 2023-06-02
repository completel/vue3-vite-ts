<template>
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
                <template #>
                    <el-button type="primary" icon="Edit" @click="updateTrademark"></el-button>
                    <el-button type="primary" icon="delete"></el-button>
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
    <el-dialog v-model="dialogFormVisible" title="添加品牌">
        <el-form style="width: 80%">
            <el-form-item label="品牌名称" label-width="80px">
                <el-input placeholder="请您输入品牌名称"></el-input>
            </el-form-item>
            <el-form-item label="品牌LOGO" label-width="80px">
                <el-upload class="avatar-uploader" action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                    :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
        </el-form>
        <!-- 具名插槽:footer -->
        <template #footer>
            <el-button type="primary" @click="cancel">取消</el-button>
            <el-button type="primary" @click="confirm">确定</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { reqHasTrademark } from '@/api/product/trademark/index'
import type { Records, TradeMarkResponseData, TradeMark } from '@/api/product/trademark/type'

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
}
// 修改已有按钮的回调
const updateTrademark = () => {
    // 对话框显示
    dialogFormVisible.value = true
}
// 对话框底部框隐藏
const cancel = () => {
    // 对话框隐藏
    dialogFormVisible.value = false
}
const confirm = () => {
    // 对话框隐藏
    dialogFormVisible.value = false
}

// 计算属性：如没有http前缀则在前面加上
const newImgUrl = computed(() => {
    return (row: TradeMark): string => {
        return row.logoUrl.includes('http') ? row.logoUrl : `http://${row.logoUrl}`
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