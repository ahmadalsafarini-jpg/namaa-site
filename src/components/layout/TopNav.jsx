const TopNav = ({ onNavigate, route, user, onLogout }) => {
  const links = [
    { key: "landing", label: "Home", public: true, auth: true }, // Visible to both logged in and out
    { key: "login", label: "Sign In", public: true, auth: false }, // Only when not logged in
    { key: "register", label: "Register", public: true, auth: false }, // Only when not logged in
    { key: "dashboard", label: "Dashboard", public: false, auth: true }, // Only when logged in
    { key: "application", label: "Apply", public: false, auth: true }, // Only when logged in
    { key: "ticket", label: "Ticket", public: false, auth: true }, // Only when logged in
    { key: "matching", label: "Matching", public: false, auth: true }, // Only when logged in
    { key: "financing", label: "Financing", public: false, auth: true }, // Only when logged in
    { key: "project", label: "Project", public: false, auth: true }, // Only when logged in
  ];
  
  const visible = links.filter((l) => {
    if (user) {
      // If user is logged in, show only auth links (Dashboard, Apply, etc.) + Home
      return l.auth;
    } else {
      // If no user, show only public links (Home, Sign In, Register)
      return l.public;
    }
  });
  
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <img src="/logo2.svg" alt="Namaa Logo" className="h-10 w-auto" />
        </div>
        <nav className="flex items-center gap-1">
          {visible.map((l) => (
            <button
              key={l.key}
              onClick={() => onNavigate(l.key)}
              aria-current={route === l.key ? "page" : undefined}
              className={`rounded-xl px-3 py-2 text-sm font-medium hover:bg-slate-100 ${
                route === l.key ? 'text-emerald-700' : 'text-slate-700'
              }`}
            >
              {l.label}
            </button>
          ))}
          {user ? (
            <button 
              onClick={onLogout} 
              className="ml-2 rounded-xl bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-900"
            >
              Sign out
            </button>
          ) : null}
        </nav>
      </div>
    </header>
  );
};

export default TopNav;
