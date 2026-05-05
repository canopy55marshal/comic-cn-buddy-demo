import { useEffect, useMemo, useState } from "react";
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

const floorOptions = ["L1 主馆层", "L2 连廊层", "屋外动线"];

const floorNotes = {
  "L1 主馆层": "适合看主舞台、摄影区、同人摊位与服务区的核心活动路线。",
  "L2 连廊层": "更适合馆间切换、俯瞰动线和错峰穿行，适合作为中转观察层。",
  "屋外动线": "适合看北门服务区、返程点和外场补给位置，偏向进出馆与返程场景。"
};

const floorDetailOverrides = {
  "L2 连廊层": {
    "A馆主舞台": {
      note: "从连廊层更适合俯瞰主舞台散场流向，判断是否值得下楼去抢前排或避开主通道。",
      spots: [
        { title: "连廊俯瞰窗位", text: "适合先看主舞台散场方向，再决定从哪侧下楼。", tag: "观察点" },
        { title: "跨馆切换口", text: "从这里转去 B馆摄影区更顺，不容易和主舞台人流正面对冲。", tag: "中转" }
      ]
    },
    "B馆摄影区": {
      note: "连廊层更适合看摄影区排队长度和机位占用情况，适合作为拍摄前的观察层。",
      spots: [
        { title: "摄影区俯瞰点", text: "先看主摄影棚入口是否拥堵，再决定是否直接下楼。", tag: "观察点" },
        { title: "侧馆下行口", text: "如果空景区排队较短，可直接从这里下行进入。", tag: "下行口" }
      ]
    },
    "C馆同人摊位": {
      note: "从连廊层更适合看热门摊位聚集区和主通道流向，判断现在冲摊是否划算。",
      spots: [
        { title: "摊位热度观察点", text: "可以先看头部摊位队列，再决定进场顺序。", tag: "观察点" },
        { title: "错峰下行口", text: "适合从侧边通道下楼，减少和主通道对冲。", tag: "中转" }
      ]
    },
    "北门服务区": {
      note: "连廊层主要用于观察进出馆流向，更像中转视角，不是服务处理主层。",
      spots: [
        { title: "北门流向观察点", text: "适合判断当前是否适合去补妆或直接准备返程。", tag: "观察点" },
        { title: "外场连接口", text: "从这里切去屋外动线更顺，适合散场前转出馆。", tag: "连接口" }
      ]
    }
  },
  "屋外动线": {
    "A馆主舞台": {
      note: "屋外视角更适合看主舞台周边出入口，不适合判断舞台内部细节。",
      spots: [
        { title: "A馆外场入口", text: "适合判断主舞台散场后的人流是否已经外溢。", tag: "外场" }
      ]
    },
    "B馆摄影区": {
      note: "屋外动线更适合判断摄影区是否值得从外侧绕行进入。",
      spots: [
        { title: "摄影区外侧入口", text: "人流较大时可考虑先从这里绕行。", tag: "外场" }
      ]
    },
    "C馆同人摊位": {
      note: "屋外更偏补给和出入馆，不适合细看摊位内部排队，只适合做绕行判断。",
      spots: [
        { title: "同人区外侧排队带", text: "适合看外溢排队是否已经延伸到馆外。", tag: "外场" }
      ]
    },
    "北门服务区": {
      note: "屋外动线最适合看北门服务区、返程拼车点和出馆路径，是返程决策主层。",
      spots: [
        { title: "返程集散点", text: "适合优先判断拼车、打车还是直接去地铁。", tag: "返程" },
        { title: "应援补给外车位", text: "适合快速补充充电宝、雨衣和小风扇。", tag: "补给" }
      ]
    }
  }
};

function getRecommendedQueueCard(zoneName) {
  if (zoneName.includes("摄影")) return queueCards[0];
  if (zoneName.includes("服务")) return queueCards[1];
  return queueCards[0];
}

function getMarkerList({ activeZone, currentZone, liveMapContext, floor }) {
  const markers = [];

  if (liveMapContext && floor !== "屋外动线") {
    markers.push({
      id: "live-marker",
      kind: "live",
      icon: "📡",
      title: `${liveMapContext.name} 开播点`,
      text: `${liveMapContext.name} 当前在 ${liveMapContext.zone} 附近活动，可作为你的目标落点。`,
      positionClass: floor === "L2 连廊层" ? "marker-live-l2" : "marker-live"
    });
  }

  if (floor === "L2 连廊层") {
    markers.push({
      id: "connector-marker",
      kind: "service",
      icon: "🌉",
      title: "连廊观察点",
      text: "适合先从连廊观察跨馆人流，再决定是下到摄影区还是继续去同人摊位。",
      positionClass: "marker-connector-l2"
    });
  }

  if (currentZone.spots?.[0] && floor !== "L2 连廊层") {
    markers.push({
      id: "service-marker",
      kind: "service",
      icon: "🧰",
      title: currentZone.spots[0].title,
      text: currentZone.spots[0].text,
      positionClass: floor === "屋外动线" ? "marker-service-outdoor" : "marker-service"
    });
  }

  const queueCard = getRecommendedQueueCard(activeZone);
  if (queueCard && floor !== "L2 连廊层") {
    markers.push({
      id: "queue-marker",
      kind: "queue",
      icon: "⏳",
      title: floor === "屋外动线" ? "北门返程排队点" : queueCard.title,
      text: floor === "屋外动线" ? "适合看散场后的拼车、打车与出馆排队情况，优先做返程决策。" : queueCard.text,
      positionClass: floor === "屋外动线" ? "marker-queue-outdoor" : "marker-queue"
    });
  }

  return markers;
}

