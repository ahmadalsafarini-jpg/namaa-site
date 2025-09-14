import { Upload } from "lucide-react";

const FilePicker = ({ id, caption = "Choose files", hint, accept, multiple = true, count = 0, onChange }) => (
  <div className="grid gap-2">
    {hint && <span className="text-sm text-slate-600">{hint}</span>}
    <label
      htmlFor={id}
      className="inline-flex items-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 px-4 py-2 text-sm text-slate-700 shadow-sm hover:bg-slate-50 focus-within:ring-2 focus-within:ring-emerald-500 cursor-pointer select-none"
    >
      <Upload className="h-4 w-4" />
      <span className="font-medium">{caption}</span>
      <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{count}</span>
      <input
        id={id}
        type="file"
        className="sr-only"
        accept={accept}
        multiple={multiple}
        onChange={(e) => onChange(Array.from(e.target.files || []))}
      />
    </label>
  </div>
);

export default FilePicker;
