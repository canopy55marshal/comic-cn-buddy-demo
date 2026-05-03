import { Injectable, NotFoundException } from "@nestjs/common";
import { MysqlService } from "../mysql/mysql.service";
import { OpenMapService } from "../open-map/open-map.service";
import { buddies, merchants, orders, queueOptions, reminderItems, services, travelOptions, users, zones, type Order } from "./mock-data";

type SqlParam = string | number | boolean | null;

type CreateOrderPayload = {
  merchantName: string;
  items?: string[];
  totalAmount?: number;
};

type CreateInvitationPayload = {
  buddyName: string;
  message?: string;
};

type CreateBookingPayload = {
  serviceName: string;
  contactName: string;
  slotTime: string;
};

type CreateLightUserPayload = {
  name: string;
  role: string;
  tags?: string[];
  onlineStatus?: string;
  currentZone?: string;
};

type QueueBookingPayload = {
  queueId: number;
};

type ReminderTogglePayload = {
  reminderId: number;
};

type TravelSelectPayload = {
  travelId: number;
};

@Injectable()
export class MvpService {
  private readonly mockOrders = [...orders];
  private readonly mockInvitations: Array<{ id: number; buddyName: string; message: string; status: string }> = [];
  private readonly mockBookings: Array<{ id: number; serviceName: string; contactName: string; slotTime: string; status: string }> = [];
  private readonly bookedQueueIds = new Set<number>();
  private readonly enabledReminderIds = new Set<number>([1, 3]);
  private selectedTravelId: number | null = null;

  constructor(
    private readonly mysqlService: MysqlService,
    private readonly openMapService: OpenMapService
  ) {}

  async getHealth() {
    return {
      ok: true,
      mode: this.mysqlService.mode,
      time: new Date().toISOString()
    };
  }

  async getOverview() {
    return {
      mode: this.mysqlService.mode,
      modules: ["餐饮配送", "场馆地图", "排队预约", "搭子匹配", "智能提醒", "交通出行", "化妆补妆", "毛娘修发", "摄影预约"],
      metrics: {
        users: (await this.getUserPool()).length,
        merchants: (await this.getMerchants()).length,
        orders: (await this.getOrders()).length,
        buddies: (await this.getBuddies()).length,
        services: (await this.getServices()).length,
        zones: (await this.getZones()).length
      }
    };
  }

  async getCurrentUser() {
    if (this.mysqlService.mode === "mysql") {
      const rows = await this.mysqlService.query(
        "SELECT id, name, role, tags_json, online_status AS onlineStatus, current_zone AS currentZone, credit_score AS creditScore FROM users ORDER BY id ASC LIMIT 1"
      );
      const firstUser = rows[0] as Record<string, unknown> | undefined;
      if (!firstUser) {
        throw new NotFoundException("未找到当前用户");
      }
      return {
        ...firstUser,
        tags: JSON.parse(String(firstUser.tags_json ?? "[]"))
      };
    }

    return users[0];
  }

  async getUserPool(role?: string, onlineOnly?: boolean) {
    if (this.mysqlService.mode === "mysql") {
      const params: SqlParam[] = [];
      let sql = "SELECT id, name, role, tags_json, online_status AS onlineStatus, current_zone AS currentZone, credit_score AS creditScore FROM users WHERE 1 = 1";

      if (role) {
        sql += " AND role = ?";
        params.push(role);
      }

      if (onlineOnly) {
        sql += " AND online_status = ?";
        params.push("在线");
      }

      const rows = await this.mysqlService.query(sql, params);
      return rows.map((item) => ({
        ...(item as Record<string, unknown>),
        tags: JSON.parse(String((item as Record<string, unknown>).tags_json ?? "[]"))
      }));
    }

    return users.filter((item) => {
      if (role && item.role !== role) return false;
      if (onlineOnly && item.onlineStatus !== "在线") return false;
      return true;
    });
  }

  async createLightUser(payload: CreateLightUserPayload) {
    const tags = payload.tags?.length ? payload.tags : ["新用户"];
    const onlineStatus = payload.onlineStatus || "在线";
    const currentZone = payload.currentZone || "A馆主舞台";

    if (this.mysqlService.mode === "mysql") {
      await this.mysqlService.execute(
        "INSERT INTO users (name, role, tags_json, online_status, current_zone, credit_score) VALUES (?, ?, ?, ?, ?, ?)",
        [payload.name, payload.role, JSON.stringify(tags), onlineStatus, currentZone, 100]
      );
      const rows = await this.getUserPool();
      return Array.isArray(rows) ? rows[rows.length - 1] : rows;
    }

    const nextUser = {
      id: users.length + 1,
      name: payload.name,
      role: payload.role,
      tags,
      onlineStatus,
      currentZone,
      creditScore: 100
    };
    users.push(nextUser);
    return nextUser;
  }

