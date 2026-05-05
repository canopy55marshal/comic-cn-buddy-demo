import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "./components/navigation";
import { BuddySection } from "./components/sections/BuddySection";
import { FoodSection } from "./components/sections/FoodSection";
import { HomeSection } from "./components/sections/HomeSection";
import { LiveSection } from "./components/sections/LiveSection";
import { MapSection } from "./components/sections/MapSection";
import { QueueSection } from "./components/sections/QueueSection";
import { ReminderSection } from "./components/sections/ReminderSection";
import { BusinessSection } from "./components/sections/BusinessSection";
import { ServiceSection } from "./components/sections/ServiceSection";
import { TravelSection } from "./components/sections/TravelSection";
import { liveLinks, navItems } from "./data/mockData";
import { api } from "./services/api";

const liveReminderStorageKey = "comic-con-buddy-live-reminders";
const liveItineraryStorageKey = "comic-con-buddy-live-itinerary";
const homeActionStorageKey = "comic-con-buddy-home-actions";

function resolveZoneTarget(zoneName) {
  if (!zoneName) return "";
  if (zoneName.includes("A馆") || zoneName.includes("主舞台")) return "A馆主舞台";
  if (zoneName.includes("B馆") || zoneName.includes("摄影")) return "B馆摄影区";
  if (zoneName.includes("C馆") || zoneName.includes("同人")) return "C馆同人摊位";
  if (zoneName.includes("服务区") || zoneName.includes("北门")) return "北门服务区";
  if (zoneName.includes("地铁口")) return "北门服务区";
  if (zoneName.includes("连廊")) return "C馆同人摊位";
  return zoneName;
}

