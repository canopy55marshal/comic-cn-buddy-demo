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

const quickEntrances = [
  { key: "food", title: "馆内补给", text: "奶茶、热食和应急用品一键下单，别等体力见底再找吃的。" },
  { key: "map", title: "场馆地图", text: "按馆区和服务点安排顺路动线，少走冤枉路。" },
  { key: "live", title: "直播链接", text: "查看现场正在直播的 Coser 和主播，快速找到对应平台账号。" },
  { key: "queue", title: "排队预约", text: "热门摄影区和服务点提前锁定时段，避开现场硬排。" },
  { key: "buddy", title: "搭子匹配", text: "快速找到同坑同好、临时互拍或顺路一起逛展的人。" },
  { key: "reminder", title: "智能提醒", text: "补妆、转场、返程这些关键节点提前提醒你。" },
  { key: "travel", title: "交通出行", text: "散场前提前看拼车点、地铁口、返程建议和痛车接驳招募。" },
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

export function HomeSection({ onNavigate, currentUser, overview, liveItineraryItems = [] }) {
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
          <strong>活动招募中：痛车司机接驳</strong>
          <p className="muted">聚焦散场接驳、车主报名和乘客登记，让返程这件事更像漫展活动能力，而不是单纯打车页。</p>
        </div>
        <div className="action-row">
          <span className="pill accent">活动招募中</span>
          <button className="btn primary" onClick={() => onNavigate("travel")}>查看招募</button>
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
          <span className="hero-badge">山海异兽幻想</span>
          <div className="hero-chips">
            <span className="chip">中式神秘气韵</span>
            <span className="chip">手绘游戏KV感</span>
            <span className="chip">异兽拟人灵感</span>
          </div>
          <h2>让这场漫展，<br />像你自己的山海异想主场</h2>
          <p className="hero-copy">
            {currentUser
              ? `${currentUser.name}，你现在在 ${currentUser.currentZone}。从补给、互拍、馆区路线到妆造救场，这里都能顺着当前这套国风二次元氛围一口气完成。`
              : "从补给、互拍、馆区路线到妆造救场，这里都能顺着当前这套国风二次元氛围一口气完成。"}
          </p>
          <div className="action-row hero-cta">
            <button className="btn primary" onClick={() => onNavigate("food")}>先点补给</button>
            <button className="btn ghost" onClick={() => onNavigate("buddy")}>找同好搭子</button>
            <button className="btn ghost" onClick={() => onNavigate("service")}>约妆造救场</button>
          </div>
          <div className="hero-stats-strip">
            <div>
              <strong>{String(overview?.metrics?.merchants ?? 0)}</strong>
              <span>补给商家</span>
            </div>
            <div>
              <strong>{String(overview?.metrics?.buddies ?? 0)}</strong>
              <span>搭子候选</span>
            </div>
            <div>
              <strong>{String(overview?.metrics?.services ?? 0)}</strong>
              <span>救场服务</span>
            </div>
          </div>
        </div>

        <div className="hero-side hero-poster">
          <div className="poster-overlay">
            <div className="poster-mist" />
            <div className="poster-ring poster-ring-a" />
            <div className="poster-ring poster-ring-b" />
            <span className="poster-kicker">山海经角色KV</span>
            <h3>把出片、补妆、找搭子<br />都收进同一幅手绘幻想里</h3>
            <p>现在这张主视觉已经改成更贴近你新图的方向，整体更像中式美学二次元游戏KV。</p>
            <div className="poster-stats">
              <StatsCard title="10" text="核心模块" />
              <StatsCard title={currentUser?.creditScore ? String(currentUser.creditScore) : "99"} text="当前状态" />
            </div>
          </div>
        </div>
      </div>

      <div className="section-layout">
        <div className="panel">
          <SectionHead title="十大能力" desc="把你路演里定义的核心能力，同步成用户当天能直接用的入口。" />
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

      {liveItineraryItems.length > 0 && (
        <div className="panel">
          <SectionHead
            title="直播行程"
            desc="把你准备关注或准备转场去看的直播单独收进首页，方便你在逛展过程中快速决策。"
            side={<span className="pill accent">已加入 {liveItineraryItems.length} 项</span>}
          />
          <div className="grid two">
            <div className="home-live-itinerary">
              <div>
                <strong>最近行程</strong>
                <p className="muted">
                  {liveItineraryItems[0].title}
                  {" "}· {liveItineraryItems[0].time}
                  {" "}· {liveItineraryItems[0].zone}
                </p>
              </div>
              <div className="action-row">
                <button className="btn primary" onClick={() => onNavigate("live")}>查看直播行程</button>
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
                    <span className="tag">{item.time}</span>
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
