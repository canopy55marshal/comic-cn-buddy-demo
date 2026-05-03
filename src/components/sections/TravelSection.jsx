import { InfoCard, SectionHead } from "../ui";

export function TravelSection({ travelOptions = [], onChoose }) {
  const selectedOption = travelOptions.find((item) => item.selected);

  return (
    <div className="section-layout">
      <div className="panel">
        <SectionHead
          title="交通出行"
          desc="把散场返程做成可决策页面：拼车、地铁、打车、结伴同行一眼看清。"
          side={<span className="pill info">{selectedOption ? "已选返程方案" : "待选择"}</span>}
        />
        <div className="grid two" style={{ marginBottom: 16 }}>
          <InfoCard>
            <strong>当前返程决策</strong>
            <p className="muted">{selectedOption ? `你已选择 ${selectedOption.title}，当前预估 ${selectedOption.eta}。` : "你还没锁定返程方案，建议散场前 30 分钟先定一个。"}</p>
          </InfoCard>
          <InfoCard>
            <strong>推荐判断</strong>
            <p className="muted">{selectedOption?.mode === "地铁" ? "适合不赶时间且不想承受打车高峰溢价的路线。" : selectedOption?.mode === "拼车" ? "适合和搭子一起返程，效率和体感通常都更稳。" : "如果你还没决定，优先看等待时间更短的方案。"}</p>
          </InfoCard>
        </div>
        <div className="stack">
          {travelOptions.length === 0 && <InfoCard><p>当前没有返程方案可选，稍后再试。</p></InfoCard>}
          {travelOptions.map((item) => {
            const selected = item.selected;
            return (
              <InfoCard key={item.id}>
                <div className="row between start">
                  <div>
                    <strong>{item.title}</strong>
                    <p className="muted">{item.mode} · {item.eta}</p>
                  </div>
                  <span className="pill price">{item.cost}</span>
                </div>
                <p className="muted">{item.desc}</p>
                <div className="action-row">
                  <button className="btn primary" onClick={() => onChoose(item)} disabled={selected}>
                    {selected ? "当前方案" : "设为返程方案"}
                  </button>
                </div>
              </InfoCard>
            );
          })}
        </div>
      </div>
      <div className="panel">
        <SectionHead title="返程建议" desc="散场时最怕临时慌乱，这里先帮你做取舍。" />
        <div className="stack">
          {[
            "如果和搭子同行，优先拼车或结伴地铁，安全感和效率都会更高。",
            "高峰期打车等待时间会明显上升，别等到出馆才开始看车。",
            "如果还有大量周边和道具，优先选少换乘的路线。",
            "返程方案最好在散场前 30 分钟就确定，别让最后阶段最乱。"
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
