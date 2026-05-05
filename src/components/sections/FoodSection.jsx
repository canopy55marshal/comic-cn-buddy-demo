import { useEffect, useMemo, useState } from "react";
import { foodCategories } from "../../data/mockData";
import { FilterBar, InfoCard, SectionHead } from "../ui";

const serviceHighlights = [
  { title: "馆内配送", text: "支持送到休息区、服务台和指定集合点。" },
  { title: "高峰避排队", text: "提前下单比现场排队更稳，也不容易错过活动。" },
  { title: "应急补给", text: "发夹、充电线、防走光贴和定妆工具都能一起买。" }
];

const cpsReturnStorageKey = "comic-con-buddy-cps-return";
const pickupPoints = [
  "A馆西侧休息区",
  "北门服务台 2号点",
  "B馆摄影区补给点",
  "连廊中转取餐点"
];

function getFinishedSuggestions(pickupPoint = "") {
  if (pickupPoint.includes("B馆")) {
    return [
      { title: "去补摄影预约", text: "取餐点离摄影区更近，适合顺路锁一个空档时段。", action: "queue", button: "去排队预约" },
      { title: "回地图确认动线", text: "先看从取餐点去摄影区或服务区的最短路线。", action: "map", button: "查看路线" }
    ];
  }
  if (pickupPoint.includes("北门")) {
    return [
      { title: "去处理返程安排", text: "你已经靠近服务区和返程点，适合顺便看返程方案。", action: "travel", button: "去交通出行" },
      { title: "去妆造服务", text: "如果取餐后准备继续活动，可以先补妆或修整状态。", action: "service", button: "去妆造服务" }
    ];
  }
  if (pickupPoint.includes("A馆")) {
    return [
      { title: "回主舞台或直播热区", text: "取餐后更适合继续看主舞台活动或同步直播情况。", action: "live", button: "去直播链接" },
      { title: "回首页继续安排行程", text: "这次取餐安排已经结束，可以继续推进当天别的任务。", action: "home", button: "回首页" }
    ];
  }
  return [
    { title: "回首页继续安排", text: "这次取餐安排已经完成，适合回到首页继续推进其他事情。", action: "home", button: "回首页" },
    { title: "查看取餐提醒", text: "如果想确认提醒状态，可以直接去提醒页统一查看。", action: "reminder", button: "去提醒页" }
  ];
}

