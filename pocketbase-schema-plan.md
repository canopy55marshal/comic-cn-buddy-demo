# 漫展搭子 PocketBase 数据表设计

## 目标
这份清单用于把当前 `漫展搭子` MVP 迁移到 `PocketBase`。

设计原则：
- 先保证 `预约 / 提醒 / 返程方案` 能跑通
- 前端尽量少改，保留现在的页面结构和 `api.js` 抽象层
- 数据结构优先面向 MVP，可后续扩展

---

## 推荐迁移顺序

### 第一阶段
- `users`
- `services`
- `service_bookings`
- `reminders`

### 第二阶段
- `queue_options`
- `queue_bookings`
- `travel_options`
- `user_travel_plans`

### 第三阶段
- `merchants`
- `orders`
- `buddy_posts`
- `buddy_invitations`
- `zones`
- `zone_spots`

---

## Collection 设计

## 1. `users`
类型：`auth collection`

用途：
- 当前用户
- 搭子身份基础信息
- 服务预约发起人
- 提醒归属人

字段：
- `nickname`
  - 类型：`text`
  - 必填：是
- `role`
  - 类型：`select`
  - 选项：`COSER`, `摄影`, `妆造`, `普通用户`
  - 必填：是
- `avatar`
  - 类型：`file`
  - 必填：否
- `tags`
  - 类型：`json`
  - 必填：否
- `currentZone`
  - 类型：`text`
  - 必填：否
- `creditScore`
  - 类型：`number`
  - 必填：否
  - 默认值：`100`
- `onlineStatus`
  - 类型：`select`
  - 选项：`在线`, `忙碌中`, `离线`
  - 必填：否
  - 默认值：`在线`

权限建议：
- 列表读取：只开放必要字段
- 单条读取：用户可读自己的完整记录
- 更新：只能更新自己的记录

---

## 2. `services`
用途：
- 化妆补妆
- 毛娘修假发
- 摄影预约
- 摄影分流

字段：
- `name`
  - `text`
  - 必填
- `category`
  - `select`
  - 选项：`化妆补妆`, `修假发`, `摄影预约`, `摄影分流`
  - 必填
- `eta`
  - `text`
  - 必填
- `priceText`
  - `text`
  - 必填
- `badge`
  - `text`
  - 必填
- `desc`
  - `editor` 或 `text`
  - 必填
- `zone`
  - `text`
  - 必填：否
- `status`
  - `select`
  - 选项：`可预约`, `繁忙`, `暂停`
  - 默认值：`可预约`
- `cover`
  - `file`
  - 必填：否

权限建议：
- 读：公开
- 写：管理员

---

## 3. `service_bookings`
用途：
- 存储用户的服务预约记录

字段：
- `user`
  - `relation -> users`
  - 必填
- `service`
  - `relation -> services`
  - 必填
- `slotTime`
  - `text`
  - 必填
- `contactName`
  - `text`
  - 必填
- `status`
  - `select`
  - 选项：`booked`, `completed`, `cancelled`
  - 默认值：`booked`
- `note`
  - `text`
  - 必填：否

权限建议：
- 创建：登录用户可创建自己的预约
- 读取：用户只能读取自己的记录
- 更新：管理员或服务端逻辑控制

---

## 4. `reminders`
用途：
- 用户自己的提醒项

字段：
- `user`
  - `relation -> users`
  - 必填
- `title`
  - `text`
  - 必填
- `timeText`
  - `text`
  - 必填
- `tag`
  - `select`
  - 选项：`妆造`, `摄影`, `交通`, `补给`
  - 必填
- `desc`
  - `text`
  - 必填
- `enabled`
  - `bool`
  - 默认值：`false`

权限建议：
- 创建：用户可创建自己的提醒
- 读取：仅自己可见
- 更新：仅自己可改

---

## 5. `queue_options`
用途：
- 展示可预约的排队项目
- 不存用户个人状态，只存公共项目

字段：
- `name`
  - `text`
  - 必填
- `area`
  - `text`
  - 必填
- `waitText`
  - `text`
  - 必填
- `slot`
  - `text`
  - 必填
- `statusText`
  - `text`
  - 必填
- `desc`
  - `text`
  - 必填
- `active`
  - `bool`
  - 默认值：`true`

权限建议：
- 读：公开
- 写：管理员

说明：
- 不建议把 `booked` 直接写在这张表里
- 用户是否预约，应该由 `queue_bookings` 决定

---

## 6. `queue_bookings`
用途：
- 记录用户预约了哪个排队项目

字段：
- `user`
  - `relation -> users`
  - 必填
- `queueOption`
  - `relation -> queue_options`
  - 必填
- `status`
  - `select`
  - 选项：`booked`, `arrived`, `cancelled`
  - 默认值：`booked`
