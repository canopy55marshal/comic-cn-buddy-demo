import { useEffect, useMemo, useState } from "react";
import { liveLinks } from "../../data/mockData";
import { InfoCard, SectionHead, StatsCard } from "../ui";

const favoriteStorageKey = "comic-con-buddy-live-favorites";
const reminderStorageKey = "comic-con-buddy-live-reminders";
const homeActionStorageKey = "comic-con-buddy-home-actions";
const cpsReturnStorageKey = "comic-con-buddy-cps-return";
const platformIcons = {
  抖音: "🎵",
  B站: "📺",
  小红书: "📕",
  快手: "🎬"
};

function getPlatformBadgeClass(platform) {
  return {
    抖音: "douyin",
    B站: "bilibili",
    小红书: "xiaohongshu",
    快手: "kuaishou"
  }[platform] || "default";
}

function getStatusInfo(item) {
  if (!item.startsAt) {
    return {
      phase: "直播中",
      label: "直播中"
    };
  }

  const [hours, minutes] = item.startsAt.split(":").map(Number);
  const now = new Date();
  const start = new Date();
  start.setHours(hours, minutes, 0, 0);

  let diff = start.getTime() - now.getTime();
  if (diff <= 0) {
    diff += 24 * 60 * 60 * 1000;
  }

  const totalMinutes = Math.round(diff / 60000);
  const hourPart = Math.floor(totalMinutes / 60);
  const minutePart = totalMinutes % 60;

  return {
    phase: "即将开播",
    label: hourPart > 0 ? `${hourPart}小时${minutePart > 0 ? `${minutePart}分` : ""}后开播` : `${minutePart} 分钟后开播`
  };
}

function getLiveStatusLabel(time) {
  if (!time || time === "直播中") {
    return "直播中";
  }

  const [hours, minutes] = time.split(":").map(Number);
  const now = new Date();
  const start = new Date();
  start.setHours(hours, minutes, 0, 0);

  let diff = start.getTime() - now.getTime();
  if (diff <= 0) {
    diff += 24 * 60 * 60 * 1000;
  }

  const totalMinutes = Math.round(diff / 60000);
  const hourPart = Math.floor(totalMinutes / 60);
  const minutePart = totalMinutes % 60;
  return hourPart > 0 ? `${hourPart}小时${minutePart > 0 ? `${minutePart}分` : ""}后开播` : `${minutePart} 分钟后开播`;
}

const quickEntrances = [
  { key: "food", title: "餐饮配送", text: "提前订餐，场内配送，别等体力见底再找吃的。" },
  { key: "map", title: "场馆导航", text: "按馆区、楼层和服务点安排顺路动线，少走冤枉路。" },
  { key: "queue", title: "排队预约", text: "热门摄影区和服务点提前锁定时段，避开现场硬排。" },
  { key: "buddy", title: "好友同行", text: "熟人邀约同行激励，用分享裂变扩大用户量，规避陌生社交风险。" }
];

const secondaryEntrances = [
  { key: "business", title: "商业平台" },
  { key: "live", title: "直播链接" },
  { key: "reminder", title: "智能提醒" },
  { key: "travel", title: "交通出行" },
  { key: "service", title: "妆造服务" }
];

const todayTips = [
  "上午优先冲热门摊位和主舞台，避免中午人流堆积。",
  "中午前先下补给单，能省掉排队和找座位的时间。",
  "热门服务点先做预约，不要到现场才开始排队。",
  "散场前 30 分钟就开始准备返程，门口通常最堵。"
];

const upworkCards = [
  {
    title: "AI智能撮合",
    tag: "6维匹配",
    text: "不只推头部 COSER，而是按风格、地域、档期、潜力、性价比和公平轮换做推荐。"
  },
  {
    title: "托管付款",
    tag: "成交才收费",
    text: "品牌商单支持分阶段托管，成交前钱在平台，COSER 和品牌两边都更放心。"
  },
  {
    title: "保证金机制",
    tag: "过滤假需求",
    text: "发布需求先交保证金，成交后退还，取消扣减，优先过滤掉低质量或试探型需求。"
  },
  {
    title: "三种需求来源",
    tag: "平台化",
    text: "品牌商单、漫展招募、COS委托统一进入平台，形成更稳定的需求池。"
  }
];

