import { useEffect, useMemo, useState } from "react";
import { liveLinks, livePlatforms } from "../../data/mockData";
import { FilterBar, InfoCard, SectionHead } from "../ui";

const liveTips = [
  "优先看和你当前馆区一致的直播，信息会更实时。",
  "想冲热门摊位时，先看现场主播的排队实况，比盲冲更稳。",
  "直播账号页适合快速收藏，等你换馆区或返程时再回看。"
];

const statusOptions = ["全部", "直播中", "即将开播"];
const sortOptions = ["默认排序", "热度优先", "直播中优先"];
const favoriteStorageKey = "comic-con-buddy-live-favorites";
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

function parseHeat(value) {
  const normalized = value.replace("预约 ", "").trim().toLowerCase();
  if (normalized.endsWith("w")) {
    return Number(normalized.replace("w", "")) * 10000;
  }
  if (normalized.endsWith("k")) {
    return Number(normalized.replace("k", "")) * 1000;
  }
  return Number(normalized) || 0;
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

  if (hourPart > 0) {
    return {
      phase: "即将开播",
      label: `${hourPart}小时${minutePart > 0 ? `${minutePart}分` : ""}后开播`
    };
  }

  return {
    phase: "即将开播",
    label: `${minutePart} 分钟后开播`
  };
}

function getRouteAdvice(item) {
  if (item.zone.includes("摄影区")) return "建议从 B馆摄影区侧入口进入，优先看空景位，再决定是否转主棚。";
  if (item.zone.includes("主舞台")) return "建议走 A馆侧通道接近舞台区，避开正面主队列。";
  if (item.zone.includes("同人摊位")) return "建议先锁定目标摊位，再顺着 C馆主通道一路逛过去。";
  if (item.zone.includes("服务区")) return "建议先经过北门服务区处理补妆或补给，再决定是否继续转场。";
  if (item.zone.includes("地铁口")) return "建议先看返程拥堵情况，再决定是地铁还是改走拼车点。";
  return "建议先看当前馆区热度，再决定是否临时转场。";
}

function getWorthGoing(item) {
  if (item.heat === "爆满" || item.heat === "高热区") {
    return "值得去，但最好提前规划路线，不然大概率会被队伍和人流拖慢。";
  }
  if (item.heat === "持续升温" || item.heat === "快速升温") {
    return "值得关注，适合先看直播判断，再决定要不要立刻过去。";
  }
  return "更适合当作信息流参考，不一定需要立刻转场过去。";
}

