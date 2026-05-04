import { useMemo, useState } from "react";
import { FilterBar, InfoCard, SectionHead } from "../ui";

const queueCards = [
  { title: "摄影区预约", tag: "可预约", text: "B馆主摄影棚开放 14:00 - 15:30 时段预约，减少现场硬排。", action: "预约摄影档期" },
  { title: "补妆位排队", tag: "等待 8 分钟", text: "北门快修站当前等待时间较短，建议先过去补一次定妆。", action: "加入补妆排队" }
];

const travelCards = [
  { title: "北门拼车点", tag: "散场推荐", text: "适合和搭子或同馆区玩家一起拼车返程。", action: "查看拼车建议" },
  { title: "地铁换乘提醒", tag: "低拥堵", text: "建议优先从东侧通道出馆，步行到地铁口更顺畅。", action: "加入返程提醒" }
];

const routeSuggestions = [
  "先主舞台后摊位区，中午前回服务区补妆或取餐。",
  "摄影档期前 20 分钟开始往 B 馆移动，别临时穿馆折返。",
  "散场前先到北门服务区集合，再统一去拼车点或地铁口。"
];

const routeMap = {
  "A馆主舞台": ["B馆摄影区", "A馆主舞台"],
  "B馆摄影区": ["A馆主舞台", "B馆摄影区"],
  "C馆同人摊位": ["A馆主舞台", "C馆同人摊位"],
  "北门服务区": ["A馆主舞台", "北门服务区"]
};

const zoneGlyphs = {
  "A馆主舞台": "🎤",
  "B馆摄影区": "📸",
  "C馆同人摊位": "🛍️",
  "北门服务区": "🧰"
};

const pointLegend = [
  { key: "live", label: "主播点", icon: "📡" },
  { key: "service", label: "服务点", icon: "🧰" },
  { key: "queue", label: "排队点", icon: "⏳" }
];

const zonePositions = {
  "A馆主舞台": "zone-a",
  "B馆摄影区": "zone-b",
  "C馆同人摊位": "zone-c",
  "北门服务区": "zone-d"
};

function getRecommendedQueueCard(zoneName) {
  if (zoneName.includes("摄影")) return queueCards[0];
  if (zoneName.includes("服务")) return queueCards[1];
  return queueCards[0];
}

function getMarkerList({ activeZone, currentZone, liveMapContext }) {
  const markers = [];

  if (liveMapContext) {
    markers.push({
      id: "live-marker",
      kind: "live",
      icon: "📡",
      title: `${liveMapContext.name} 开播点`,
      text: `${liveMapContext.name} 当前在 ${liveMapContext.zone} 附近活动，可作为你的目标落点。`,
      positionClass: "marker-live"
    });
  }

  if (currentZone.spots?.[0]) {
    markers.push({
      id: "service-marker",
      kind: "service",
      icon: "🧰",
      title: currentZone.spots[0].title,
      text: currentZone.spots[0].text,
      positionClass: "marker-service"
    });
  }

  const queueCard = getRecommendedQueueCard(activeZone);
  if (queueCard) {
    markers.push({
      id: "queue-marker",
      kind: "queue",
      icon: "⏳",
      title: queueCard.title,
      text: queueCard.text,
      positionClass: "marker-queue"
    });
  }

  return markers;
}

function getSpotIcon(title) {
  if (title.includes("摄影") || title.includes("主舞台")) return "📡";
  if (title.includes("补妆") || title.includes("修复") || title.includes("补给")) return "🧰";
  return "📍";
}

