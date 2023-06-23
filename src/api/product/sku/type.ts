export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}

// 定义SKU对象的TS类型
export interface Attr {
    attrId: number | string, // 平台属性的ID
    valueId: number | string,// 属性值ID
    id?: number,
    valueName?: string
}
export interface SaleAttr {
    saleAttrId: number | string, // 属性ID
    saleAttrValueId: number | string, // 属性值ID
    saleIdAndValueId?: string,
    id?: number,
    saleAttrName?: string
}
export interface SkuImg {
    id?: number,
    imgUrl: string
}
export interface SkuData {
    category3Id?: number | string, // 三级分类ID
    spuId?: number | string, // 已有的SPU的ID
    tmId?: number | string, // SKU品牌的ID
    skuName?: string, // SKU名字
    price?: number | string, // SKU价格
    weight?: number | string, // SKU重量
    skuDes?: string, // SKU描述
    skuAttrValueList?: Attr[], // 平台属性的收集
    skuSaleAttrValueList?: SaleAttr[],// 销售属性
    skuDefaultImg?: string, // SKU图片地址
    isSale?: number, // 控制商品上架和下架
    id?: number,
    skuDesc?: string,
    skuImageList?: SkuImg[]
}

// 获取SKU接口返回的数据ts类型
export interface SkuResponseData extends ResponseData {
    data: {
        records: SkuData[],
        total: number,
        size: number,
        current: number,
        orders: [],
        optimizeCounSql: boolean,
        hitCount: false,
        countId: null,
        maxLimit: null,
        searchCount: boolean,
        pages: number
    }
}

// 获取SKU商品详情的接口类型
export interface SkuInfoData extends ResponseData {
    data: SkuData
}