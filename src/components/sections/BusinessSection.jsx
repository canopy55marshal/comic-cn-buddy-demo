import { useMemo, useState } from "react";
import { FilterBar, InfoCard, SectionHead } from "../ui";

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

const demandPool = [
  {
    id: "brand-1",
    type: "品牌商单",
    title: "国风新游角色联动拍摄",
    createdAt: "今天 09:20",
    budget: "¥18,000",
    deposit: "¥2,000",
    status: "匹配中",
    phase: "30% 已托管",
    requester: "品牌方 · 星绘互动",
    delivery: "平面图 12 张 + 短视频 3 条",
    matches: ["青岚 · 国风女角色", "白露 · 视频表现强", "凛夜 · 商单履约高"],
    desc: "品牌方需要 2 位擅长国风角色演绎的 COSER，支持平面图和短视频双交付。",
    milestone: ["已发布需求", "AI匹配中", "确认人选后托管 30%"],
    stages: [
      { label: "发布需求", status: "done" },
      { label: "AI匹配", status: "current" },
      { label: "首款托管", status: "upcoming" },
      { label: "执行交付", status: "upcoming" },
      { label: "成交分佣", status: "upcoming" }
    ]
  },
  {
    id: "expo-1",
    type: "漫展招募",
    title: "主舞台驻场互动 COSER 招募",
    createdAt: "今天 10:40",
    budget: "¥9,500",
    deposit: "¥1,000",
    status: "待确认",
    phase: "保证金已冻结",
    requester: "主办方 · 星河漫展组委会",
    delivery: "驻场互动 4 小时 + 舞台环节 2 场",
    matches: ["阿澄 · 舞台互动经验", "雪饼 · 现场控场稳", "木子 · 合影反馈高"],
    desc: "主办方需要 3 位现场驻场 COSER，负责舞台互动、巡场和用户合影环节。",
    milestone: ["已发布需求", "保证金冻结", "等待确认排期"],
    stages: [
      { label: "发布需求", status: "done" },
      { label: "保证金冻结", status: "current" },
      { label: "确认排期", status: "upcoming" },
      { label: "现场履约", status: "upcoming" },
      { label: "成交分佣", status: "upcoming" }
    ]
  },
  {
    id: "commission-1",
    type: "COS委托",
    title: "漫展现场约拍委托",
    createdAt: "昨天 21:15",
    budget: "¥1,200",
    deposit: "¥500",
    status: "执行中",
    phase: "50% 已托管",
    requester: "个人委托方 · 同IP粉丝用户",
    delivery: "漫展现场约拍 1 组 + 精修 9 张",
    matches: ["柚子 · 同IP出片强", "眠眠 · 现场沟通稳"],
    desc: "个人委托方希望在漫展当天完成 1 组角色约拍，要求现场公共场所执行。",
    milestone: ["方向已确认", "50% 托管中", "等待终稿交付"],
    stages: [
      { label: "委托发布", status: "done" },
      { label: "方向确认", status: "done" },
      { label: "50% 托管", status: "current" },
      { label: "终稿交付", status: "upcoming" },
      { label: "尾款结算", status: "upcoming" }
    ]
  }
];

const escrowNodes = [
  { title: "需求发布", text: "发布需求免费，先进入平台需求池。" },
  { title: "保证金 / 首付款", text: "品牌和委托先支付保证金或首阶段款，过滤假需求。" },
  { title: "中途确认", text: "根据初稿或排期确认，继续释放第二阶段托管款。" },
  { title: "终稿交付", text: "最终交付完成后，平台释放尾款并结算抽佣。" }
];