function getSpotIcon(title) {
  if (title.includes("摄影") || title.includes("主舞台")) return "📡";
  if (title.includes("补妆") || title.includes("修复") || title.includes("补给")) return "🧰";
  return "📍";
}

function getZoneDetailForFloor(zone, floor) {
  const override = floorDetailOverrides[floor]?.[zone.name];
  if (!override) return zone;
  return {
    ...zone,
    note: override.note,
    spots: override.spots
  };
}

function getObservationMode(activeZone) {
  if (activeZone.includes("主舞台")) {
    return {
      title: "舞台散场观察模式",
      desc: "优先观察主舞台散场流向和侧通道人流，再决定是否下楼追活动或转去摄影区。",
      tags: ["散场流向", "侧通道", "下楼时机"]
    };
  }
  if (activeZone.includes("摄影")) {
    return {
      title: "摄影区排队观察模式",
      desc: "优先看主摄影棚入口和侧馆空景区的差异，再决定下楼走哪一侧。",
      tags: ["排队长度", "空景区", "机位占用"]
    };
  }
  if (activeZone.includes("同人")) {
    return {
      title: "摊位热度观察模式",
      desc: "先看头部摊位拥堵和主通道人流，判断现在冲摊还是继续观望。",
      tags: ["热门摊位", "主通道", "错峰下行"]
    };
  }
  return {
    title: "返程流向观察模式",
    desc: "适合先看北门服务区和外场流向，再决定补妆、取物资还是直接返程。",
    tags: ["返程点", "服务区", "外场流向"]
  };
}

