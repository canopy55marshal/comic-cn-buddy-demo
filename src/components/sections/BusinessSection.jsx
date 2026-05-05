import { InfoCard, SectionHead } from "../ui";

const demandSources = [
  {
    title: "品牌商单",
    tag: "高客单低频",
    text: "品牌方发布合作需求，平台按风格、地域、档期和性价比去匹配合适的 COSER。"
  },
  {
    title: "漫展招募",
    tag: "周期性需求",
    text: "主办方发布漫展出场、驻场、互动和联动需求，平台做活动型撮合和履约支持。"
  },
  {
    title: "COS委托",
    tag: "低客单高频",
    text: "个人或创作者发起线上出图、视频、漫展约拍、工作室约拍和角色配音委托。"
  }
];

const flowSteps = [
  { title: "发布需求", text: "品牌、主办方或个人先发布需求，平台不在这一阶段收费。" },
  { title: "AI匹配", text: "按风格、地域、档期、潜力、性价比和公平轮换做推荐。" },
  { title: "托管付款", text: "品牌商单按 30%+40%+30%，COS委托按 50%+50% 分阶段托管。" },
  { title: "执行交付", text: "初稿确认方向，终稿完成交付，平台在中间提供交易规则和过程保障。" },
  { title: "成交分佣", text: "成交后再抽佣，COSER端 10%，品牌端 5%，提现手续费 1%。" }
];

const ruleCards = [
  {
    title: "托管付款",
    tag: "分阶段安全",
    text: "成交前钱先在平台托管，COSER 更放心执行，品牌和委托方也更容易确认交付节点。"
  },
  {
    title: "保证金机制",
    tag: "过滤假需求",
    text: "发布需求时交保证金，成交后退还，取消扣减，优先过滤试探型和低质量需求。"
  },
  {
    title: "成交才收费",
    tag: "Upwork模式",
    text: "发布免费、AI匹配免费，只有真正成交后平台才抽佣，不成功不收费。"
  },
  {
    title: "提现手续费",
    tag: "仅 1%",
    text: "平台把主要收费点放在成交撮合，而不是前置收费或高额提现抽成。"
  }
];

const cosRequestTypes = [
  "C1 线上出图",
  "C2 线上视频",
  "C3 漫展约拍",
  "C4 工作室约拍",
  "C5 角色配音"
];

export function BusinessSection({ onNavigate }) {
  return (
    <div className="section-layout">
      <div className="panel">
        <SectionHead
          title="COSER商业平台"
          desc="把宣讲网页里的 COSER 的 Upwork 模式落成独立页面：三种需求来源、托管交易、成交才收费。"
          side={<span className="pill accent">COSER 的 Upwork</span>}
        />
        <div className="grid two" style={{ marginBottom: 16 }}>
          <div className="business-hero-card">
            <span className="pill info">AI撮合 + 托管交易</span>
            <strong>让 COSER 的每一分热爱都值得</strong>
            <p className="muted">这页不再只讲概念，而是把品牌商单、漫展招募和 COS委托统一放进一套交易模型里。</p>
            <div className="tag-row">
              <span className="tag">COSER端抽佣 10%</span>
              <span className="tag">品牌端抽佣 5%</span>
              <span className="tag">提现手续费 1%</span>
            </div>
            <div className="action-row">
              <button className="btn primary" onClick={() => onNavigate?.("live")}>查看直播引流</button>
              <button className="btn ghost" onClick={() => onNavigate?.("service")}>查看服务供给</button>
            </div>
          </div>
          <div className="grid two">
            {ruleCards.map((item) => (
              <InfoCard key={item.title}>
                <div className="row between start">
                  <strong>{item.title}</strong>
                  <span className="pill info">{item.tag}</span>
                </div>
                <p className="muted">{item.text}</p>
              </InfoCard>
            ))}
          </div>
        </div>

        <SectionHead title="三种需求来源" desc="平台不是只做品牌合作，而是把品牌、主办方和个人委托统一收进需求池。" />
        <div className="grid three" style={{ marginTop: 16, marginBottom: 16 }}>
          {demandSources.map((item) => (
            <InfoCard key={item.title}>
              <div className="row between start">
                <strong>{item.title}</strong>
                <span className="pill success">{item.tag}</span>
              </div>
              <p className="muted">{item.text}</p>
            </InfoCard>
          ))}
        </div>

        <SectionHead title="撮合流程" desc="从发布需求到成交分佣，整个流程都按 Upwork 逻辑拆开讲清楚。" />
        <div className="stack" style={{ marginTop: 16 }}>
          {flowSteps.map((item, index) => (
            <InfoCard key={item.title}>
              <div className="row between start">
                <strong>{index + 1}. {item.title}</strong>
                <span className="pill accent">流程</span>
              </div>
              <p className="muted">{item.text}</p>
            </InfoCard>
          ))}
        </div>
      </div>

      <div className="panel">
        <SectionHead title="COS委托" desc="这是网页里新抬出来的第三种需求来源，核心价值是填补私聊交易的信任空白。" />
        <div className="grid two" style={{ marginBottom: 16 }}>
          <InfoCard>
            <strong>委托价值</strong>
            <p className="muted">把原本散落在闲鱼、小红书私聊里的低频低信任交易，收进平台的托管付款体系里。</p>
            <div className="tag-row">
              <span className="tag">50% + 50%</span>
              <span className="tag">公共场所优先</span>
              <span className="tag">方向确认 + 终稿交付</span>
            </div>
          </InfoCard>
          <InfoCard>
            <strong>适合先做展示版</strong>
            <p className="muted">演示阶段先把类型、流程、规则讲清楚，比急着做复杂撮合表单更能承接宣讲网页的商业模式。</p>
          </InfoCard>
        </div>
        <div className="grid two">
          {cosRequestTypes.map((item) => (
            <InfoCard key={item}>
              <strong>{item}</strong>
              <p className="muted">适合作为平台委托撮合的标准化需求类型，后续可再补表单、交付节点和样例模板。</p>
            </InfoCard>
          ))}
        </div>
      </div>
    </div>
  );
}
