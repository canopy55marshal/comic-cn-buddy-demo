# 漫展搭子部署说明

## 目标
- 前端：部署到 `Cloudflare Pages`
- 后端：部署到一台 `VPS`
- 先用平台临时域名，不绑定自定义域名

---

## 一、前端部署到 Cloudflare Pages

### 1. 构建设置
- Framework preset：`Vite`
- Build command：`npm run build`
- Build output directory：`dist`
- Root directory：`/`

### 2. 环境变量
在 Cloudflare Pages 中配置：

```env
VITE_API_BASE=https://你的后端域名或IP/api
```

示例：

```env
VITE_API_BASE=http://123.123.123.123/api
```

如果后端已经配好域名，也可以填：

```env
VITE_API_BASE=https://api-demo.example.com/api
```

### 3. 前端上线前检查
- 确认 `src/services/api.js` 已使用 `VITE_API_BASE`
- 确认后端已允许 Cloudflare Pages 域名跨域

---

## 二、后端部署到 VPS

### 1. 推荐目录

```bash
/var/www/comic-con-buddy/backend
```

### 2. 上传后端代码
把 `backend/` 整个目录放到 VPS：

```bash
scp -r backend root@你的服务器IP:/var/www/comic-con-buddy/
```

### 3. 安装依赖

```bash
cd /var/www/comic-con-buddy/backend
npm install
```

### 4. 配置环境变量

复制：

```bash
cp .env.example .env
```

然后编辑 `.env`：

```env
PORT=3001
DATA_MODE=mock
FRONTEND_ORIGINS=https://你的cloudflare-pages地址
```

如果后面切数据库：

```env
DATA_MODE=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=你的密码
DB_NAME=comic_con_buddy
FRONTEND_ORIGINS=https://你的cloudflare-pages地址
```

如果 Cloudflare Pages 预览域名和正式域名都要放行，可以逗号分隔：

```env
FRONTEND_ORIGINS=https://xxx.pages.dev,https://yyy.pages.dev
```

### 5. 构建后端

```bash
npm run build
```

### 6. 使用 PM2 启动

全局安装：

```bash
npm install -g pm2
```

启动：

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

---

## 三、Nginx 反向代理

参考文件：
- `backend/nginx.conf.example`

把它复制到你的 Nginx 站点配置中，并改好域名或直接监听 IP。

重载：

```bash
nginx -t
systemctl reload nginx
```

---

## 四、如果启用 MySQL

### 1. 创建数据库并执行初始化脚本

```bash
mysql -u root -p
```

进入后：

```sql
source /var/www/comic-con-buddy/backend/sql/init.sql;
```

### 2. 改 `.env`

```env
DATA_MODE=mysql
```

### 3. 重启后端

```bash
pm2 restart comic-con-buddy-backend
```

---

## 五、当前代码已支持的部署能力

### 前端
- 通过 `VITE_API_BASE` 指向任意后端地址

### 后端
- 通过 `PORT` 指定监听端口
- 通过 `FRONTEND_ORIGINS` 配置允许跨域来源
- 支持 `mock` 和 `mysql` 两种模式

---

## 六、上线前最小检查清单

- 前端 `VITE_API_BASE` 已配置
- 后端 `.env` 已配置
- 后端 `npm run build` 通过
- 前端 `npm run build` 通过
- VPS 防火墙已放通 `80`
- 如果不直接暴露 `3001`，确保 Nginx 已代理 `/api`
- 如果切 MySQL，确认 `sql/init.sql` 已执行

---

## 七、我下一步还能继续做什么
如果你后面给我：
- Cloudflare Pages 项目访问
- VPS SSH 访问

我就可以继续帮你把部署真正落下去，而不只是停留在配置文件阶段。
