export const navItems = [
  { key: "home", label: "首页", group: "main" },
  { key: "food", label: "吃谷补给", group: "main" },
  { key: "map", label: "场馆地图", group: "main" },
  { key: "buddy", label: "好友同行", group: "main" },
  { key: "service", label: "妆造服务", group: "main" },
  { key: "business", label: "商业平台", group: "extended" },
  { key: "live", label: "直播链接", group: "extended" },
  { key: "queue", label: "排队预约", group: "extended" },
  { key: "reminder", label: "智能提醒", group: "extended" },
  { key: "travel", label: "交通出行", group: "extended" }
];

export const foodCategories = ["全部", "奶茶", "主食", "甜品", "应急用品"];

export const merchants = [
  { type: "normal", name: "樱桃汽泡补给站", category: "奶茶", eta: "18 分钟送达", price: "￥22 起", score: "4.9", desc: "高颜值奶茶和应援杯套，适合边逛边拿。", hot: "桃桃气泡波波" },
  {
    type: "cps",
    name: "真功夫",
    title: "冬菇鸡蒸蛋汤套餐兑换券",
    category: "主食",
    eta: "多店可用",
    price: "￥20.9",
    marketPrice: "￥46",
    score: "CPS",
    desc: "测试用美团 CPS 券卡，后续可以由后台表统一填入并渲染到前台。",
    hot: "套餐兑换券",
    vendor: "美团CPS",
    ctaLabel: "去美团下单",
    orderLink: "http://dpurl.cn/3kLbuKrz",
    commandText: "1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰trYmY3MGQ3M2Y💰",
    multiStore: true
  },
  { type: "normal", name: "次元便当研究所", category: "主食", eta: "26 分钟送达", price: "￥34 起", score: "4.8", desc: "热食便当、饭团和意面，适合长线逛展补充体力。", hot: "照烧鸡排饭团" },
  { type: "normal", name: "喵团烘焙屋", category: "甜品", eta: "20 分钟送达", price: "￥18 起", score: "4.7", desc: "适合拍照打卡的轻甜品和奶油卷。", hot: "草莓奶盖卷" },
  { type: "normal", name: "应援急救小铺", category: "应急用品", eta: "12 分钟送达", price: "￥9 起", score: "4.9", desc: "补妆棉签、发夹、充电线、防走光贴一站补齐。", hot: "便携定妆补给包" },
  { type: "normal", name: "狐火乌冬车", category: "主食", eta: "24 分钟送达", price: "￥29 起", score: "4.6", desc: "热乌冬和炸物套餐，适合快速暖胃。", hot: "咖喱炸鸡乌冬" },
  { type: "normal", name: "星野冰饮站", category: "奶茶", eta: "16 分钟送达", price: "￥19 起", score: "4.8", desc: "低糖果茶更适合长时间带妆。", hot: "柚见星河果茶" }
];

export const orders = [
  { name: "樱桃汽泡补给站", status: "正在制作", detail: "桃桃气泡波波 ×2，预计送达 A 馆西侧休息区" },
  { name: "应援急救小铺", status: "骑手取货中", detail: "便携定妆补给包 ×1，预计送达 2 号服务台" },
  { name: "次元便当研究所", status: "可再次下单", detail: "上次购买照烧鸡排饭团，推荐复购套餐减 6 元" }
];

export const zones = [
  {
    name: "A馆主舞台",
    note: "活动密度最高，适合优先看舞台和官方互动，当前人流较高。",
    spots: [
      { title: "官方主舞台", tag: "排队 18 分钟", text: "签售、互动演出与主舞台活动集中在这里。" },
      { title: "饮品补给点", tag: "配送点", text: "支持奶茶与轻食自提，也是搭子集合的热门点。" },
      { title: "快速补妆位", tag: "空位 3 个", text: "补妆镜、插座和应急用品比较齐全。" },
      { title: "谷子热门摊位", tag: "热门", text: "高流量摊位集中，建议早去或错峰。" }
    ]
  },
  {
    name: "B馆摄影区",
    note: "适合摄影和约拍，主通道容易拥堵，建议按拍摄时段分流。",
    spots: [
      { title: "主摄影棚入口", tag: "拥堵", text: "人流高峰建议先预约摄影再入场。" },
      { title: "侧馆空景区", tag: "推荐", text: "更适合拍单人和双人，背景干净。" },
      { title: "摄影师集合点", tag: "在线 22 人", text: "可以现场匹配空闲摄影师和返图风格。" },
      { title: "发型急救台", tag: "等待 10 分钟", text: "适合拍摄前处理毛娘前额和发尾。" }
    ]
  },
  {
    name: "C馆同人摊位",
    note: "适合买本、逛摊和交换无料，建议提前收藏目标摊位。",
    spots: [
      { title: "同人本岛区", tag: "高热", text: "热门摊位集中，容易形成短时拥堵。" },
      { title: "无料交换台", tag: "轻社交", text: "适合搭子之间交换物料和同好认识。" },
      { title: "休息补给区", tag: "低人流", text: "适合短暂停留吃东西和整理战利品。" },
      { title: "寄存服务点", tag: "推荐", text: "买本较多时可先寄存，减轻负重。" }
    ]
  },
  {
    name: "北门服务区",
    note: "应急服务最集中，适合入场前后做妆造、物资和返程处理。",
    spots: [
      { title: "补妆快修站", tag: "等待 8 分钟", text: "适合脱妆、睫毛开胶、局部修容补救。" },
      { title: "毛娘修复点", tag: "等待 12 分钟", text: "假发乱翘、发包松动可快速处理。" },
      { title: "返程拼车点", tag: "散场必看", text: "可临时组车，降低打车难度。" },
      { title: "应援补给车", tag: "热卖", text: "售卖充电宝、雨衣、小风扇等应急物品。" }
    ]
  }
];

