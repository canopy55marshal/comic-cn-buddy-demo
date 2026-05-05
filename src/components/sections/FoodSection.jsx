import { useEffect, useState } from "react";
import { foodCategories } from "../../data/mockData";
import { FilterBar, InfoCard, SectionHead } from "../ui";

const serviceHighlights = [
  { title: "馆内配送", text: "支持送到休息区、服务台和指定集合点。" },
  { title: "高峰避排队", text: "提前下单比现场排队更稳，也不容易错过活动。" },
  { title: "应急补给", text: "发夹、充电线、防走光贴和定妆工具都能一起买。" }
];

const cpsReturnStorageKey = "comic-con-buddy-cps-return";

export function FoodSection({
  cartCount,
  foodFilter,
  merchants,
  orders,
  loading,
  onFoodFilterChange,
  onAddToCart,
  onCreateOrder,
  onNavigate
}) {
  const latestOrder = orders[0];
  const [cpsReturnState, setCpsReturnState] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      return JSON.parse(window.localStorage.getItem(cpsReturnStorageKey) || "null");
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(cpsReturnStorageKey, JSON.stringify(cpsReturnState));
  }, [cpsReturnState]);

  const copyText = async (text, successText) => {
    try {
      await navigator.clipboard.writeText(text);
      setCpsReturnState((prev) => ({
        ...(prev || {}),
        feedback: successText
      }));
    } catch {
      setCpsReturnState((prev) => ({
        ...(prev || {}),
        feedback: "复制失败，请手动长按复制"
      }));
    }
  };

  const handleStartCpsOrder = (item) => {
    setCpsReturnState({
      status: "pending_return",
      merchantName: item.name,
      title: item.title,
      link: item.orderLink,
      feedback: "已跳转外卖平台，完成下单后回到应用继续安排取餐和行程。"
    });
    window.open(item.orderLink, "_blank", "noopener,noreferrer");
  };

  const handleReturnToApp = () => {
    setCpsReturnState((prev) => ({
      ...prev,
      status: "returned",
      feedback: "欢迎回来，建议下一步确认取餐点、补一个提醒，再回首页继续安排行程。"
    }));
  };

  return (
    <div className="section-layout">
      <div className="panel">
        <SectionHead
          title="餐饮配送"
          desc="把首页路演里的餐饮配送能力细化成可点餐、可配送、可追踪的用户页。"
          side={<span className="pill info">购物车 {cartCount} 件</span>}
        />
        <div className="grid three">
          {serviceHighlights.map((item) => (
            <InfoCard key={item.title}>
              <strong>{item.title}</strong>
              <p className="muted">{item.text}</p>
            </InfoCard>
          ))}
        </div>
        <div style={{ height: 16 }} />
        <FilterBar items={foodCategories} value={foodFilter} onChange={onFoodFilterChange} />
        <div className="stack">
          {loading && <InfoCard><p>正在加载补给数据...</p></InfoCard>}
          {!loading && merchants.length === 0 && <InfoCard><p>当前分类暂无商家。</p></InfoCard>}
          {merchants.map((item) => (
            <InfoCard key={`${item.name}-${item.title || item.hot}`} className={item.type === "cps" ? "cps-offer-card" : ""}>
              <div className="row between start">
                <div>
                  <strong>{item.type === "cps" ? `🔥【外卖】${item.name}` : item.name}</strong>
                  <p className="muted">{item.type === "cps" ? `${item.title} · ${item.eta}` : `${item.category} · ${item.eta}`}</p>
                </div>
                <span className="pill price">{item.price}</span>
              </div>
              {item.type === "cps" ? (
                <>
                  <p className="muted">💰门市价 {item.marketPrice}，现价仅需 {item.price}。{item.multiStore ? "支持多店可用，适合先囤券再安排取餐。" : item.desc}</p>
                  <div className="tag-row">
                    <span className="tag">{item.vendor}</span>
                    <span className="tag">后端表可配置</span>
                    {item.multiStore && <span className="tag">多店可用</span>}
                  </div>
                  <div className="action-row">
                    <button className="btn primary" onClick={() => handleStartCpsOrder(item)}>{item.ctaLabel}</button>
                    <button className="btn ghost" onClick={() => copyText(item.commandText, "已复制团口令，可直接去美团粘贴打开")}>复制团口令</button>
                    <button className="btn ghost" onClick={() => copyText(item.orderLink, "已复制下单链接")}>复制链接</button>
                  </div>
                </>
              ) : (
                <>
                  <p className="muted">{item.desc}</p>
                  <div className="row between">
                    <span className="pill success">评分 {item.score}</span>
                    <span className="muted">爆款：{item.hot}</span>
                  </div>
                  <div className="action-row">
                    <button className="btn primary" onClick={() => onAddToCart(item.name)}>加入购物车</button>
                    <button className="btn ghost" onClick={() => onCreateOrder(item.name)}>立即下单</button>
                  </div>
                </>
              )}
            </InfoCard>
          ))}
        </div>
      </div>
      <div className="panel">
        <SectionHead title="订单追踪" desc="从下单、制作到送达，优先展示当前最影响逛展节奏的状态。" />
        {cpsReturnState && (
          <InfoCard className={`page-progress-card ${cpsReturnState.status === "returned" ? "completed" : ""}`} style={{ marginBottom: 16 }}>
            <div className="row between start">
              <div>
                <strong>外卖跳转回流承接</strong>
                <p className="muted">{cpsReturnState.feedback}</p>
              </div>
              <span className={`pill ${cpsReturnState.status === "returned" ? "success" : "accent"}`}>
                {cpsReturnState.status === "returned" ? "已回到应用" : "等待返回"}
              </span>
            </div>
            <div className="tag-row">
              <span className="tag">{cpsReturnState.merchantName}</span>
              {cpsReturnState.title && <span className="tag">{cpsReturnState.title}</span>}
            </div>
            <div className="action-row">
              {cpsReturnState.status !== "returned" && (
                <button className="btn primary" onClick={handleReturnToApp}>我已下单并返回</button>
              )}
              <button className="btn ghost" onClick={() => onNavigate?.("reminder")}>去设置取餐提醒</button>
              <button className="btn ghost" onClick={() => onNavigate?.("home")}>回首页继续安排</button>
            </div>
          </InfoCard>
        )}
        <div className="grid two">
          <InfoCard>
            <strong>当前进度</strong>
            <p className="muted">{latestOrder ? `${latestOrder.status} · ${latestOrder.merchantName || latestOrder.name}` : "还没有进行中的订单"}</p>
          </InfoCard>
          <InfoCard>
            <strong>结算建议</strong>
            <p className="muted">{cartCount > 0 ? `购物车已有 ${cartCount} 件，建议一起凑单送到同一取餐点。` : "先加购再统一结算，更适合漫展现场节奏。"}</p>
          </InfoCard>
        </div>
        <div style={{ height: 16 }} />
        <div className="stack">
          {orders.length === 0 && <InfoCard><p>当前还没有订单，先试试下单吧。</p></InfoCard>}
          {orders.map((item) => (
            <InfoCard key={`${item.merchantName || item.name}-${item.status}`}>
              <div className="row between start">
                <strong>{item.merchantName || item.name}</strong>
                <span className="pill accent">{item.status}</span>
              </div>
              <p className="muted">{item.detail}</p>
            </InfoCard>
          ))}
        </div>
        <div style={{ height: 16 }} />
        <SectionHead title="下单策略" desc="根据漫展现场节奏，给出更实用的点餐建议。" />
        <div className="stack">
          {[
            "上午优先买水和小食，中午再补主食，避免一开始就提太多。",
            "如果要拍正片，先选不容易弄花口红和底妆的饮品。",
            "和搭子一起凑单，统一送到同一个集合点最省时间。"
          ].map((text) => (
            <InfoCard key={text}>
              <p>{text}</p>
            </InfoCard>
          ))}
        </div>
      </div>
    </div>
  );
}