const starterTodoItems = [
  { id: "map", title: "先确认馆区位置", text: "先打开场馆地图，确认自己和主舞台、服务点的相对位置。", button: "去地图" },
  { id: "food", title: "再补给", text: "先把吃喝或应急用品锁掉，别等体力见底再找。", button: "去补给" },
  { id: "queue", title: "热门项目先预约", text: "摄影区和热门活动优先锁时段，减少硬排队。", button: "去预约" },
  { id: "buddy", title: "最后发起同行", text: "把熟人同行邀约补上，方便补给、返程和转场一起做。", button: "去邀约" },
  { id: "travel", title: "返程方案提前锁", text: "散场前先把返程路线定好，避免最后一刻再挤在门口决策。", button: "去返程" }
];

function getRecommendedAction(currentZone = "") {
  if (currentZone.includes("主舞台")) {
    return {
      id: "queue",
      title: "推荐先锁排队预约",
      text: "你现在更接近主舞台区域，先把热门活动或摄影时段锁住，后面会更从容。",
      tags: ["主舞台", "预约优先", "避开硬排"]
    };
  }

  if (currentZone.includes("服务区") || currentZone.includes("北门")) {
    return {
      id: "food",
      title: "推荐先补给或整理状态",
      text: "你现在更靠近服务区，适合先点补给或处理补妆、休整这些即时需求。",
      tags: ["服务区", "补给优先", "状态恢复"]
    };
  }

  return {
    id: "map",
    title: "推荐先看场馆地图",
    text: "先确认自己在馆内的相对位置，再决定是去补给、预约还是跟着主播行程转场。",
    tags: ["路线优先", "少走回头路", "先看位置"]
  };
}

function getPickupNextFocus(pickupPoint = "") {
  if (pickupPoint.includes("B馆")) {
    return {
      title: "下一步建议去摄影区",
      text: "你当前的取餐点更靠近摄影区，适合取餐后顺路去看预约档期或补拍摄动线。",
      action: "queue",
      button: "去排队预约"
    };
  }
  if (pickupPoint.includes("北门")) {
    return {
      title: "下一步建议整理返程或服务",
      text: "你当前的取餐点靠近服务区和返程点，适合取餐后顺手处理补妆或返程决策。",
      action: "travel",
      button: "去交通出行"
    };
  }
  if (pickupPoint.includes("A馆")) {
    return {
      title: "下一步建议回主舞台附近",
      text: "你当前的取餐点更靠近主舞台，适合补给后继续看活动或同步直播热度。",
      action: "live",
      button: "去直播链接"
    };
  }
  return {
    title: "下一步建议回首页继续安排",
    text: "这次取餐安排已经闭环，可以回到首页继续推进当天其他任务。",
    action: "home",
    button: "回首页"
  };
}

function getTimePhaseInfo(hour) {
  if (hour < 11) {
    return {
      key: "morning",
      label: "上午阶段",
      target: "先跑通路线、补给和预约主线",
      hint: "上午最适合先定路线、锁预约，不要把高优先级动作拖到中午以后。"
    };
  }
  if (hour < 15) {
    return {
      key: "noon",
      label: "中午阶段",
      target: "完成补给、取餐和状态恢复",
      hint: "中午更适合处理补给、取餐和休整，避免体力和妆面在下午掉下来。"
    };
  }
  if (hour < 18) {
    return {
      key: "afternoon",
      label: "下午阶段",
      target: "补齐预约、同行和返程收尾",
      hint: "下午适合把剩余预约、同行协同和返程方案一起收尾。"
    };
  }
  return {
    key: "evening",
    label: "散场前阶段",
    target: "确认返程、提醒和最后动线",
    hint: "散场前优先处理返程和最后提醒，别把决策堆到出馆口。"
  };
}

