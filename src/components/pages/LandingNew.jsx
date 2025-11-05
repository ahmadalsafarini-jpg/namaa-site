import { useState } from "react";
import { motion } from "framer-motion";
import { Sun, FileText, Building2, BatteryCharging, ArrowRight, Phone, Mail, MapPin, ShieldCheck, Zap, Leaf, Award, CheckCircle, Users, TrendingUp, Star, ChevronRight, Sparkles, BarChart3, Clock, Globe } from "lucide-react";
import { Pill, Section, Card, PrimaryButton, GhostButton, Input, AnimatedGrid } from "../ui";
import { HERO_URL } from "../../constants";

const Landing = ({ onLeadSubmit }) => {
  const [lead, setLead] = useState({ name: "", email: "", phone: "" });
  const canSubmit = lead.name && lead.email && lead.phone;

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.1 } },
    viewport: { once: true }
  };

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Enhanced HERO Section - Aurora Solar Inspired */}
      <div className="relative isolate overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: `url('${HERO_URL}')`,
          }}
        />
        
        {/* Gradient Overlay for better text contrast */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-600/20 via-transparent to-blue-600/20" />

        {/* Animated Grid Background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 -z-10"
        >
          <AnimatedGrid />
        </motion.div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 backdrop-blur-sm px-4 py-2 text-sm text-emerald-300 border border-emerald-500/20 mb-8"
            >
              <Sparkles className="h-4 w-4" />
              <span className="font-medium">Qatar's Premier Solar Energy Platform</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6"
            >
              Turn Your Facility Into
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                A Solar Powerhouse
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mx-auto max-w-3xl text-xl text-slate-300 mb-10 leading-relaxed"
            >
              Connect with vetted solar companies, secure institutional financing, and track your clean energy impact - all through one intelligent platform.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <button
                onClick={() => document.getElementById("lead-capture")?.scrollIntoView({ behavior: "smooth" })}
                className="group relative inline-flex items-center gap-2 rounded-full bg-emerald-500 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-emerald-500/50 hover:bg-emerald-600 hover:shadow-emerald-500/60 transition-all duration-300 hover:scale-105"
              >
                Get Started Free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })}
                className="group inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-8 py-4 text-lg font-semibold text-white border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                Watch Demo
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
            >
              {[
                { value: "500+", label: "MW Capacity", icon: <Zap className="h-5 w-5" /> },
                { value: "50+", label: "Projects Delivered", icon: <Building2 className="h-5 w-5" /> },
                { value: "24hrs", label: "Average Match Time", icon: <Clock className="h-5 w-5" /> },
                { value: "QFC", label: "Regulated Entity", icon: <ShieldCheck className="h-5 w-5" /> }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                  className="text-center group"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="text-emerald-400 group-hover:scale-110 transition-transform">
                      {stat.icon}
                    </div>
                    <div className="text-3xl sm:text-4xl font-bold text-white">
                      {stat.value}
                    </div>
                  </div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16 text-white" preserveAspectRatio="none" viewBox="0 0 1200 120">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
          </svg>
        </div>
      </div>

      {/* Enhanced Lead Capture Section */}
      <section id="lead-capture" className="relative py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Start Your Solar Journey Today
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Join leading facilities across Qatar in reducing costs and carbon emissions
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="max-w-4xl mx-auto shadow-2xl border-2 border-emerald-100">
              <form
                className="grid grid-cols-1 gap-6 md:grid-cols-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!canSubmit) return;
                  onLeadSubmit(lead);
                }}
              >
                <Input 
                  label="Full Name" 
                  value={lead.name} 
                  onChange={(v) => setLead((s) => ({ ...s, name: v }))} 
                  required 
                  placeholder="Ahmad Al-Safarini"
                />
                <Input 
                  label="Business Email" 
                  type="email" 
                  value={lead.email} 
                  onChange={(v) => setLead((s) => ({ ...s, email: v }))} 
                  required 
                  placeholder="ahmad@company.com"
                />
                <Input 
                  label="Phone Number" 
                  type="tel" 
                  value={lead.phone} 
                  onChange={(v) => setLead((s) => ({ ...s, phone: v }))} 
                  required 
                  placeholder="+974 XXXX XXXX"
                />
                <div className="md:col-span-3 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span>Free account • No credit card required</span>
                  </div>
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="group inline-flex items-center gap-2 rounded-full bg-emerald-500 px-8 py-3 text-base font-semibold text-white shadow-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
                  >
                    Create My Account
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>
            </Card>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <span>QFC Registered</span>
            </div>
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-emerald-500" />
              <span>ESG Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-emerald-500" />
              <span>Institutional Grade</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works - Enhanced 3 Steps */}
      <section id="how" className="relative py-24 bg-gradient-to-br from-slate-50 to-emerald-50/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 mb-4">
              Simple Process
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Your Solar Journey in 3 Steps
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From application to clean energy generation - we make it seamless and transparent
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="grid gap-8 lg:gap-12 md:grid-cols-3"
          >
            {[
              {
                number: "01",
                title: "Submit Application",
                description: "Upload your energy bills, share facility details, and specify your solar preferences through our intuitive platform.",
                icon: <FileText className="h-10 w-10" />,
                gradient: "from-blue-500 to-cyan-500",
                bgGradient: "from-blue-50 to-cyan-50",
                highlights: [
                  "Digital document upload",
                  "Energy consumption analysis",
                  "Custom requirements"
                ]
              },
              {
                number: "02",
                title: "Get Matched",
                description: "Our AI-powered platform connects you with pre-vetted solar companies and presents competitive, transparent offers.",
                icon: <Building2 className="h-10 w-10" />,
                gradient: "from-emerald-500 to-green-500",
                bgGradient: "from-emerald-50 to-green-50",
                highlights: [
                  "AI-powered matching",
                  "Multiple competitive bids",
                  "24-hour response time"
                ]
              },
              {
                number: "03",
                title: "Finance & Execute",
                description: "Secure institutional financing through our partners or proceed directly. Track your project from installation to generation.",
                icon: <BatteryCharging className="h-10 w-10" />,
                gradient: "from-amber-500 to-orange-500",
                bgGradient: "from-amber-50 to-orange-50",
                highlights: [
                  "Flexible financing options",
                  "Real-time project tracking",
                  "Performance monitoring"
                ]
              }
            ].map((step, index) => (
              <motion.div
                key={step.number}
                variants={fadeInUp}
                className="relative group"
              >
                {/* Connector Line (Desktop) */}
                {index < 2 && (
                  <div className="hidden lg:block absolute top-20 left-full w-full h-0.5 bg-gradient-to-r from-slate-200 to-transparent -translate-x-1/2 -z-10" />
                )}

                <div className="relative h-full rounded-3xl border-2 border-slate-200 bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:border-emerald-200 group-hover:-translate-y-2">
                  {/* Step Number Badge */}
                  <div className="absolute -top-4 -left-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-2xl font-bold text-white shadow-xl">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${step.bgGradient} text-slate-700 shadow-inner ml-12`}>
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    {step.description}
                  </p>

                  {/* Highlights */}
                  <ul className="space-y-2">
                    {step.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Hover Glow Effect */}
                  <div className={`absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl`} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="relative py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 mb-4">
              Complete Solution
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Comprehensive Solar Solutions
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From PV design to monitoring, we cover the full lifecycle with AI-powered optimization
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {[
              {
                title: "AI-Powered PV Design",
                description: "Advanced solar system design with machine learning optimization for maximum efficiency and ROI.",
                icon: <Sun className="h-8 w-8" />,
                color: "text-yellow-500",
                bgColor: "bg-yellow-50",
                features: ["3D Modeling", "Shade Analysis", "Energy Simulation", "Cost Optimization"]
              },
              {
                title: "Smart EPC Management",
                description: "End-to-end project management with real-time tracking and quality assurance.",
                icon: <Building2 className="h-8 w-8" />,
                color: "text-blue-500",
                bgColor: "bg-blue-50",
                features: ["Project Tracking", "Quality Control", "Timeline Management", "Vendor Coordination"]
              },
              {
                title: "Flexible Financing",
                description: "Multiple financing options including PPA, leasing, and traditional loans with competitive rates.",
                icon: <BatteryCharging className="h-8 w-8" />,
                color: "text-green-500",
                bgColor: "bg-green-50",
                features: ["PPA Options", "Solar Leasing", "Bank Financing", "Government Incentives"]
              },
              {
                title: "Real-Time Monitoring",
                description: "Advanced IoT monitoring with predictive analytics and performance optimization.",
                icon: <Zap className="h-8 w-8" />,
                color: "text-purple-500",
                bgColor: "bg-purple-50",
                features: ["Live Dashboard", "Performance Alerts", "Predictive Maintenance", "Energy Analytics"]
              },
              {
                title: "Green Impact Tracking",
                description: "Comprehensive environmental impact reporting with carbon footprint reduction metrics.",
                icon: <Leaf className="h-8 w-8" />,
                color: "text-emerald-500",
                bgColor: "bg-emerald-50",
                features: ["CO₂ Tracking", "Sustainability Reports", "Green Certificates", "Impact Analytics"]
              },
              {
                title: "24/7 Support",
                description: "Round-the-clock technical support and maintenance services for optimal system performance.",
                icon: <Award className="h-8 w-8" />,
                color: "text-orange-500",
                bgColor: "bg-orange-50",
                features: ["Technical Support", "Maintenance", "Warranty Service", "Performance Optimization"]
              }
            ].map((service, index) => (
              <motion.div key={service.title} variants={fadeInUp}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 group border-2 border-transparent hover:border-emerald-100">
                  <div className={`flex items-center justify-center h-16 w-16 rounded-2xl ${service.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className={service.color}>{service.icon}</div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Namaa */}
      <section id="why" className="relative py-24 bg-gradient-to-br from-slate-900 to-emerald-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 backdrop-blur-sm px-4 py-2 text-sm font-medium text-emerald-300 border border-emerald-500/30 mb-4">
              Trusted Partner
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Why Choose Namaa Energy?
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              We're not just another solar platform - we're your strategic partner in Qatar's clean energy transformation
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="grid gap-8 md:grid-cols-3"
          >
            {[
              {
                icon: <ShieldCheck className="h-10 w-10" />,
                title: "QFC Compliant",
                description: "Registered under Qatar Financial Centre, ensuring transparent, institutional-grade project management and compliance.",
                badge: "Regulatory Compliance",
                gradient: "from-emerald-500 to-blue-500"
              },
              {
                icon: <Users className="h-10 w-10" />,
                title: "Trusted Partnerships",
                description: "Strategic collaborations with QDB, QNB, Kahramaa, and leading solar companies across the MENA region.",
                badge: "Institutional Support",
                gradient: "from-blue-500 to-purple-500"
              },
              {
                icon: <TrendingUp className="h-10 w-10" />,
                title: "Measurable Impact",
                description: "Real-time ESG reporting with transparent CO₂ reduction metrics and sustainability impact tracking for your stakeholders.",
                badge: "ESG Reporting",
                gradient: "from-green-500 to-emerald-500"
              }
            ].map((item, index) => (
              <motion.div key={item.title} variants={fadeInUp}>
                <div className="relative h-full rounded-3xl border-2 border-white/10 bg-white/5 backdrop-blur-sm p-8 hover:bg-white/10 transition-all duration-500 group">
                  <div className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-slate-300 leading-relaxed mb-6">{item.description}</p>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400">
                    <CheckCircle className="h-4 w-4" />
                    {item.badge}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="relative py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 mb-4">
              Strategic Network
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Potential Strategic Partners
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Namaa Energy is heading for partnering with Qatar's most respected institutions and companies
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {[
              { name: "QDB", desc: "Qatar Development Bank", logo: "🏛️", color: "from-blue-500 to-cyan-500" },
              { name: "QNB", desc: "Qatar National Bank", logo: "🏦", color: "from-emerald-500 to-green-500" },
              { name: "Kahramaa", desc: "Qatar General Electricity", logo: "⚡", color: "from-yellow-500 to-orange-500" },
              { name: "Ashghal", desc: "Public Works Authority", logo: "🏗️", color: "from-purple-500 to-pink-500" }
            ].map((partner, index) => (
              <motion.div
                key={partner.name}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Card className="text-center hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-emerald-100 h-full">
                  <div className="text-6xl mb-6 group-hover:scale-125 transition-transform duration-500">
                    {partner.logo}
                  </div>
                  <div className="text-xl font-bold text-slate-900 mb-2">{partner.name}</div>
                  <p className="text-sm text-slate-600 mb-4">{partner.desc}</p>
                  <div className="flex items-center justify-center gap-2 text-sm font-medium text-emerald-600">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Verified Partner</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-emerald-500 to-blue-600 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Ready to Go Solar?
            </h2>
            <p className="text-xl text-emerald-100 mb-10">
              Join leading facilities in Qatar reducing costs and carbon emissions
            </p>
            <button
              onClick={() => document.getElementById("lead-capture")?.scrollIntoView({ behavior: "smooth" })}
              className="group inline-flex items-center gap-2 rounded-full bg-white px-10 py-5 text-lg font-bold text-emerald-600 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
            >
              Start Your Project Today
              <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
            </button>
            <p className="mt-6 text-sm text-emerald-100">
              Free consultation • No obligations • Fast response
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <h4 className="text-2xl font-bold mb-4">Namaa Energy</h4>
              <p className="text-slate-400 mb-6 max-w-md">
                Turning facilities into clean power hubs. Qatar's premier platform for solar energy transformation.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  <Globe className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Quick Links</h5>
              <div className="grid gap-3 text-sm text-slate-400">
                <a href="#services" className="hover:text-emerald-400 transition-colors">Services</a>
                <a href="#how" className="hover:text-emerald-400 transition-colors">How it works</a>
                <a href="#why" className="hover:text-emerald-400 transition-colors">Why Namaa</a>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('nav:goto', { detail: 'admin-login' }))}
                  className="text-left hover:text-emerald-400 transition-colors"
                >
                  Admin Portal
                </button>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('nav:goto', { detail: 'energy-company-login' }))}
                  className="text-left hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  <Zap className="h-3 w-3" /> Energy Company Portal
                </button>
              </div>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Contact Us</h5>
              <div className="grid gap-3 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-emerald-400" />
                  <a href="tel:+97433085766" className="hover:text-emerald-400 transition-colors">
                    +974 3308 5766
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-emerald-400" />
                  <a href="mailto:info@namaa.energy" className="hover:text-emerald-400 transition-colors">
                    info@namaa.energy
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  <span>Doha, Qatar</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 text-center text-sm text-slate-400">
            <p>© {new Date().getFullYear()} Namaa Energy. All rights reserved. | QFC Registered Entity</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;




