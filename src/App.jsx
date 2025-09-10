import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  FileText,
  Building2,
  BatteryCharging,
  Upload,
  Loader2,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  ShieldCheck,
  Banknote,
  HandCoins,
  Info as InfoIcon,
} from "lucide-react";

/**
 * Namaa Energy – Web Prototype (Single-file React, JSX)
 * TailwindCSS + framer-motion + lucide-react
 *
 * Fix: removes stray escaped quotes (\") and misplaced markup that caused parser errors.
 *      Ensures all JSX blocks close properly. Restores TopNav with logo and full page flow.
 * Tests: keeps existing self-tests and adds a couple more assertions.
 */

/******************** Utilities & UI ********************/
const Pill = ({ children, variant = "default" }) => {
  const map = {
    default: "bg-slate-800 text-white",
    outline: "border border-slate-300 text-slate-700",
    success: "bg-emerald-600 text-white",
    warning: "bg-amber-500 text-white",
    info: "bg-blue-600 text-white",
  };
  return (
    <span className={`inline-flex items-center gap-2 rounded-2xl px-3 py-1 text-sm ${map[variant]}`}>{children}</span>
  );
};

const Section = ({ id, title, subtitle, children }) => (
  <section id={id} className="mx-auto max-w-6xl px-4 py-16">
    <div className="mb-8">
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
      {subtitle && <p className="mt-2 text-slate-600">{subtitle}</p>}
    </div>
    {children}
  </section>
);

const Card = ({ children, className = "" }) => (
  <div className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</div>
);

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

const Progress = ({ value }) => (
  <div className="h-3 w-full rounded-full bg-slate-200">
    <div className="h-3 rounded-full bg-emerald-600" style={{ width: `${value}%` }} />
  </div>
);

/** Custom File Picker (styled like the screenshot) */
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

/******************** Mock data & helpers ********************/
const STATUS_FLOW = [
  "Pending",
  "Under Review",
  "Matched",
  "Approved",
  "In Execution",
  "Completed",
];

const PROJECT_FLOW = [
  "Submitted",
  "Reviewed",
  "Matched",
  "Financing",
  "Contract Signed",
  "Installation",
  "Testing",
  "Completed",
];

const MOCK_COMPANIES = [
  { id: "sunrise-solar", name: "Sunrise Solar", size: "500 kWp", cost: "$420,000", warranty: "10 years", timeline: "90 days", score: 4.8 },
  { id: "qatar-green-tech", name: "Qatar Green Tech", size: "450 kWp", cost: "$399,000", warranty: "8 years", timeline: "75 days", score: 4.6 },
  { id: "desert-sun-epc", name: "Desert Sun EPC", size: "520 kWp", cost: "$445,000", warranty: "12 years", timeline: "95 days", score: 4.7 },
];

