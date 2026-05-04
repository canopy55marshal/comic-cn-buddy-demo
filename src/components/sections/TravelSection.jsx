import { useState } from "react";
import { InfoCard, SectionHead } from "../ui";

const recruitmentNotes = [
  "优先把地铁、拼车、网约车这些高频返程方案放前面，先解决交通便利。",
  "痛车接驳只作为特色补充，不应该盖过主流返程方案。",
  "正式版上线前会补司机审核、费用说明和安全须知。"
];

const itashaMetaTags = [
  "车型：轿车 / SUV",
  "可载：3-4 人",
  "路线：虹桥 / 徐泾 / 市区",
  "接驳：散场后定点出发"
];

export function TravelSection({ travelOptions = [], onChoose, itashaCampaign, onJoinDriver, onJoinRide }) {
  const selectedOption = travelOptions.find((item) => item.selected);
  const role = itashaCampaign?.role;
  const [showRecruitmentCard, setShowRecruitmentCard] = useState(false);

  return (
    <div className="section-layout">
      <div className="panel">
        <SectionHead
          title="交通出行"
          desc="把散场返程做成可决策页面：先解决怎么更方便回去，再考虑痛车这类更有仪式感的补充方案。"
          side={<span className="pill info">{selectedOption ? "已选返程方案" : "待选择"}</span>}
        />
        <div className="grid two" style={{ marginBottom: 16 }}>
          <InfoCard>
            <strong>当前返程决策</strong>
            <p className="muted">{selectedOption ? `你已选择 ${selectedOption.title}，当前预估 ${selectedOption.eta}。` : "你还没锁定返程方案，建议散场前 30 分钟先定一个。"}</p>
          </InfoCard>
          <InfoCard>
            <strong>推荐判断</strong>
            <p className="muted">{selectedOption?.mode === "地铁" ? "适合不赶时间且不想承受打车高峰溢价的路线。" : selectedOption?.mode === "拼车" ? "适合优先解决返程效率，通常比临时打车更稳。" : "如果你还没决定，优先看等待时间更短、换乘更少的方案。"}</p>
          </InfoCard>
        </div>
        <div className="stack" style={{ marginBottom: 16 }}>
          <InfoCard>
            <div className="row between start">
              <div>
                <strong>痛车接驳补充方案</strong>
                <p className="muted">在主流返程方案之外，提供更有漫展仪式感的特色接驳，先以活动招募和意向匹配为主。</p>
              </div>
              <span className="pill accent">特色补充</span>
            </div>
            <div className="tag-row">
              <span className="tag">已报名车主 {itashaCampaign?.driverCount ?? 0} 位</span>
              <span className="tag">搭乘意向 {itashaCampaign?.riderCount ?? 0} 人</span>
              <span className="tag">散场后 18:30 - 21:00</span>
              {itashaMetaTags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
            </div>
            <p className="muted">当前优先接驳路线：国家会展中心 ⇄ 虹桥枢纽 / 徐泾东 / 人民广场方向。适合散场后顺路返程、拍车打卡或做活动型接驳补充。</p>
            <div className="action-row">
              <button className="btn primary" onClick={onJoinDriver} disabled={role === "driver" || role === "rider"}>
                {role === "driver" ? "已报名车主" : role === "rider" ? "已锁定搭乘身份" : "我要报名车主"}
              </button>
              <button className="btn ghost" onClick={onJoinRide} disabled={role === "rider" || role === "driver"}>
                {role === "rider" ? "已登记搭乘" : role === "driver" ? "已锁定车主身份" : "我想搭痛车"}
              </button>
              <button className="btn ghost" onClick={() => setShowRecruitmentCard((prev) => !prev)}>
                {showRecruitmentCard ? "收起报名卡" : "查看报名卡"}
              </button>
            </div>
          </InfoCard>
          {showRecruitmentCard && (
            <InfoCard>
              <div className="row between start">
                <div>
                  <strong>痛车招募报名卡</strong>
                  <p className="muted">先做成特色接驳报名与意向匹配能力，核心仍然是补充交通便利，而不是替代主流交通。</p>
                </div>
                <span className="pill info">演示版可交互</span>
              </div>
              <div className="grid two" style={{ marginTop: 12 }}>
                <InfoCard>
                  <strong>车主侧信息</strong>
                  <p className="muted">提交车型、可载人数、接驳时段、覆盖路线和是否接受拼车。后续可扩展证件审核和停车指引。</p>
                </InfoCard>
                <InfoCard>
                  <strong>接驳规则</strong>
                  <p className="muted">当前演示版默认按顺路程度、同行人数和返程方向做轻匹配，不做实时抢单，也不直接介入费用结算。</p>
                </InfoCard>
              </div>
              <div className="tag-row" style={{ marginTop: 12 }}>
                <span className="tag">报名信息：车型</span>
                <span className="tag">报名信息：可载人数</span>
                <span className="tag">报名信息：覆盖路线</span>
                <span className="tag">规则：顺路优先匹配</span>
              </div>
            </InfoCard>
          )}
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
        <SectionHead title="返程建议" desc="散场时最怕临时慌乱，这里先帮你做取舍；痛车属于加分项，不是唯一答案。" />
        <div className="grid two" style={{ marginBottom: 16 }}>
          <InfoCard>
            <strong>交通便利优先</strong>
            <p className="muted">先比较等待时间、换乘复杂度和道具携带成本，再决定拼车、地铁还是打车。</p>
          </InfoCard>
          <InfoCard>
            <strong>仪式感加分</strong>
            <p className="muted">如果返程便利已经满足，再看痛车接驳、同IP拼车和拍照打卡这些更有漫展氛围的补充体验。</p>
          </InfoCard>
        </div>
        <div className="stack">
          {[
            "如果和熟人同行，优先拼车或一起走地铁，通常比临时各自打车更稳。",
            "高峰期打车等待时间会明显上升，别等到出馆才开始看车。",
            "如果还有大量周边和道具，优先选少换乘的路线。",
            "返程方案最好在散场前 30 分钟就确定，别让最后阶段最乱。"
          ].concat(recruitmentNotes).map((text) => (
            <InfoCard key={text}>
              <p>{text}</p>
            </InfoCard>
          ))}
        </div>
      </div>
    </div>
  );
}
