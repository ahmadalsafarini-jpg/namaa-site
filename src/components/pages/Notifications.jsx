import { useState } from "react";
import { Bell, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { Card, Pill } from "../ui";

const Notifications = () => {
  const [items] = useState([
    { id: 1, type: "status", title: "Application Approved", desc: "Your application was approved.", ts: "2h" },
    { id: 2, type: "matching", title: "New Offer Available", desc: "Sunrise Solar submitted an updated offer.", ts: "1d" },
    { id: 3, type: "financing", title: "Financing Submitted", desc: "Your request was sent to QDB.", ts: "3d" },
  ]);

  const iconFor = (type) => {
    if (type === "status") return <CheckCircle className="h-4 w-4 text-emerald-600" />;
    if (type === "matching") return <Info className="h-4 w-4 text-blue-600" />;
    if (type === "financing") return <AlertTriangle className="h-4 w-4 text-amber-600" />;
    return <Bell className="h-4 w-4 text-slate-500" />;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Notifications</h2>
        <Pill variant="outline"><Bell className="h-4 w-4" /> Inbox</Pill>
      </div>

      <Card>
        <div className="divide-y divide-slate-200">
          {items.map(n => (
            <div key={n.id} className="flex items-start gap-3 p-3">
              {iconFor(n.type)}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{n.title}</div>
                  <div className="text-xs text-slate-500">{n.ts}</div>
                </div>
                <p className="text-sm text-slate-600">{n.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Notifications;


