import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Home,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Ticket,
  Bell,
  HelpCircle,
  Menu,
  X,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";

const LINK_META = {
  landing: { icon: Home },
  login: { icon: LogIn, variant: "ghost" },
  register: { icon: UserPlus, variant: "cta" },
  dashboard: { icon: LayoutDashboard },
  ticket: { icon: Ticket },
  notifications: { icon: Bell },
  help: { icon: HelpCircle },
};

const TopNav = ({ onNavigate, route, user, onLogout }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const links = [
    { key: "landing", label: "Home", public: true, auth: false },
    { key: "login", label: "Sign In", public: true, auth: false },
    { key: "register", label: "Register", public: true, auth: false },
    { key: "dashboard", label: "Dashboard", public: false, auth: true },
    { key: "ticket", label: "Ticket", public: false, auth: true },
    { key: "notifications", label: "Notifications", public: false, auth: true },
    { key: "help", label: "Help", public: false, auth: true },
  ];

  const visible = links.filter((l) => (user ? l.auth : l.public));
  const firstName = user?.name?.split(" ")[0] || "Profile";
  const initials = (user?.name || "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [route]);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!profileRef.current?.contains(event.target)) setProfileOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const goHome = () => onNavigate(user ? "dashboard" : "landing");

  const navigate = (key) => {
    onNavigate(key);
    setMobileOpen(false);
    setProfileOpen(false);
  };

  const linkClass = (key, variant) => {
    const active = route === key;
    if (variant === "cta") {
      return [
        "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-500/25",
        "bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-200",
        "hover:scale-[1.04] hover:shadow-lg hover:shadow-emerald-500/30",
        active ? "ring-2 ring-emerald-300 ring-offset-2" : "",
      ].join(" ");
    }
    if (variant === "ghost") {
      return [
        "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
        active
          ? "border-emerald-300 bg-emerald-50 text-emerald-700"
          : "border-slate-200/80 bg-white/70 text-slate-700 hover:border-emerald-300 hover:text-emerald-700",
      ].join(" ");
    }
    return [
      "relative inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors duration-200",
      active ? "text-emerald-700" : "text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/70",
    ].join(" ");
  };

  const renderLink = (link, { fullWidth = false } = {}) => {
    const meta = LINK_META[link.key] || {};
    const Icon = meta.icon;
    const active = route === link.key;
    return (
      <button
        key={link.key}
        type="button"
        onClick={() => navigate(link.key)}
        aria-current={active ? "page" : undefined}
        className={`${linkClass(link.key, meta.variant)} ${fullWidth ? "w-full justify-center" : ""}`}
      >
        {meta.variant !== "cta" && active && !fullWidth && (
          <motion.span
            layoutId="nav-active"
            className="absolute inset-0 rounded-full bg-emerald-50"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
        <span className="relative z-10 inline-flex items-center gap-1.5">
          {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
          {link.label}
        </span>
      </button>
    );
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-emerald-100/80 bg-white/80 shadow-lg shadow-emerald-900/5 backdrop-blur-xl"
          : "border-white/50 bg-white/65 shadow-sm backdrop-blur-md"
      }`}
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px overflow-hidden">
        <motion.div
          className="h-full w-1/3 bg-gradient-to-r from-transparent via-emerald-400 to-sky-400"
          animate={{ x: ["-120%", "320%"] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={goHome}
          className="group flex items-center gap-2 rounded-xl outline-none ring-emerald-400/40 transition hover:opacity-90 focus-visible:ring-2"
          aria-label="Namaa Energy home"
        >
          <img
            src="/brand-logo.png"
            alt="Namaa Logo"
            className="h-10 w-auto origin-left transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/logo2.svg";
            }}
          />
        </button>

        <nav className="hidden items-center gap-1 sm:flex" aria-label="Primary">
          {visible.map((link) => renderLink(link))}
          {user ? (
            <div className="relative ml-1" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 py-1 pl-1 pr-3 text-sm font-medium text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 text-[11px] font-bold text-white">
                  {initials}
                </span>
                {firstName}
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {profileOpen ? (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.16 }}
                    role="menu"
                    className="absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-1.5 shadow-xl shadow-slate-900/10 backdrop-blur-xl"
                  >
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => navigate("profile")}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={onLogout}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          ) : null}
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700 sm:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden border-t border-emerald-100/70 bg-white/90 sm:hidden"
            aria-label="Mobile"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3">
              {visible.map((link) => renderLink(link, { fullWidth: true }))}
              {user ? (
                <>
                  <button
                    type="button"
                    onClick={() => navigate("profile")}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </>
              ) : null}
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
};

export default TopNav;
