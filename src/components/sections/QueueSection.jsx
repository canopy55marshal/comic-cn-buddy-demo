import { InfoCard, SectionHead } from "../ui";

function getRecommendedQueueItem(liveQueueContext, queueOptions) {
  if (!liveQueueContext) return null;
  if (liveQueueContext.zone.includes("摄影区")) return queueOptions.find((item) => item.name.includes("摄影"));
  if (liveQueueContext.zone.includes("服务区")) return queueOptions.find((item) => item.name.includes("补妆"));
  return queueOptions[0];
}

export function QueueSection({ queueOptions = [], onBook, liveQueueContext = null, queueCompleted = false }) {
  const bookedItems = queueOptions.filter((item) => item.booked);
  const nextRecommended = queueOptions.find((item) => !item.booked);
  const liveRecommended = getRecommendedQueueItem(liveQueueContext, queueOptions);

  return (
    <div className="section-layout">
      <div className="panel">
        <SectionHead
          title="排队预约"
          desc="左边先选要预约的事项，右边看当前进度、推荐下一步和预约策略。"
          side={<span className={`pill ${queueCompleted ? "success" : "accent"}`}>{queueCompleted ? "当前环节已完成" : `已预约 ${bookedItems.length} 项`}</span>}
        />
        <div className="guided-layout">
          <div className="stack">
            <InfoCard className={`page-progress-card ${queueCompleted ? "completed" : ""}`}>
              <div className="row between start">
                <div>
                  <strong>预约任务反馈</strong>
                  <p className="muted">{queueCompleted ? "你已经完成过至少一次预约环节，当前可以继续补新的时段或回首页推进下一步。" : "先预约一个当前等待最短或最关键的项目，系统就会把预约环节标成已完成。"}</p>
                </div>
                <span className={`pill ${queueCompleted ? "success" : "accent"}`}>{queueCompleted ? "已完成" : "待完成"}</span>
              </div>
            </InfoCard>
            {queueOptions.length === 0 && <InfoCard><p>当前没有可预约项目，稍后再试。</p></InfoCard>}
            {queueOptions.map((item) => {
              const booked = item.booked;
              return (
                <InfoCard key={item.id} className="queue-option-card">
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
                    {booked && <span className="tag">已完成</span>}
                  </div>
                  <p className="muted">{item.desc}</p>
                  <div className="action-row">
                    <button className="btn primary" onClick={() => onBook(item)} disabled={booked}>
                      {booked ? "已预约" : "预约时段"}
                    </button>
                  </div>
                </InfoCard>
              );
            })}
          </div>
          <div className="stack">
            <InfoCard>
              <strong>当前预约进度</strong>
              <p className="muted">{bookedItems.length > 0 ? `你已经锁定 ${bookedItems.length} 个时段，当前最早的是 ${bookedItems[0].slot}。` : "还没有预约时段，建议先锁一个等待时间最短的项目。"}</p>
            </InfoCard>
            <InfoCard>
              <strong>环节下一步</strong>
              <p className="muted">{nextRecommended ? `优先看 ${nextRecommended.name}，当前显示 ${nextRecommended.wait}。` : "当前可用项目都已处理完，可以回首页继续安排补给或返程。"}</p>
            </InfoCard>
            {liveQueueContext && liveRecommended && (
              <InfoCard>
                <div className="row between start">
                  <div>
                    <strong>来自主播行程的推荐预约</strong>
                    <p className="muted">{liveQueueContext.name} 当前关联馆区是 {liveQueueContext.zone}，建议优先看 {liveRecommended.name}。</p>
                  </div>
                  <span className="pill accent">{liveRecommended.wait}</span>
                </div>
              </InfoCard>
            )}
            <InfoCard>
              <strong>预约策略</strong>
              <div className="stack" style={{ marginTop: 12 }}>
                {[
                  "摄影档期尽量和补妆时间错开，中间预留至少 20 分钟移动时间。",
                  "如果主摄影棚拥挤，优先锁侧馆空景区，不容易白等。",
                  "补妆位建议选离当前馆区更近的，别为了便宜多走一段路。",
                  "返程前 1 小时尽量不要再加新的拍摄档期，容易拖崩节奏。"
                ].map((text) => (
                  <div key={text} className="business-milestone">{text}</div>
                ))}
              </div>
            </InfoCard>
          </div>
        </div>
      </div>
    </div>
  );
}