export const buddyFilterOptions = ["全部", "门票同行", "补给拼单", "返程同行", "主播行程", "同IP邀约"];

export const buddies = [
  { name: "宿舍群同行邀约", purpose: "门票同行", role: "熟人分享", time: "已邀请 3 人", vibe: "分享裂变", tags: ["同宿舍", "一起进场", "组队奖励"], intro: "适合先拉熟人一起进场和打卡，人数越多越容易解锁同行礼包和现场权益。" },
  { name: "同IP群拼单补给", purpose: "补给拼单", role: "熟人分享", time: "已邀请 2 人", vibe: "降低单人成本", tags: ["同IP", "奶茶拼单", "场内配送"], intro: "适合把熟悉的同IP朋友拉进来一起拼单补给，省配送费也更方便统一取餐。" },
  { name: "散场返程邀约", purpose: "返程同行", role: "熟人分享", time: "已邀请 4 人", vibe: "返程优先", tags: ["返程", "拼车", "地铁"], intro: "先分享给熟人同行群，散场前就把返程路线和拼车关系锁好，减少最后阶段的混乱。" },
  { name: "主播行程共看", purpose: "主播行程", role: "熟人分享", time: "已邀请 1 人", vibe: "共同追更", tags: ["主播行程", "直播提醒", "顺路转场"], intro: "适合把你关注的主播直播安排分享给熟人，一起决定要不要去看和怎么转场。" },
  { name: "同IP打卡邀约", purpose: "同IP邀约", role: "熟人分享", time: "已邀请 5 人", vibe: "仪式感更强", tags: ["同IP", "拍照打卡", "组队成就"], intro: "适合同IP好友一起打卡、一起拍照，再配合同行激励做轻裂变传播。" }
];

export const serviceCategories = ["全部", "化妆补妆", "修假发", "摄影预约", "摄影分流"];

export const queueOptions = [
  { id: 1, name: "主摄影棚黄金档", area: "B馆摄影区", wait: "排队 25 分钟", slot: "14:00 - 14:30", status: "可预约", desc: "适合正片拍摄，棚内背景稳定，人流偏高。"},
  { id: 2, name: "侧馆空景区", area: "B馆摄影区", wait: "排队 8 分钟", slot: "14:30 - 15:00", status: "推荐", desc: "适合双人互拍和快速出片，移动更灵活。"},
  { id: 3, name: "北门快修补妆位", area: "北门服务区", wait: "排队 6 分钟", slot: "13:40 - 14:00", status: "低等待", desc: "补妆后可以直接转场去摄影区，不容易耽误档期。"},
  { id: 4, name: "摄影预约档期", area: "预约服务", wait: "15 分钟确认", slot: "16:00 - 16:40", status: "可锁档", desc: "先锁摄影师时段，再根据馆内拥挤度调整机位。"}
];

export const reminderOptions = [
  { id: 1, title: "补妆提醒", time: "12:10", tag: "妆造", desc: "午间高温前提醒补一次定妆，避免下午妆面脱得太厉害。" },
  { id: 2, title: "摄影转场提醒", time: "15:20", tag: "摄影", desc: "主摄影区拥堵时自动提醒你切到侧馆空景区。" },
  { id: 3, title: "返程提醒", time: "18:00", tag: "交通", desc: "散场前 30 分钟提醒去拼车点或提前叫车。" },
  { id: 4, title: "取餐提醒", time: "11:50", tag: "补给", desc: "订单快送到时提醒你去休息区或服务台取餐。" }
];

