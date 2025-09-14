const TopNav = ({ onNavigate, route }) => {
  const links = [
    { key: "landing", label: "Home" },
    { key: "register", label: "Register" },
    { key: "dashboard", label: "Dashboard" },
    { key: "application", label: "Apply" },
    { key: "ticket", label: "Ticket" },
    { key: "matching", label: "Matching" },
    { key: "financing", label: "Financing" },
    { key: "project", label: "Project" },
  ];
  
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <img src="/logo2.svg" alt="Namaa Logo" className="h-10 w-auto" />
        </div>
        <nav className="flex items-center gap-1">
          {links.map((l) => (
            <button
              key={l.key}
              onClick={() => onNavigate(l.key)}
              aria-current={route === l.key ? "page" : undefined}
              className={`rounded-2xl px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 ${
                route === l.key ? "bg-slate-100 ring-1 ring-slate-200" : ""
              }`}
            >
              {l.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default TopNav;
