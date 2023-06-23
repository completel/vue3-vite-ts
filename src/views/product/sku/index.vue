<template>
    <el-card>
        <el-table border style="margin: 10px;" :data="skuArr">
            <el-table-column label="序号" type="index" width="80px"></el-table-column>
            <el-table-column label="名称" show-overflow-tooltip width="200px" prop="skuName"></el-table-column>
            <el-table-column label="描述" show-overflow-tooltip prop="skuDesc"></el-table-column>
            <el-table-column label="默认图片" width="200px">
                <template #="{ row }">
                    <img :src="row.skuDefaultImg" style="height: 150px; width: 150px" alt="">
                </template>
            </el-table-column>
            <el-table-column label="重量" width="150px" prop="weight"></el-table-column>
            <el-table-column label="价格" width="150px" prop="price"></el-table-column>
            <el-table-column label="操作" width="300px" fixed="right">
                <template #="{ row }">
                    <el-button type="primary" :icon="row.isSale == 1 ? 'Bottom' : 'Top'"
                        @click="updateSale(row)"></el-button>
                    <el-button type="warning" icon="Edit" @click="updateSku"></el-button>
                    <el-button type="info" icon="InfoFilled" @click="findSku(row)"></el-button>
                    <el-popconfirm :title="`你确定要删除${row.skuName}吗？`" width="200px" @confirm="removeSku(row.id)">
                        <template #reference>
                            <el-button type="danger" icon="Delete"></el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <div class="demo-pagination-block">
            <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
                :background="true" layout="prev, pager, next, jumper, ->, sizes, total" :total="total"
                @current-change="getHasSku" @size-change="handler" />
        </div>
        <!-- 抽屉组件 -->
        <el-drawer v-model="drawer">
            <!-- 标题部分 -->
            <template #header>
                <h4>查看商品详情</h4>
            </template>
            <template #default>
                <el-row style="margin: 10px 0">
                    <el-col :span="6">名称</el-col>
                    <el-col :span="18">{{ skuInfo.skuName }}</el-col>
                </el-row>
                <el-row style="margin: 10px 0">
                    <el-col :span="6">描述</el-col>
                    <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
                </el-row>
                <el-row style="margin: 10px 0">
                    <el-col :span="6">价格</el-col>
                    <el-col :span="18">{{ skuInfo.price }}</el-col>
                </el-row>
                <el-row style="margin: 10px 0">
                    <el-col :span="6">平台属性</el-col>
                    <el-col :span="18">
                        <el-tag style="margin: 0 10px 0 0" v-for="item in skuInfo.skuAttrValueList" :key="item.id">
                            {{ item.valueName }}
                        </el-tag>
                    </el-col>
                </el-row>
                <el-row style="margin: 10px 0">
                    <el-col :span="6">销售属性</el-col>
                    <el-col :span="18">
                        <el-tag type="success" style="margin: 0 10px 0 0" v-for="item in skuInfo.skuSaleAttrValueList"
                            :key="item.id">{{ item.saleAttrName }}</el-tag>
                    </el-col>
                </el-row>
                <el-row style="margin: 10px 0">
                    <el-col :span="6">商品图片</el-col>
                    <el-col :span="18">
                        <el-carousel type="card" indicator-position="outside">
                            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                                <img :src="item.imgUrl" style="width:100%;height: 100%" alt="">
                            </el-carousel-item>
                        </el-carousel>
                    </el-col>
                </el-row>
            </template>
            <template #footer>
                <div style="flex: auto">
                    see you bye bye
                </div>
            </template>
        </el-drawer>
    </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { reqSkuList, reqSaleSku, reqCancelSale, reqSkuInfo, reqRemoveSku } from '@/api/product/sku'
import type { SkuData } from '@/api/product/sku/type'

// 分页器当前页码
let pageNo = ref<number>(1)
// 每一页展示几条数据
let pageSize = ref<number>(10)
let total = ref<number>()
const skuArr = ref<SkuData[]>([])
// 控制抽屉显示与隐藏
let drawer = ref<boolean>(false)
const skuInfo = ref<SkuData>({})

// 分页器下拉菜单发生变化时触发
const handler = () => {
    getHasSku()
}
// 商品上架与下架的操作
const updateSale = async (row: SkuData) => {
    // 如果当前的商品 isSale == 1 说明当前商品是上架状态->更新为下架
    // 否则else情况，如上方情况相反
    if (row.isSale == 1) {
        // 下架操作
        await reqCancelSale(row.id as number)
        // 提示信息
        ElMessage({
            type: 'success',
            message: '下架成功'
        })
        // 发请求获取当前更新完毕的全部已有sku
        getHasSku(pageNo.value)
    } else {
        await reqSaleSku(row.id as number)
        // 提示信息
        ElMessage({
            type: 'success',
            message: '上架成功'
        })
        // 发请求获取当前更新完毕的全部已有sku
        getHasSku(pageNo.value)
    }
}
// 更新已有的SKU
const updateSku = () => {
    ElMessage({
        type: 'success',
        message: '程序员在努力研发中~'
    })
}
// 查看商品详情按钮的回调
const findSku = async (row: SkuData) => {
    // 抽屉展示出来
    drawer.value = true
    // 获取已有的商品详情信息
    const result = await reqSkuInfo(row.id as number)
    skuInfo.value = result.data
}
// 删除某一个已有的商品
const removeSku = async (id: number) => {
    // 删除某一个已有的商品情况
    const result = await reqRemoveSku(id)
    if (result.code == 200) {
        // 提示信息
        ElMessage({
            type: 'success',
            message: '删除成功'
        })
        // 获取已有的数据
        getHasSku(skuArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
    } else {
        ElMessage({
            type: 'error',
            message: result.message
        })
        // 获取已有的数据
        getHasSku(skuArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
    }
}

// 更新数据
const getHasSku = async (pager = 1) => {
    // 当前分页器页码
    pageNo.value = pager
    const result = await reqSkuList(pageNo.value, pageSize.value)
    if (result.code == 200) {
        total.value = result.data.total
        skuArr.value = result.data.records
    }
}
// 组件挂在完毕
onMounted(() => {
    getHasSku()
})

</script>

<style scoped>
.el-carousel__item h3 {
    display: flex;
    color: #475669;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}
</style>