function getTodayNextStep({
  completedActions,
  pickupFlowState,
  pickupFlowCompleted,
  pickupFlowDoneCount,
  pickupFlowTotal,
  currentZone,
  currentHour,
  nextLiveReminder,
  mapActiveZone,
  liveMapContext
}) {
  const timePhase = getTimePhaseInfo(currentHour);
  const mapTargetZone = liveMapContext?.targetZone || mapActiveZone;

  if (pickupFlowState?.jumped && !pickupFlowCompleted) {
    if (!pickupFlowState.pickupPoint) {
      return {
        title: "先确认取餐点",
        text: "你已经完成外部下单，当前最关键的是先把取餐点锁定，后面的提醒和路线才有依据。",
        action: "food",
        button: "去完成取餐安排"
      };
    }
    if (pickupFlowTotal > 0 && pickupFlowDoneCount < pickupFlowTotal) {
      return {
        title: "继续完成取餐闭环",
        text: "你已经选好取餐点，建议继续补取餐提醒和路线确认，把这条链路闭环。",
        action: "food",
        button: "继续取餐安排"
      };
    }
  }

  if ((timePhase.key === "afternoon" || timePhase.key === "evening") && nextLiveReminder && !completedActions.includes("live")) {
    return {
      title: "留意接下来的直播提醒",
      text: `${nextLiveReminder.title} 即将开始，现在适合先确认路线和当前位置，别错过想看的内容。`,
      action: "live",
      button: "去直播链接"
    };
  }

  if (!completedActions.includes("map")) {
    if (timePhase.key === "evening") {
      return {
        title: "先确认最后动线",
        text: "散场前先把当前位置、出入口和服务点关系看清，后面处理返程会更轻松。",
        action: "map",
        button: "去场馆地图"
      };
    }
    if (currentZone?.includes("主舞台")) {
      return {
        title: "先确认主舞台周边路线",
        text: "你当前更靠近主舞台，建议先看主舞台和服务区的相对位置，避免活动开始后再临时找路。",
        action: "map",
        button: "去场馆地图"
      };
    }
    if (currentZone?.includes("摄影")) {
      return {
        title: "先确认摄影区动线",
        text: "你当前更靠近摄影区，先看主摄影棚、空景区和服务点的相对位置会更省时间。",
        action: "map",
        button: "去场馆地图"
      };
    }
    return {
      title: "先看场馆地图",
      text: "今天最该先完成的是路线判断，先知道自己在哪，再决定补给、预约还是返程。",
      action: "map",
      button: "去场馆地图"
    };
  }
  if (mapTargetZone && !completedActions.includes("queue") && (mapTargetZone.includes("主舞台") || mapTargetZone.includes("摄影"))) {
    return {
      title: "沿当前地图目标继续推进",
      text: `你刚刚锁定了 ${mapTargetZone}，现在最适合继续处理该区域附近的预约或热门项目。`,
      action: "queue",
      button: "去排队预约"
    };
  }
  if (!completedActions.includes("food")) {
    if (timePhase.key === "noon") {
      return {
        title: "中午先处理补给",
        text: "现在正适合补给和取餐，把体力和状态稳住，下午会更从容。",
        action: "food",
        button: "去餐饮配送"
      };
    }
    if (currentZone?.includes("服务区") || currentZone?.includes("北门")) {
      return {
        title: "接下来先补给或取餐",
        text: "你现在更靠近服务区，先把补给和取餐相关安排处理掉，后面会更从容。",
        action: "food",
        button: "去餐饮配送"
      };
    }
    return {
      title: "接下来先补给",
      text: "路线确认后，下一步最适合先解决补给和取餐，不要等到体力下滑再补。",
      action: "food",
      button: "去餐饮配送"
    };
  }
  if (!completedActions.includes("queue")) {
    if (timePhase.key === "morning") {
      return {
        title: "上午优先锁预约",
        text: "上午是锁热门项目最划算的时间，先把预约拿下，后面行程会更稳。",
        action: "queue",
        button: "去排队预约"
      };
    }
    if (currentZone?.includes("主舞台") || currentZone?.includes("摄影")) {
      return {
        title: "接下来优先锁预约",
        text: "你当前更靠近高热区域，适合先把热门摄影区或活动时段锁住，减少硬排。",
        action: "queue",
        button: "去排队预约"
      };
    }
    return {
      title: "接下来锁预约",
      text: "补给安排之后，建议优先把热门摄影区或活动时段锁定，减少现场硬排。",
      action: "queue",
      button: "去排队预约"
    };
  }
  if (!completedActions.includes("travel")) {
    if (timePhase.key === "evening" || timePhase.key === "afternoon") {
      return {
        title: "现在开始处理返程",
        text: "已经进入后半段，建议先把返程方式锁定，避免散场后再临时决策。",
        action: "travel",
        button: "去交通出行"
      };
    }
    if (currentZone?.includes("北门") || currentZone?.includes("服务区")) {
      return {
        title: "现在就顺手处理返程",
        text: "你已经更靠近服务区和出入口，适合现在就把返程方案定掉，避免散场再决策。",
        action: "travel",
        button: "去交通出行"
      };
    }
    return {
      title: "提前处理返程安排",
      text: "当天后半段最容易被忽略的是返程，提前定好出馆方式会轻松很多。",
      action: "travel",
      button: "去交通出行"
    };
  }
  if (!completedActions.includes("live") && nextLiveReminder) {
    return {
      title: "顺手处理直播提醒",
      text: `${nextLiveReminder.title} 已经在你的提醒列表里，适合现在确认一下开播前的位置和转场节奏。`,
      action: "live",
      button: "去直播链接"
    };
  }
  if (!completedActions.includes("buddy")) {
    return {
      title: "最后补同行协同",
      text: "主线任务做完后，可以补一下同行邀约或共享返程，让后续安排更顺。",
      action: "buddy",
      button: "去好友同行"
    };
  }
  return {
    title: "今天主线已推进完成",
    text: "主线任务已经基本闭环，接下来可以按兴趣去直播、商业平台或继续细化当天安排。",
    action: "live",
    button: "去直播链接"
  };
}