function formatDate(d = new Date()) {
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

function nextStatus(s) {
  const i = STATUS_FLOW.indexOf(s);
  return STATUS_FLOW[Math.min(i + 1, STATUS_FLOW.length - 1)];
}

function progressForStatus(s) {
  return ((STATUS_FLOW.indexOf(s) + 1) / STATUS_FLOW.length) * 100;
}

/******************** Self-tests (non-UI) ********************/
function _assert(cond, msg) { if (!cond) throw new Error(msg); }
(function runSelfTests() {
  try {
    _assert(Array.isArray(STATUS_FLOW) && STATUS_FLOW[0] === "Pending", "STATUS_FLOW start");
    _assert(STATUS_FLOW.at(-1) === "Completed", "STATUS_FLOW end");
    _assert(PROJECT_FLOW.length === 8, "PROJECT_FLOW length");
    _assert(nextStatus("Pending") === "Under Review", "nextStatus forward");
    _assert(nextStatus("Completed") === "Completed", "nextStatus clamp");
    _assert(Math.round(progressForStatus("Matched")) === Math.round((3/6)*100), "progress calc");
    const fd = formatDate(); _assert(typeof fd === "string" && fd.length > 0, "formatDate string");
    // Added tests
    _assert(STATUS_FLOW.length === 6, "STATUS_FLOW has 6 states");
    _assert(progressForStatus("Completed") === 100, "Completed is 100% progress");
    console.log("[NamaaPrototype] Self-tests passed ✅");
  } catch (e) {
    console.error("[NamaaPrototype] Self-tests failed:", e);
  }
})();

/******************** Visuals ********************/
const AnimatedGrid = () => (
  <svg className="h-full w-full" viewBox="0 0 800 400" preserveAspectRatio="none">
    <defs>
      <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor="#34d399" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.25" />
      </linearGradient>
    </defs>
    <motion.rect
      initial={{ x: -50 }}
      animate={{ x: 50 }}
      transition={{ repeat: Infinity, duration: 6, repeatType: "mirror" }}
      x="0"
      y="0"
      width="100%"
      height="100%"
      fill="url(#g1)"
    />
  </svg>
);

/******************** Pages ********************/
const Landing = ({ onLeadSubmit }) => {
  const [lead, setLead] = useState({ name: "", email: "", phone: "" });
  const canSubmit = lead.name && lead.email && lead.phone;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-amber-50 via-white to-emerald-50">
      {/* HERO with Cover Photo */}
      <div className="relative isolate overflow-hidden">
        {/* Background Cover Photo */}
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1592833159117-ac790d4066e4?q=80&w=1170&auto=format&fit=crop&quot')",
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 -z-10 bg-black/30" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 -z-10"
        >
          <AnimatedGrid />
        </motion.div>

        <div className="mx-auto flex min-h-[70vh] max-w-6xl flex-col items-center justify-center gap-6 px-4 text-center text-white">
          <Pill variant="info">
            <Sun className="h-4 w-4" /> Empowering Facilities with Clean Energy
          </Pill>
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl">
            Empowering Facilities with Clean Energy
          </h1>
          <p className="mx-auto max-w-2xl text-pretty md:text-lg">
            Namaa connects facility owners, institutional partners, and solar companies to deliver turnkey renewable energy solutions.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <PrimaryButton onClick={() => document.getElementById("lead-capture")?.scrollIntoView({ behavior: "smooth" })}>
              Get Started <ArrowRight className="h-4 w-4" />
            </PrimaryButton>
            <GhostButton onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })}>
              Learn More
            </GhostButton>
          </div>
        </div>
      </div>

      {/* Lead Capture */}
      <Section id="lead-capture" title="Get Started" subtitle="Tell us a bit about you and we’ll open your portal.">
        <Card>
          <form
            className="grid grid-cols-1 gap-4 md:grid-cols-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (!canSubmit) return;
              onLeadSubmit(lead);
            }}
          >
            <Input label="Name" value={lead.name} onChange={(v) => setLead((s) => ({ ...s, name: v }))} required />
            <Input label="Email" type="email" value={lead.email} onChange={(v) => setLead((s) => ({ ...s, email: v }))} required />
            <Input label="Phone" type="tel" value={lead.phone} onChange={(v) => setLead((s) => ({ ...s, phone: v }))} required />
            <div className="md:col-span-3 flex items-center gap-3 pt-2">
              <PrimaryButton type="submit">
                Create My Account <ArrowRight className="h-4 w-4" />
              </PrimaryButton>
              <span className="text-sm text-slate-500">You’ll be redirected to registration.</span>
            </div>
          </form>
        </Card>
      </Section>

      {/* How Namaa Works */}
      <Section id="how" title="How Namaa Works" subtitle="Three simple steps from request to clean energy.">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6" />
              <h3 className="font-semibold">1) Submit Application</h3>
            </div>
            <p className="mt-2 text-sm text-slate-600">Share facility details, energy bills and preferences.</p>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <Building2 className="h-6 w-6" />
              <h3 className="font-semibold">2) Get Matched</h3>
            </div>
            <p className="mt-2 text-sm text-slate-600">We match you with vetted solar companies and offers.</p>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <BatteryCharging className="h-6 w-6" />
              <h3 className="font-semibold">3) Finance & Execute</h3>
            </div>
            <p className="mt-2 text-sm text-slate-600">Proceed directly, apply for financing, and track to completion.</p>
          </Card>
        </div>
      </Section>

      {/* Services */}
      <Section id="services" title="Services" subtitle="From PV design to monitoring, we cover the full lifecycle.">
        <div className="grid gap-4 md:grid-cols-3">
          {["PV Design", "EPC", "Financing", "Monitoring", "PPA / Leasing", "Green Impact"].map((s) => (
            <Card key={s}>
              <div className="font-semibold">{s}</div>
              <p className="mt-2 text-sm text-slate-600">Best-in-class vendors with transparent pricing.</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Why Namaa */}
      <Section id="why" title="Why Namaa" subtitle="Aligned with QFC, institutional collaboration, and measurable green impact.">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <h3 className="font-semibold">QFC Alignment</h3>
            <p className="mt-2 text-sm text-slate-600">Structured, compliant workflows for institutional-grade projects.</p>
          </Card>
          <Card>
            <h3 className="font-semibold">Institutional Collaboration</h3>
            <p className="mt-2 text-sm text-slate-600">Works with QDB, QNB, Kahramaa and partners across the ecosystem.</p>
          </Card>
          <Card>
            <h3 className="font-semibold">Green Impact</h3>
            <p className="mt-2 text-sm text-slate-600">Transparent reporting of CO₂ reduction and clean kWh generated.</p>
          </Card>
        </div>
      </Section>

      {/* Partners */}
      <Section id="testimonials" title="Partners & Testimonials">
        <div className="grid gap-4 md:grid-cols-3">
          {["QDB", "QNB", "Kahramaa"].map((p) => (
            <Card key={p} className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{p}</div>
                <p className="text-sm text-slate-600">Strategic partner</p>
              </div>
              <ShieldCheck className="h-6 w-6 text-emerald-600" />
            </Card>
          ))}
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/70 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-10 md:grid-cols-3">
          <div>
            <h4 className="font-semibold">Namaa Energy</h4>
            <p className="mt-2 text-sm text-slate-600">Turning facilities into clean power hubs.</p>
          </div>
          <div className="grid gap-2 text-sm text-slate-600">
            <a href="#services" className="hover:text-slate-900">Services</a>
            <a href="#how" className="hover:text-slate-900">How it works</a>
            <a href="#why" className="hover:text-slate-900">Why Namaa</a>
          </div>
          <div className="grid gap-2 text-sm text-slate-600">
            <div className="flex items-center gap-2"><Phone className="h-4 w-4"/> +974 0000 0000</div>
            <div className="flex items-center gap-2"><Mail className="h-4 w-4"/> hello@namaa.energy</div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4"/> Doha, Qatar</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const Registration = ({ lead, onRegistered }) => {
  const [form, setForm] = useState({ name: lead?.name || "", email: lead?.email || "", phone: lead?.phone || "", password: "" });
  const can = form.name && form.email && form.phone && form.password.length >= 6;
  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h2 className="text-2xl font-semibold">Create your account</h2>
      <p className="mt-1 text-slate-600">Welcome! Finish your registration to access the portal.</p>
      <Card className="mt-6">
        <form
          className="grid gap-4"
          onSubmit={(e) => { e.preventDefault(); if (!can) return; onRegistered({ id: crypto.randomUUID(), ...form }); }}
        >
          <Input label="Full name" value={form.name} onChange={(v) => setForm((s) => ({ ...s, name: v }))} required />
          <Input label="Email" type="email" value={form.email} onChange={(v) => setForm((s) => ({ ...s, email: v }))} required />
          <Input label="Phone" type="tel" value={form.phone} onChange={(v) => setForm((s) => ({ ...s, phone: v }))} required />
          <Input label="Password (min 6)" type="password" value={form.password} onChange={(v) => setForm((s) => ({ ...s, password: v }))} required />
          <PrimaryButton type="submit">Register & Continue</PrimaryButton>
        </form>
      </Card>
    </div>
  );
};

