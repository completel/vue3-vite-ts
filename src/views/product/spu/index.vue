<template>
    <div>
        <!-- 三级分类 -->
        <Category :scene="scene"></Category>
        <el-card style="margin: 10px 0">
            <!-- v-if|v-show：都可以实现显示隐藏 -->
            <div v-show="scene == 0">
                <el-button @click="addSpu" type="primary" icon="Plus" :disabled="!categoryStore.c3Id">添加SPU</el-button>
                <!-- 展示已有的SPU数据 -->
                <el-table style="margin: 10px 0" border :data="records">
                    <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
                    <el-table-column label="SPU名称" prop="spuName"></el-table-column>
                    <el-table-column label="SPU描述" prop="description"></el-table-column>
                    <el-table-column label="SPU操作">
                        <template #="{ row }">
                            <el-button @click="addSku(row)" type="primary" icon="Plus" title="添加SKU"></el-button>
                            <el-button @click="updateSpu(row)" type="warning" icon="Edit" title="修改SKU"></el-button>
                            <el-button @click="findSku(row)" type="info" icon="View" title="查看SKU"></el-button>
                            <el-popconfirm @confirm="deleteSpu(row)" :title="`你确定要删除已有的${row.spuName}吗？`" width="200px">
                                <template #reference>
                                    <el-button type="danger" icon="Delete" title="删除SKU"></el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页器 -->
                <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
                    :background="true" layout="prev, pager, next, jumper, ->, sizes, total" :total="total"
                    @current-change="getHasSpu" @size-change="changeSize" />
            </div>
            <!-- 添加SKU|修改SPU子组件 -->
            <spu-form ref="spu" v-show="scene == 1" @changeScene="changeScene"></spu-form>
            <!-- 添加SKU的子组件 -->
            <sku-form ref="sku" v-show="scene == 2" @changeScene="changeScene"></sku-form>
            <!-- dialog对话框：展示已有的SKU数据 -->
            <el-dialog v-model="show" title="SPU列表">
                <el-table border :data="skuArr">
                    <el-table-column label="SKU名字" prop="skuName"></el-table-column>
                    <el-table-column label="SKU价格" prop="price"></el-table-column>
                    <el-table-column label="SKU重量" prop="weight"></el-table-column>
                    <el-table-column label="SKU图片">
                        <template #="{ row }">
                            <img :src="row.skuDefaultImg" style="height: 120px;" alt="">
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { reqHasSpu, reqSkuList, reqRemoveSpu } from '@/api/product/spu'
import type { HasSpuResponseData, Records, SpuData, SkuInfoData, SkuData } from '@/api/product/spu/type'
// 引入分类仓库
import useCategoryStore from '@/store/module/category'
// 引入子组件
import SkuForm from '@/views/product/spu/SkuForm.vue'
import SpuForm from '@/views/product/spu/SpuForm.vue'
import { ElMessage } from 'element-plus'

const categoryStore = useCategoryStore()
// 场景数据
let scene = ref<number>(0) //0：显示已有SPU 1：添加或者修改该已有SPU 2：添加SKU的结构
// 分页器默认页码
let pageNo = ref<number>(1)
// 每一页几条数据
let pageSize = ref<number>(3)
// 存储已有的SPU数据
let records = ref<Records>([])
// 存储已有SPU总个数
let total = ref<number>(0)
// 获取子组件实例
const spu = ref()
const sku = ref()
// 存储全部SKU的数据
const skuArr = ref<SkuData[]>([])
let show = ref<boolean>(false)

// 此方法执行：可以获取某一个三级分类下全部的已有的SPU
const getHasSpu = async (pager = 1) => {
    // 修改当前页码
    pageNo.value = pager
    const result: HasSpuResponseData = await reqHasSpu(pageNo.value, pageSize.value, categoryStore.c3Id)
    if (result.code == 200) {
        records.value = result.data.records
        total.value = result.data.total
    }
}
// 分页器下拉菜单发生变化的时候触发
const changeSize = () => {
    getHasSpu()
}
// 添加新的SPU的按钮的回调
const addSpu = () => {
    // 切换为场景1：添加与修改已有的SPU结构->SpuForm
    scene.value = 1
    // 点击添加SPU按钮，调用子组件的方法初始化数据
    spu.value.initAddSpu(categoryStore.c3Id)
}
interface ChangeScene {
    flag: number,
    params?: 'update' | 'add'
}
// 子组件spuForm绑定自定义事件：目前是让子组件通知父组件切换场景0
const changeScene = ({ flag, params }: ChangeScene) => {
    // 子组件SpuForm点击取消变为场景0，展示已有的SPU
    scene.value = flag
    if (params == 'update') {
        // 更新留在当前页
        getHasSpu(pageNo.value)
    } else {
        // 添加留在第一页
        getHasSpu()
    }

}
// 修改已有的SPU的按钮回调
const updateSpu = (row: SpuData) => {
    // 切换为场景1：添加与修改已有的SPU结构->SpuForm
    scene.value = 1
    // 调用子组件实例方法获取完整已有的SPU数据
    spu.value.initHasSpuData(row)
}
// 添加SKU按钮的回调
const addSku = (row: SpuData) => {
    // 点击添加SPU按钮切换场景2
    scene.value = 2
    // 调用子组件的方法初始化添加SKU的数据
    sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}
// 查看SKU列表的数据
const findSku = async (row: SpuData) => {
    const result: SkuInfoData = await reqSkuList(row.id as number)
    if (result.code == 200) {
        skuArr.value = result.data
        // 对话框显示
        show.value = true
    }
}
// 删除已有的SPU按钮回调
const deleteSpu = async (row: SpuData) => {
    const result = await reqRemoveSpu(row.id as number)
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '删除成功'
        })
        // 获取剩余SPU数量
        getHasSpu(records.value.length > 1 ? 1 : pageNo.value - 1)
    } else {
        ElMessage({
            type: 'error',
            message: '删除失败'
        })
    }
}

// 监听三级分类ID的变化
watch(() => categoryStore.c3Id, () => {
    // 务必保证有3级分类id
    if (!categoryStore.c3Id) return
    getHasSpu()
})

// 路由组件销毁前，仓库关于分类数据清掉
onBeforeUnmount(() => {
    categoryStore.$reset()
})

</script>

<style scoped></style>