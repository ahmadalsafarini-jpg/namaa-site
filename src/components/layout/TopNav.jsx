const TopNav = ({ onNavigate, route, user, onLogout }) => {
  const links = [
    { key: "landing", label: "Home", public: true, auth: false }, // Only when not logged in
    { key: "login", label: "Sign In", public: true, auth: false }, // Only when not logged in
    { key: "register", label: "Register", public: true, auth: false }, // Only when not logged in
    { key: "dashboard", label: "Dashboard", public: false, auth: true }, // Only when logged in
    { key: "ticket", label: "Ticket", public: false, auth: true }, // Only when logged in
    { key: "notifications", label: "Notifications", public: false, auth: true },
    { key: "help", label: "Help", public: false, auth: true },
  ];
  
  const visible = links.filter((l) => {
    if (user) {
      // If user is logged in, show only auth links (Dashboard, Ticket, etc.)
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
            <div className="relative group ml-1">
              <button className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                {user.name?.split(' ')[0] || 'Profile'} ▾
              </button>
              <div className="absolute right-0 mt-1 hidden w-44 rounded-xl border border-slate-200 bg-white p-2 shadow-md group-hover:block">
                <button onClick={() => onNavigate('profile')} className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-100">Settings</button>
                <button onClick={onLogout} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">Sign out</button>
              </div>
            </div>
          ) : null}
        </nav>
      </div>
    </header>
  );
};

export default TopNav;