const Dashboard = ({ user, tickets, onOpen }) => (
  <div className="mx-auto max-w-6xl px-4 py-10">
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-2xl font-semibold">Welcome, {user.name.split(" ")[0]} 👋</h2>
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <Mail className="h-4 w-4" /> {user.email}
      </div>
    </div>

    <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
      <Card>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Start a new application</h3>
          <Pill variant="outline"><CalendarDays className="h-4 w-4" /> {formatDate()}</Pill>
        </div>
        <p className="mt-2 text-sm text-slate-600">Provide facility details, upload bills and choose your preferred system.</p>
        <div className="mt-4">
          <PrimaryButton onClick={onOpen}>Open Application Form</PrimaryButton>
        </div>
      </Card>
      <Card>
        <h3 className="font-semibold">Your tickets</h3>
        <div className="mt-3 grid gap-3">
          {tickets.length === 0 && <p className="text-sm text-slate-600">No tickets yet. Create your first application.</p>}
          {tickets.map((t) => (
            <div key={t.id} className="rounded-xl border border-slate-200 p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">{t.name}</div>
                <Pill variant={t.status === "Completed" ? "success" : "info"}>{t.status}</Pill>
              </div>
              <div className="mt-2"><Progress value={progressForStatus(t.status)} /></div>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                <span>{t.systemType}</span>
                <span>Submitted: {t.submittedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
);

const ApplicationForm = ({ onSubmit, onCancel }) => {
  const [f, setF] = useState({ projectName: "", facilityType: "", location: "", loadProfile: "", systemType: "", notes: "" });
  const [files, setFiles] = useState({ bills: [], photos: [], load: [] });
  const can = f.projectName && f.facilityType && f.location && f.systemType;
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Application Form</h2>
        <GhostButton onClick={onCancel}>Cancel</GhostButton>
      </div>
      <Card>
        <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={(e) => {
          e.preventDefault();
          if (!can) return;
          const ticket = { id: crypto.randomUUID(), name: f.projectName, systemType: f.systemType, status: "Pending", submittedAt: formatDate(), files, details: f };
          onSubmit(ticket);
        }}>
          <Input label="Project name" value={f.projectName} onChange={(v) => setF((s) => ({ ...s, projectName: v }))} required />
          <Select label="Facility type" value={f.facilityType} onChange={(v) => setF((s) => ({ ...s, facilityType: v }))} required options={["Commercial", "Industrial", "Educational", "Healthcare", "Agricultural"]} />
          <Input label="Location" value={f.location} onChange={(v) => setF((s) => ({ ...s, location: v }))} required />
          <Input label="Load profile (kWh/month)" value={f.loadProfile} onChange={(v) => setF((s) => ({ ...s, loadProfile: v }))} placeholder="e.g., 120,000" />
          <Select label="System type" value={f.systemType} onChange={(v) => setF((s) => ({ ...s, systemType: v }))} required options={["On-grid", "Off-grid", "Hybrid"]} />
          <TextArea label="Notes" value={f.notes} onChange={(v) => setF((s) => ({ ...s, notes: v }))} placeholder="Any specifics we should know?" />

          <div className="md:col-span-2 grid gap-4">
            <div className="grid gap-2">
              <span className="text-sm text-slate-600">Upload energy bills</span>
              <FilePicker id="bills" caption="Choose files" hint={null} count={files.bills.length} onChange={(list)=>setFiles((s)=>({ ...s, bills:list }))} />
            </div>
            <div className="grid gap-2">
              <span className="text-sm text-slate-600">Upload site photos</span>
              <FilePicker id="photos" caption="Choose files" count={files.photos.length} onChange={(list)=>setFiles((s)=>({ ...s, photos:list }))} />
            </div>
            <div className="grid gap-2">
              <span className="text-sm text-slate-600">Upload load data</span>
              <FilePicker id="load" caption="Choose files" count={files.load.length} onChange={(list)=>setFiles((s)=>({ ...s, load:list }))} />
            </div>
          </div>

          <div className="md:col-span-2 flex items-center gap-3 pt-2">
            <PrimaryButton type="submit"><Upload className="h-4 w-4" /> Submit & Create Ticket</PrimaryButton>
            <span className="text-sm text-slate-500">A ticket will be auto-generated.</span>
          </div>
        </form>
      </Card>
    </div>
  );
};

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
              <PrimaryButton onClick={onAdvance}>Advance Status <Loader2 className="h-4 w-4 animate-spin" /></PrimaryButton>
            )}
            {ticket.status === "Matched" && <GhostButton onClick={onGoMatching}>View Matching & Offers</GhostButton>}
          </div>
          <p className="mt-2 text-xs text-slate-500">Notifications (email/SMS) will be sent on status changes in production.</p>
        </div>
      </Card>
    </div>
  );
};

