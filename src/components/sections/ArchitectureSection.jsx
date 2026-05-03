import { architectureCards } from "../../data/mockData";
import { InfoCard, SectionHead } from "../ui";

export function ArchitectureSection() {
  return (
    <div className="panel">
      <SectionHead title="技术架构" desc="对照原站补齐方案说明，方便继续往前后端 MVP 演进。" />
      <div className="grid two">
        {architectureCards.map((item) => (
          <InfoCard key={item.title}>
            <strong>{item.title}</strong>
            <p className="muted">{item.text}</p>
          </InfoCard>
        ))}
      </div>
    </div>
  );
}
