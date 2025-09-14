const Pill = ({ children, variant = "default" }) => {
  const map = {
    default: "bg-slate-800 text-white",
    outline: "border border-slate-300 text-slate-700",
    success: "bg-emerald-600 text-white",
    warning: "bg-amber-500 text-white",
    info: "bg-blue-600 text-white",
  };
  return (
    <span className={`inline-flex items-center gap-2 rounded-2xl px-3 py-1 text-sm ${map[variant]}`}>
      {children}
    </span>
  );
};

export default Pill;
