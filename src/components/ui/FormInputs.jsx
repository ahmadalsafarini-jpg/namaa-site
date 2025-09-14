const Input = ({ label, type = "text", value, onChange, placeholder, required }) => (
  <label className="grid gap-2">
    <span className="text-sm text-slate-600">{label}</span>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="rounded-xl border border-slate-300 px-3 py-2 outline-none ring-emerald-500 focus:ring"
    />
  </label>
);

const Select = ({ label, value, onChange, options = [], required }) => (
  <label className="grid gap-2">
    <span className="text-sm text-slate-600">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="rounded-xl border border-slate-300 px-3 py-2 outline-none ring-emerald-500 focus:ring"
    >
      <option value="">Select...</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </label>
);

const TextArea = ({ label, value, onChange, placeholder }) => (
  <label className="grid gap-2">
    <span className="text-sm text-slate-600">{label}</span>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={4}
      className="rounded-xl border border-slate-300 px-3 py-2 outline-none ring-emerald-500 focus:ring"
    />
  </label>
);

export { Input, Select, TextArea };
