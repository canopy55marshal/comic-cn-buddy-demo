import { liveLinks } from "../../data/mockData";
import { InfoCard, SectionHead, StatsCard } from "../ui";

const favoriteStorageKey = "comic-con-buddy-live-favorites";
const reminderStorageKey = "comic-con-buddy-live-reminders";
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
  { key: "live", title: "直播链接", text: "查看现场正在直播的 Coser 和主播，快速找到对应平台账号。" },
  { key: "queue", title: "排队预约", text: "热门摄影区和服务点提前锁定时段，避开现场硬排。" },
  { key: "buddy", title: "安全搭子", text: "快速找到安全可靠的同伴，降低一个人逛展的不安感。" },
  { key: "reminder", title: "智能提醒", text: "补妆、转场、返程这些关键节点提前提醒你。" },
  { key: "travel", title: "痛车出行", text: "支持痛车接驳、同IP拼车和 COS 友好返程路线。" },
  { key: "service", title: "化妆师补妆", text: "妆面花了能马上预约补妆，不耽误下一场拍摄。" },
  { key: "service", title: "毛娘修假发", text: "发包松动、碎发乱翘时，现场直接找人救场。" },
  { key: "service", title: "摄影预约分流", text: "摄影区太挤时，快速切到空档摄影师和替代点位。" }
];

const todayTips = [
  "上午优先冲热门摊位和主舞台，避免中午人流堆积。",
  "中午前先下补给单，能省掉排队和找座位的时间。",
  "出正片前先看摄影区拥堵情况，再决定是否分流到侧馆。",
  "热门服务点先做预约，不要到现场才开始排队。",
  "散场前 30 分钟就开始准备返程，门口通常最堵。",
  "如果想体验痛车接驳，建议提前查看车主招募和接驳路线。"
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

export function HomeSection({
  onNavigate,
  currentUser,
  overview,
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

  return (
    <>
      <div className="campaign-banner">
        <div>
          <strong>双主线升级：漫展现场服务 + COSER商业平台</strong>
          <p className="muted">这版首页开始对齐宣讲网页，把现场体验和 COSER 成交平台放进同一条产品叙事里。</p>
        </div>
        <div className="action-row">
          <span className="pill accent">定位已升级</span>
          <button className="btn primary" onClick={() => onNavigate("live")}>查看直播生态</button>
        </div>
      </div>

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
              ? `${currentUser.name}，你现在在 ${currentUser.currentZone}。前台帮你解决补给、导航、搭子、妆造和返程；后台再把 COSER 的商单撮合、托管交易和安全成交串起来。`
              : "前台解决补给、导航、搭子、妆造和返程，后台再把 COSER 的商单撮合、托管交易和安全成交串起来。"}
          </p>
          <div className="action-row hero-cta">
            <button className="btn primary" onClick={() => onNavigate("food")}>先看现场服务</button>
            <button className="btn ghost" onClick={() => onNavigate("buddy")}>进入安全搭子</button>
            <button className="btn ghost" onClick={() => onNavigate("service")}>查看妆造服务</button>
          </div>
          <div className="hero-stats-strip">
            <div>
              <strong>{String(overview?.metrics?.merchants ?? 0)}</strong>
              <span>现场补给</span>
            </div>
            <div>
              <strong>{String(overview?.metrics?.buddies ?? 0)}</strong>
              <span>安全搭子</span>
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

      <div className="section-layout">
        <div className="panel">
          <SectionHead title="九大核心模块" desc="把宣讲网页里的关键能力，同步成用户当天能直接用、能看懂的入口。" />
          <div className="grid three">
            {quickEntrances.map((item) => (
              <InfoCard key={item.title}>
                <strong>{item.title}</strong>
                <p className="muted">{item.text}</p>
                <div className="action-row">
                  <button className="btn ghost" onClick={() => onNavigate(item.key)}>进入</button>
                </div>
              </InfoCard>
            ))}
          </div>
        </div>

        <div className="panel">
          <SectionHead title="今日建议" desc="按漫展真实节奏安排，少走弯路，也少在现场临时手忙脚乱。 " />
          <div className="stack">
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
          title="COSER的Upwork"
          desc="把 AI撮合、托管交易和成交收费模型提前放到首页，避免 Demo 和宣讲网页的商业叙事脱节。"
          side={<span className="pill accent">成交才收费</span>}
        />
        <div className="grid two">
          <div className="home-upwork-hero">
            <strong>平台模式</strong>
            <p className="muted">COSER商业平台的核心不是单纯展示人，而是把需求、撮合、托管和交付流程收进同一个平台。</p>
            <div className="tag-row">
              <span className="tag">品牌商单</span>
              <span className="tag">漫展招募</span>
              <span className="tag">COS委托</span>
            </div>
            <div className="action-row">
              <button className="btn primary" onClick={() => onNavigate("buddy")}>先看撮合入口</button>
              <button className="btn ghost" onClick={() => onNavigate("service")}>查看服务供给</button>
            </div>
          </div>
          <div className="grid two">
            {upworkCards.map((item) => (
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
          {sortedPreviewLinks.slice(0, 3).map((item) => {
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
