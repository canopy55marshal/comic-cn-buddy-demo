# CPS后台表字段说明

## 用途
用于配置餐饮页中的 `外部CPS券卡` 展示内容，支持后台录入后前台直接渲染。

## 建议字段

| 字段名 | 类型 | 是否必填 | 说明 | 示例 |
|---|---|---|---|---|
| `id` | string / number | 是 | 唯一ID | `mt_kfg_001` |
| `type` | string | 是 | 固定填 `cps`，前台据此识别为券卡 | `cps` |
| `name` | string | 是 | 商家名 | `真功夫` |
| `title` | string | 是 | 券标题/套餐标题 | `冬菇鸡蒸蛋汤套餐兑换券` |
| `category` | string | 是 | 分类，用于前台筛选 | `主食` |
| `eta` | string | 否 | 可用范围或补充标签 | `多店可用` |
| `price` | string | 是 | 当前价 | `￥20.9` |
| `marketPrice` | string | 否 | 门市价/原价 | `￥46` |
| `score` | string | 否 | 可填平台标识或评分 | `CPS` |
| `desc` | string | 否 | 文案说明 | `测试用美团 CPS 券卡...` |
| `hot` | string | 否 | 前台可作为副标签 | `套餐兑换券` |
| `vendor` | string | 是 | 平台来源 | `美团CPS` |
| `ctaLabel` | string | 是 | 主按钮文案 | `去美团下单` |
| `orderLink` | string | 是 | 外部下单链接 | `http://dpurl.cn/3kLbuKrz` |
| `commandText` | string | 否 | 团口令整段文本 | `1来美团...` |
| `multiStore` | boolean | 否 | 是否多店可用 | `true` |
| `coverTitle` | string | 否 | 券卡封面主标题 | `冬菇鸡蒸蛋汤套餐` |
| `coverLabel` | string | 否 | 券卡封面副标题 | `兑换券 · 1张` |
| `status` | string | 否 | 上下架状态 | `online` |
| `sort` | number | 否 | 排序值，越小越靠前 | `10` |

## 推荐最小可用结构

```json
{
  "id": "mt_kfg_001",
  "type": "cps",
  "name": "真功夫",
  "title": "冬菇鸡蒸蛋汤套餐兑换券",
  "category": "主食",
  "eta": "多店可用",
  "price": "￥20.9",
  "marketPrice": "￥46",
  "vendor": "美团CPS",
  "ctaLabel": "去美团下单",
  "orderLink": "http://dpurl.cn/3kLbuKrz",
  "commandText": "1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰trYmY3MGQ3M2Y💰",
  "multiStore": true,
  "coverTitle": "冬菇鸡蒸蛋汤套餐",
  "coverLabel": "兑换券 · 1张"
}
```

## 前台展示逻辑

1. `type = cps` 的记录显示在 `外部CPS券卡` 分组
2. `category` 决定是否在当前筛选下显示
3. `orderLink` 用于跳转外部平台
4. `commandText` 用于复制团口令
5. `coverTitle / coverLabel` 用于生成券卡封面区
6. `vendor / multiStore / marketPrice` 用于辅助标签和卖点展示

## 回流承接建议

前台用户跳转下单后，建议记录：

- `merchantName`
- `title`
- `orderLink`
- `pickupPoint`
- `returnStatus`
- `returnSteps`

这样用户返回应用后，可以继续完成：

1. 确认取餐点
2. 设置取餐提醒
3. 回地图确认路线