  async getMerchants(category?: string) {
    if (this.mysqlService.mode === "mysql") {
      const params: SqlParam[] = [];
      let sql = "SELECT id, name, category, eta, price, score, description AS `desc`, hot FROM merchants";

      if (category && category !== "全部") {
        sql += " WHERE category = ?";
        params.push(category);
      }

      return this.mysqlService.query(sql, params);
    }

    return merchants.filter((item) => !category || category === "全部" || item.category === category);
  }

  async getOrders() {
    if (this.mysqlService.mode === "mysql") {
      return this.mysqlService.query(
        "SELECT id, merchant_name AS merchantName, status, detail, total_amount AS totalAmount FROM orders ORDER BY id DESC"
      );
    }

    return [...this.mockOrders].sort((a, b) => b.id - a.id);
  }

  async createOrder(payload: CreateOrderPayload) {
    const detail = `${payload.items?.join("、") || "默认套餐"}，由 ${payload.merchantName} 处理`;
    const totalAmount = payload.totalAmount ?? 39;

    if (this.mysqlService.mode === "mysql") {
      await this.mysqlService.execute(
        "INSERT INTO orders (merchant_name, status, detail, total_amount) VALUES (?, ?, ?, ?)",
        [payload.merchantName, "已创建", detail, totalAmount]
      );
      const rows = await this.getOrders();
      return Array.isArray(rows) ? rows[0] : rows;
    }

    const nextOrder: Order = {
      id: this.mockOrders.length + 1,
      merchantName: payload.merchantName,
      status: "已创建",
      detail,
      totalAmount
    };

    this.mockOrders.unshift(nextOrder);
    return nextOrder;
  }

  async getBuddies(purpose?: string) {
    if (this.mysqlService.mode === "mysql") {
      const params: SqlParam[] = [];
      let sql = "SELECT id, name, purpose, role, available_time AS `time`, vibe, tags_json, intro, credit_score AS creditScore FROM buddies";

      if (purpose && purpose !== "全部") {
        sql += " WHERE purpose = ?";
        params.push(purpose);
      }

      const rows = await this.mysqlService.query(sql, params);
      return rows.map((item) => ({
        ...(item as Record<string, unknown>),
        tags: JSON.parse(String((item as Record<string, unknown>).tags_json ?? "[]"))
      }));
    }

    return buddies.filter((item) => !purpose || purpose === "全部" || item.purpose === purpose);
  }

  async createInvitation(payload: CreateInvitationPayload) {
    if (this.mysqlService.mode === "mysql") {
      await this.mysqlService.execute(
        "INSERT INTO invitations (buddy_name, message, status) VALUES (?, ?, ?)",
        [payload.buddyName, payload.message || "一起逛展吗？", "pending"]
      );
      return { ok: true, status: "pending" };
    }

    const invitation = {
      id: this.mockInvitations.length + 1,
      buddyName: payload.buddyName,
      message: payload.message || "一起逛展吗？",
      status: "pending"
    };
    this.mockInvitations.push(invitation);
    return invitation;
  }

  async getServices(category?: string) {
    if (this.mysqlService.mode === "mysql") {
      const params: SqlParam[] = [];
      let sql = "SELECT id, name, category, eta, price, badge, description AS `desc` FROM services";

      if (category && category !== "全部") {
        sql += " WHERE category = ?";
        params.push(category);
      }

      return this.mysqlService.query(sql, params);
    }

    return services.filter((item) => !category || category === "全部" || item.category === category);
  }

  async createBooking(payload: CreateBookingPayload) {
    if (this.mysqlService.mode === "mysql") {
      await this.mysqlService.execute(
        "INSERT INTO bookings (service_name, contact_name, slot_time, status) VALUES (?, ?, ?, ?)",
        [payload.serviceName, payload.contactName, payload.slotTime, "booked"]
      );
      return { ok: true, status: "booked" };
    }

    const booking = {
      id: this.mockBookings.length + 1,
      serviceName: payload.serviceName,
      contactName: payload.contactName,
      slotTime: payload.slotTime,
      status: "booked"
    };
    this.mockBookings.push(booking);
    return booking;
  }

  async getZones() {
    if (this.mysqlService.mode === "mysql") {
      return this.mysqlService.query("SELECT id, name, note FROM venues ORDER BY id ASC");
    }

    return zones.map(({ id, name, note }) => ({ id, name, note }));
  }

