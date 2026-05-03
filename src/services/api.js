import {
  buddies as mockBuddies,
  merchants as mockMerchants,
  orders as mockOrders,
  queueOptions as mockQueueOptions,
  reminderOptions as mockReminderOptions,
  roadmap,
  services as mockServices,
  travelOptions as mockTravelOptions,
  zones as mockZones
} from "../data/mockData";

const demoUsers = [
  {
    id: 1,
    name: "鹿宁",
    role: "COSER",
    tags: ["互拍", "古风", "路线控"],
    onlineStatus: "在线",
    currentZone: "B馆摄影区",
    creditScore: 99
  },
  {
    id: 2,
    name: "阿澄",
    role: "摄影",
    tags: ["返图快", "空景区", "双人互拍"],
    onlineStatus: "在线",
    currentZone: "B馆摄影区",
    creditScore: 97
  },
  {
    id: 3,
    name: "眠眠",
    role: "妆造",
    tags: ["补妆", "修发", "慢节奏"],
    onlineStatus: "忙碌中",
    currentZone: "北门服务区",
    creditScore: 98
  },
  {
    id: 4,
    name: "柚子",
    role: "普通用户",
    tags: ["逛摊", "吃谷", "结伴返程"],
    onlineStatus: "在线",
    currentZone: "C馆同人摊位",
    creditScore: 96
  }
];

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";
const DEFAULT_API_BASE = "http://127.0.0.1:3001/api";
const API_BASE = (import.meta.env.VITE_API_BASE || DEFAULT_API_BASE).replace(/\/$/, "");

const demoState = {
  orders: [...mockOrders],
  invitations: [],
  bookings: [],
  queueOptions: mockQueueOptions.map((item) => ({ ...item, booked: false })),
  reminders: mockReminderOptions.map((item) => ({ ...item, enabled: item.id === 1 || item.id === 3 })),
  travelOptions: mockTravelOptions.map((item) => ({ ...item, selected: false }))
};

function resolveZoneSpots(zoneName) {
  const zone = mockZones.find((item) => item.name === zoneName);
  return (zone?.spots || []).map((spot) => ({
    title: spot.title,
    tag: spot.tag,
    text: spot.text
  }));
}

async function requestDemo(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const body = options.body ? JSON.parse(options.body) : null;

  if (path === "/health") {
    return { ok: true, mode: "demo" };
  }

  if (path === "/overview") {
    return {
      metrics: {
        merchants: mockMerchants.length,
        buddies: mockBuddies.length,
        services: mockServices.length
      },
      roadmap
    };
  }

  if (path === "/users/me") {
    return demoUsers[0];
  }

  if (path.startsWith("/users/pool")) {
    return demoUsers;
  }

  if (path.startsWith("/merchants")) {
    const url = new URL(`http://demo.local${path}`);
    const category = url.searchParams.get("category");
    return mockMerchants.filter((item) => !category || category === "全部" || item.category === category);
  }

  if (path === "/orders" && method === "GET") {
    return demoState.orders;
  }

  if (path === "/orders" && method === "POST") {
    const order = {
      name: body?.merchantName || "演示商家",
      status: "已创建",
      detail: `${(body?.items || []).join("、")}，演示模式下已创建订单`
    };
    demoState.orders = [order, ...demoState.orders];
    return order;
  }

  if (path.startsWith("/buddies")) {
    const url = new URL(`http://demo.local${path}`);
    const purpose = url.searchParams.get("purpose");
    return mockBuddies.filter((item) => !purpose || purpose === "全部" || item.purpose === purpose);
  }

  if (path === "/invitations" && method === "POST") {
    demoState.invitations.push({
      buddyName: body?.buddyName,
      message: body?.message,
      status: "pending"
    });
    return { ok: true };
  }

  if (path.startsWith("/services")) {
    const url = new URL(`http://demo.local${path}`);
    const category = url.searchParams.get("category");
    return mockServices.filter((item) => !category || category === "全部" || item.category === category);
  }

  if (path === "/queue-options") {
    return demoState.queueOptions;
  }

  if (path === "/queue-bookings" && method === "POST") {
    demoState.queueOptions = demoState.queueOptions.map((item) => (
      item.id === body?.queueId ? { ...item, booked: true } : item
    ));
    return { ok: true };
  }

  if (path === "/reminders") {
    return demoState.reminders;
  }

  if (path === "/reminders/toggle" && method === "POST") {
    demoState.reminders = demoState.reminders.map((item) => (
      item.id === body?.reminderId ? { ...item, enabled: !item.enabled } : item
    ));
    return { ok: true };
  }

  if (path === "/travel-options") {
    return demoState.travelOptions;
  }

  if (path === "/travel/select" && method === "POST") {
    demoState.travelOptions = demoState.travelOptions.map((item) => ({
      ...item,
      selected: item.id === body?.travelId
    }));
    return { ok: true };
  }

  if (path === "/bookings" && method === "POST") {
    demoState.bookings.push(body);
    return { ok: true };
  }

  if (path === "/zones") {
    return mockZones.map(({ name, note }) => ({ name, note }));
  }

  if (path.includes("/spots")) {
    const zoneName = decodeURIComponent(path.split("/zones/")[1].split("/spots")[0]);
    return resolveZoneSpots(zoneName);
  }

  if (path.startsWith("/map/search")) {
    return [
      { id: 1, name: "国家会展中心（上海）", type: "展馆", latitude: "31.1924", longitude: "121.2998" },
      { id: 2, name: "北门服务区", type: "服务点", latitude: "31.1931", longitude: "121.3006" }
    ];
  }

  throw new Error(`演示模式未实现接口: ${path}`);
}