export function MapSection({
  activeZone,
  zoneOptions,
  currentZone,
  currentUserZone = "",
  mapCompleted = false,
  loading,
  onNavigate,
  onZoneChange,
  onSetSpot,
  mapResults = [],
  liveMapContext = null
}) {
  const routePath = routeMap[activeZone] || [activeZone];
  const targetZone = liveMapContext?.targetZone || activeZone;
  const [floor, setFloor] = useState("L1 主馆层");
  const markers = useMemo(
    () => getMarkerList({ activeZone, currentZone, liveMapContext, floor }),
    [activeZone, currentZone, liveMapContext, floor]
  );
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [selectedZoneName, setSelectedZoneName] = useState(null);
  const routeCopy = floor === "L1 主馆层"
    ? "L1 更适合看核心馆区路线，适合直接冲主舞台、摄影区和同人摊位。"
    : floor === "L2 连廊层"
      ? "L2 更像中转观察层，适合先看跨馆流向，再决定从哪边下楼。"
      : "屋外动线更适合看北门服务区、返程点和外场补给，偏进出馆和散场路线。";
  const selectedZoneDetail = selectedZoneName
    ? getZoneDetailForFloor(
      zoneOptions.find((item) => item.name === selectedZoneName) || { name: selectedZoneName, note: "当前馆区暂无更多说明。", spots: [] },
      floor
    )
    : null;
  const observationMode = getObservationMode(activeZone);

  useEffect(() => {
    if (!markers.find((item) => item.id === selectedMarker?.id)) {
      setSelectedMarker(null);
    }
  }, [markers, selectedMarker]);

  return (
    <div className="section-layout">
      <div className="panel">
        <SectionHead
          title="场馆地图"
          desc="按馆区查看热门点位、补给点、拥挤情况和动线建议。"
          side={<span className={`pill ${mapCompleted ? "success" : "info"}`}>{mapCompleted ? "本页动作已完成" : `当前：${currentZone.name}`}</span>}
        />
        <InfoCard className={`page-progress-card ${mapCompleted ? "completed" : ""}`}>
          <div className="row between start">
            <div>
              <strong>地图任务反馈</strong>
              <p className="muted">{mapCompleted ? "你已经完成过地图相关动作，当前可以继续细化路线或切换楼层查看。" : "先设一个途经点或跟随主播落点走一次推荐路线，系统就会记录你已完成地图动作。"}</p>
            </div>
            <span className={`pill ${mapCompleted ? "success" : "accent"}`}>{mapCompleted ? "已完成" : "待完成"}</span>
          </div>
        </InfoCard>
        <FilterBar items={zoneOptions.map((item) => item.name)} value={activeZone} onChange={onZoneChange} />
        <div style={{ marginTop: 10 }}>
          <FilterBar items={floorOptions} value={floor} onChange={setFloor} />
        </div>
        <div className="floor-hint">
          <strong>{floor}</strong>
          <p className="muted">{floorNotes[floor]}</p>
        </div>
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
          <div className={`route-board floor-${floor === "L1 主馆层" ? "l1" : floor === "L2 连廊层" ? "l2" : "outdoor"}`}>
            {["A馆主舞台", "B馆摄影区", "C馆同人摊位", "北门服务区"].map((zone) => {
              const active = zone === targetZone;
              const current = zone === currentUserZone;
              const inPath = routePath.includes(zone);
              return (
                <div
                  key={zone}
                  className={`route-node ${zonePositions[zone]} ${active ? "target" : ""} ${current ? "current" : ""} ${inPath ? "path" : ""}`}
                  onClick={() => setSelectedZoneName(zone)}
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
            <div className={`route-line route-line-to-b ${floor !== "屋外动线" && targetZone === "B馆摄影区" ? "active" : ""}`} />
            <div className={`route-line route-line-to-c ${floor !== "屋外动线" && targetZone === "C馆同人摊位" ? "active" : ""}`} />
            <div className={`route-line route-line-to-d ${floor !== "L2 连廊层" && targetZone === "北门服务区" ? "active" : ""}`} />
            <div className={`route-arrow route-arrow-to-b ${floor !== "屋外动线" && targetZone === "B馆摄影区" ? "active" : ""}`}>➜</div>
            <div className={`route-arrow route-arrow-to-c ${floor !== "屋外动线" && targetZone === "C馆同人摊位" ? "active" : ""}`}>➜</div>
            <div className={`route-arrow route-arrow-to-d ${floor !== "L2 连廊层" && targetZone === "北门服务区" ? "active" : ""}`}>➜</div>
            {floor !== "L2 连廊层" && <div className="route-pulse route-pulse-a" />}
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
          <p className="muted route-copy">{routeCopy}</p>
          {floor === "L2 连廊层" && (
            <InfoCard>
              <div className="row between start">
                <div>
                  <strong>俯瞰观察模式</strong>
                  <p className="muted">{observationMode.title}</p>
                </div>
                <span className="pill accent">L2 专属</span>
              </div>
              <p className="muted">{observationMode.desc}</p>
              <div className="tag-row">
                {observationMode.tags.map((tag) => (
                  <span className="tag" key={tag}>{tag}</span>
                ))}
              </div>
            </InfoCard>
          )}
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
              <button className="btn ghost" onClick={() => onNavigate?.("live")}>去主播行程</button>
              <button className="btn ghost" onClick={() => onNavigate?.("queue")}>去排队预约</button>
              <button className="btn ghost" onClick={() => onNavigate?.("service")}>去服务预约</button>
              {selectedMarker.kind === "live" && <button className="btn ghost" onClick={() => onZoneChange(targetZone)}>定位到目标馆区</button>}
            </div>
          </div>
        </div>
      )}

      {selectedZoneDetail && (
        <div className="overlay-backdrop" onClick={() => setSelectedZoneName(null)}>
          <div className="detail-modal map-detail-modal" onClick={(event) => event.stopPropagation()}>
            <div className="row between start">
              <div>
                <strong style={{ fontSize: 20 }}>{zoneGlyphs[selectedZoneDetail.name] || "📍"} {selectedZoneDetail.name}</strong>
                <p className="muted" style={{ marginTop: 8 }}>{floor} · 馆区详情</p>
              </div>
              <button className="btn ghost" onClick={() => setSelectedZoneName(null)}>关闭</button>
            </div>
            <div className="tag-row" style={{ marginTop: 12 }}>
              <span className="tag">馆区块</span>
              <span className="tag">{floor}</span>
              {selectedZoneDetail.name === activeZone && <span className="tag">当前查看</span>}
            </div>
            <div className="stack" style={{ marginTop: 16 }}>
              <InfoCard>
                <strong>馆区说明</strong>
                <p className="muted">{selectedZoneDetail.note}</p>
              </InfoCard>
              {selectedZoneDetail.spots?.slice(0, 3).map((spot) => (
                <InfoCard key={spot.title}>
                  <strong>{getSpotIcon(spot.title)} {spot.title}</strong>
                  <p className="muted">{spot.text}</p>
                </InfoCard>
              ))}
            </div>
            <div className="action-row" style={{ marginTop: 16 }}>
              <button className="btn primary" onClick={() => onZoneChange(selectedZoneDetail.name)}>切换到该馆区</button>
              <button className="btn ghost" onClick={() => onNavigate?.("queue")}>去排队预约</button>
              <button className="btn ghost" onClick={() => onNavigate?.("service")}>去服务预约</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