const Matching = ({ ticket, onProceedPay, onFinancing, onMoreInfo }) => (
  <div className="mx-auto max-w-5xl px-4 py-10">
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-2xl font-semibold">Solar Company Matching</h2>
      <Pill variant="info">Ticket: {ticket.name}</Pill>
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
            <PrimaryButton onClick={() => onProceedPay(c)}>Proceed & Pay <Banknote className="h-4 w-4" /></PrimaryButton>
            <GhostButton onClick={() => onFinancing(c)}>Apply for Financing <HandCoins className="h-4 w-4" /></GhostButton>
            <button onClick={() => onMoreInfo(c)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200">
              Request More Info <InfoIcon className="h-4 w-4" />
            </button>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const Financing = ({ ticket, company, onSubmit, onCancel }) => {
  const [type, setType] = useState("");
  const [org, setOrg] = useState("");
  const [notes, setNotes] = useState("");
  const can = type && org;
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Financing Application</h2>
        <Pill variant="info">Ticket: {ticket.name}</Pill>
      </div>
      <Card>
        <div className="mb-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
          <p className="font-medium">Options</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li><span className="font-medium">PPA:</span> Pay per kWh generated, no upfront cost.</li>
            <li><span className="font-medium">Solar Leasing:</span> Fixed monthly leasing fee.</li>
          </ul>
        </div>
        <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={(e) => { e.preventDefault(); if (!can) return; onSubmit({ type, org, notes, company }); }}>
          <Select label="Financing type" value={type} onChange={setType} required options={["PPA", "Solar Leasing"]} />
          <Select label="Institution" value={org} onChange={setOrg} required options={["QDB", "QNB", "Kahramaa"]} />
          <TextArea label="Notes" value={notes} onChange={setNotes} placeholder="Any additional context..." />
          <div className="md:col-span-2 flex items-center gap-3 pt-2">
            <PrimaryButton type="submit">Submit Financing Request</PrimaryButton>
            <GhostButton onClick={onCancel}>Cancel</GhostButton>
          </div>
        </form>
      </Card>
    </div>
  );
};

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
              <div className="mt-3 rounded-xl bg-slate-50 p-4 text-sm">Today’s generation: 2,340 kWh</div>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
};

