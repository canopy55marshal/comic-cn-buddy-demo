import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "./components/navigation";
import { BuddySection } from "./components/sections/BuddySection";
import { FoodSection } from "./components/sections/FoodSection";
import { HomeSection } from "./components/sections/HomeSection";
import { LiveSection } from "./components/sections/LiveSection";
import { MapSection } from "./components/sections/MapSection";
import { QueueSection } from "./components/sections/QueueSection";
import { ReminderSection } from "./components/sections/ReminderSection";
import { ServiceSection } from "./components/sections/ServiceSection";
import { TravelSection } from "./components/sections/TravelSection";
import { liveLinks, navItems } from "./data/mockData";
import { api } from "./services/api";

const liveReminderStorageKey = "comic-con-buddy-live-reminders";

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
  const [liveReminderIds, setLiveReminderIds] = useState(() => {
    if (!storage) return [];
    try {
      return JSON.parse(storage.getItem(liveReminderStorageKey) || "[]");
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
    notify(`已将 ${spot} 设为路线途经点`);
  };

  const handleInviteBuddy = async (name) => {
    try {
      await api.createInvitation({
        buddyName: name,
        message: "一起逛展吗？"
      });
      notify(`已向 ${name} 发起同逛邀请`);
    } catch (error) {
      notify(`邀请失败：${error.message}`);
    }
  };

  const handlePlanRoute = (name) => {
    notify(`已为你和 ${name} 生成路线建议`);
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
            loading={loading.zones}
            mapResults={mapResults}
            onZoneChange={setActiveZone}
            onSetSpot={handleSetSpot}
          />
        );
      case "buddy":
        return (
          <BuddySection
            buddyFilter={buddyFilter}
            buddies={filteredBuddies}
            loading={loading.buddies}
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
      case "queue":
        return (
          <QueueSection
            queueOptions={queueOptions}
            onBook={handleBookQueue}
          />
        );
      case "live":
        return (
          <LiveSection
            onNotify={notify}
            onNavigate={setSection}
            reminderIds={liveReminderIds}
            onToggleReminder={handleToggleLiveReminder}
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
        return <HomeSection onNavigate={setSection} currentUser={currentUser} overview={overview} />;
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