- `bookingDate`
  - `date`
  - 必填：否

权限建议：
- 创建：登录用户可创建自己的预约
- 读取：用户只能读取自己的预约
- 更新：用户可取消；管理员可改状态

---

## 7. `travel_options`
用途：
- 公共返程方案池

字段：
- `title`
  - `text`
  - 必填
- `mode`
  - `select`
  - 选项：`拼车`, `地铁`, `打车`, `结伴`
  - 必填
- `eta`
  - `text`
  - 必填
- `cost`
  - `text`
  - 必填
- `desc`
  - `text`
  - 必填
- `active`
  - `bool`
  - 默认值：`true`

权限建议：
- 读：公开
- 写：管理员

---

## 8. `user_travel_plans`
用途：
- 存储每个用户当前选择的返程方案

字段：
- `user`
  - `relation -> users`
  - 必填
- `travelOption`
  - `relation -> travel_options`
  - 必填
- `selected`
  - `bool`
  - 默认值：`true`

权限建议：
- 创建：用户可创建自己的记录
- 读取：用户只能读取自己的记录
- 更新：用户只能更新自己的记录

建议：
- 一个用户最好只有一条当前有效方案
- 实现上可在前端或服务端保证“重新选择时先取消旧项”

---

## 9. `merchants`
用途：
- 补给商家列表

字段：
- `name`
- `category`
- `eta`
- `priceText`
- `score`
- `desc`
- `hotItem`
- `cover`
- `status`

字段类型建议：
- 文本类用 `text`
- `score` 用 `number`
- `cover` 用 `file`
- `status` 用 `select`

---

## 10. `orders`
用途：
- 存储补给订单

字段：
- `user`
  - `relation -> users`
- `merchant`
  - `relation -> merchants`
- `itemsJson`
  - `json`
- `status`
  - `select`
  - 选项：`已创建`, `正在制作`, `骑手取货中`, `已送达`, `已取消`
- `detail`
  - `text`
- `totalAmount`
  - `number`
- `deliveryZone`
  - `text`

---

## 11. `buddy_posts`
用途：
- 搭子需求发布

字段：
- `user`
  - `relation -> users`
- `purpose`
  - `select`
  - 选项：`逛摊+吃谷`, `摄影互拍`, `舞台活动`, `补给搭伴`, `逛摊+摄影`
- `timeSlot`
  - `text`
- `vibe`
  - `text`
- `tags`
  - `json`
- `intro`
  - `text`
- `zone`
  - `text`
- `status`
  - `select`
  - 选项：`open`, `matched`, `closed`

---

## 12. `buddy_invitations`
用途：
- 搭子邀请和回应

字段：
- `fromUser`
  - `relation -> users`
- `toUser`
  - `relation -> users`
- `message`
  - `text`
- `status`
  - `select`
  - 选项：`pending`, `accepted`, `rejected`

---

## 13. `zones`
用途：
- 场馆区域

字段：
- `name`
  - `text`
- `note`
  - `text`
- `crowdLevel`
  - `select`
  - 选项：`低`, `中`, `高`
- `sortOrder`
  - `number`

---

## 14. `zone_spots`
用途：
- 每个馆区的点位

字段：
- `zone`
  - `relation -> zones`
- `title`
  - `text`
- `tag`
  - `text`
- `desc`
  - `text`
- `type`
  - `select`
  - 选项：`补给`, `摄影`, `服务`, `休息`, `交通`
- `x`
  - `number`
  - 必填：否
- `y`
  - `number`
  - 必填：否

---

## 最小 MVP 必建表
如果你只想先把现在的产品跑起来，最少先建这 8 个：

- `users`
- `services`
- `service_bookings`
- `reminders`
- `queue_options`
- `queue_bookings`
- `travel_options`
- `user_travel_plans`

---

## 当前前端最适合先接的表
按你现有页面，优先接这几个：

- `services`
- `service_bookings`
- `reminders`
- `queue_options`
- `queue_bookings`
- `travel_options`
- `user_travel_plans`

这样你现在最有展示效果的功能，能最快切到 PocketBase。

---

## 权限规则建议

### 公开可读
- `services`
- `queue_options`
- `travel_options`
- `zones`
- `zone_spots`

### 登录后仅自己可读写
- `service_bookings`
- `reminders`
- `queue_bookings`
- `user_travel_plans`

### 带用户关系但需要有限公开
- `users`
- `buddy_posts`

建议只公开必要字段，不要把用户完整信息全部开放。

---

## 建议的下一步
建完 collection 后，下一步最适合做的是：

1. 先把 `api.js` 改成 PocketBase SDK 版本
2. 先接 `提醒 / 排队预约 / 返程方案`
3. 跑通后再迁 `服务预约`
4. 最后再迁 `订单 / 搭子 / 地图`
