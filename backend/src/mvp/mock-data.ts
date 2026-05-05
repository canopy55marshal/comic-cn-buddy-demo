export type Merchant = {
  id: number;
  name: string;
  category: string;
  eta: string;
  price: string;
  score: string;
  desc: string;
  hot: string;
  type?: string;
  title?: string;
  marketPrice?: string;
  vendor?: string;
  ctaLabel?: string;
  orderLink?: string;
  commandText?: string;
  multiStore?: boolean;
  coverTitle?: string;
  coverLabel?: string;
};

export type Order = {
  id: number;
  merchantName: string;
  status: string;
  detail: string;
  totalAmount: number;
};

export type Buddy = {
  id: number;
  name: string;
  purpose: string;
  role: string;
  time: string;
  vibe: string;
  tags: string[];
  intro: string;
  creditScore: number;
};

export type ServiceItem = {
  id: number;
  name: string;
  category: string;
  eta: string;
  price: string;
  badge: string;
  desc: string;
};

export type Zone = {
  id: number;
  name: string;
  note: string;
  spots: { id: number; title: string; tag: string; text: string }[];
};

export type User = {
  id: number;
  name: string;
  role: string;
  tags: string[];
  onlineStatus: string;
  currentZone: string;
  creditScore: number;
};

export type QueueOption = {
  id: number;
  name: string;
  area: string;
  wait: string;
  slot: string;
  status: string;
  desc: string;
};

export type ReminderItem = {
  id: number;
  title: string;
  time: string;
  tag: string;
  desc: string;
};

export type TravelOption = {
  id: number;
  title: string;
  mode: string;
  eta: string;
  cost: string;
  desc: string;
};

export const merchants: Merchant[] = [
  { id: 1, type: "normal", name: "樱桃汽泡补给站", category: "奶茶", eta: "18 分钟送达", price: "￥22 起", score: "4.9", desc: "高颜值奶茶和应援杯套，适合边逛边拿。", hot: "桃桃气泡波波" },
  { id: 2, type: "cps", name: "真功夫", title: "冬菇鸡蒸蛋汤套餐兑换券", category: "主食", eta: "多店可用", price: "￥20.9", marketPrice: "￥46", score: "CPS", desc: "测试用美团 CPS 券卡，后续可以由后台表统一填入并渲染到前台。", hot: "套餐兑换券", vendor: "美团CPS", ctaLabel: "去美团下单", orderLink: "http://dpurl.cn/3kLbuKrz", commandText: "1来美团，吃得更好，生活更好❤️复制整条信息，打开👉美团👈 http:/💰trYmY3MGQ3M2Y💰", multiStore: true, coverTitle: "冬菇鸡蒸蛋汤套餐", coverLabel: "兑换券 · 1张" },
  { id: 3, type: "normal", name: "次元便当研究所", category: "主食", eta: "26 分钟送达", price: "￥34 起", score: "4.8", desc: "热食便当、饭团和意面，适合长线逛展补充体力。", hot: "照烧鸡排饭团" },
  { id: 4, type: "normal", name: "喵团烘焙屋", category: "甜品", eta: "20 分钟送达", price: "￥18 起", score: "4.7", desc: "适合拍照打卡的轻甜品和奶油卷。", hot: "草莓奶盖卷" },
  { id: 5, type: "normal", name: "应援急救小铺", category: "应急用品", eta: "12 分钟送达", price: "￥9 起", score: "4.9", desc: "补妆棉签、发夹、充电线、防走光贴一站补齐。", hot: "便携定妆补给包" }
];

export const orders: Order[] = [
  { id: 1, merchantName: "樱桃汽泡补给站", status: "正在制作", detail: "桃桃气泡波波 ×2，预计送达 A 馆西侧休息区", totalAmount: 44 },
  { id: 2, merchantName: "应援急救小铺", status: "骑手取货中", detail: "便携定妆补给包 ×1，预计送达 2 号服务台", totalAmount: 19 }
];

export const buddies: Buddy[] = [
  { id: 1, name: "铃音", purpose: "逛摊+吃谷", role: "LOLITA", time: "全天", vibe: "社牛一点点", tags: ["同人本", "谷子", "奶茶控"], intro: "想找能一起冲热门摊位、顺便拍几张日常感照片的搭子。", creditScore: 96 },
  { id: 2, name: "阿澄", purpose: "摄影互拍", role: "COSER", time: "下午", vibe: "偏安静", tags: ["互拍", "返图快", "不赶场"], intro: "主要去 B 馆拍照，想找节奏合适、愿意互相看构图的搭子。", creditScore: 94 },
  { id: 3, name: "眠眠", purpose: "补给搭伴", role: "妆造党", time: "中午", vibe: "慢节奏", tags: ["补妆", "吃饭", "休息区"], intro: "中午想找人一起补妆、吃饭，别一个人狼狈找地方坐。", creditScore: 92 }
];

