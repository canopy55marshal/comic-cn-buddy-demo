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

export function LiveSection({ onNotify }) {
  const [platform, setPlatform] = useState("全部");
  const [status, setStatus] = useState("全部");
  const [zone, setZone] = useState("全部");
  const [sortMode, setSortMode] = useState("默认排序");
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
        const currentStatus = item.time === "直播中" ? "直播中" : "即将开播";
        return (
          (platform === "全部" || item.platform === platform) &&
          (status === "全部" || currentStatus === status) &&
          (zone === "全部" || item.zone === zone)
        );
      });

      return [...statusMatched].sort((a, b) => {
        const aFav = favorites.includes(a.id) ? 1 : 0;
        const bFav = favorites.includes(b.id) ? 1 : 0;
        const aLive = a.time === "直播中" ? 1 : 0;
        const bLive = b.time === "直播中" ? 1 : 0;
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(favoriteStorageKey, JSON.stringify(favorites));
  }, [favorites]);

  const liveNowCount = liveLinks.filter((item) => item.time === "直播中").length;
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
        {favoriteLinks.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <SectionHead
              title="我关注的主播"
              desc="你收藏过的直播账号会优先收在这里，方便你在逛展过程中随时回看。"
              side={<span className="pill info">{favoriteLinks.length} 位</span>}
            />
            <div className="grid two">
              {favoriteLinks.map((item) => (
                <InfoCard key={`favorite-${item.id}`}>
                  <div className="row between start">
                    <div>
                      <strong>{item.name}</strong>
                      <p className="muted">{item.platform} · {item.account}</p>
                    </div>
                    <span className={`pill ${item.time === "直播中" ? "accent" : "info"}`}>{item.time}</span>
                  </div>
                  <div className="tag-row">
                    <span className="tag">{item.zone}</span>
                    <span className="tag">{item.viewers}</span>
                  </div>
                  <p className="muted">{item.liveTitle}</p>
                  <div className="action-row">
                    <button className="btn primary" onClick={() => jumpToLive(item)}>一键跳转</button>
                    <button className="btn ghost" onClick={() => copyAccount(item.account, item.platform)}>复制账号</button>
                  </div>
                </InfoCard>
              ))}
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
          {filteredLinks.map((item) => (
            <InfoCard key={item.id}>
              <div className="row between start">
                <div>
                  <strong>{item.name}</strong>
                  <p className="muted">{item.platform} · {item.account}</p>
                </div>
                <span className={`pill ${item.time === "直播中" ? "accent" : "info"}`}>{item.time}</span>
              </div>
              <div className="tag-row">
                <span className="tag">{item.zone}</span>
                <span className="tag">{item.viewers}</span>
                <span className="tag">{item.platform}</span>
                {favorites.includes(item.id) && <span className="tag">已收藏</span>}
              </div>
              <p className="muted">{item.cosplay}</p>
              <p className="muted">当前直播：{item.liveTitle}</p>
              <div className="action-row">
                <button className="btn primary" onClick={() => jumpToLive(item)}>一键跳转</button>
                <button className="btn ghost" onClick={() => copyAccount(item.account, item.platform)}>复制账号</button>
                <button className="btn ghost" onClick={() => toggleFavorite(item.id, item.name)}>
                  {favorites.includes(item.id) ? "取消收藏" : "收藏账号"}
                </button>
              </div>
            </InfoCard>
          ))}
          {filteredLinks.length === 0 && (
            <InfoCard>
              <p>当前筛选下还没有直播账号，换个平台看看。</p>
            </InfoCard>
          )}
        </div>
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
          {liveTips.map((text) => (
            <InfoCard key={text}>
              <p>{text}</p>
            </InfoCard>
          ))}
        </div>
      </div>
    </div>
  );
}
