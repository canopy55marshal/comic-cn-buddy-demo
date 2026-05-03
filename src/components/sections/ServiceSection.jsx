import { serviceCategories } from "../../data/mockData";
import { FilterBar, InfoCard, SectionHead } from "../ui";

const reminders = [
  ["12:10 补妆提醒", "角色妆面在高温下容易掉色，建议中午前补一次定妆。"],
  ["13:30 毛娘检查", "长时间外拍后建议检查前额、鬓角和发网边缘稳定度。"],
  ["15:20 摄影转场", "主摄影区拥挤时自动推荐侧馆拍摄位和空闲摄影师。"],
  ["16:00 摄影预约", "提前锁定下一场摄影档期，减少现场等待和错过机位。"],
  ["18:00 返程提醒", "散场前 30 分钟提醒预约打车或转地铁。"]
];

const serviceFlow = [
  { title: "先筛服务", text: "先看是补妆、修假发还是摄影预约，再决定时段。" },
  { title: "再看等待", text: "同一类服务优先选等待更短、距离更近的工位。" },
  { title: "锁定转场", text: "摄影相关服务最好和馆区路线一起看，避免来回折返。" }
];

export function ServiceSection({
  serviceFilter,
  services,
  loading,
  onServiceFilterChange,
  onBook,
  onRemind
}) {
  return (
    <div className="section-layout">
      <div className="panel">
        <SectionHead
          title="妆造与摄影预约"
          desc="同步路演里的三类重点服务：化妆师补妆、毛娘修假发、摄影预约分流。"
        />
        <FilterBar items={serviceCategories} value={serviceFilter} onChange={onServiceFilterChange} />
        <div className="grid three" style={{ marginBottom: 16 }}>
          {serviceFlow.map((item) => (
            <InfoCard key={item.title}>
              <strong>{item.title}</strong>
              <p className="muted">{item.text}</p>
            </InfoCard>
          ))}
        </div>
        <div className="stack">
          {loading && <InfoCard><p>正在加载服务数据...</p></InfoCard>}
          {!loading && services.length === 0 && <InfoCard><p>当前分类暂无可预约服务。</p></InfoCard>}
          {services.map((item) => (
            <InfoCard key={item.name}>
              <div className="row between start">
                <strong>{item.name}</strong>
                <span className="pill price">{item.price}</span>
              </div>
              <div className="tag-row">
                <span className="tag">{item.category}</span>
                <span className="tag">{item.eta}</span>
                <span className="tag">{item.badge}</span>
              </div>
              <p className="muted">{item.desc}</p>
              <div className="action-row">
                <button className="btn primary" onClick={() => onBook(item.name)}>立即预约</button>
                <button className="btn ghost" onClick={() => onRemind(item.name)}>加入提醒</button>
              </div>
            </InfoCard>
          ))}
        </div>
      </div>
      <div className="panel">
        <SectionHead title="提醒中心" desc="把智能提醒、预约转场和返程建议聚合到一个视图。" />
        <div className="stack">
          <InfoCard>
            <div className="row between start">
              <strong>当前预约状态</strong>
              <span className="pill accent">已同步</span>
            </div>
            <p className="muted">补妆、修假发和摄影预约都建议提前锁定，避免现场临时排队。</p>
          </InfoCard>
          {reminders.map(([title, text]) => (
            <InfoCard key={title}>
              <strong>{title}</strong>
              <p className="muted">{text}</p>
            </InfoCard>
          ))}
        </div>
      </div>
    </div>
  );
}
