import { buddyFilterOptions } from "../../data/mockData";
import { FilterBar, InfoCard, SectionHead } from "../ui";

const iceBreakers = [
  "先定集合点，优先选馆外显眼地标或服务台",
  "先同步目标，是逛摊、拍照、看舞台还是吃谷",
  "提前设散场预案，避免结束后打不到车",
  "支持轻社交，只拼补给或摄影也成立"
];

const buddyNotes = [
  { title: "同坑优先", text: "先按目标筛一轮，再看节奏和区域是否顺路。" },
  { title: "约拍分流", text: "摄影区拥挤时，先去侧馆空景区等更容易出片。" },
  { title: "散场预案", text: "搭子不是只管一起逛，返程能不能同步也很重要。" }
];

export function BuddySection({ buddyFilter, buddies, loading, onBuddyFilterChange, onInvite, onPlanRoute, userPool = [] }) {
  return (
    <div className="section-layout">
      <div className="panel">
        <SectionHead
          title="搭子匹配"
          desc="把路演里的搭子社交做成更像真实使用的匹配页：看目的、看节奏、看顺路程度。"
          side={<span className="pill accent">候选 {buddies.length} 人</span>}
        />
        <FilterBar items={buddyFilterOptions} value={buddyFilter} onChange={onBuddyFilterChange} />
        <div className="grid three" style={{ marginBottom: 16 }}>
          {buddyNotes.map((item) => (
            <InfoCard key={item.title}>
              <strong>{item.title}</strong>
              <p className="muted">{item.text}</p>
            </InfoCard>
          ))}
        </div>
        <div className="stack">
          {loading && <InfoCard><p>正在加载搭子数据...</p></InfoCard>}
          {!loading && buddies.length === 0 && <InfoCard><p>当前筛选下暂无匹配搭子。</p></InfoCard>}
          {buddies.map((item) => (
            <InfoCard key={item.name}>
              <div className="row between start">
                <div>
                  <strong>{item.name}</strong>
                  <p className="muted">{item.role} · {item.time} · {item.vibe}</p>
                </div>
                <span className="pill success">{item.purpose}</span>
              </div>
              <p className="muted">{item.intro}</p>
              <div className="tag-row">
                {item.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
                <span className="tag">顺路度高</span>
              </div>
              <div className="action-row">
                <button className="btn primary" onClick={() => onInvite(item.name)}>发起同逛邀请</button>
                <button className="btn ghost" onClick={() => onPlanRoute(item.name)}>一起规划路线</button>
              </div>
            </InfoCard>
          ))}
        </div>
      </div>
      <div className="panel">
        <SectionHead title="在线同好" desc="除了搭子匹配，也把当前在线、可临时协作的人放到同一页里。" />
        <div className="stack">
          {userPool.slice(0, 4).map((user) => (
            <InfoCard key={user.id}>
              <strong>{user.name}</strong>
              <p className="muted">{user.role} · {user.onlineStatus} · 位于 {user.currentZone}</p>
              <div className="tag-row">
                {user.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
              </div>
            </InfoCard>
          ))}
        </div>
        <div style={{ height: 16 }} />
        <SectionHead title="轻社交建议" desc="适合漫展当天的关系强度，不强推重社交。" />
        <div className="stack">
          {iceBreakers.map((text) => (
            <InfoCard key={text}>
              <p>{text}</p>
            </InfoCard>
          ))}
        </div>
      </div>
    </div>
  );
}