export function FoodSection({
  cartCount,
  foodFilter,
  merchants,
  orders,
  loading,
  onFoodFilterChange,
  onAddToCart,
  onCreateOrder,
  onNavigate,
  onOpenPickupMap,
  onCreatePickupReminder
}) {
  const latestOrder = orders[0];
  const cpsOffers = merchants.filter((item) => item.type === "cps");
  const normalMerchants = merchants.filter((item) => item.type !== "cps");
  const [cpsReturnState, setCpsReturnState] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      return JSON.parse(window.localStorage.getItem(cpsReturnStorageKey) || "null");
    } catch {
      return null;
    }
  });
  const finishedSuggestions = getFinishedSuggestions(cpsReturnState?.pickupPoint || "");

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(cpsReturnStorageKey, JSON.stringify(cpsReturnState));
  }, [cpsReturnState]);

  useEffect(() => {
    if (typeof document === "undefined" || !cpsReturnState?.jumped || cpsReturnState?.returned) return undefined;

    const handleResume = () => {
      setCpsReturnState((prev) => {
        if (!prev || prev.returned || !prev.jumped) return prev;
        return {
          ...prev,
          status: "returned",
          feedback: "欢迎回来，先确认取餐点，再继续设置提醒和路线。",
          returned: true,
          nextSteps: prev.nextSteps?.length
            ? prev.nextSteps
            : [
              { key: "pickup", label: "确认取餐点", done: false },
              { key: "reminder", label: "设置取餐提醒", done: false },
              { key: "route", label: "回地图确认路线", done: false }
            ]
        };
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        handleResume();
      }
    };

    window.addEventListener("focus", handleResume);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("focus", handleResume);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [cpsReturnState]);

  const copyText = async (text, successText) => {
    try {
      await navigator.clipboard.writeText(text);
      setCpsReturnState((prev) => ({
        ...(prev || {}),
        feedback: successText,
        copiedText: text
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
      feedback: "已跳转外卖平台，完成下单后回到应用继续安排取餐和行程。",
      copiedText: "",
      copiedType: "",
      jumped: true
    });
    window.open(item.orderLink, "_blank", "noopener,noreferrer");
  };

  const handleReturnToApp = () => {
    setCpsReturnState((prev) => ({
      ...prev,
      status: "returned",
      feedback: "欢迎回来，建议按顺序完成取餐点、提醒和路线确认，再回首页继续安排行程。",
      pickupPoint: prev?.pickupPoint || "",
      returned: true,
      nextSteps: [
        { key: "pickup", label: "确认取餐点", done: false },
        { key: "reminder", label: "设置取餐提醒", done: false },
        { key: "route", label: "回地图确认路线", done: false }
      ]
    }));
  };

  const handleCompleteReturnStep = (stepKey, target) => {
    setCpsReturnState((prev) => {
      if (!prev?.nextSteps) return prev;
      const nextSteps = prev.nextSteps.map((item) => (
        item.key === stepKey ? { ...item, done: true } : item
      ));
      const allDone = nextSteps.every((item) => item.done);
      return {
        ...prev,
        status: allDone ? "done" : prev.status,
        feedback: allDone ? "本次取餐安排已完成，系统会按提醒时间提示你取餐。" : prev.feedback,
        nextSteps
      };
    });
    if (stepKey === "reminder" && cpsReturnState?.pickupPoint) {
      onCreatePickupReminder?.(cpsReturnState.pickupPoint, cpsReturnState.merchantName);
      return;
    }
    if (stepKey === "route" && cpsReturnState?.pickupPoint) {
      onOpenPickupMap?.(cpsReturnState.pickupPoint);
      return;
    }
    if (target) onNavigate?.(target);
  };

  const handleSelectPickupPoint = (point) => {
    setCpsReturnState((prev) => {
      if (!prev) return prev;
      const nextSteps = (prev.nextSteps || []).map((item) => (
        item.key === "pickup" ? { ...item, done: true } : item
      ));
      return {
        ...prev,
        pickupPoint: point,
        nextSteps
      };
    });
  };

  const progressSummary = useMemo(() => {
    const steps = cpsReturnState?.nextSteps || [];
    const doneCount = steps.filter((item) => item.done).length;
    return {
      total: steps.length,
      done: doneCount,
      percent: steps.length ? Math.round((doneCount / steps.length) * 100) : 0
    };
  }, [cpsReturnState]);

  const getCpsStatusTags = (item) => {
    const tags = [];
    if (cpsReturnState?.merchantName === item.name && cpsReturnState?.title === item.title) {
      if (cpsReturnState.copiedType === "command") tags.push("已复制团口令");
      if (cpsReturnState.copiedType === "link") tags.push("已复制链接");
      if (cpsReturnState.jumped) tags.push("已跳转");
      if (cpsReturnState.returned) tags.push("已返回");
      if (cpsReturnState.status === "done") tags.push("已完成安排");
    }
    return tags;
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
          {!loading && normalMerchants.length > 0 && (
            <>
              <SectionHead title="馆内配送" desc="优先展示可直接在场馆内配送或现场取餐的补给项。" />
              {normalMerchants.map((item) => (
                <InfoCard key={`${item.name}-${item.hot}`}>
                  <div className="food-item-cover">
                    <strong>{item.hot}</strong>
                    <p className="muted">{item.category} · {item.price}</p>
                  </div>
                  <div className="row between start">
                    <div>
                      <strong>{item.name}</strong>
                      <p className="muted">{item.category} · {item.eta}</p>
                    </div>
                    <span className="pill price">{item.price}</span>
                  </div>
                  <p className="muted">{item.desc}</p>
                  <div className="row between">
                    <span className="pill success">评分 {item.score}</span>
                    <span className="muted">爆款：{item.hot}</span>
                  </div>
                  <div className="action-row">
                    <button className="btn primary" onClick={() => onAddToCart(item.name)}>加入购物车</button>
                    <button className="btn ghost" onClick={() => onCreateOrder(item.name)}>立即下单</button>
                  </div>
                </InfoCard>
              ))}
            </>
          )}
          {!loading && cpsOffers.length > 0 && (
            <>
              <SectionHead title="外部CPS券卡" desc="这类券卡来自外卖平台或团购渠道，适合后续由后台表统一维护和投放。" />
              {cpsOffers.map((item) => (
                <InfoCard key={`${item.name}-${item.title}`} className="cps-offer-card">
                  <div className="cps-cover-card">
                    <span className="pill accent">{item.vendor}</span>
                    <strong>{item.coverTitle || item.title}</strong>
                    <p className="muted">{item.coverLabel || "团购券"}</p>
                  </div>
                  <div className="row between start">
                    <div>
                      <strong>{`🔥【外卖】${item.name}`}</strong>
                      <p className="muted">{`${item.title} · ${item.eta}`}</p>
                    </div>
                    <span className="pill price">{item.price}</span>
                  </div>
                  <p className="muted">💰门市价 {item.marketPrice}，现价仅需 {item.price}。{item.multiStore ? "支持多店可用，适合先囤券再安排取餐。" : item.desc}</p>
                  <div className="tag-row">
                    <span className="tag">{item.vendor}</span>
                    <span className="tag">后端表可配置</span>
                    {item.multiStore && <span className="tag">多店可用</span>}
                    {getCpsStatusTags(item).map((tag) => <span className="tag" key={tag}>{tag}</span>)}
                  </div>
                  <div className="stack" style={{ marginTop: 12 }}>
                    <div className="business-milestone">
                      <strong>下单链接</strong>
                      <p className="muted cps-inline-text">{item.orderLink}</p>
                    </div>
                    <div className="business-milestone">
                      <strong>团口令</strong>
                      <p className="muted cps-inline-text">{item.commandText}</p>
                    </div>
                  </div>
                  <div className="action-row">
                    <button className="btn primary" onClick={() => handleStartCpsOrder(item)}>{item.ctaLabel}</button>
                    <button
                      className="btn ghost"
                      onClick={async () => {
                        await copyText(item.commandText, "已复制团口令，可直接去美团粘贴打开");
                        setCpsReturnState((prev) => ({ ...(prev || {}), copiedType: "command", merchantName: item.name, title: item.title }));
                      }}
                    >
                      复制团口令
                    </button>
                    <button
                      className="btn ghost"
                      onClick={async () => {
                        await copyText(item.orderLink, "已复制下单链接");
                        setCpsReturnState((prev) => ({ ...(prev || {}), copiedType: "link", merchantName: item.name, title: item.title }));
                      }}
                    >
                      复制链接
                    </button>
                  </div>
                </InfoCard>
              ))}
            </>
          )}
        </div>
      </div>
      <div className="panel">
        <SectionHead title="订单追踪" desc="从下单、制作到送达，优先展示当前最影响逛展节奏的状态。" />
        {cpsReturnState?.status === "done" && (
          <InfoCard className="pickup-finished-card" style={{ marginBottom: 16 }}>
            <div className="row between start">
              <div>
                <strong>本次取餐安排已完成</strong>
                <p className="muted">取餐点、提醒和路线都已经确认完毕，你现在可以安心继续逛展，系统会在合适时间提醒你取餐。</p>
              </div>
              <span className="pill success">已完成</span>
            </div>
            <div className="tag-row">
              {cpsReturnState.merchantName && <span className="tag">{cpsReturnState.merchantName}</span>}
              {cpsReturnState.pickupPoint && <span className="tag">取餐点：{cpsReturnState.pickupPoint}</span>}
            </div>
            <div className="action-row">
              <button className="btn ghost" onClick={() => onNavigate?.("home")}>回首页看行程安排</button>
              <button className="btn ghost" onClick={() => onNavigate?.("reminder")}>查看取餐提醒</button>
            </div>
            <div className="grid two" style={{ marginTop: 16 }}>
              {finishedSuggestions.map((item) => (
                <InfoCard key={item.title} className="pickup-next-card">
                  <strong>{item.title}</strong>
                  <p className="muted">{item.text}</p>
                  <div className="action-row">
                    <button className="btn ghost" onClick={() => onNavigate?.(item.action)}>{item.button}</button>
                  </div>
                </InfoCard>
              ))}
            </div>
          </InfoCard>
        )}
        {cpsReturnState && (
          <InfoCard className={`page-progress-card ${cpsReturnState.status === "returned" || cpsReturnState.status === "done" ? "completed" : ""}`} style={{ marginBottom: 16 }}>
            <div className="row between start">
              <div>
                <strong>外卖跳转回流承接</strong>
                <p className="muted">{cpsReturnState.feedback}</p>
              </div>
              <span className={`pill ${cpsReturnState.status === "returned" || cpsReturnState.status === "done" ? "success" : "accent"}`}>
                {cpsReturnState.status === "done" ? "承接完成" : cpsReturnState.status === "returned" ? "已回到应用" : "等待返回"}
              </span>
            </div>
            <div className="tag-row">
              <span className="tag">{cpsReturnState.merchantName}</span>
              {cpsReturnState.title && <span className="tag">{cpsReturnState.title}</span>}
            </div>
            {cpsReturnState.nextSteps?.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <div className="row between start">
                  <strong>回流承接进度</strong>
                  <span className="pill info">{progressSummary.done} / {progressSummary.total}</span>
                </div>
                <div className="invite-progress-track">
                  <div className="today-progress-fill" style={{ width: `${progressSummary.percent}%` }} />
                </div>
              </div>
            )}
            <div className="action-row">
              {cpsReturnState.status === "pending_return" && (
                <button className="btn primary" onClick={handleReturnToApp}>我已下单并返回</button>
              )}
              {(cpsReturnState.status === "returned" || cpsReturnState.status === "done") && (
                <>
                  <button className="btn ghost" onClick={() => handleCompleteReturnStep("pickup", "food")}>确认取餐点</button>
                  <button className="btn ghost" onClick={() => handleCompleteReturnStep("reminder", "reminder")}>设置取餐提醒</button>
                  <button className="btn ghost" onClick={() => handleCompleteReturnStep("route", "map")} disabled={!cpsReturnState.pickupPoint}>回地图看路线</button>
                </>
              )}
            </div>
            {(cpsReturnState.status === "returned" || cpsReturnState.status === "done") && cpsReturnState.nextSteps?.length > 0 && (
              <div className="stack" style={{ marginTop: 12 }}>
                <InfoCard>
                  <strong>确认取餐点</strong>
                  <p className="muted">先选一个你最顺路的取餐点，后续提醒和路线都会围绕这里展开。</p>
                  <div className="tag-row" style={{ marginTop: 12 }}>
                    {pickupPoints.map((item) => (
                      <button
                        key={item}
                        className={`pickup-chip ${cpsReturnState.pickupPoint === item ? "active" : ""}`}
                        onClick={() => handleSelectPickupPoint(item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </InfoCard>
                {cpsReturnState.nextSteps.map((item) => (
                  <div key={item.key} className={`return-step-item ${item.done ? "done" : ""}`}>
                    <span className={`todo-check ${item.done ? "done" : ""}`}>{item.done ? "✓" : ""}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
                {cpsReturnState.pickupPoint && (
                  <InfoCard className="page-progress-card completed">
                    <strong>当前取餐点</strong>
                    <p className="muted">{cpsReturnState.pickupPoint}。建议下一步去设置取餐提醒，再回地图确认动线。</p>
                    <div className="action-row">
                      <button className="btn ghost" onClick={() => handleCompleteReturnStep("reminder", "reminder")}>
                        去提醒页创建取餐提醒
                      </button>
                    </div>
                  </InfoCard>
                )}
              </div>
            )}
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
              {cpsReturnState?.pickupPoint && (item.merchantName || item.name) === cpsReturnState.merchantName && (
                <div className="tag-row">
                  <span className="tag">取餐点：{cpsReturnState.pickupPoint}</span>
                </div>
              )}
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
