import { InfoCard, SectionHead } from "../ui";

export function ReminderSection({ reminderOptions = [], onToggle }) {
  return (
    <div className="section-layout">
      <div className="panel">
        <SectionHead
          title="智能提醒"
          desc="把漫展当天最容易忘的节点提前拎出来：补妆、取餐、转场、返程。"
          side={<span className="pill success">已开启 {reminderOptions.filter((item) => item.enabled).length} 项</span>}
        />
        <div className="stack">
          {reminderOptions.map((item) => {
            const enabled = item.enabled;
            return (
              <InfoCard key={item.id}>
                <div className="row between start">
                  <div>
                    <strong>{item.title}</strong>
                    <p className="muted">{item.time} · {item.tag}</p>
                  </div>
                  <span className="pill accent">{enabled ? "已开启" : "未开启"}</span>
                </div>
                <p className="muted">{item.desc}</p>
                <div className="action-row">
                  <button className="btn primary" onClick={() => onToggle(item)}>
                    {enabled ? "关闭提醒" : "开启提醒"}
                  </button>
                </div>
              </InfoCard>
            );
          })}
        </div>
      </div>
      <div className="panel">
        <SectionHead title="提醒建议" desc="提醒应该帮你减负，而不是变成新的打扰。" />
        <div className="stack">
          {[
            "优先开启补妆、摄影转场和返程提醒，这三个最容易影响当天节奏。",
            "如果已经和搭子同步行程，就没必要重复开太多同类提醒。",
            "取餐提醒建议比预计送达时间提前 5 到 10 分钟，更从容。",
            "返程提醒最好和交通页一起看，能直接决定拼车还是地铁。"
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
