import { foodCategories } from "../../data/mockData";
import { FilterBar, InfoCard, SectionHead } from "../ui";

const serviceHighlights = [
  { title: "馆内配送", text: "支持送到休息区、服务台和指定集合点。" },
  { title: "高峰避排队", text: "提前下单比现场排队更稳，也不容易错过活动。" },
  { title: "应急补给", text: "发夹、充电线、防走光贴和定妆工具都能一起买。" }
];

export function FoodSection({
  cartCount,
  foodFilter,
  merchants,
  orders,
  loading,
  onFoodFilterChange,
  onAddToCart,
  onCreateOrder
}) {
  const latestOrder = orders[0];

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
            <InfoCard key={item.name}>
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
        </div>
      </div>
      <div className="panel">
        <SectionHead title="订单追踪" desc="从下单、制作到送达，优先展示当前最影响逛展节奏的状态。" />
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