async function request(path, options = {}) {
  if (DEMO_MODE) {
    return requestDemo(path, options);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `请求失败: ${response.status}`);
  }

  return response.json();
}

export const api = {
  getHealth() {
    return request("/health");
  },
  getOverview() {
    return request("/overview");
  },
  getCurrentUser() {
    return request("/users/me");
  },
  getUserPool(params = {}) {
    const query = new URLSearchParams();
    if (params.role) query.set("role", params.role);
    if (params.onlineOnly) query.set("onlineOnly", String(params.onlineOnly));
    return request(`/users/pool${query.toString() ? `?${query.toString()}` : ""}`);
  },
  getMerchants(category) {
    const query = new URLSearchParams();
    if (category && category !== "全部") query.set("category", category);
    return request(`/merchants${query.toString() ? `?${query.toString()}` : ""}`);
  },
  getOrders() {
    return request("/orders");
  },
  createOrder(payload) {
    return request("/orders", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  getBuddies(purpose) {
    const query = new URLSearchParams();
    if (purpose && purpose !== "全部") query.set("purpose", purpose);
    return request(`/buddies${query.toString() ? `?${query.toString()}` : ""}`);
  },
  createInvitation(payload) {
    return request("/invitations", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  getServices(category) {
    const query = new URLSearchParams();
    if (category && category !== "全部") query.set("category", category);
    return request(`/services${query.toString() ? `?${query.toString()}` : ""}`);
  },
  getQueueOptions() {
    return request("/queue-options");
  },
  createQueueBooking(payload) {
    return request("/queue-bookings", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  getReminders() {
    return request("/reminders");
  },
  toggleReminder(payload) {
    return request("/reminders/toggle", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  getTravelOptions() {
    return request("/travel-options");
  },
  selectTravelOption(payload) {
    return request("/travel/select", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  createBooking(payload) {
    return request("/bookings", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  getZones() {
    return request("/zones");
  },
  getZoneSpots(zoneName) {
    return request(`/zones/${encodeURIComponent(zoneName)}/spots`);
  },
  searchMap(keyword) {
    const query = new URLSearchParams();
    query.set("q", keyword);
    return request(`/map/search?${query.toString()}`);
  }
};
