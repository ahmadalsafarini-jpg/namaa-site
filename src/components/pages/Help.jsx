import { Card } from "../ui";
import { Mail, Phone, BookOpen } from "lucide-react";

const Help = () => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h2 className="text-2xl font-semibold mb-6">Help & Support</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <div className="font-semibold flex items-center gap-2"><BookOpen className="h-5 w-5"/> Documentation</div>
          <p className="mt-2 text-sm text-slate-600">Learn how to submit applications, review offers, and track projects.</p>
          <a href="#docs" className="mt-3 inline-block text-sm text-emerald-700 hover:underline">View Docs</a>
        </Card>
        <Card>
          <div className="font-semibold flex items-center gap-2"><Mail className="h-5 w-5"/> Email Support</div>
          <p className="mt-2 text-sm text-slate-600">Reach out to our team for assistance.</p>
          <a href="mailto:info@namaa.energy" className="mt-3 inline-block text-sm text-emerald-700 hover:underline">info@namaa.energy</a>
        </Card>
        <Card>
          <div className="font-semibold flex items-center gap-2"><Phone className="h-5 w-5"/> Contact</div>
          <p className="mt-2 text-sm text-slate-600">Call us between 9:00–17:00.</p>
          <span className="mt-3 inline-block text-sm">+974 3308 5766</span>
        </Card>
      </div>
    </div>
  );
};

export default Help;


