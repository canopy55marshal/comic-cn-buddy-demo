import { InfoCard, SectionHead } from "../ui";

export function QueueSection({ queueOptions = [], onBook }) {
  return (
    <div className="section-layout">
      <div className="panel">
        <SectionHead
          title="排队预约"
          desc="把热门摄影区、补妆位和摄影档期做成提前预约，而不是到现场再硬排。"
          side={<span className="pill accent">已预约 {queueOptions.filter((item) => item.booked).length} 项</span>}
        />
        <div className="stack">
          {queueOptions.map((item) => {
            const booked = item.booked;
            return (
              <InfoCard key={item.id}>
                <div className="row between start">
                  <div>
                    <strong>{item.name}</strong>
                    <p className="muted">{item.area} · {item.slot}</p>
                  </div>
                  <span className="pill price">{item.wait}</span>
                </div>
                <div className="tag-row">
                  <span className="tag">{item.status}</span>
                  <span className="tag">排队预约</span>
                </div>
                <p className="muted">{item.desc}</p>
                <div className="action-row">
                  <button className="btn primary" onClick={() => onBook(item)}>
                    {booked ? "已预约" : "预约时段"}
                  </button>
                </div>
              </InfoCard>
            );
          })}
        </div>
      </div>
      <div className="panel">
        <SectionHead title="预约策略" desc="预约不是越多越好，而是保证动线顺、等待短、转场稳。" />
        <div className="stack">
          {[
            "摄影档期尽量和补妆时间错开，中间预留至少 20 分钟移动时间。",
            "如果主摄影棚拥挤，优先锁侧馆空景区，不容易白等。",
            "补妆位建议选离当前馆区更近的，别为了便宜多走一段路。",
            "返程前 1 小时尽量不要再加新的拍摄档期，容易拖崩节奏。"
          ].map((text) => (
            <InfoCard key={text}>
              <p>{text}</p>
            </InfoCard>
          ))}
        </div>
      </div>
    </div>
  );
}
