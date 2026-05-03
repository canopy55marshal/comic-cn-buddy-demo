import { InfoCard, SectionHead } from "../ui";

export function TravelSection({ travelOptions = [], onChoose }) {
  return (
    <div className="section-layout">
      <div className="panel">
        <SectionHead
          title="交通出行"
          desc="把散场返程做成可决策页面：拼车、地铁、打车、结伴同行一眼看清。"
          side={<span className="pill info">{travelOptions.some((item) => item.selected) ? "已选返程方案" : "待选择"}</span>}
        />
        <div className="stack">
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
                  <button className="btn primary" onClick={() => onChoose(item)}>
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