function App() {
  const storage = typeof window === "undefined" ? null : window.localStorage;
  const [section, setSection] = useState("home");
  const [foodFilter, setFoodFilter] = useState("全部");
  const [cartCount, setCartCount] = useState(() => {
    if (!storage) return 0;
    return Number(storage.getItem("comic-con-buddy-cart-count") || 0);
  });
  const [activeZone, setActiveZone] = useState("");
  const [buddyFilter, setBuddyFilter] = useState("全部");
  const [serviceFilter, setServiceFilter] = useState("全部");
  const [toast, setToast] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [userPool, setUserPool] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [buddies, setBuddies] = useState([]);
  const [services, setServices] = useState([]);
  const [zoneOptions, setZoneOptions] = useState([]);
  const [zoneSpots, setZoneSpots] = useState([]);
  const [mapResults, setMapResults] = useState([]);
  const [overview, setOverview] = useState(null);
  const [queueOptions, setQueueOptions] = useState([]);
  const [reminderOptions, setReminderOptions] = useState([]);
  const [travelOptions, setTravelOptions] = useState([]);
  const [liveMapContext, setLiveMapContext] = useState(null);
  const [liveQueueContext, setLiveQueueContext] = useState(null);
  const [liveReminderIds, setLiveReminderIds] = useState(() => {
    if (!storage) return [];
    try {
      return JSON.parse(storage.getItem(liveReminderStorageKey) || "[]");
    } catch {
      return [];
    }
  });
  const [liveItineraryIds, setLiveItineraryIds] = useState(() => {
    if (!storage) return [];
    try {
      return JSON.parse(storage.getItem(liveItineraryStorageKey) || "[]");
    } catch {
      return [];
    }
  });
  const [itashaCampaign, setItashaCampaign] = useState(() => {
    if (!storage) {
      return {
        role: null,
        driverCount: 6,
        riderCount: 18
      };
    }

    try {
      return JSON.parse(storage.getItem("comic-con-buddy-itasha-campaign")) || {
        role: null,
        driverCount: 6,
        riderCount: 18
      };
    } catch {
      return {
        role: null,
        driverCount: 6,
        riderCount: 18
      };
    }
  });
  const [loading, setLoading] = useState({
    merchants: false,
    buddies: false,
    services: false,
    zones: false,
    queue: false,
    reminders: false,
    travel: false
  });
  const [completedHomeActions, setCompletedHomeActions] = useState(() => {
    if (!storage) return [];
    try {
      return JSON.parse(storage.getItem(homeActionStorageKey) || "[]");
    } catch {
      return [];
    }
  });

  const filteredMerchants = useMemo(
    () => merchants.filter((item) => !foodFilter || foodFilter === "全部" || item.category === foodFilter),
    [foodFilter, merchants]
  );

  const filteredBuddies = useMemo(
    () => buddies.filter((item) => !buddyFilter || buddyFilter === "全部" || item.purpose === buddyFilter),
    [buddyFilter, buddies]
  );

  const filteredServices = useMemo(
    () => services.filter((item) => !serviceFilter || serviceFilter === "全部" || item.category === serviceFilter),
    [serviceFilter, services]
  );

  const currentZone = useMemo(
    () => {
      const current = zoneOptions.find((item) => item.name === activeZone) ?? zoneOptions[0];
      return {
        ...(current || { name: "暂无馆区", note: "请稍后加载", spots: [] }),
        spots: zoneSpots
      };
    },
    [activeZone, zoneOptions, zoneSpots]
  );

  const notify = (message) => {
    setToast(message);
    window.clearTimeout(notify.timer);
    notify.timer = window.setTimeout(() => setToast(""), 2200);
  };

  const markHomeActionComplete = (key) => {
    setCompletedHomeActions((prev) => (prev.includes(key) ? prev : [...prev, key]));
  };

  useEffect(() => {
    if (!storage) return;
    storage.setItem("comic-con-buddy-cart-count", String(cartCount));
  }, [cartCount, storage]);

  useEffect(() => {
    if (!storage) return;
    storage.setItem("comic-con-buddy-itasha-campaign", JSON.stringify(itashaCampaign));
  }, [itashaCampaign, storage]);

  useEffect(() => {
    if (!storage) return;
    storage.setItem(liveReminderStorageKey, JSON.stringify(liveReminderIds));
  }, [liveReminderIds, storage]);

  useEffect(() => {
    if (!storage) return;
    storage.setItem(liveItineraryStorageKey, JSON.stringify(liveItineraryIds));
  }, [liveItineraryIds, storage]);

  useEffect(() => {
    if (!storage) return;
    storage.setItem(homeActionStorageKey, JSON.stringify(completedHomeActions));
  }, [completedHomeActions, storage]);

  const liveReminderItems = useMemo(
    () => liveLinks
      .filter((item) => liveReminderIds.includes(item.id))
      .map((item) => ({
        id: `live-${item.id}`,
        sourceId: item.id,
        title: `${item.name} 开播提醒`,
        time: item.startsAt || "直播中",
        rawTime: item.startsAt || "99:99",
        tag: "直播",
        desc: `${item.platform} · ${item.zone} · ${item.liveTitle}`,
        enabled: true
      })),
    [liveReminderIds]
  );

  const liveItineraryItems = useMemo(
    () => liveLinks
      .filter((item) => liveItineraryIds.includes(item.id))
      .map((item) => ({
        id: `itinerary-${item.id}`,
        sourceId: item.id,
        name: item.name,
        title: `${item.name} · ${item.liveTitle}`,
        zone: item.zone,
        time: item.startsAt || "直播中",
        platform: item.platform
      })),
    [liveItineraryIds]
  );

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [user, pool, orderList, zoneList, mapList, overviewData, queueList, reminderList, travelList] = await Promise.all([
          api.getCurrentUser(),
          api.getUserPool({ onlineOnly: true }),
          api.getOrders(),
          api.getZones(),
          api.searchMap("上海国家会展中心"),
          api.getOverview(),
          api.getQueueOptions(),
          api.getReminders(),
          api.getTravelOptions()
        ]);

        setCurrentUser(user);
        setUserPool(pool);
        setOrders(orderList);
        setZoneOptions(zoneList);
        setMapResults(mapList);
        setOverview(overviewData);
        setQueueOptions(queueList);
        setReminderOptions(reminderList);
        setTravelOptions(travelList);

        if (zoneList.length > 0) {
          setActiveZone(zoneList[0].name);
        }
      } catch (error) {
        notify(`初始化数据失败：${error.message}`);
      }
    };

    bootstrap();
  }, []);

  useEffect(() => {
    const loadMerchants = async () => {
      setLoading((prev) => ({ ...prev, merchants: true }));
      try {
        const data = await api.getMerchants(foodFilter);
        setMerchants(data);
      } catch (error) {
        notify(`补给数据加载失败：${error.message}`);
      } finally {
        setLoading((prev) => ({ ...prev, merchants: false }));
      }
    };

    loadMerchants();
  }, [foodFilter]);

  useEffect(() => {
    const loadBuddies = async () => {
      setLoading((prev) => ({ ...prev, buddies: true }));
      try {
        const data = await api.getBuddies(buddyFilter);
        setBuddies(data);
      } catch (error) {
        notify(`搭子数据加载失败：${error.message}`);
      } finally {
        setLoading((prev) => ({ ...prev, buddies: false }));
      }
    };

    loadBuddies();
  }, [buddyFilter]);

  useEffect(() => {
    const loadServices = async () => {
      setLoading((prev) => ({ ...prev, services: true }));
      try {
        const data = await api.getServices(serviceFilter);
        setServices(data);
      } catch (error) {
        notify(`服务数据加载失败：${error.message}`);
      } finally {
        setLoading((prev) => ({ ...prev, services: false }));
      }
    };

    loadServices();
  }, [serviceFilter]);

  useEffect(() => {
    if (!activeZone) {
      return;
    }

    const loadZoneSpots = async () => {
      setLoading((prev) => ({ ...prev, zones: true }));
      try {
        const data = await api.getZoneSpots(activeZone);
        setZoneSpots(data);
      } catch (error) {
        notify(`馆区点位加载失败：${error.message}`);
      } finally {
        setLoading((prev) => ({ ...prev, zones: false }));
      }
    };

    loadZoneSpots();
  }, [activeZone]);

  const handleAddToCart = (name) => {
    setCartCount((count) => count + 1);
    notify(`已将 ${name} 加入购物车`);
  };

  const handleCreateOrder = async (name) => {
    try {
      const newOrder = await api.createOrder({
        merchantName: name,
        items: ["漫展补给套餐"],
        totalAmount: 39
      });
      setOrders((prev) => [newOrder, ...prev]);
      notify(`已创建 ${name} 的订单`);
    } catch (error) {
      notify(`下单失败：${error.message}`);
    }
  };

  const handleSetSpot = (spot) => {
    markHomeActionComplete("map");
    notify(`已将 ${spot} 设为路线途经点`);
  };

  const handleInviteBuddy = async (name) => {
    try {
      await api.createInvitation({
        buddyName: name,
        message: "一起去漫展吧，顺便解锁同行权益"
      });
      markHomeActionComplete("buddy");
      notify(`已生成 ${name} 的熟人同行邀约`);
    } catch (error) {
      notify(`邀约生成失败：${error.message}`);
    }
  };

  const handlePlanRoute = (name) => {
    markHomeActionComplete("buddy");
    notify(`已为 ${name} 配置同行权益和路线建议`);
  };

  const handleBookService = async (name) => {
    try {
      await api.createBooking({
        serviceName: name,
        contactName: currentUser?.name || "测试用户",
        slotTime: "今天 14:30"
      });
      notify(`已预约 ${name}`);
    } catch (error) {
      notify(`预约失败：${error.message}`);
    }
  };

  const handleRemindService = (name) => {
    notify(`已将 ${name} 加入提醒中心`);
  };

  const handleBookQueue = (item) => {
    api.createQueueBooking({ queueId: item.id })
      .then(() => api.getQueueOptions())
      .then((list) => {
        setQueueOptions(list);
        markHomeActionComplete("queue");
        notify(`已预约 ${item.name}`);
      })
      .catch((error) => notify(`预约失败：${error.message}`));
  };

  const handleToggleReminder = (item) => {
    api.toggleReminder({ reminderId: item.id })
      .then(() => api.getReminders())
      .then((list) => {
        setReminderOptions(list);
        notify(`${item.enabled ? "已关闭" : "已开启"} ${item.title}`);
      })
      .catch((error) => notify(`提醒设置失败：${error.message}`));
  };

  const handleChooseTravel = (item) => {
    api.selectTravelOption({ travelId: item.id })
      .then(() => api.getTravelOptions())
      .then((list) => {
        setTravelOptions(list);
        notify(`已将 ${item.title} 设为返程方案`);
      })
      .catch((error) => notify(`设置返程方案失败：${error.message}`));
  };

  const handleToggleLiveReminder = (item) => {
    if (!item.startsAt) {
      notify(`${item.name} 已经在直播中了，不需要额外提醒`);
      return;
    }

    setLiveReminderIds((prev) => {
      const exists = prev.includes(item.id);
      const next = exists ? prev.filter((id) => id !== item.id) : [...prev, item.id];
      notify(exists ? `已取消 ${item.name} 的开播提醒` : `已为 ${item.name} 添加开播提醒`);
      return next;
    });
  };

  const handleToggleLiveItinerary = (item) => {
    setLiveItineraryIds((prev) => {
      const exists = prev.includes(item.id);
      const next = exists ? prev.filter((id) => id !== item.id) : [...prev, item.id];
      notify(exists ? `已从主播行程移除 ${item.name}` : `已将 ${item.name} 加入主播行程`);
      return next;
    });
  };

  const handleOpenLiveMap = (item) => {
    const targetZone = resolveZoneTarget(item.zone);
    setLiveMapContext({ name: item.name, zone: item.zone, targetZone });
    setSection("map");
    setActiveZone(targetZone);
    markHomeActionComplete("map");
    notify(`已带你去场馆地图，当前定位到 ${targetZone}`);
  };

  const handleOpenLiveQueue = (item) => {
    setLiveQueueContext({ name: item.name, zone: item.zone, targetZone: resolveZoneTarget(item.zone) });
    setSection("queue");
    markHomeActionComplete("queue");
    notify(`已带你去排队预约，正在按 ${item.zone} 推荐更合适的预约项`);
  };

  const handleJoinItashaDriver = () => {
    if (itashaCampaign.role === "driver") {
      notify("你已经报名过痛车车主招募");
      return;
    }
    if (itashaCampaign.role === "rider") {
      notify("你已经提交了搭乘意向，当前演示版先锁定一种身份");
      return;
    }

    setItashaCampaign((prev) => ({
      ...prev,
      role: "driver",
      driverCount: prev.driverCount + 1
    }));
    notify("已提交痛车车主招募意向");
  };

  const handleJoinItashaRide = () => {
    if (itashaCampaign.role === "rider") {
      notify("你已经提交过痛车搭乘意向");
      return;
    }
    if (itashaCampaign.role === "driver") {
      notify("你已经报名为痛车车主，当前演示版先锁定一种身份");
      return;
    }

    setItashaCampaign((prev) => ({
      ...prev,
      role: "rider",
      riderCount: prev.riderCount + 1
    }));
    notify("已登记痛车搭乘意向");
  };

  const renderSection = () => {
    switch (section) {
      case "food":
        return (
          <FoodSection
            cartCount={cartCount}
            foodFilter={foodFilter}
            merchants={filteredMerchants}
            orders={orders}
            loading={loading.merchants}
            onNavigate={setSection}
            onFoodFilterChange={setFoodFilter}
            onAddToCart={handleAddToCart}
            onCreateOrder={handleCreateOrder}
          />
        );
      case "map":
        return (
          <MapSection
            activeZone={activeZone}
            zoneOptions={zoneOptions}
            currentZone={currentZone}
            currentUserZone={currentUser?.currentZone}
            mapCompleted={completedHomeActions.includes("map")}
            loading={loading.zones}
            mapResults={mapResults}
            onNavigate={setSection}
            onZoneChange={setActiveZone}
            onSetSpot={handleSetSpot}
            liveMapContext={liveMapContext}
          />
        );
      case "buddy":
        return (
          <BuddySection
            buddyFilter={buddyFilter}
            buddies={filteredBuddies}
            loading={loading.buddies}
            buddyCompleted={completedHomeActions.includes("buddy")}
            userPool={userPool}
            onBuddyFilterChange={setBuddyFilter}
            onInvite={handleInviteBuddy}
            onPlanRoute={handlePlanRoute}
          />
        );
      case "service":
        return (
          <ServiceSection
            serviceFilter={serviceFilter}
            services={filteredServices}
            loading={loading.services}
            onServiceFilterChange={setServiceFilter}
            onBook={handleBookService}
            onRemind={handleRemindService}
          />
        );
      case "business":
        return <BusinessSection onNavigate={setSection} />;
      case "queue":
        return (
          <QueueSection
            queueOptions={queueOptions}
            queueCompleted={completedHomeActions.includes("queue")}
            onBook={handleBookQueue}
            liveQueueContext={liveQueueContext}
          />
        );
      case "live":
        return (
          <LiveSection
            onNotify={notify}
            onNavigate={setSection}
            reminderIds={liveReminderIds}
            itineraryIds={liveItineraryIds}
            onToggleReminder={handleToggleLiveReminder}
            onToggleItinerary={handleToggleLiveItinerary}
          />
        );
      case "reminder":
        return (
          <ReminderSection
            reminderOptions={reminderOptions}
            liveReminderItems={liveReminderItems}
            onToggle={handleToggleReminder}
            onToggleLiveReminder={handleToggleLiveReminder}
          />
        );
      case "travel":
        return (
          <TravelSection
            travelOptions={travelOptions}
            onChoose={handleChooseTravel}
            itashaCampaign={itashaCampaign}
            onJoinDriver={handleJoinItashaDriver}
            onJoinRide={handleJoinItashaRide}
          />
        );
      case "home":
      default:
        return (
          <HomeSection
            onNavigate={setSection}
            currentUser={currentUser}
            overview={overview}
            completedActions={completedHomeActions}
            liveItineraryItems={liveItineraryItems}
            onToggleLiveItinerary={handleToggleLiveItinerary}
            onOpenLiveMap={handleOpenLiveMap}
            onOpenLiveQueue={handleOpenLiveQueue}
          />
        );
    }
  };

  return (
    <div className="app">
      <div className="shell">
        <AppHeader navItems={navItems} section={section} onNavigate={setSection} currentUser={currentUser} />

        {renderSection()}
      </div>

      <div className={`toast ${toast ? "show" : ""}`}>{toast}</div>
    </div>
  );
}

export default App;
