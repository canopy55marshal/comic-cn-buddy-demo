const DEFAULT_API_BASE = "http://127.0.0.1:3001/api";
const API_BASE = (import.meta.env.VITE_API_BASE || DEFAULT_API_BASE).replace(/\/$/, "");

async function request(path, options = {}) {
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
