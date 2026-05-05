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

const rewardMilestones = [
  { count: 2, title: "双人同行礼包", text: "解锁补给拼单减免和同行地图快捷入口。", unlocked: true },
  { count: 4, title: "四人组队权益", text: "解锁返程优先建议和组队打卡奖励。", unlocked: true },
  { count: 6, title: "六人裂变加成", text: "解锁限定邀请海报和更多现场权益展示位。", unlocked: false }
];

export function BuddySection({ buddyFilter, buddies, loading, onBuddyFilterChange, onInvite, onPlanRoute, userPool = [], buddyCompleted = false }) {
  return (
    <div className="section-layout">
      <div className="panel">
        <SectionHead
          title="好友同行"
          desc="把熟人漫展同行做成邀约激励页：先分享，再组队，再领取同行权益，不走陌生社交。"
          side={<span className={`pill ${buddyCompleted ? "success" : "accent"}`}>{buddyCompleted ? "本页动作已完成" : `邀约模版 ${buddies.length} 个`}</span>}
        />
        <InfoCard className={`page-progress-card ${buddyCompleted ? "completed" : ""}`} style={{ marginBottom: 16 }}>
          <div className="row between start">
            <div>
              <strong>同行任务反馈</strong>
              <p className="muted">{buddyCompleted ? "你已经生成过熟人同行邀约，当前可以继续补同行权益或扩大分享范围。" : "先生成一张邀请海报或配置一次同行权益，系统就会把同行动作标成已完成。"}</p>
            </div>
            <span className={`pill ${buddyCompleted ? "success" : "accent"}`}>{buddyCompleted ? "已完成" : "待完成"}</span>
          </div>
        </InfoCard>
        <FilterBar items={buddyFilterOptions} value={buddyFilter} onChange={onBuddyFilterChange} />
        <div className="grid two" style={{ marginBottom: 16 }}>
          <div className="invite-poster-card">
            <span className="pill accent">熟人分享海报</span>
            <strong>一起去漫展，同行更轻松</strong>
            <p className="muted">把门票、补给、返程和主播行程一次分享给熟人，不做陌生社交，只做组队激励。</p>
            <div className="tag-row">
              <span className="tag">邀请码 CCBD-2026</span>
              <span className="tag">已邀请 4 人</span>
              <span className="tag">转化率 32%</span>
            </div>
            <div className="action-row">
              <button className="btn primary" onClick={() => onInvite("默认同行海报")}>生成邀请海报</button>
              <button className="btn ghost" onClick={() => onPlanRoute("默认同行海报")}>复制邀请码</button>
            </div>
          </div>
          <div className="stack">
            <InfoCard>
              <div className="row between start">
                <strong>同行人数进度</strong>
                <span className="pill success">4 / 6</span>
              </div>
              <div className="invite-progress-track">
                <div className="invite-progress-fill" />
              </div>
              <p className="muted">当前已经拉到 4 位熟人同行，再邀请 2 人就能解锁更高阶的裂变奖励。</p>
            </InfoCard>
            <InfoCard>
              <strong>裂变目标</strong>
              <p className="muted">优先把邀约分享到微信好友、宿舍群和同IP小群，先形成真实同行关系，再转化成补给、返程和直播联动使用。</p>
            </InfoCard>
          </div>
        </div>
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
        <SectionHead title="奖励解锁" desc="同行人数越高，越适合叠加补给、返程和打卡奖励，形成更稳定的熟人裂变链路。" />
        <div className="stack" style={{ marginBottom: 16 }}>
          {rewardMilestones.map((item) => (
            <InfoCard key={item.title}>
              <div className="row between start">
                <div>
                  <strong>{item.title}</strong>
                  <p className="muted">{item.text}</p>
                </div>
                <span className={`pill ${item.unlocked ? "success" : "info"}`}>{item.unlocked ? `已解锁 ${item.count} 人` : `${item.count} 人解锁`}</span>
              </div>
            </InfoCard>
          ))}
        </div>
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
