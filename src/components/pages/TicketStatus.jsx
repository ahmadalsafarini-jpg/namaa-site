import { Loader2 } from "lucide-react";
import { Card, PrimaryButton, GhostButton, Pill, Progress } from "../ui";
import { STATUS_FLOW } from "../../constants";
import { progressForStatus } from "../../utils";

const TicketStatus = ({ ticket, onAdvance, onGoMatching }) => {
  const progress = progressForStatus(ticket.status);
  
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Ticket Status</h2>
        <Pill variant={ticket.status === "Completed" ? "success" : "info"}>{ticket.status}</Pill>
      </div>
      <Card>
        <div className="grid gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="font-semibold">{ticket.name}</div>
            <div className="text-sm text-slate-600">Submitted: {ticket.submittedAt}</div>
          </div>
          <div className="text-sm text-slate-600">System type: {ticket.systemType}</div>
          <div className="mt-4"><Progress value={progress} /></div>
          <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-6">
            {STATUS_FLOW.map((s) => (
              <div key={s} className={`rounded-xl border px-3 py-2 text-center text-xs ${
                STATUS_FLOW.indexOf(s) <= STATUS_FLOW.indexOf(ticket.status)
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-white text-slate-500"
              }`}>
                {s}
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {ticket.status !== "Completed" && (
              <PrimaryButton onClick={onAdvance}>
                Advance Status <Loader2 className="h-4 w-4 animate-spin" />
              </PrimaryButton>
            )}
            {ticket.status === "Matched" && <GhostButton onClick={onGoMatching}>View Matching & Offers</GhostButton>}
          </div>
          <p className="mt-2 text-xs text-slate-500">Notifications (email/SMS) will be sent on status changes in production.</p>
        </div>
      </Card>
    </div>
  );
};

export default TicketStatus;