export function HomeSection({
  onNavigate,
  currentUser,
  mapActiveZone = "",
  liveMapContext = null,
  overview,
  completedActions: completedActionsProp = [],
  pickupReminderItems = [],
  liveItineraryItems = [],
  onToggleLiveItinerary,
  onOpenLiveMap,
  onOpenLiveQueue
}) {
  const favoriteIds = (() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(window.localStorage.getItem(favoriteStorageKey) || "[]");
    } catch {
      return [];
    }
  })();
  const liveReminderIds = (() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(window.localStorage.getItem(reminderStorageKey) || "[]");
    } catch {
      return [];
    }
  })();
  const sortedPreviewLinks = [...liveLinks].sort((a, b) => {
    const aFav = favoriteIds.includes(a.id) ? 1 : 0;
    const bFav = favoriteIds.includes(b.id) ? 1 : 0;
    const aLive = getStatusInfo(a).phase === "直播中" ? 1 : 0;
    const bLive = getStatusInfo(b).phase === "直播中" ? 1 : 0;
    return bFav - aFav || bLive - aLive;
  });
  const remindedLives = liveLinks.filter((item) => liveReminderIds.includes(item.id));
  const nextLiveReminder = [...remindedLives].sort((a, b) => {
    const aTime = a.startsAt || "99:99";
    const bTime = b.startsAt || "99:99";
    return aTime.localeCompare(bTime);
  })[0];
  const [completedActions, setCompletedActions] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      return completedActionsProp.length > 0
        ? completedActionsProp
        : JSON.parse(window.localStorage.getItem(homeActionStorageKey) || "[]");
    } catch {
      return completedActionsProp;
    }
  });
  const [justCompleted, setJustCompleted] = useState("");
  const [pickupFlowState, setPickupFlowState] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      return JSON.parse(window.localStorage.getItem(cpsReturnStorageKey) || "null");
    } catch {
      return null;
    }
  });
  const recommendedAction = useMemo(() => getRecommendedAction(currentUser?.currentZone || ""), [currentUser?.currentZone]);
  const completedTodoCount = starterTodoItems.filter((item) => completedActions.includes(item.id)).length;
  const pickupFlowDoneCount = (pickupFlowState?.nextSteps || []).filter((item) => item.done).length;
  const pickupFlowCompleted = pickupFlowState?.status === "done";
  const pickupFlowTotal = pickupFlowState?.nextSteps?.length || 0;
  const journeyTotal = starterTodoItems.length + pickupFlowTotal;
  const journeyDone = completedTodoCount + pickupFlowDoneCount;
  const journeyPercent = journeyTotal ? Math.round((journeyDone / journeyTotal) * 100) : 0;
  const currentHour = new Date().getHours();
  const timePhase = useMemo(() => getTimePhaseInfo(currentHour), [currentHour]);
  const tripGoal = journeyPercent >= 100
    ? "本次行程主线已完成"
    : journeyPercent >= 75
      ? "行程目标：收尾并准备返程"
      : journeyPercent >= 40
        ? "行程目标：完成补给、预约和取餐闭环"
        : "行程目标：先把路线、补给和预约主线跑通";
  const pickupNextFocus = useMemo(() => getPickupNextFocus(pickupFlowState?.pickupPoint || ""), [pickupFlowState?.pickupPoint]);
  const todayNextStep = useMemo(
    () => getTodayNextStep({
      completedActions,
      pickupFlowState,
      pickupFlowCompleted,
      pickupFlowDoneCount,
      pickupFlowTotal,
      currentZone: currentUser?.currentZone,
      currentHour,
      nextLiveReminder,
      mapActiveZone,
      liveMapContext
    }),
    [completedActions, pickupFlowState, pickupFlowCompleted, pickupFlowDoneCount, pickupFlowTotal, currentUser?.currentZone, currentHour, nextLiveReminder, mapActiveZone, liveMapContext]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(homeActionStorageKey, JSON.stringify(completedActions));
  }, [completedActions]);

  useEffect(() => {
    setCompletedActions(completedActionsProp);
  }, [completedActionsProp]);

  useEffect(() => {
    if (!justCompleted) return undefined;
    const timer = window.setTimeout(() => setJustCompleted(""), 1400);
    return () => window.clearTimeout(timer);
  }, [justCompleted]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const syncPickupFlow = () => {
      try {
        setPickupFlowState(JSON.parse(window.localStorage.getItem(cpsReturnStorageKey) || "null"));
      } catch {
        setPickupFlowState(null);
      }
    };
    syncPickupFlow();
    window.addEventListener("focus", syncPickupFlow);
    document.addEventListener("visibilitychange", syncPickupFlow);
    return () => {
      window.removeEventListener("focus", syncPickupFlow);
      document.removeEventListener("visibilitychange", syncPickupFlow);
    };
  }, []);

  const handleChecklistAction = (key) => {
    setCompletedActions((prev) => (prev.includes(key) ? prev : [...prev, key]));
    setJustCompleted(key);
    onNavigate(key);
  };

  return (
    <>
      <div className="hero">
        <div className="hero-main hero-banner">
          <div className="hero-decor hero-decor-left" />
          <div className="hero-decor hero-decor-right" />
          <div className="hero-foxfire hero-foxfire-a" />
          <div className="hero-foxfire hero-foxfire-b" />
          <div className="hero-flower hero-flower-a">✦</div>
          <div className="hero-flower hero-flower-b">✦</div>
          <span className="hero-badge">漫展现场服务 + COSER商业平台</span>
          <div className="hero-chips">
            <span className="chip">AI撮合</span>
            <span className="chip">托管交易</span>
            <span className="chip">成交才收费</span>
          </div>
          <h2>漫展有搭子，玩展不累。<br />让 COSER 的每一分热爱都值得。</h2>
          <p className="hero-copy">
            {currentUser
              ? `${currentUser.name}，你现在在 ${currentUser.currentZone}。建议先从补给、导航、预约或好友同行里选一个主动作开始，商业平台能力放到下方继续看。`
              : "先从补给、导航、预约或好友同行里选一个主动作开始；商业平台能力放到下方继续看。"}
          </p>
          <div className="hero-dual-entry">
            <InfoCard className="hero-entry-card">
              <strong>现场服务</strong>
              <p className="muted">适合已经在漫展现场，先解决补给、导航、预约和同行这些即时需求。</p>
              <div className="tag-row">
                <span className="tag">餐饮配送</span>
                <span className="tag">场馆导航</span>
                <span className="tag">排队预约</span>
              </div>
              <div className="action-row">
                <button className="btn primary" onClick={() => onNavigate("food")}>进入现场服务</button>
                <button className="btn ghost" onClick={() => onNavigate("map")}>打开地图</button>
              </div>
            </InfoCard>
            <InfoCard className="hero-entry-card">
              <strong>商业平台</strong>
              <p className="muted">适合想看品牌商单、漫展招募和 COS委托，理解平台撮合和托管交易模式。</p>
              <div className="tag-row">
                <span className="tag">品牌商单</span>
                <span className="tag">漫展招募</span>
                <span className="tag">COS委托</span>
              </div>
              <div className="action-row">
                <button className="btn primary" onClick={() => onNavigate("business")}>进入商业平台</button>
              </div>
            </InfoCard>
          </div>
          <div className="hero-stats-strip">
            <div>
              <strong>{String(overview?.metrics?.merchants ?? 0)}</strong>
              <span>现场补给</span>
            </div>
            <div>
              <strong>{String(overview?.metrics?.buddies ?? 0)}</strong>
              <span>同行邀约</span>
            </div>
            <div>
              <strong>{String(overview?.metrics?.services ?? 0)}</strong>
              <span>COS服务</span>
            </div>
          </div>
        </div>

        <div className="hero-side hero-poster">
          <div className="poster-overlay">
            <div className="poster-mist" />
            <div className="poster-ring poster-ring-a" />
            <div className="poster-ring poster-ring-b" />
            <span className="poster-kicker">COSER 的 Upwork</span>
            <h3>AI撮合 + 托管交易<br />成交才收费</h3>
            <p>品牌商单、漫展招募和 COS 委托统一进平台，先匹配，再托管，再成交。</p>
            <div className="poster-stats">
              <StatsCard title="3" text="需求来源" />
              <StatsCard title="15%" text="平台抽佣" />
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <SectionHead
          title="现场服务推荐动作"
          desc="左边先选要做的事项，右边看推荐动作和行程安排进度，让首页更像行动面板而不是大表单。"
          side={<span className="pill info">已完成 {journeyDone} / {journeyTotal || starterTodoItems.length}</span>}
        />
        <div className="guided-layout">
          <div className="stack">
            {starterTodoItems.map((item) => {
              const completed = completedActions.includes(item.id);
              return (
                <InfoCard key={item.title} className={`todo-like-card compact ${completed ? "completed" : ""} ${justCompleted === item.id ? "just-completed" : ""}`}>
                  <div className="row between start">
                    <strong>{item.title}</strong>
                    <span className={`todo-check ${completed ? "done" : ""}`}>{completed ? "✓" : ""}</span>
                  </div>
                  <p className="muted">{item.text}</p>
                  <div className="action-row">
                    <button className="btn ghost" onClick={() => handleChecklistAction(item.id)}>
                      {completed ? "已完成" : item.button}
                    </button>
                  </div>
                </InfoCard>
              );
            })}
          </div>
          <div className="stack">
            <InfoCard className="today-progress-card">
              <div className="row between start">
                <div>
                  <strong>行程安排进度</strong>
                  <p className="muted">把首页主动作和取餐安排放进同一条行程里推进，做完会留下完成标记。</p>
                </div>
                <span className="pill accent">{journeyPercent}%</span>
              </div>
              <div className="invite-progress-track">
                <div className="today-progress-fill" style={{ width: `${journeyPercent}%` }} />
              </div>
              <div className="today-task-card">
                <div className="row between start">
                  <div>
                    <strong>行程任务卡</strong>
                    <p className="muted">{timePhase.label} · {currentUser?.currentZone || "馆内移动中"}</p>
                  </div>
                  <span className="pill info">{journeyPercent}%</span>
                </div>
                <div className="tag-row">
                  <span className="tag">{timePhase.target}</span>
                  {currentUser?.currentZone && <span className="tag">{currentUser.currentZone}</span>}
                  {mapActiveZone && <span className="tag">地图目标：{liveMapContext?.targetZone || mapActiveZone}</span>}
                  {nextLiveReminder && <span className="tag">直播提醒待处理</span>}
                </div>
                <p className="muted">{timePhase.hint}</p>
                {(mapActiveZone || nextLiveReminder) && (
                  <div className="stack" style={{ marginTop: 8 }}>
                    {mapActiveZone && (
                      <div className="business-milestone">
                        地图当前更偏向 `{liveMapContext?.targetZone || mapActiveZone}`，首页推荐会优先沿这个区域继续推进。
                      </div>
                    )}
                    {nextLiveReminder && (
                      <div className="business-milestone">
                        当前有直播提醒待处理：`{nextLiveReminder.title}`，建议结合所在馆区决定是否顺路切过去。
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="today-goal-card">
                <strong>{tripGoal}</strong>
                <p className="muted">
                  {journeyPercent >= 100
                    ? "本次行程主线已经闭环，接下来可以按兴趣自由扩展直播、商业平台或更细的现场安排。"
                    : "系统会根据你当前馆区和已完成事项，持续推荐这次行程里最值得优先处理的下一步。"}
                </p>
              </div>
              <div className="tag-row">
                <span className="tag">现场任务 {completedTodoCount} / {starterTodoItems.length}</span>
                {pickupFlowTotal > 0 && <span className="tag">取餐任务 {pickupFlowDoneCount} / {pickupFlowTotal}</span>}
              </div>
              {(pickupFlowState?.jumped || pickupReminderItems.length > 0) && (
                <div className={`pickup-progress-card ${pickupFlowCompleted ? "completed" : ""}`} style={{ marginTop: 12 }}>
                  <div className="row between start">
                    <strong>取餐安排进度</strong>
                    <span className={`pill ${pickupFlowCompleted ? "success" : "accent"}`}>{pickupFlowCompleted ? "已完成" : "进行中"}</span>
                  </div>
                  <p className="muted">
                    {pickupFlowCompleted
                      ? "外卖下单回流承接已完成，系统会继续按提醒时间提示你取餐。"
                      : pickupFlowState?.nextSteps?.length
                        ? `当前已完成 ${pickupFlowDoneCount} / ${pickupFlowState.nextSteps.length} 步，建议继续完成取餐点、提醒和路线。`
                        : `当前已创建 ${pickupReminderItems.length} 条取餐提醒，回到餐饮页可继续安排取餐。`}
                  </p>
                  {pickupFlowState?.nextSteps?.length > 0 && (
                    <div className="invite-progress-track">
                      <div className="today-progress-fill" style={{ width: `${pickupFlowCompleted ? 100 : Math.round((pickupFlowDoneCount / pickupFlowState.nextSteps.length) * 100)}%` }} />
                    </div>
                  )}
                  <div className="tag-row" style={{ marginTop: 8 }}>
                    {pickupFlowState?.pickupPoint && <span className="tag">取餐点：{pickupFlowState.pickupPoint}</span>}
                    {pickupReminderItems.length > 0 && <span className="tag">提醒 {pickupReminderItems.filter((item) => item.enabled).length} 项</span>}
                    {pickupFlowCompleted && <span className="tag">承接完成</span>}
                  </div>
                  <div className="action-row">
                    <button className={`btn ${pickupFlowCompleted ? "ghost" : "primary"}`} onClick={() => onNavigate("food")}>
                      {pickupFlowCompleted ? "查看取餐安排" : "继续完成取餐安排"}
                    </button>
                  </div>
                </div>
              )}
              {pickupFlowCompleted && (
                <div className="pickup-next-card">
                  <div className="row between start">
                    <div>
                      <strong>{pickupNextFocus.title}</strong>
                      <p className="muted">{pickupNextFocus.text}</p>
                    </div>
                    <span className="pill success">下一步</span>
                  </div>
                  <div className="action-row">
                    <button className="btn ghost" onClick={() => onNavigate(pickupNextFocus.action)}>{pickupNextFocus.button}</button>
                  </div>
                </div>
              )}
              <div className="today-next-card">
                <div className="row between start">
                  <div>
                    <strong>行程推荐下一步</strong>
                    <p className="muted">{todayNextStep.title}</p>
                  </div>
                  <span className="pill accent">推荐</span>
                </div>
                <p className="muted">{todayNextStep.text}</p>
                <div className="action-row">
                  <button className="btn primary" onClick={() => onNavigate(todayNextStep.action)}>{todayNextStep.button}</button>
                </div>
              </div>
            </InfoCard>
            <InfoCard className={`todo-recommend-card ${completedActions.includes(recommendedAction.id) ? "completed" : ""} ${justCompleted === recommendedAction.id ? "just-completed" : ""}`}>
              <div className="row between start">
                <div>
                  <strong>{recommendedAction.title}</strong>
                  <p className="muted">{recommendedAction.text}</p>
                </div>
                <span className={`pill ${completedActions.includes(recommendedAction.id) ? "success" : "accent"}`}>
                  {completedActions.includes(recommendedAction.id) ? "已完成" : "推荐"}
                </span>
              </div>
              <div className="tag-row">
                {recommendedAction.tags.map((item) => (
                  <span className="tag" key={item}>{item}</span>
                ))}
              </div>
              <div className="action-row">
                <button className="btn primary" onClick={() => handleChecklistAction(recommendedAction.id)}>
                  {completedActions.includes(recommendedAction.id) ? "再次查看" : "按推荐开始"}
                </button>
              </div>
            </InfoCard>
          </div>
        </div>
      </div>

      <div className="section-layout">
        <div className="panel">
          <SectionHead title="现在先做什么" desc="首页先只保留最关键的 4 个动作，避免信息太满导致不知道先点哪里。" />
          <div className="grid two">
            {quickEntrances.map((item) => (
              <InfoCard
                key={item.title}
                className={`home-focus-card ${completedActions.includes(item.key) ? "completed" : ""} ${justCompleted === item.key ? "just-completed" : ""}`}
              >
                <div className="row between start">
                  <strong>{item.title}</strong>
                  {completedActions.includes(item.key) && <span className="pill success">已完成</span>}
                </div>
                <p className="muted">{item.text}</p>
                <div className="action-row">
                  <button className="btn ghost" onClick={() => handleChecklistAction(item.key)}>
                    {completedActions.includes(item.key) ? "再次进入" : "进入"}
                  </button>
                </div>
              </InfoCard>
            ))}
          </div>
        </div>

        <div className="panel">
          <SectionHead title="更多入口" desc="剩下的能力放成次级入口，用户先完成主动作，再按需要进入。" />
          <div className="home-secondary-actions">
            {secondaryEntrances.map((item) => (
              <button key={item.title} className="btn ghost" onClick={() => onNavigate(item.key)}>{item.title}</button>
            ))}
          </div>
          <div className="stack" style={{ marginTop: 16 }}>
            {todayTips.map((item) => (
              <InfoCard key={item}>
                <p>{item}</p>
              </InfoCard>
            ))}
          </div>
        </div>
      </div>

      <div className="panel">
        <SectionHead
          title="商业平台摘要"
          desc="首页只保留最核心的商业模式摘要，详细规则进入商业平台页查看。"
          side={<span className="pill accent">成交才收费</span>}
        />
        <div className="grid two">
          <div className="home-upwork-hero">
            <strong>平台模式</strong>
            <p className="muted">品牌商单、漫展招募和 COS委托统一进入平台，首页只保留一句话摘要，避免再次把信息堆满。</p>
            <div className="tag-row">
              <span className="tag">品牌商单</span>
              <span className="tag">漫展招募</span>
              <span className="tag">COS委托</span>
            </div>
            <div className="action-row">
              <button className="btn primary" onClick={() => onNavigate("business")}>进入商业平台</button>
              <button className="btn ghost" onClick={() => onNavigate("service")}>查看服务供给</button>
            </div>
          </div>
          <div className="grid two">
            {upworkCards.slice(0, 3).map((item) => (
              <InfoCard key={item.title}>
                <div className="row between start">
                  <strong>{item.title}</strong>
                  <span className="pill info">{item.tag}</span>
                </div>
                <p className="muted">{item.text}</p>
              </InfoCard>
            ))}
          </div>
        </div>
      </div>

      {liveItineraryItems.length > 0 && (
        <div className="panel">
          <SectionHead
            title="主播行程"
            desc="把你关注的主播直播安排单独收进首页，方便你随时查看、决定要不要去看和怎么转场。"
            side={<span className="pill accent">已加入 {liveItineraryItems.length} 项</span>}
          />
          <div className="grid two">
            <div className="home-live-itinerary">
              <div>
                <strong>最近一项</strong>
                <p className="muted">
                  {liveItineraryItems[0].title}
                  {" "}· {liveItineraryItems[0].time}
                  {" "}· {liveItineraryItems[0].zone}
                </p>
              </div>
              <div className="action-row">
                <button className="btn primary" onClick={() => onNavigate("live")}>查看主播行程</button>
                <button className="btn ghost" onClick={() => onNavigate("queue")}>去排队预约</button>
              </div>
            </div>
            <div className="stack">
              {liveItineraryItems.slice(0, 3).map((item) => (
                <InfoCard key={item.id}>
                  <strong>{item.title}</strong>
                  <div className="tag-row">
                    <span className="tag">{item.platform}</span>
                    <span className="tag">{item.zone}</span>
                    <span className="tag">{getLiveStatusLabel(item.time)}</span>
                  </div>
                  <div className="action-row">
                    <button className="btn ghost" onClick={() => onOpenLiveMap?.(item)}>去地图</button>
                    <button className="btn ghost" onClick={() => onOpenLiveQueue?.(item)}>去排队预约</button>
                    <button className="btn ghost" onClick={() => onToggleLiveItinerary?.({ id: item.sourceId, name: item.name })}>移出主播行程</button>
                  </div>
                </InfoCard>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="panel">
        <SectionHead
          title="直播链接"
          desc="集中展示现场正在直播的 Coser 和主播账号，方便你快速找到对应平台和当前馆区。 "
          side={<span className="pill accent">直播中 {liveLinks.filter((item) => getStatusInfo(item).phase === "直播中").length} 场</span>}
        />
        {liveReminderIds.length > 0 && (
          <div className="home-live-summary">
            <div>
              <strong>直播提醒摘要</strong>
              <p className="muted">
                当前已关注 {liveReminderIds.length} 个开播提醒
                {nextLiveReminder ? `，最近提醒倒计时：${nextLiveReminder.name} ${getStatusInfo(nextLiveReminder).label}` : "。"}
              </p>
            </div>
            <div className="action-row">
              <button className="btn primary" onClick={() => onNavigate("reminder")}>直播提醒</button>
              <button className="btn ghost" onClick={() => onNavigate("live")}>去看主播</button>
            </div>
          </div>
        )}
        <div className="row between start" style={{ marginBottom: 12 }}>
          <p className="muted">首页优先展示你已关注的主播，想看更多平台和馆区筛选可进入详情页。</p>
          <button className="btn ghost" onClick={() => onNavigate("live")}>查看更多</button>
        </div>
        <div className="grid three">
          {sortedPreviewLinks.slice(0, 2).map((item) => {
            const statusInfo = getStatusInfo(item);
            return (
            <InfoCard key={item.id}>
              <div className="row between start">
                <strong>{item.name}</strong>
                <span className={`pill ${statusInfo.phase === "直播中" ? "accent" : "info"}`}>{statusInfo.label}</span>
              </div>
              <p className="muted">
                <span className={`platform-badge ${getPlatformBadgeClass(item.platform)}`}>{platformIcons[item.platform]} {item.platform}</span>
                {" "}· {item.account}
              </p>
              <div className="tag-row">
                <span className="tag">{item.zone}</span>
                <span className="tag">{item.viewers}</span>
                {favoriteIds.includes(item.id) && <span className="tag">已关注</span>}
              </div>
              <p className="muted">{item.liveTitle}</p>
              <div className="action-row">
                <button className="btn ghost" onClick={() => onNavigate("live")}>查看直播链接</button>
              </div>
            </InfoCard>
            );
          })}
        </div>
      </div>
    </>
  );
}
