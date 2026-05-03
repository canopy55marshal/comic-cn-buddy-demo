export function AppHeader({ navItems, section, onNavigate, currentUser }) {
  const mainItems = navItems.filter((item) => item.group === "main");
  const extendedItems = navItems.filter((item) => item.group === "extended");

  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark">漫</div>
        <div>
          <h1>漫展搭子</h1>
          {currentUser ? <span className="brand-meta">{currentUser.name} · {currentUser.role}</span> : null}
        </div>
      </div>
      <div className="nav-groups">
        <div className="nav-group">
          <span className="nav-group-title">主功能</span>
          <nav className="nav">
            {mainItems.map((item) => (
              <button
                key={item.key}
                className={section === item.key ? "active" : ""}
                onClick={() => onNavigate(item.key)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="nav-group">
          <span className="nav-group-title">扩展能力</span>
          <nav className="nav">
            {extendedItems.map((item) => (
              <button
                key={item.key}
                className={section === item.key ? "active" : ""}
                onClick={() => onNavigate(item.key)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