export const services: ServiceItem[] = [
  { id: 1, name: "化妆师补妆预约", category: "化妆补妆", eta: "8 分钟可接待", price: "￥39 / 次", badge: "热门", desc: "适合底妆斑驳、唇妆掉色、睫毛开胶等快速补救。" },
  { id: 2, name: "毛娘修假发预约", category: "修假发", eta: "12 分钟可接待", price: "￥58 / 次", badge: "高需求", desc: "修碎发、前额、发网外露和假发松动，适合拍摄前急救。" },
  { id: 3, name: "摄影预约分流", category: "摄影分流", eta: "即时响应", price: "免费", badge: "效率提升", desc: "按空闲摄影师与场地拥堵程度推荐更合适的拍摄点位。" },
  { id: 4, name: "摄影预约档期", category: "摄影预约", eta: "15 分钟内确认", price: "￥29 订金", badge: "高转化", desc: "先锁定摄影时段，再根据拥挤度自动推荐更顺的拍摄路线。" }
];

export const zones: Zone[] = [
  {
    id: 1,
    name: "A馆主舞台",
    note: "活动密度最高，适合优先看舞台和官方互动，当前人流较高。",
    spots: [
      { id: 1, title: "官方主舞台", tag: "排队 18 分钟", text: "签售、互动演出与主舞台活动集中在这里。" },
      { id: 2, title: "饮品补给点", tag: "配送点", text: "支持奶茶与轻食自提，也是搭子集合的热门点。" }
    ]
  },
  {
    id: 2,
    name: "B馆摄影区",
    note: "适合摄影和约拍，主通道容易拥堵，建议按拍摄时段分流。",
    spots: [
      { id: 3, title: "主摄影棚入口", tag: "拥堵", text: "人流高峰建议先预约摄影再入场。" },
      { id: 4, title: "侧馆空景区", tag: "推荐", text: "更适合拍单人和双人，背景干净。" }
    ]
  }
];

export const users: User[] = [
  {
    id: 1,
    name: "星野七",
    role: "COSER",
    tags: ["互拍", "逛摊", "补妆"],
    onlineStatus: "在线",
    currentZone: "A馆主舞台",
    creditScore: 98
  },
  {
    id: 2,
    name: "阿澄",
    role: "摄影",
    tags: ["互拍", "返图快", "侧馆空景"],
    onlineStatus: "在线",
    currentZone: "B馆摄影区",
    creditScore: 95
  },
  {
    id: 3,
    name: "眠眠",
    role: "妆造",
    tags: ["补妆", "修假发", "中午可接"],
    onlineStatus: "忙碌中",
    currentZone: "北门服务区",
    creditScore: 93
  },
  {
    id: 4,
    name: "谷子熊",
    role: "普通用户",
    tags: ["吃谷", "舞台", "拼返程"],
    onlineStatus: "在线",
    currentZone: "A馆主舞台",
    creditScore: 90
  }
];

export const queueOptions: QueueOption[] = [
  { id: 1, name: "主摄影棚黄金档", area: "B馆摄影区", wait: "排队 25 分钟", slot: "14:00 - 14:30", status: "可预约", desc: "适合正片拍摄，棚内背景稳定，人流偏高。" },
  { id: 2, name: "侧馆空景区", area: "B馆摄影区", wait: "排队 8 分钟", slot: "14:30 - 15:00", status: "推荐", desc: "适合双人互拍和快速出片，移动更灵活。" },
  { id: 3, name: "北门快修补妆位", area: "北门服务区", wait: "排队 6 分钟", slot: "13:40 - 14:00", status: "低等待", desc: "补妆后可以直接转场去摄影区，不容易耽误档期。" },
  { id: 4, name: "摄影预约档期", area: "预约服务", wait: "15 分钟确认", slot: "16:00 - 16:40", status: "可锁档", desc: "先锁摄影师时段，再根据馆内拥挤度调整机位。" }
];

export const reminderItems: ReminderItem[] = [
  { id: 1, title: "补妆提醒", time: "12:10", tag: "妆造", desc: "午间高温前提醒补一次定妆，避免下午妆面脱得太厉害。" },
  { id: 2, title: "摄影转场提醒", time: "15:20", tag: "摄影", desc: "主摄影区拥堵时自动提醒你切到侧馆空景区。" },
  { id: 3, title: "返程提醒", time: "18:00", tag: "交通", desc: "散场前 30 分钟提醒去拼车点或提前叫车。" },
  { id: 4, title: "取餐提醒", time: "11:50", tag: "补给", desc: "订单快送到时提醒你去休息区或服务台取餐。" }
];

export const travelOptions: TravelOption[] = [
  { id: 1, title: "北门拼车", mode: "拼车", eta: "5 分钟内可发车", cost: "约 ￥18 / 人", desc: "适合和搭子一起返程，省时间也更稳。" },
  { id: 2, title: "东侧地铁口", mode: "地铁", eta: "步行 9 分钟", cost: "常规票价", desc: "当前人流较低，适合不赶时间的返程路线。" },
  { id: 3, title: "主门网约车区", mode: "打车", eta: "等待 18 分钟", cost: "动态计价", desc: "高峰期排队更久，建议提前 30 分钟开始准备。" },
  { id: 4, title: "搭子同行返程", mode: "结伴", eta: "即时发起", cost: "AA", desc: "适合和同馆区搭子拼车或一起走地铁，提高安全感。" }
];
