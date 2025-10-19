import { useState } from "react";
import { motion } from "framer-motion";
import { Sun, FileText, Building2, BatteryCharging, ArrowRight, Phone, Mail, MapPin, ShieldCheck, Zap, Leaf, Award, CheckCircle, Users, TrendingUp, Star } from "lucide-react";
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
          Namaa connects facility owners, institutional partners, and solar companies in one platform empowering them with integrated tools to design, finance, and deploy removing the complexity of going green.
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

      {/* Your Solar Journey in 3 Steps */}
      <section id="how" className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Your Solar Journey in 3 Steps</h2>
          <p className="mt-2 text-slate-600">From application to clean energy generation - we make it seamless.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-center h-full relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-sm">1</div>
              <h3 className="font-bold text-lg mb-3">Submit Application</h3>
              <p className="text-slate-600 leading-relaxed">Upload your energy bills, share facility details, and specify your solar preferences through our intuitive platform.</p>
              <div className="mt-4 flex justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-amber-400 fill-current mx-0.5" />
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-center h-full relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-sm">2</div>
              <h3 className="font-bold text-lg mb-3">Get Matched</h3>
              <p className="text-slate-600 leading-relaxed">Our AI-powered platform connects you with pre-vetted solar companies and presents competitive, transparent offers.</p>
              <div className="mt-4 text-sm text-emerald-600 font-medium">⚡ Average 3 offers in 24 hours</div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-center h-full relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <BatteryCharging className="h-8 w-8 text-white" />
              </div>
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-sm">3</div>
              <h3 className="font-bold text-lg mb-3">Finance & Execute</h3>
              <p className="text-slate-600 leading-relaxed">Secure institutional financing through our partners or proceed directly. Track your project from installation to generation.</p>
              <div className="mt-4 text-sm text-amber-600 font-medium">💰 Up to 100% financing</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <Section id="services" title="Comprehensive Solar Solutions" subtitle="From PV design to monitoring, we cover the full lifecycle with AI-powered optimization.">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "AI-Powered PV Design",
              description: "Advanced solar system design with machine learning optimization for maximum efficiency and ROI.",
              icon: <Sun className="h-8 w-8 text-yellow-500" />,
              features: ["3D Modeling", "Shade Analysis", "Energy Simulation", "Cost Optimization"]
            },
            {
              title: "Smart EPC Management", 
              description: "End-to-end project management with real-time tracking and quality assurance.",
              icon: <Building2 className="h-8 w-8 text-blue-500" />,
              features: ["Project Tracking", "Quality Control", "Timeline Management", "Vendor Coordination"]
            },
            {
              title: "Flexible Financing",
              description: "Multiple financing options including PPA, leasing, and traditional loans with competitive rates.",
              icon: <BatteryCharging className="h-8 w-8 text-green-500" />,
              features: ["PPA Options", "Solar Leasing", "Bank Financing", "Government Incentives"]
            },
            {
              title: "Real-Time Monitoring",
              description: "Advanced IoT monitoring with predictive analytics and performance optimization.",
              icon: <Zap className="h-8 w-8 text-purple-500" />,
              features: ["Live Dashboard", "Performance Alerts", "Predictive Maintenance", "Energy Analytics"]
            },
            {
              title: "Green Impact Tracking",
              description: "Comprehensive environmental impact reporting with carbon footprint reduction metrics.",
              icon: <Leaf className="h-8 w-8 text-emerald-500" />,
              features: ["CO₂ Tracking", "Sustainability Reports", "Green Certificates", "Impact Analytics"]
            },
            {
              title: "24/7 Support",
              description: "Round-the-clock technical support and maintenance services for optimal system performance.",
              icon: <Award className="h-8 w-8 text-orange-500" />,
              features: ["Technical Support", "Maintenance", "Warranty Service", "Performance Optimization"]
            }
          ].map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  {service.icon}
                  <h3 className="text-lg font-semibold">{service.title}</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-slate-500">
                      <CheckCircle className="h-3 w-3 text-emerald-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
            </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Why Choose Namaa */}
      <Section id="why" className="bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Namaa Energy?</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">We're not just another solar platform - we're your strategic partner in Qatar's clean energy transformation.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="text-center h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-4">QFC Compliant</h3>
              <p className="text-slate-600 leading-relaxed mb-4">Registered under Qatar Financial Centre, ensuring transparent, institutional-grade project management and compliance.</p>
              <div className="text-emerald-600 font-medium">✓ Regulatory Compliance</div>
          </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="text-center h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-4">Trusted Partnerships</h3>
              <p className="text-slate-600 leading-relaxed mb-4">Strategic collaborations with QDB, QNB, Kahramaa, and leading solar companies across the MENA region.</p>
              <div className="text-blue-600 font-medium">✓ Institutional Support</div>
          </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="text-center h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-4">Measurable Impact</h3>
              <p className="text-slate-600 leading-relaxed mb-4">Real-time ESG reporting with transparent CO₂ reduction metrics and sustainability impact tracking for your stakeholders.</p>
              <div className="text-green-600 font-medium">✓ ESG Reporting</div>
          </Card>
          </motion.div>
        </div>
      </Section>

      {/* Trusted Partners */}
      <Section id="partners" title="Potential Srategic Partners and Organizations" subtitle="Namaa Energy is heading for Partnering with Qatar's most respected institutions and companies.">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { name: "QDB", desc: "Qatar Development Bank", logo: "🏛️" },
            { name: "QNB", desc: "Qatar National Bank", logo: "🏦" },
            { name: "Kahramaa", desc: "Qatar General Electricity", logo: "⚡" },
            { name: "Ashghal", desc: "Public Works Authority", logo: "🏗️" }
          ].map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="text-center hover:shadow-lg transition-all duration-300 group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{partner.logo}</div>
                <div className="font-bold text-lg text-slate-900">{partner.name}</div>
                <p className="text-sm text-slate-600 mt-2">{partner.desc}</p>
                <div className="mt-4 flex justify-center">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
              </div>
            </Card>
            </motion.div>
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
            <button 
              onClick={() => {
                console.log('🚀 Admin Portal button clicked, dispatching nav:goto event');
                window.dispatchEvent(new CustomEvent('nav:goto', { detail: 'admin-login' }));
              }}
              className="text-left hover:text-slate-900 text-slate-500"
            >
              Admin Portal
            </button>
          </div>
          <div className="grid gap-2 text-sm text-slate-600">
            <div className="flex items-center gap-2"><Phone className="h-4 w-4"/> +974 3308 5766</div>
            <div className="flex items-center gap-2"><Mail className="h-4 w-4"/> info@namaa.energy</div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4"/> Doha, Qatar</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
