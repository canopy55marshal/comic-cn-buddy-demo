export function SectionHead({ title, desc, side }) {
  return (
    <div className="section-head">
      <div>
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
      {side}
    </div>
  );
}

export function FilterBar({ items, value, onChange }) {
  return (
    <div className="filter-bar">
      {items.map((item) => (
        <button
          key={item}
          className={value === item ? "active" : ""}
          onClick={() => onChange(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export function StatsCard({ title, text }) {
  return (
    <div className="stats-card">
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  );
}

export function InfoCard({ children }) {
  return <article className="info-card">{children}</article>;
}