export function MapSection({
  activeZone,
  zoneOptions,
  currentZone,
  currentUserZone = "",
  loading,
  onZoneChange,
  onSetSpot,
  mapResults = [],
  liveMapContext = null
}) {
  const routePath = routeMap[activeZone] || [activeZone];
  const targetZone = liveMapContext?.targetZone || activeZone;
  const markers = useMemo(
    () => getMarkerList({ activeZone, currentZone, liveMapContext }),
    [activeZone, currentZone, liveMapContext]
  );
  const [selectedMarker, setSelectedMarker] = useState(null);

  return (
    <div className="section-layout">
      <div className="panel">
        <SectionHead
          title="场馆地图"
          desc="按馆区查看热门点位、补给点、拥挤情况和动线建议。"
          side={<span className="pill success">当前：{currentZone.name}</span>}
        />
        <FilterBar items={zoneOptions.map((item) => item.name)} value={activeZone} onChange={onZoneChange} />
        {liveMapContext && (
          <div className="stack" style={{ marginTop: 16 }}>
            <InfoCard>
              <div className="row between start">
                <strong>来自主播行程</strong>
                <span className="pill accent">{liveMapContext.zone}</span>
              </div>
              <p className="muted">{liveMapContext.name} 当前在这个区域附近开播，建议先看推荐动线再决定是否转场过去。</p>
              <p className="muted">可以把它理解成游戏里的自动寻路落点提示：先锁定目标馆区，再沿推荐动线移动过去。</p>
            </InfoCard>
          </div>
        )}
        <div className="route-visual">
          <div className="route-visual-head">
            <strong>自动寻路示意</strong>
            <span className="pill info">目标：{targetZone}</span>
          </div>
          <div className="route-legend">
            {pointLegend.map((item) => (
              <span key={item.key} className="route-legend-item">{item.icon} {item.label}</span>
            ))}
          </div>
          <div className="route-board">
            {["A馆主舞台", "B馆摄影区", "C馆同人摊位", "北门服务区"].map((zone) => {
              const active = zone === targetZone;
              const current = zone === currentUserZone;
              const inPath = routePath.includes(zone);
              return (
                <div
                  key={zone}
                  className={`route-node ${zonePositions[zone]} ${active ? "target" : ""} ${current ? "current" : ""} ${inPath ? "path" : ""}`}
                >
                  <b className="route-node-top" />
                  <b className="route-node-side" />
                  <em className="route-node-icon">{zoneGlyphs[zone]}</em>
                  <span>{zone}</span>
                  {current && <small>当前位置</small>}
                  {active && <small>目标点</small>}
                </div>
              );
            })}
            <div className={`route-line route-line-to-b ${targetZone === "B馆摄影区" ? "active" : ""}`} />
            <div className={`route-line route-line-to-c ${targetZone === "C馆同人摊位" ? "active" : ""}`} />
            <div className={`route-line route-line-to-d ${targetZone === "北门服务区" ? "active" : ""}`} />
            <div className={`route-arrow route-arrow-to-b ${targetZone === "B馆摄影区" ? "active" : ""}`}>➜</div>
            <div className={`route-arrow route-arrow-to-c ${targetZone === "C馆同人摊位" ? "active" : ""}`}>➜</div>
            <div className={`route-arrow route-arrow-to-d ${targetZone === "北门服务区" ? "active" : ""}`}>➜</div>
            <div className="route-pulse route-pulse-a" />
            <div className="route-pulse route-pulse-b" />
            <div className={`route-target-ring ${targetZone === "B馆摄影区" ? "ring-b" : targetZone === "C馆同人摊位" ? "ring-c" : targetZone === "北门服务区" ? "ring-d" : "ring-a"}`} />
            {markers.map((marker) => (
              <button
                key={marker.id}
                className={`map-marker ${marker.kind} ${marker.positionClass} ${selectedMarker?.id === marker.id ? "active" : ""}`}
                onClick={() => setSelectedMarker(marker)}
              >
                <span>{marker.icon}</span>
              </button>
            ))}
          </div>
          <p className="muted route-copy">像游戏自动寻路一样：先锁定目标馆区，再沿高亮路径移动。后续可以继续升级成 2.5D 或真 3D 版本。</p>
        </div>
        <div className="mini-grid">
          {zoneOptions.map((zone) => (
            <button
              key={zone.name}
              className={`mini-zone ${activeZone === zone.name ? "active" : ""}`}
              onClick={() => onZoneChange(zone.name)}
            >
              {zone.name}
            </button>
          ))}
        </div>
        <p className="muted zone-note">{currentZone.note}</p>
        <div className="stack" style={{ marginTop: 16 }}>
          <InfoCard>
            <div className="row between start">
              <strong>实时拥挤度</strong>
              <span className="pill accent">{activeZone.includes("摄影") ? "高峰预警" : "可通行"}</span>
            </div>
            <p className="muted">
              {activeZone.includes("摄影")
                ? "当前摄影区主通道较拥挤，建议先预约后入场，或分流到侧馆空景区。"
                : "当前馆区人流还算可控，适合先完成补给、打卡或与搭子汇合。"}
            </p>
          </InfoCard>
          <InfoCard>
            <div className="row between start">
              <strong>推荐动线</strong>
              <span className="pill info">顺路优先</span>
            </div>
            <p className="muted">{routeSuggestions[activeZone.includes("摄影") ? 1 : activeZone.includes("主舞台") ? 0 : 2]}</p>
          </InfoCard>
        </div>
      </div>
      <div className="panel">
        <SectionHead title="点位与预约" desc="除了馆区点位，也同步展示排队预约和返程出行建议。" />
        <div className="grid two">
          {loading && <InfoCard><p>正在加载馆区点位...</p></InfoCard>}
          {currentZone.spots.map((spot) => (
            <InfoCard key={spot.title}>
              <strong>{getSpotIcon(spot.title)} {spot.title}</strong>
              <div className="tag-row">
                <span className="tag">{spot.tag}</span>
                <span className="tag">服务点</span>
              </div>
              <p className="muted">{spot.text}</p>
              <button className="btn ghost" onClick={() => onSetSpot(spot.title)}>
                设为途经点
              </button>
            </InfoCard>
          ))}
          {!loading && mapResults.slice(0, 2).map((item) => (
            <InfoCard key={item.id}>
              <strong>{item.name}</strong>
              <div className="tag-row">
                <span className="tag">{item.type}</span>
                <span className="tag">开放地图</span>
              </div>
              <p className="muted">坐标：{item.latitude}, {item.longitude}</p>
            </InfoCard>
          ))}
          {queueCards.map((item) => (
            <InfoCard key={item.title}>
              <strong>⏳ {item.title}</strong>
              <div className="tag-row">
                <span className="tag">{item.tag}</span>
                <span className="tag">排队预约</span>
              </div>
              <p className="muted">{item.text}</p>
              <button className="btn ghost" onClick={() => onSetSpot(item.action)}>
                {item.action}
              </button>
            </InfoCard>
          ))}
          {travelCards.map((item) => (
            <InfoCard key={item.title}>
              <strong>🧭 {item.title}</strong>
              <div className="tag-row">
                <span className="tag">{item.tag}</span>
                <span className="tag">交通出行</span>
              </div>
              <p className="muted">{item.text}</p>
              <button className="btn ghost" onClick={() => onSetSpot(item.action)}>
                {item.action}
              </button>
            </InfoCard>
          ))}
        </div>
      </div>

      {selectedMarker && (
        <div className="overlay-backdrop" onClick={() => setSelectedMarker(null)}>
          <div className="detail-modal map-detail-modal" onClick={(event) => event.stopPropagation()}>
            <div className="row between start">
              <div>
                <strong style={{ fontSize: 20 }}>{selectedMarker.icon} {selectedMarker.title}</strong>
                <p className="muted" style={{ marginTop: 8 }}>
                  {selectedMarker.kind === "live" ? "主播点位详情" : selectedMarker.kind === "service" ? "服务点位详情" : "排队点位详情"}
                </p>
              </div>
              <button className="btn ghost" onClick={() => setSelectedMarker(null)}>关闭</button>
            </div>
            <div className="tag-row" style={{ marginTop: 12 }}>
              <span className="tag">{activeZone}</span>
              <span className="tag">
                {selectedMarker.kind === "live" ? "主播点" : selectedMarker.kind === "service" ? "服务点" : "排队点"}
              </span>
              {liveMapContext && selectedMarker.kind === "live" && <span className="tag">来自主播行程</span>}
            </div>
            <div className="stack" style={{ marginTop: 16 }}>
              <InfoCard>
                <strong>点位说明</strong>
                <p className="muted">{selectedMarker.text}</p>
              </InfoCard>
              <InfoCard>
                <strong>推荐动作</strong>
                <p className="muted">
                  {selectedMarker.kind === "live"
                    ? "先看目标馆区动线，再决定是否立刻转场去追直播。"
                    : selectedMarker.kind === "service"
                      ? "如果你当前正准备拍摄或补妆，可以优先把这里设为途经点。"
                      : "如果当前等待时间可接受，建议直接锁一个预约或排队时段。"}
                </p>
              </InfoCard>
            </div>
            <div className="action-row" style={{ marginTop: 16 }}>
              <button className="btn primary" onClick={() => onSetSpot(selectedMarker.title)}>设为途经点</button>
              {selectedMarker.kind === "queue" && <button className="btn ghost" onClick={() => onSetSpot("预约推荐项目")}>查看预约建议</button>}
              {selectedMarker.kind === "live" && <button className="btn ghost" onClick={() => onZoneChange(targetZone)}>定位到目标馆区</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
