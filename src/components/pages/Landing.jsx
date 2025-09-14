import { useState } from "react";
import { motion } from "framer-motion";
import { Sun, FileText, Building2, BatteryCharging, ArrowRight, Phone, Mail, MapPin, ShieldCheck } from "lucide-react";
import { Pill, Section, Card, PrimaryButton, GhostButton, Input, AnimatedGrid } from "../ui";
import { HERO_URL } from "../../constants";

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
            backgroundImage: `url('${HERO_URL}')`,
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
      <Section id="lead-capture" title="Get Started" subtitle="Tell us a bit about you and we'll open your portal.">
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
              <span className="text-sm text-slate-500">You'll be redirected to registration.</span>
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

export default Landing;
