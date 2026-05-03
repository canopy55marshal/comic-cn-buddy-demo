# 漫展搭子后端 MVP

这是一个基于 `NestJS + MySQL` 设计的后端 MVP。

当前提供两种运行模式：

- `mock`：默认模式，不依赖本地 MySQL，适合当前直接启动接口联调
- `mysql`：连接真实 MySQL，执行 `sql/init.sql` 后可切换到数据库模式

## 启动方式

1. 安装依赖

```bash
npm install
```

2. 复制环境变量

```bash
cp .env.example .env
```

3. 启动开发服务

```bash
npm run start:dev
```

默认地址：

- `http://127.0.0.1:3001`

## 数据模式

`.env` 中：

```env
DATA_MODE=mock
```

切到 MySQL 时：

```env
DATA_MODE=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=comic_con_buddy
```

然后执行：

```sql
source sql/init.sql;
```

## 已实现接口

### 基础

- `GET /api/health`
- `GET /api/overview`

### 补给订单

- `GET /api/merchants?category=奶茶`
- `GET /api/orders`
- `POST /api/orders`

示例：

```json
{
  "merchantName": "樱桃汽泡补给站",
  "items": ["桃桃气泡波波", "便携补给包"],
  "totalAmount": 58
}
```

### 搭子匹配

- `GET /api/buddies?purpose=摄影互拍`
- `POST /api/invitations`

示例：

```json
{
  "buddyName": "阿澄",
  "message": "下午一起去 B 馆互拍吗？"
}
```

### 妆造服务预约

- `GET /api/services?category=补妆`
- `POST /api/bookings`

示例：

```json
{
  "serviceName": "北门闪修补妆站",
  "contactName": "测试用户",
  "slotTime": "2026-05-03 14:30"
}
```

### 排队预约 / 智能提醒 / 交通出行

- `GET /api/queue-options`
- `POST /api/queue-bookings`
- `GET /api/reminders`
- `POST /api/reminders/toggle`
- `GET /api/travel-options`
- `POST /api/travel/select`

示例：

```json
{
  "queueId": 1
}
```

```json
{
  "reminderId": 2
}
```

```json
{
  "travelId": 2
}
```

### 场馆地图

- `GET /api/zones`
- `GET /api/zones/A馆主舞台/spots`
- `GET /api/map/search?q=上海国家会展中心`

## 当前 MVP 的定位

这版后端优先打通 4 条业务链路：

- 补给订单
- 搭子匹配
- 妆造服务预约
- 场馆地图点位

并继续补齐：

- 排队预约
- 智能提醒
- 交通出行

同时按你的要求，用户体系优先做成：

- 轻用户池
- 轻社交
- 可交易
- 可评价

暂不做完整内容社区。