export function LiveSection({ onNotify, reminderIds = [], onToggleReminder }) {
  const [platform, setPlatform] = useState("全部");
  const [status, setStatus] = useState("全部");
  const [zone, setZone] = useState("全部");
  const [sortMode, setSortMode] = useState("默认排序");
  const [page, setPage] = useState(1);
  const [selectedLive, setSelectedLive] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(window.localStorage.getItem(favoriteStorageKey) || "[]");
    } catch {
      return [];
    }
  });

  const zoneOptions = useMemo(
    () => ["全部", ...new Set(liveLinks.map((item) => item.zone))],
    []
  );

  const filteredLinks = useMemo(
    () => {
      const statusMatched = liveLinks.filter((item) => {
        const currentStatus = getStatusInfo(item).phase;
        return (
          (platform === "全部" || item.platform === platform) &&
          (status === "全部" || currentStatus === status) &&
          (zone === "全部" || item.zone === zone)
        );
      });

      return [...statusMatched].sort((a, b) => {
        const aFav = favorites.includes(a.id) ? 1 : 0;
        const bFav = favorites.includes(b.id) ? 1 : 0;
        const aLive = getStatusInfo(a).phase === "直播中" ? 1 : 0;
        const bLive = getStatusInfo(b).phase === "直播中" ? 1 : 0;
        const heatDelta = parseHeat(b.viewers) - parseHeat(a.viewers);

        if (sortMode === "热度优先") {
          return bFav - aFav || heatDelta || bLive - aLive;
        }

        if (sortMode === "直播中优先") {
          return bFav - aFav || bLive - aLive || heatDelta;
        }

        return bFav - aFav || bLive - aLive || heatDelta;
      });
    },
    [favorites, platform, sortMode, status, zone]
  );

  const favoriteLinks = useMemo(
    () => liveLinks.filter((item) => favorites.includes(item.id)),
    [favorites]
  );

  const previewTopLinks = useMemo(() => filteredLinks.slice(0, 3), [filteredLinks]);
  const pageSize = 4;
  const totalPages = Math.max(1, Math.ceil(filteredLinks.length / pageSize));
  const pagedLinks = useMemo(
    () => filteredLinks.slice((page - 1) * pageSize, page * pageSize),
    [filteredLinks, page]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(favoriteStorageKey, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    setPage(1);
  }, [platform, status, zone, sortMode]);

  const liveNowCount = liveLinks.filter((item) => getStatusInfo(item).phase === "直播中").length;
  const upcomingCount = liveLinks.length - liveNowCount;
  const favoriteCount = favorites.length;

  const toggleFavorite = (id, name) => {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
      onNotify?.(exists ? `已取消收藏 ${name}` : `已收藏 ${name}`);
      return next;
    });
  };

  const copyAccount = async (account, platformName) => {
    try {
      await navigator.clipboard.writeText(account);
      onNotify?.(`已复制 ${platformName} 账号 ${account}`);
    } catch {
      onNotify?.("当前环境暂不支持直接复制，请手动记录账号");
    }
  };

  const jumpToLive = (item) => {
    onNotify?.(`演示版占位：后续可跳转到 ${item.platform} 的账号 ${item.account}`);
  };

  const summaryItems = [
    { label: "当前平台", value: platform },
    { label: "当前馆区", value: zone },
    { label: "当前状态", value: status },
    { label: "匹配结果", value: `${filteredLinks.length} 个账号` }
  ];

  return (
    <div className="section-layout">
      <div className="panel">
        <SectionHead
          title="直播链接"
          desc="集中查看现场正在直播的 Coser / 主播，按平台快速找到对应直播账号和当前馆区。"
          side={<span className="pill accent">直播中 {liveNowCount} 场</span>}
        />
        <div className="grid three" style={{ marginBottom: 16 }}>
          <InfoCard>
            <strong>{liveNowCount}</strong>
            <p className="muted">当前直播中</p>
          </InfoCard>
          <InfoCard>
            <strong>{upcomingCount}</strong>
            <p className="muted">即将开播</p>
          </InfoCard>
          <InfoCard>
            <strong>{favoriteCount}</strong>
            <p className="muted">已收藏账号</p>
          </InfoCard>
        </div>
        <div className="summary-bar">
          {summaryItems.map((item) => (
            <div className="summary-chip" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
        {favoriteLinks.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <SectionHead
              title="我关注的主播"
              desc="你收藏过的直播账号会优先收在这里，默认置顶在列表前面，方便你在逛展过程中随时回看。"
              side={<span className="pill info">{favoriteLinks.length} 位</span>}
            />
            <div className="grid two">
              {favoriteLinks.map((item) => {
                const statusInfo = getStatusInfo(item);
                return (
                <InfoCard key={`favorite-${item.id}`}>
                  <div className="row between start">
                    <div>
                      <strong>{item.name}</strong>
                      <p className="muted">
                        <span className={`platform-badge ${getPlatformBadgeClass(item.platform)}`}>{platformIcons[item.platform]} {item.platform}</span>
                        {" "}· {item.account}
                      </p>
                    </div>
                    <span className={`pill ${statusInfo.phase === "直播中" ? "accent" : "info"}`}>{statusInfo.label}</span>
                  </div>
                  <div className="tag-row">
                    <span className="tag">{item.zone}</span>
                    <span className="tag">{item.viewers}</span>
                    <span className={`platform-badge ${getPlatformBadgeClass(item.platform)}`}>{platformIcons[item.platform]} {item.platform}</span>
                  </div>
                  <p className="muted">{item.liveTitle}</p>
                  <div className="action-row">
                    <button className="btn ghost" onClick={() => setSelectedLive(item)}>查看详情</button>
                    <button className="btn primary" onClick={() => jumpToLive(item)}>一键跳转</button>
                    <button className="btn ghost" onClick={() => copyAccount(item.account, item.platform)}>复制账号</button>
                    <button className="btn ghost" onClick={() => onToggleReminder?.(item)} disabled={statusInfo.phase === "直播中" && !reminderIds.includes(item.id)}>
                      {reminderIds.includes(item.id) ? "已提醒" : "开播提醒"}
                    </button>
                  </div>
                </InfoCard>
                );
              })}
            </div>
          </div>
        )}
        <FilterBar items={livePlatforms} value={platform} onChange={setPlatform} />
        <div style={{ marginTop: 10 }}>
          <FilterBar items={statusOptions} value={status} onChange={setStatus} />
        </div>
        <div style={{ marginTop: 10 }}>
          <FilterBar items={zoneOptions} value={zone} onChange={setZone} />
        </div>
        <div style={{ marginTop: 10 }}>
          <FilterBar items={sortOptions} value={sortMode} onChange={setSortMode} />
        </div>
        <div className="stack" style={{ marginTop: 16 }}>
          {pagedLinks.map((item) => {
            const statusInfo = getStatusInfo(item);
            return (
            <InfoCard key={item.id}>
              <div className="row between start">
                <div>
                  <strong>{item.name}</strong>
                  <p className="muted">
                    <span className={`platform-badge ${getPlatformBadgeClass(item.platform)}`}>{platformIcons[item.platform]} {item.platform}</span>
                    {" "}· {item.account}
                  </p>
                </div>
                <span className={`pill ${statusInfo.phase === "直播中" ? "accent" : "info"}`}>{statusInfo.label}</span>
              </div>
              <div className="tag-row">
                <span className="tag">{item.zone}</span>
                <span className="tag">{item.viewers}</span>
                <span className={`platform-badge ${getPlatformBadgeClass(item.platform)}`}>{platformIcons[item.platform]} {item.platform}</span>
                {favorites.includes(item.id) && <span className="tag">已收藏</span>}
              </div>
              <p className="muted">{item.cosplay}</p>
              <p className="muted">当前直播：{item.liveTitle}</p>
              <div className="action-row">
                <button className="btn ghost" onClick={() => setSelectedLive(item)}>查看详情</button>
                <button className="btn primary" onClick={() => jumpToLive(item)}>一键跳转</button>
                <button className="btn ghost" onClick={() => copyAccount(item.account, item.platform)}>复制账号</button>
                <button className="btn ghost" onClick={() => onToggleReminder?.(item)} disabled={statusInfo.phase === "直播中" && !reminderIds.includes(item.id)}>
                  {reminderIds.includes(item.id) ? "已提醒" : "开播提醒"}
                </button>
                <button className="btn ghost" onClick={() => toggleFavorite(item.id, item.name)}>
                  {favorites.includes(item.id) ? "取消收藏" : "收藏账号"}
                </button>
              </div>
            </InfoCard>
            );
          })}
          {filteredLinks.length === 0 && (
            <InfoCard>
              <p>当前筛选下还没有直播账号，换个平台看看。</p>
            </InfoCard>
          )}
        </div>
        {filteredLinks.length > 0 && (
          <div className="pagination-bar">
            <span className="muted">第 {page} / {totalPages} 页，共 {filteredLinks.length} 位主播</span>
            <div className="action-row">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  className={`btn ${page === pageNumber ? "primary" : "ghost"}`}
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}
              <button className="btn ghost" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>上一页</button>
              <button className="btn ghost" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages}>下一页</button>
            </div>
          </div>
        )}
      </div>

      <div className="panel">
        <SectionHead title="使用建议" desc="把直播链接当作现场信息流入口，用来判断馆区热度、排队情况和活动氛围。" />
        <div className="grid two" style={{ marginBottom: 16 }}>
          <InfoCard>
            <strong>馆区实时感</strong>
            <p className="muted">如果你还没决定去哪一馆，先看不同主播当前所在馆区，能更快判断哪里更热、更堵或更适合拍照。</p>
          </InfoCard>
          <InfoCard>
            <strong>账号快速收藏</strong>
            <p className="muted">演示版先展示平台和账号，后续可以扩展收藏、跳转和直播回放入口。</p>
          </InfoCard>
        </div>
        <div className="stack">
          {previewTopLinks.length > 0 && (
            <InfoCard>
              <strong>当前热度最高</strong>
              <p className="muted">{previewTopLinks[0].name} · {previewTopLinks[0].platform} · {previewTopLinks[0].viewers}</p>
            </InfoCard>
          )}
          {liveTips.map((text) => (
            <InfoCard key={text}>
              <p>{text}</p>
            </InfoCard>
          ))}
        </div>
      </div>

      {selectedLive && (
        <div className="overlay-backdrop" onClick={() => setSelectedLive(null)}>
          <div className="detail-modal" onClick={(event) => event.stopPropagation()}>
            <div className="row between start">
              <div>
                <strong style={{ fontSize: 20 }}>{selectedLive.name}</strong>
                <p className="muted" style={{ marginTop: 8 }}>
                  <span className={`platform-badge ${getPlatformBadgeClass(selectedLive.platform)}`}>
                    {platformIcons[selectedLive.platform]} {selectedLive.platform}
                  </span>
                  {" "}· {selectedLive.account}
                </p>
              </div>
              <button className="btn ghost" onClick={() => setSelectedLive(null)}>关闭</button>
            </div>
            <div className="tag-row" style={{ marginTop: 12 }}>
              <span className="tag">{selectedLive.zone}</span>
              <span className="tag">{selectedLive.viewers}</span>
              <span className={`pill ${getStatusInfo(selectedLive).phase === "直播中" ? "accent" : "info"}`}>
                {getStatusInfo(selectedLive).label}
              </span>
            </div>
            <div className="stack" style={{ marginTop: 16 }}>
              <InfoCard>
                <strong>当前内容</strong>
                <p className="muted">{selectedLive.liveTitle}</p>
              </InfoCard>
              <InfoCard>
                <strong>角色 / 风格</strong>
                <p className="muted">{selectedLive.cosplay}</p>
              </InfoCard>
              <InfoCard>
                <strong>推荐用途</strong>
                <p className="muted">适合用来判断当前馆区热度、队伍长度、舞台活动氛围，以及是否值得临时转场去看。</p>
              </InfoCard>
              <InfoCard>
                <strong>馆区热度</strong>
                <p className="muted">{selectedLive.heat}</p>
              </InfoCard>
              <InfoCard>
                <strong>排队提示</strong>
                <p className="muted">{selectedLive.queueTip}</p>
              </InfoCard>
              <InfoCard>
                <strong>适合谁看</strong>
                <p className="muted">{selectedLive.bestFor}</p>
              </InfoCard>
              <InfoCard>
                <strong>推荐路线</strong>
                <p className="muted">{getRouteAdvice(selectedLive)}</p>
              </InfoCard>
              <InfoCard>
                <strong>去不去值得</strong>
                <p className="muted">{getWorthGoing(selectedLive)}</p>
              </InfoCard>
            </div>
            <div className="action-row" style={{ marginTop: 16 }}>
              <button className="btn primary" onClick={() => jumpToLive(selectedLive)}>一键跳转</button>
              <button className="btn ghost" onClick={() => copyAccount(selectedLive.account, selectedLive.platform)}>复制账号</button>
              <button className="btn ghost" onClick={() => onToggleReminder?.(selectedLive)}>
                {reminderIds.includes(selectedLive.id) ? "已提醒" : "开播提醒"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