/******************** Root App ********************/
export default function NamaaPrototype() {
  const [route, setRoute] = useState("landing");
  const [lead, setLead] = useState(null);
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [activeTicketId, setActiveTicketId] = useState(null);
  const activeTicket = useMemo(() => tickets.find((t) => t.id === activeTicketId) || tickets[0], [tickets, activeTicketId]);
  const [matchingCompany, setMatchingCompany] = useState(null);
  const [project, setProject] = useState(null);

  const goto = (r) => setRoute(r);

  const handleLeadSubmit = (l) => { setLead(l); goto("register"); };
  const handleRegistered = (u) => { setUser(u); goto("dashboard"); };
  const handleApplicationSubmit = (ticket) => { setTickets((s) => [ticket, ...s]); setActiveTicketId(ticket.id); goto("ticket"); };

  const advanceStatus = () => {
    setTickets((prev) => prev.map((t) => {
      const targetId = activeTicket ? activeTicket.id : (prev[0]?.id);
      if (t.id !== targetId) return t;
      return { ...t, status: nextStatus(t.status) };
    }));
  };

  useEffect(() => {
    const t = activeTicket;
    if (t && t.status === "Matched") {
      const to = setTimeout(() => goto("matching"), 600);
      return () => clearTimeout(to);
    }
  }, [tickets]);

  const handleProceedPay = (company) => {
    alert(`Payment to ${company.name} simulated ✅`);
    setTickets((prev) => prev.map((t) => (t.id === activeTicket.id ? { ...t, status: "Approved" } : t)));
    setTimeout(() => setTickets((prev) => prev.map((t) => (t.id === activeTicket.id ? { ...t, status: "In Execution" } : t))), 600);
    setTimeout(() => { setTickets((prev) => prev.map((t) => (t.id === activeTicket.id ? { ...t, status: "Completed" } : t))); setProject({ name: activeTicket.name, phase: "Installation" }); goto("project"); }, 1600);
  };

  const handleApplyFinancing = (company) => { setMatchingCompany(company); goto("financing"); };
  const handleFinancingSubmit = (payload) => { setTickets((prev) => prev.map((t) => (t.id === activeTicket.id ? { ...t, status: "Under Review" } : t))); alert(`Financing submitted to ${payload.org} for ${payload.type}. Ticket set to Under Financing Review.`); setProject({ name: activeTicket.name, phase: "Financing" }); goto("project"); };
  const handleMoreInfo = (company) => { alert(`A clarification request was sent to ${company.name}. They will revise their offer.`); };

  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav onNavigate={goto} route={route} />

      <AnimatePresence mode="wait">
        {route === "landing" && (
          <motion.div key="landing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Landing onLeadSubmit={handleLeadSubmit} />
          </motion.div>
        )}

        {route === "register" && (
          <motion.div key="register" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Registration lead={lead} onRegistered={handleRegistered} />
          </motion.div>
        )}

        {route === "dashboard" && user && (
          <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Dashboard user={user} tickets={tickets} onOpen={() => goto("application")} />
          </motion.div>
        )}

        {route === "application" && (
          <motion.div key="application" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <ApplicationForm onSubmit={handleApplicationSubmit} onCancel={() => goto("dashboard")} />
          </motion.div>
        )}

        {route === "ticket" && activeTicket && (
          <motion.div key="ticket" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <TicketStatus ticket={activeTicket} onAdvance={advanceStatus} onGoMatching={() => goto("matching")} />
          </motion.div>
        )}

        {route === "matching" && activeTicket && (
          <motion.div key="matching" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Matching ticket={activeTicket} onProceedPay={handleProceedPay} onFinancing={handleApplyFinancing} onMoreInfo={handleMoreInfo} />
          </motion.div>
        )}

        {route === "financing" && activeTicket && (
          <motion.div key="financing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Financing ticket={activeTicket} company={matchingCompany} onSubmit={handleFinancingSubmit} onCancel={() => goto("matching")} />
          </motion.div>
        )}

        {route === "project" && project && (
          <motion.div key="project" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <FinalProject project={project} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/******************** Top Navigation ********************/
const TopNav = ({ onNavigate, route }) => {
  const links = [
    { key: "landing", label: "Home" },
    { key: "register", label: "Register" },
    { key: "dashboard", label: "Dashboard" },
    { key: "application", label: "Apply" },
    { key: "ticket", label: "Ticket" },
    { key: "matching", label: "Matching" },
    { key: "financing", label: "Financing" },
    { key: "project", label: "Project" },
  ];
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          {/* Replace /logo.png with your asset in public/ */}
          <img src="/logo2.svg" alt="Namaa Logo" className="h-10 w-auto" />
        </div>
        <nav className="flex items-center gap-1">
          {links.map((l) => (
            <button
              key={l.key}
              onClick={() => onNavigate(l.key)}
              aria-current={route === l.key ? "page" : undefined}
              className={`rounded-2xl px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 ${
                route === l.key ? "bg-slate-100 ring-1 ring-slate-200" : ""
              }`}
            >
              {l.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
