const PrimaryButton = ({ children, onClick, type = "button" }) => (
  <button
    type={type}
    onClick={onClick}
    className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 font-medium text-white shadow hover:bg-emerald-700 focus:outline-none"
  >
    {children}
  </button>
);

const GhostButton = ({ children, onClick, type = "button" }) => (
  <button
    type={type}
    onClick={onClick}
    className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 font-medium text-slate-700 hover:bg-slate-50"
  >
    {children}
  </button>
);

export { PrimaryButton, GhostButton };
