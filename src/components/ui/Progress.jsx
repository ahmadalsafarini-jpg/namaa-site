const Progress = ({ value }) => (
  <div className="h-3 w-full rounded-full bg-slate-200">
    <div className="h-3 rounded-full bg-emerald-600" style={{ width: `${value}%` }} />
  </div>
);

export default Progress;
