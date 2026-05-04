import { useMemo, useState } from "react";
import { liveLinks, livePlatforms } from "../../data/mockData";
import { FilterBar, InfoCard, SectionHead } from "../ui";

const liveTips = [
  "优先看和你当前馆区一致的直播，信息会更实时。",
  "想冲热门摊位时，先看现场主播的排队实况，比盲冲更稳。",
  "直播账号页适合快速收藏，等你换馆区或返程时再回看。"
];

export function LiveSection() {
  const [platform, setPlatform] = useState("全部");

  const filteredLinks = useMemo(
    () => liveLinks.filter((item) => platform === "全部" || item.platform === platform),
    [platform]
  );

  return (
    <div className="section-layout">
      <div className="panel">
        <SectionHead
          title="直播链接"
          desc="集中查看现场正在直播的 Coser / 主播，按平台快速找到对应直播账号和当前馆区。"
          side={<span className="pill accent">直播中 {liveLinks.filter((item) => item.time === "直播中").length} 场</span>}
        />
        <FilterBar items={livePlatforms} value={platform} onChange={setPlatform} />
        <div className="stack" style={{ marginTop: 16 }}>
          {filteredLinks.map((item) => (
            <InfoCard key={item.id}>
              <div className="row between start">
                <div>
                  <strong>{item.name}</strong>
                  <p className="muted">{item.platform} · {item.account}</p>
                </div>
                <span className="pill info">{item.time}</span>
              </div>
              <div className="tag-row">
                <span className="tag">{item.zone}</span>
                <span className="tag">{item.viewers}</span>
                <span className="tag">{item.platform}</span>
              </div>
              <p className="muted">{item.cosplay}</p>
              <p className="muted">当前直播：{item.liveTitle}</p>
            </InfoCard>
          ))}
          {filteredLinks.length === 0 && (
            <InfoCard>
              <p>当前筛选下还没有直播账号，换个平台看看。</p>
            </InfoCard>
          )}
        </div>
      </div>

      <div className="panel">
        <SectionHead title="使用建议" desc="把直播链接当作现场信息流入口，用来判断馆区热度、排队情况和活动氛围。" />
        <div className="grid two" style={{ marginBottom: 16 }}>
          <InfoCard>
            <strong>馆区实时感</strong>
            <p className="muted">如果你还没决定去哪一馆，先看不同主播当前所在馆区，能更快判断哪里更热、更堵或更适合拍照。</p>
          </InfoCard>
          <InfoCard>
            <strong>账号快速收藏</strong>
            <p className="muted">演示版先展示平台和账号，后续可以扩展收藏、跳转和直播回放入口。</p>
          </InfoCard>
        </div>
        <div className="stack">
          {liveTips.map((text) => (
            <InfoCard key={text}>
              <p>{text}</p>
            </InfoCard>
          ))}
        </div>
      </div>
    </div>
  );
}
