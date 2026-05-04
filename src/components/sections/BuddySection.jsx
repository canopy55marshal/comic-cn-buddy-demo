import { buddyFilterOptions } from "../../data/mockData";
import { FilterBar, InfoCard, SectionHead } from "../ui";

const iceBreakers = [
  "优先分享给微信好友、宿舍群或同IP小群，不做陌生人匹配",
  "先同步目标，是一起进场、拼单补给、追主播还是散场返程",
  "提前设同行激励，比如拼单减免、组队礼包或返程同行权益",
  "把集合点和返程方案一起发出去，比临时社交更稳"
];

const buddyNotes = [
  { title: "熟人优先", text: "优先分享给熟人或已有群关系，规避陌生社交风险。" },
  { title: "同行激励", text: "重点不是匹配陌生人，而是通过邀约和奖励把熟人带进来。" },
  { title: "返程同步", text: "同行不只管一起逛，返程和补给也要能一起安排。" }
];

export function BuddySection({ buddyFilter, buddies, loading, onBuddyFilterChange, onInvite, onPlanRoute, userPool = [] }) {
  return (
    <div className="section-layout">
      <div className="panel">
        <SectionHead
          title="好友同行"
          desc="把熟人漫展同行做成邀约激励页：先分享，再组队，再领取同行权益，不走陌生社交。"
          side={<span className="pill accent">邀约模版 {buddies.length} 个</span>}
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
          {loading && <InfoCard><p>正在加载好友同行邀约模版...</p></InfoCard>}
          {!loading && buddies.length === 0 && <InfoCard><p>当前筛选下暂无同行邀约模版。</p></InfoCard>}
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
                <span className="tag">分享裂变</span>
              </div>
              <div className="action-row">
                <button className="btn primary" onClick={() => onInvite(item.name)}>生成分享邀约</button>
                <button className="btn ghost" onClick={() => onPlanRoute(item.name)}>配置同行权益</button>
              </div>
            </InfoCard>
          ))}
        </div>
      </div>
      <div className="panel">
        <SectionHead title="已邀请好友" desc="这里展示你已经拉进来的熟人同行池，而不是陌生人候选列表。" />
        <div className="stack">
          {userPool.slice(0, 4).map((user) => (
            <InfoCard key={user.id}>
              <strong>{user.name}</strong>
              <p className="muted">{user.role} · {user.onlineStatus} · 当前位于 {user.currentZone}</p>
              <div className="tag-row">
                {user.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
                <span className="tag">熟人同行</span>
              </div>
            </InfoCard>
          ))}
        </div>
        <div style={{ height: 16 }} />
        <SectionHead title="邀约建议" desc="把它做成熟人分享和同行激励，而不是陌生社交产品。" />
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
