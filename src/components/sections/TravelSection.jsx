import { useState } from "react";
import { InfoCard, SectionHead } from "../ui";

const recruitmentNotes = [
  "优先招募散场后可覆盖虹桥、徐泾和人民广场方向的车主。",
  "默认按同馆区、同行人数和顺路程度做轻匹配，不做实时抢单。",
  "正式版上线前会补司机审核、费用说明和安全须知。"
];

const itashaMetaTags = [
  "车型：轿车 / SUV",
  "可载：3-4 人",
  "路线：虹桥 / 徐泾 / 市区",
  "平台：抖音 / B站 / 小红书"
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
        <div className="stack" style={{ marginBottom: 16 }}>
          <InfoCard>
            <div className="row between start">
              <div>
                <strong>痛车司机招募</strong>
                <p className="muted">把返程做成更有漫展氛围的接驳方式，先以活动招募和意向匹配为主。</p>
              </div>
              <span className="pill accent">活动招募中</span>
            </div>
            <div className="tag-row">
              <span className="tag">已报名车主 {itashaCampaign?.driverCount ?? 0} 位</span>
              <span className="tag">搭乘意向 {itashaCampaign?.riderCount ?? 0} 人</span>
              <span className="tag">散场后 18:30 - 21:00</span>
              {itashaMetaTags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
            </div>
            <p className="muted">当前优先接驳路线：国家会展中心 ⇄ 虹桥枢纽 / 徐泾东 / 人民广场方向。适合散场后顺路结伴返程、拍车打卡或活动接驳，也适合作为 Coser 直播结束后的同好导流入口。</p>
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
                  <p className="muted">先做成活动报名与意向匹配能力，兼容车主招募、乘客登记和直播流量承接。</p>
                </div>
                <span className="pill info">演示版可交互</span>
              </div>
              <div className="grid two" style={{ marginTop: 12 }}>
                <InfoCard>
                  <strong>车主侧信息</strong>
                  <p className="muted">提交车型、可载人数、接驳时段、覆盖路线和是否接受拼车。后续可扩展证件审核和停车指引。</p>
                </InfoCard>
                <InfoCard>
                  <strong>直播联动位</strong>
                  <p className="muted">适合挂在 Coser 直播间主页、口播口令、二维码海报或直播结束页，把同好流量引到活动 H5 再沉淀到招募模块。</p>
                </InfoCard>
              </div>
              <div className="tag-row" style={{ marginTop: 12 }}>
                <span className="tag">导流方式：直播口令</span>
                <span className="tag">导流方式：主页链接</span>
                <span className="tag">导流方式：海报二维码</span>
                <span className="tag">转化目标：报名 / 搭乘 / 关注活动</span>
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
        <SectionHead title="返程建议" desc="散场时最怕临时慌乱，这里先帮你做取舍，也把活动型接驳能力提前放进来。" />
        <div className="grid two" style={{ marginBottom: 16 }}>
          <InfoCard>
            <strong>车主权益</strong>
            <p className="muted">演示版里先展示优先曝光、集中接驳推荐位和活动页展示资格，后续可以扩展停车指引和补贴说明。</p>
          </InfoCard>
          <InfoCard>
            <strong>乘客体验</strong>
            <p className="muted">以顺路结伴、散场拼车和同好接驳为主，减少高峰期打车焦虑，也让交通页更有二次元活动特色。</p>
          </InfoCard>
        </div>
        <div className="stack">
          {[
            "如果和搭子同行，优先拼车或结伴地铁，安全感和效率都会更高。",
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
