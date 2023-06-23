<template>
    <el-form label-width="100px">
        <el-form-item label="SKU名称">
            <el-input v-model="skuParams.skuName" placeholder="SKU名称"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)">
            <el-input v-model="skuParams.price" type="number" placeholder="价格(元)"></el-input>
        </el-form-item>
        <el-form-item label="重量(g)">
            <el-input v-model="skuParams.weight" type="number" placeholder="重量(g)"></el-input>
        </el-form-item>
        <el-form-item label="SKU描述">
            <el-input v-model="skuParams.skuDes" type="textarea" placeholder="重量SKU描述"></el-input>
        </el-form-item>
        <el-form-item label="平台属性">
            <el-form :inline="true" label-width="60px">
                <el-form-item v-for="item in attrArr" :key="item.id" :label="item.attrName">
                    <el-select v-model="item.attrIdAndValueId">
                        <el-option :value="`${item.id}:${attrValue.id}`" v-for="attrValue in item.attrValueList"
                            :key="attrValue.id" :label="attrValue.valueName"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-form-item>
        <el-form-item label="销售属性">
            <el-form :inline="true" label-width="60px">
                <el-form-item v-for="item in saleAttr" :key="item.id" :label="item.saleAttrName">
                    <el-select v-model="item.saleIdAndValueId">
                        <el-option :value="`${item.id}:${saleAttrValue.id}`"
                            v-for="saleAttrValue in item.spuSaleAttrValueList" :key="saleAttrValue.id"
                            :label="saleAttrValue.saleAttrValueName"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-form-item>
        <el-form-item label="图片名称">
            <el-table border :data="imgArr" ref="table">
                <el-table-column type="selection" width="80px" align="center"></el-table-column>
                <el-table-column label="图片">
                    <template #="{ row }">
                        <img :src="row.imgUrl" style="height: 150px;" alt="">
                    </template>
                </el-table-column>
                <el-table-column label="名称" prop="imgName"></el-table-column>
                <el-table-column label="操作">
                    <template #="{ row }">
                        <el-button type="primary" @click="handler(row)">设置默认</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="save">保存</el-button>
            <el-button type="primary" @click="cancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
// 引入请求API
import { reqAttr } from '@/api/product/attr'
import { reqSpuImageList, reqSpuHasSaleAttr, reqAddSku } from '@/api/product/spu'
import type { SpuData, SaleAttr, SpuImg, SkuData } from '@/api/product/spu/type'
import { Attr } from '@/api/product/attr/type'
import { ElMessage } from 'element-plus'

// 品牌属性
const attrArr = ref<Attr[]>([])
// 销售属性
const saleAttr = ref<SaleAttr[]>([])
// 照片墙的数据
const imgArr = ref<SpuImg[]>([])
// 收集SKU的参数
const skuParams = reactive<SkuData>({
    // 父组件传递过来的数据
    category3Id: '', // 三级分类ID
    spuId: '', // 已有的SPU的ID
    tmId: '', // SKU品牌的ID
    // 通过v-model收集
    skuName: '', // SKU名字
    price: '', // SKU价格
    weight: '', // SKU重量
    skuDes: '', // SKU描述
    skuAttrValueList: [], // 平台属性的收集
    skuSaleAttrValueList: [], // 销售属性
    skuDefaultImg: '' // SKU图片地址
})
// 获取table实例对象
const table = ref()

const $emit = defineEmits(['changeScene'])

// 取消按钮的回调
const cancel = () => {
    $emit('changeScene', { flag: 0 })
}

// 定义子组件的方法对外暴露
const initSkuData = async (c1Id: number, c2Id: number, spu: SpuData) => {
    // 收集数据
    skuParams.category3Id = spu.category3Id
    skuParams.spuId = spu.id as number
    skuParams.tmId = spu.tmId
    // 获取平台属性
    const result = await reqAttr(c1Id, c2Id, spu.category3Id)
    // 获取对应的销售属性
    const result1 = await reqSpuHasSaleAttr(spu.id as number)
    // 获取照片墙的数据
    const result2 = await reqSpuImageList(spu.id as number)
    // 品牌属性
    attrArr.value = result.data
    // 销售属性
    saleAttr.value = result1.data
    // 图片
    imgArr.value = result2.data
}
// 设置默认图片回调
const handler = (row: SpuImg) => {
    // 点击的时候让全部的复选框都不勾选
    imgArr.value.forEach(item => {
        table.value.toggleRowSelection(item, false)
    })
    // 复选框选中
    table.value.toggleRowSelection(row, true)
    skuParams.skuDefaultImg = row.imgUrl as string
}
// 保存按钮的回调
const save = async () => {
    // 整理参数
    // 平台属性
    skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next) => {
        if (next.attrIdAndValueId) {
            const [attrId, valueId] = next.attrIdAndValueId.split(':')
            prev.push({
                attrId,
                valueId
            })
            return prev
        }
    }, [])
    // 销售属性
    skuParams.skuSaleAttrValueList = saleAttr.value.reduce((prev: any, next) => {
        if (next.saleAttrValueId) {
            const [saleAttrId, saleAttrValueId] = next.saleIdAndValueId!.split(':')
            prev.push({
                saleAttrId,
                saleAttrValueId
            })
        }
        return prev
    }, [])
    // 添加SKU的请求
    const result = await reqAddSku(skuParams)
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '添加SKU成功'
        })
        // 通知父组件切换场景为0
        $emit('changeScene', { flag: 0 })
    } else {
        ElMessage({
            type: 'error',
            message: '添加SKU失败'
        })
    }
}

defineExpose({ initSkuData })

</script>

<style scoped></style>