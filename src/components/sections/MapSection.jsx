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

export function MapSection({ activeZone, zoneOptions, currentZone, loading, onZoneChange, onSetSpot, mapResults = [] }) {
  return (
    <div className="section-layout">
      <div className="panel">
        <SectionHead
          title="场馆地图"
          desc="按馆区查看热门点位、补给点、拥挤情况和动线建议。"
          side={<span className="pill success">当前：{currentZone.name}</span>}
        />
        <FilterBar items={zoneOptions.map((item) => item.name)} value={activeZone} onChange={onZoneChange} />
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
              <strong>{spot.title}</strong>
              <div className="tag-row">
                <span className="tag">{spot.tag}</span>
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
              <strong>{item.title}</strong>
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
              <strong>{item.title}</strong>
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
    </div>
  );
}
