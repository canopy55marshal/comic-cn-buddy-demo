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
  { id: "buddy", title: "最后发起同行", text: "把熟人同行邀约补上，方便补给、返程和转场一起做。", button: "去邀约" }
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

export function HomeSection({
  onNavigate,
  currentUser,
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
          side={<span className="pill info">已完成 {completedTodoCount} / {starterTodoItems.length}</span>}
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
                  <p className="muted">把首页主动作当成你的行程安排来推进，做完会留下完成标记。</p>
                </div>
                <span className="pill accent">{Math.round((completedTodoCount / starterTodoItems.length) * 100)}%</span>
              </div>
              <div className="invite-progress-track">
                <div className="today-progress-fill" style={{ width: `${(completedTodoCount / starterTodoItems.length) * 100}%` }} />
              </div>
              {(pickupFlowState?.jumped || pickupReminderItems.length > 0) && (
                <div className="business-milestone" style={{ marginTop: 12 }}>
                  <strong>取餐安排进度</strong>
                  <p className="muted">
                    {pickupFlowState?.status === "done"
                      ? "外卖下单回流承接已完成，系统会继续按提醒时间提示你取餐。"
                      : pickupFlowState?.nextSteps?.length
                        ? `当前已完成 ${pickupFlowDoneCount} / ${pickupFlowState.nextSteps.length} 步，建议继续完成取餐点、提醒和路线。`
                        : `当前已创建 ${pickupReminderItems.length} 条取餐提醒，回到餐饮页可继续安排取餐。`}
                  </p>
                  <div className="tag-row" style={{ marginTop: 8 }}>
                    {pickupFlowState?.pickupPoint && <span className="tag">取餐点：{pickupFlowState.pickupPoint}</span>}
                    {pickupReminderItems.length > 0 && <span className="tag">提醒 {pickupReminderItems.filter((item) => item.enabled).length} 项</span>}
                    {pickupFlowState?.status === "done" && <span className="tag">承接完成</span>}
                  </div>
                </div>
              )}
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
