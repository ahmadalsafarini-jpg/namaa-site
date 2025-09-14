import { Card, GhostButton, Pill, Progress } from "../ui";
import { PROJECT_FLOW } from "../../constants";

const FinalProject = ({ project }) => {
  const pct = ((PROJECT_FLOW.indexOf(project.phase) + 1) / PROJECT_FLOW.length) * 100;
  
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Project Tracking Dashboard</h2>
        <Pill variant={project.phase === "Completed" ? "success" : "info"}>{project.phase}</Pill>
      </div>
      <Card>
        <div className="grid gap-4">
          <div className="grid gap-1">
            <div className="text-sm text-slate-600">{project.name}</div>
            <Progress value={pct} />
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-8">
            {PROJECT_FLOW.map((p) => (
              <div key={p} className={`rounded-xl border px-3 py-2 text-center text-xs ${
                PROJECT_FLOW.indexOf(p) <= PROJECT_FLOW.indexOf(project.phase)
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-white text-slate-500"
              }`}>
                {p}
              </div>
            ))}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Card>
              <div className="font-semibold">Documents</div>
              <div className="mt-3 grid gap-2 text-sm">
                {["Design.pdf", "Contract.pdf", "CommissioningReport.pdf"].map((d) => (
                  <div key={d} className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2">
                    <span>{d}</span>
                    <GhostButton onClick={() => alert(`Pretend download of ${d}`)}>Download</GhostButton>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <div className="font-semibold">Live Performance (mock)</div>
              <p className="mt-2 text-sm text-slate-600">API integration placeholder for real-time system data.</p>
              <div className="mt-3 rounded-xl bg-slate-50 p-4 text-sm">Today's generation: 2,340 kWh</div>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FinalProject;