export const travelOptions = [
  { id: 1, title: "北门拼车", mode: "拼车", eta: "5 分钟内可发车", cost: "约 ￥18 / 人", desc: "适合优先解决返程效率问题，省时间也更稳。"},
  { id: 2, title: "东侧地铁口", mode: "地铁", eta: "步行 9 分钟", cost: "常规票价", desc: "当前人流较低，适合不赶时间且想稳定返程的路线。"},
  { id: 3, title: "主门网约车区", mode: "打车", eta: "等待 18 分钟", cost: "动态计价", desc: "高峰期排队更久，适合大件道具或不方便换乘的情况。"},
  { id: 4, title: "好友同行返程", mode: "同行", eta: "即时发起", cost: "AA", desc: "适合和熟人一起拼车或同行走地铁，优先提升返程便利。"}
];

export const livePlatforms = ["全部", "抖音", "B站", "小红书", "快手"];

export const liveLinks = [
  {
    id: 1,
    name: "阿澄",
    cosplay: "镜华国风改 · 正在返图闲聊",
    platform: "抖音",
    account: "@achen_cos",
    liveTitle: "B馆摄影区现场直播",
    zone: "B馆摄影区",
    time: "直播中",
    viewers: "1.2w",
    startsAt: null,
    heat: "高热区",
    queueTip: "主摄影棚排队约 25 分钟，建议先看侧馆空景区。",
    bestFor: "适合想看摄影区实时拥堵和出片节奏的人。"
  },
  {
    id: 2,
    name: "铃音",
    cosplay: "LOLITA 巡馆记录",
    platform: "小红书",
    account: "铃音今天也出片",
    liveTitle: "同人摊位实时逛展",
    zone: "C馆同人摊位",
    time: "直播中",
    viewers: "6.8k",
    startsAt: null,
    heat: "持续升温",
    queueTip: "热门摊位目前排队 12 到 18 分钟，适合错峰插空逛。",
    bestFor: "适合判断摊位热度和吃谷路线。"
  },
  {
    id: 3,
    name: "柚子",
    cosplay: "古风双人互拍",
    platform: "B站",
    account: "柚子YuzuLive",
    liveTitle: "侧馆空景区实况",
    zone: "B馆摄影区",
    time: "直播中",
    viewers: "8.5k",
    startsAt: null,
    heat: "高热区",
    queueTip: "空景机位等待约 8 分钟，当前比主棚更适合临时转场。",
    bestFor: "适合准备互拍和临时补位的用户。"
  },
  {
    id: 4,
    name: "眠眠",
    cosplay: "妆造补完日记",
    platform: "抖音",
    account: "@mianmian_makeup",
    liveTitle: "北门补妆位现场直播",
    zone: "北门服务区",
    time: "19:00 开播",
    viewers: "预约 2.1k",
    startsAt: "19:00",
    heat: "中热区",
    queueTip: "补妆位排队约 6 分钟，开播前适合先做妆面整理。",
    bestFor: "适合妆造党和准备返场拍摄的人。"
  },
  {
    id: 5,
    name: "星野白祈",
    cosplay: "舞台活动同步",
    platform: "快手",
    account: "星野白祈Live",
    liveTitle: "主舞台应援实况",
    zone: "A馆主舞台",
    time: "直播中",
    viewers: "9.3k",
    startsAt: null,
    heat: "爆满",
    queueTip: "舞台前排候场较满，建议从侧通道绕行。",
    bestFor: "适合看主舞台热度和应援节奏。"
  },
  {
    id: 6,
    name: "小羽",
    cosplay: "逛摊 + 吃谷记录",
    platform: "B站",
    account: "小羽同好频道",
    liveTitle: "热门摊位排队实况",
    zone: "C馆同人摊位",
    time: "20:00 开播",
    viewers: "预约 1.6k",
    startsAt: "20:00",
    heat: "持续升温",
    queueTip: "热门摊位队列在拉长，建议先锁定目标摊位再进场。",
    bestFor: "适合吃谷党和想看实时摊位状态的人。"
  },
  {
    id: 7,
    name: "洛七",
    cosplay: "舞台返场速报",
    platform: "抖音",
    account: "@luoqi_stage",
    liveTitle: "A馆主舞台返场排队实况",
    zone: "A馆主舞台",
    time: "19:30 开播",
    viewers: "预约 3.2k",
    startsAt: "19:30",
    heat: "爆满",
    queueTip: "返场队列正在形成，建议提前 20 分钟去侧排队口。",
    bestFor: "适合准备冲舞台活动和签售的人。"
  },
  {
    id: 8,
    name: "白露",
    cosplay: "妆造修复实时播报",
    platform: "小红书",
    account: "白露今天补妆了吗",
    liveTitle: "北门服务区补妆位实时状态",
    zone: "北门服务区",
    time: "直播中",
    viewers: "4.4k",
    startsAt: null,
    heat: "平稳",
    queueTip: "补妆区等待 5 到 8 分钟，适合中途补救。",
    bestFor: "适合妆面修复和服务区避堵参考。"
  },
  {
    id: 9,
    name: "初空",
    cosplay: "场外返程观察",
    platform: "快手",
    account: "初空返程频道",
    liveTitle: "东侧地铁口和打车点实时情况",
    zone: "东侧地铁口",
    time: "直播中",
    viewers: "5.1k",
    startsAt: null,
    heat: "快速升温",
    queueTip: "地铁口排队加长中，建议提前决定拼车还是地铁。",
    bestFor: "适合返程前做交通决策。"
  },
  {
    id: 10,
    name: "南枝",
    cosplay: "谷店扫街直播",
    platform: "B站",
    account: "南枝吃谷中",
    liveTitle: "C馆谷店补货和排队状态",
    zone: "C馆同人摊位",
    time: "直播中",
    viewers: "7.2k",
    startsAt: null,
    heat: "高热区",
    queueTip: "头部谷店排队约 15 分钟，补货节奏快。",
    bestFor: "适合想追补货和高热摊位的人。"
  },
  {
    id: 11,
    name: "青禾",
    cosplay: "摄影区候场视角",
    platform: "抖音",
    account: "@qinghe_photo",
    liveTitle: "摄影区候场 + 空景位切换",
    zone: "B馆摄影区",
    time: "18:50 开播",
    viewers: "预约 2.8k",
    startsAt: "18:50",
    heat: "高热区",
    queueTip: "主摄影位仍然偏挤，建议优先看空景替代机位。",
    bestFor: "适合准备拍正片和临时抢档的人。"
  },
  {
    id: 12,
    name: "弥音",
    cosplay: "场馆巡游记录",
    platform: "小红书",
    account: "弥音巡馆中",
    liveTitle: "A馆到C馆巡游热度速看",
    zone: "连廊区域",
    time: "直播中",
    viewers: "3.9k",
    startsAt: null,
    heat: "流动高峰",
    queueTip: "连廊人流明显增加，跨馆建议预留更多步行时间。",
    bestFor: "适合看跨馆路线和实时人流。"
  }
];