  async getQueueOptions() {
    if (this.mysqlService.mode === "mysql") {
      return this.mysqlService.query(
        "SELECT id, name, area, wait_text AS `wait`, slot_time AS slot, status_text AS status, description AS `desc`, booked FROM queue_options ORDER BY id ASC"
      );
    }

    return queueOptions.map((item) => ({
      ...item,
      booked: this.bookedQueueIds.has(item.id)
    }));
  }

  async createQueueBooking(payload: QueueBookingPayload) {
    if (this.mysqlService.mode === "mysql") {
      const result = await this.mysqlService.execute(
        "UPDATE queue_options SET booked = 1 WHERE id = ?",
        [payload.queueId]
      );
      return {
        ok: true,
        queueId: payload.queueId,
        status: "booked",
        result
      };
    }

    const target = queueOptions.find((item) => item.id === payload.queueId);
    if (!target) {
      throw new NotFoundException("未找到预约项目");
    }
    this.bookedQueueIds.add(payload.queueId);
    return {
      ok: true,
      queueId: payload.queueId,
      status: "booked"
    };
  }

  async getReminderItems() {
    if (this.mysqlService.mode === "mysql") {
      return this.mysqlService.query(
        "SELECT id, title, remind_time AS `time`, tag, description AS `desc`, enabled FROM reminders ORDER BY id ASC"
      );
    }

    return reminderItems.map((item) => ({
      ...item,
      enabled: this.enabledReminderIds.has(item.id)
    }));
  }

  async toggleReminder(payload: ReminderTogglePayload) {
    if (this.mysqlService.mode === "mysql") {
      const rows = await this.mysqlService.query(
        "SELECT enabled FROM reminders WHERE id = ?",
        [payload.reminderId]
      );
      const first = rows[0] as Record<string, unknown> | undefined;
      if (!first) {
        throw new NotFoundException("未找到提醒项");
      }
      const nextEnabled = Number(first.enabled) ? 0 : 1;
      await this.mysqlService.execute(
        "UPDATE reminders SET enabled = ? WHERE id = ?",
        [nextEnabled, payload.reminderId]
      );
      return {
        ok: true,
        reminderId: payload.reminderId,
        enabled: Boolean(nextEnabled)
      };
    }

    const target = reminderItems.find((item) => item.id === payload.reminderId);
    if (!target) {
      throw new NotFoundException("未找到提醒项");
    }
    const enabled = this.enabledReminderIds.has(payload.reminderId);
    if (enabled) {
      this.enabledReminderIds.delete(payload.reminderId);
    } else {
      this.enabledReminderIds.add(payload.reminderId);
    }
    return {
      ok: true,
      reminderId: payload.reminderId,
      enabled: !enabled
    };
  }

  async getTravelOptions() {
    if (this.mysqlService.mode === "mysql") {
      return this.mysqlService.query(
        "SELECT id, title, mode, eta, cost, description AS `desc`, selected FROM travel_options ORDER BY id ASC"
      );
    }

    return travelOptions.map((item) => ({
      ...item,
      selected: this.selectedTravelId === item.id
    }));
  }

  async selectTravelOption(payload: TravelSelectPayload) {
    if (this.mysqlService.mode === "mysql") {
      const target = await this.mysqlService.query(
        "SELECT id FROM travel_options WHERE id = ?",
        [payload.travelId]
      );
      if (!target.length) {
        throw new NotFoundException("未找到返程方案");
      }
      await this.mysqlService.execute("UPDATE travel_options SET selected = 0");
      await this.mysqlService.execute(
        "UPDATE travel_options SET selected = 1 WHERE id = ?",
        [payload.travelId]
      );
      return {
        ok: true,
        travelId: payload.travelId,
        selected: true
      };
    }

    const target = travelOptions.find((item) => item.id === payload.travelId);
    if (!target) {
      throw new NotFoundException("未找到返程方案");
    }
    this.selectedTravelId = payload.travelId;
    return {
      ok: true,
      travelId: payload.travelId,
      selected: true
    };
  }

  async getZoneSpots(name: string) {
    if (this.mysqlService.mode === "mysql") {
      const rows = await this.mysqlService.query(
        "SELECT vs.id, vs.title, vs.tag, vs.description AS `text` FROM venue_spots vs INNER JOIN venues v ON v.id = vs.venue_id WHERE v.name = ? ORDER BY vs.id ASC",
        [name]
      );
      if (!rows.length) {
        throw new NotFoundException("未找到对应馆区");
      }
      return rows;
    }

    const zone = zones.find((item) => item.name === name);
    if (!zone) {
      throw new NotFoundException("未找到对应馆区");
    }
    return zone.spots;
  }

  async searchMap(query: string) {
    return this.openMapService.searchPlaces(query);
  }
}