export function BusinessSection({ onNavigate }) {
  const [demandFilter, setDemandFilter] = useState("全部");
  const [sortMode, setSortMode] = useState("最新");
  const [selectedDemand, setSelectedDemand] = useState(demandPool[0]);
  const filteredDemandPool = useMemo(() => {
    const next = demandPool.filter((item) => demandFilter === "全部" || item.type === demandFilter);
    if (sortMode === "预算优先") {
      return [...next].sort((a, b) => Number(b.budget.replace(/[^\d]/g, "")) - Number(a.budget.replace(/[^\d]/g, "")));
    }
    if (sortMode === "执行中") {
      const order = { 执行中: 0, 匹配中: 1, 待确认: 2 };
      return [...next].sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9));
    }
    return [...next].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [demandFilter, sortMode]);
  const currentStageIndex = selectedDemand?.stages?.findIndex((item) => item.status === "current") ?? -1;

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
        <SectionHead title="需求池" desc="把品牌商单、漫展招募和 COS委托做成可浏览的需求卡片，方便用户理解平台里到底流转什么。 " />
        <div style={{ marginTop: 16, marginBottom: 12 }}>
          <FilterBar items={["全部", "品牌商单", "漫展招募", "COS委托"]} value={demandFilter} onChange={setDemandFilter} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <FilterBar items={["最新", "预算优先", "执行中"]} value={sortMode} onChange={setSortMode} />
        </div>
        <div className="grid three" style={{ marginTop: 16, marginBottom: 16 }}>
          {filteredDemandPool.map((item) => (
            <InfoCard key={item.id}>
              <div className="row between start">
                <strong>{item.title}</strong>
                <span className="pill success">{item.type}</span>
              </div>
              <p className="muted">{item.desc}</p>
              <div className="tag-row">
                <span className="tag">{item.createdAt}</span>
                <span className="tag">预算 {item.budget}</span>
                <span className="tag">保证金 {item.deposit}</span>
                <span className="tag">{item.status}</span>
                <span className="tag">{item.phase}</span>
              </div>
              <div className="action-row">
                <button className="btn primary" onClick={() => setSelectedDemand(item)}>查看详情</button>
              </div>
            </InfoCard>
          ))}
        </div>

        <SectionHead title="托管节点" desc="先把节点讲清楚，比一上来做复杂表单更能体现平台型交易保障。" />
        <div className="stack" style={{ marginTop: 16, marginBottom: 16 }}>
          <InfoCard>
            <div className="row between start">
              <strong>当前托管进度</strong>
              <span className="pill accent">{selectedDemand.phase}</span>
            </div>
            <div className="invite-progress-track">
              <div className="business-progress-fill" />
            </div>
            <p className="muted">当前查看的是 `{selectedDemand.title}`，平台会按阶段释放托管款，而不是一次性打款。</p>
          </InfoCard>
          {escrowNodes.map((item, index) => (
            <InfoCard key={item.title}>
              <div className="row between start">
                <strong>{index + 1}. {item.title}</strong>
                <span className="pill info">节点</span>
              </div>
              <p className="muted">{item.text}</p>
            </InfoCard>
          ))}
        </div>

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

      {selectedDemand && (
        <div className="overlay-backdrop" onClick={() => setSelectedDemand(null)}>
          <div className="detail-modal business-detail-modal" onClick={(event) => event.stopPropagation()}>
            <div className="row between start">
              <div>
                <strong style={{ fontSize: 20 }}>{selectedDemand.title}</strong>
                <p className="muted" style={{ marginTop: 8 }}>{selectedDemand.type} · {selectedDemand.status}</p>
              </div>
              <button className="btn ghost" onClick={() => setSelectedDemand(null)}>关闭</button>
            </div>
            <div className="tag-row" style={{ marginTop: 12 }}>
              <span className="tag">预算 {selectedDemand.budget}</span>
              <span className="tag">保证金 {selectedDemand.deposit}</span>
              <span className="tag">{selectedDemand.phase}</span>
              <span className="tag">{selectedDemand.status}</span>
            </div>
            <div className="stack" style={{ marginTop: 16 }}>
              <InfoCard>
                <strong>需求说明</strong>
                <p className="muted">{selectedDemand.desc}</p>
              </InfoCard>
              <InfoCard>
                <strong>需求方与交付</strong>
                <div className="stack" style={{ marginTop: 12 }}>
                  <div className="business-milestone">需求方：{selectedDemand.requester}</div>
                  <div className="business-milestone">交付方式：{selectedDemand.delivery}</div>
                </div>
              </InfoCard>
              <InfoCard>
                <div className="row between start">
                  <strong>阶段状态</strong>
                  <span className="pill accent">{currentStageIndex >= 0 ? `进行到第 ${currentStageIndex + 1} 步` : "待开始"}</span>
                </div>
                <div className="business-stage-list" style={{ marginTop: 12 }}>
                  {selectedDemand.stages.map((item) => (
                    <div className={`business-stage-item ${item.status}`} key={item.label}>
                      <span className="business-stage-dot" />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </InfoCard>
              <InfoCard>
                <strong>COSER匹配结果</strong>
                <div className="tag-row" style={{ marginTop: 12 }}>
                  {selectedDemand.matches.map((item) => (
                    <span className="tag" key={item}>{item}</span>
                  ))}
                </div>
              </InfoCard>
              <InfoCard>
                <strong>当前里程碑</strong>
                <div className="stack" style={{ marginTop: 12 }}>
                  {selectedDemand.milestone.map((item) => (
                    <div className="business-milestone" key={item}>{item}</div>
                  ))}
                </div>
              </InfoCard>
            </div>
            <div className="action-row" style={{ marginTop: 16 }}>
              <button className="btn primary" onClick={() => onNavigate?.("service")}>查看服务供给</button>
              <button className="btn ghost" onClick={() => onNavigate?.("live")}>查看直播引流</button>
              <button className="btn ghost" onClick={() => onNavigate?.("home")}>回首页</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
