import { roadmap } from "../../data/mockData";
import { InfoCard, SectionHead } from "../ui";

export function RoadmapSection() {
  return (
    <div className="panel">
      <SectionHead title="开发计划" desc="把展示页里的开发思路转成更适合真正项目推进的阶段。" />
      <div className="stack">
        {roadmap.map((item) => (
          <InfoCard key={item.phase}>
            <div className="row between start">
              <strong>{item.title}</strong>
              <span className="pill accent">{item.phase}</span>
            </div>
            <p className="muted">{item.text}</p>
          </InfoCard>
        ))}
      </div>
    </div>
  );
}
