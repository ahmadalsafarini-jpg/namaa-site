import { Banknote, HandCoins, Info as InfoIcon } from "lucide-react";
import { Card, PrimaryButton, GhostButton, Pill } from "../ui";
import { MOCK_COMPANIES } from "../../constants";

const Matching = ({ application, onProceedPay, onFinancing, onMoreInfo }) => (
  <div className="mx-auto max-w-5xl px-4 py-10">
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-2xl font-semibold">Solar Company Matching</h2>
      <Pill variant="info">Application: {application.projectName}</Pill>
    </div>
    <div className="grid gap-4 md:grid-cols-3">
      {MOCK_COMPANIES.map((c) => (
        <Card key={c.id}>
          <div className="flex items-center justify-between">
            <div className="font-semibold">{c.name}</div>
            <div className="text-xs text-slate-500">Score {c.score.toFixed(1)}</div>
          </div>
          <div className="mt-3 grid gap-2 text-sm">
            <div className="flex items-center justify-between"><span>System size</span><span className="font-medium">{c.size}</span></div>
            <div className="flex items-center justify-between"><span>Cost</span><span className="font-medium">{c.cost}</span></div>
            <div className="flex items-center justify-between"><span>Warranty</span><span className="font-medium">{c.warranty}</span></div>
            <div className="flex items-center justify-between"><span>Timeline</span><span className="font-medium">{c.timeline}</span></div>
          </div>
          <div className="mt-4 grid gap-2">
            <PrimaryButton onClick={() => onProceedPay(c)}>
              Proceed & Pay <Banknote className="h-4 w-4" />
            </PrimaryButton>
            <GhostButton onClick={() => onFinancing(c)}>
              Apply for Financing <HandCoins className="h-4 w-4" />
            </GhostButton>
            <button 
              onClick={() => onMoreInfo(c)} 
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200"
            >
              Request More Info <InfoIcon className="h-4 w-4" />
            </button>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

export default Matching;