export const services = [
  { name: "北门闪修补妆站", category: "补妆", eta: "8 分钟可接待", price: "￥39 / 次", badge: "热门", desc: "适合底妆斑驳、唇妆掉色、睫毛开胶等快速补救。" },
  { name: "毛娘救场工位", category: "修假发", eta: "12 分钟可接待", price: "￥58 / 次", badge: "高需求", desc: "修碎发、前额、发网外露和假发松动，适合拍摄前急救。" },
  { name: "摄影分流协调台", category: "摄影分流", eta: "即时响应", price: "免费", badge: "效率提升", desc: "按空闲摄影师与场地拥堵程度推荐更合适的拍摄点位。" },
  { name: "应援急救物资包", category: "应急用品", eta: "10 分钟送达", price: "￥19 / 包", badge: "刚需", desc: "含定妆纸巾、发夹、创可贴、防走光贴和小镜子。" },
  { name: "舞台前妆面维护位", category: "补妆", eta: "15 分钟可接待", price: "￥49 / 次", badge: "高颜值", desc: "适合拍正片前做整体妆面提亮和修饰。" }
];

export const architectureCards = [
  { title: "前端层", text: "React + Vite 负责 H5 / 小程序 WebView 原型与业务迭代，便于快速分模块开发。" },
  { title: "接口层", text: "后续可接入 Node.js / NestJS，统一处理用户、订单、地图点位、匹配和预约服务。" },
  { title: "数据层", text: "可落地到 MySQL + Redis，支持订单状态、实时排队、在线搭子等高频读写场景。" },
  { title: "扩展层", text: "后续可接地图 SDK、IM 聊天、支付、消息推送、摄影/妆造服务商后台。" }
];

export const roadmap = [
  { phase: "第 1 周", title: "需求梳理", text: "明确首版业务范围、信息架构和低保真原型。" },
  { phase: "第 2-3 周", title: "前端原型", text: "完成 React 页面结构、交互流和视觉样式。" },
  { phase: "第 4-6 周", title: "后端与数据", text: "建立用户、订单、服务预约、点位等核心模型。" },
  { phase: "第 7-8 周", title: "联调测试", text: "联调订单、地图、匹配和提醒流程，完成体验优化。" },
  { phase: "第 9 周+", title: "发布与迭代", text: "上线 MVP，并针对高频场景继续补齐支付、IM 和消息系统。" }
];
