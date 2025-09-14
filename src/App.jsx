import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TopNav from "./components/layout/TopNav";
import {
  Landing, 
  Registration, 
  Dashboard, 
  ApplicationForm, 
  TicketStatus, 
  Matching, 
  Financing, 
  FinalProject 
} from "./components/pages";
import { nextStatus, progressForStatus, runSelfTests } from "./utils";
import { onAuthStateChange, getCurrentUser } from "./firebase/auth";

// Run self-tests on load
runSelfTests();

/******************** Root App ********************/
export default function NamaaPrototype() {
  const [route, setRoute] = useState("landing");
  const [lead, setLead] = useState(null);
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [activeTicketId, setActiveTicketId] = useState(null);
  const [loading, setLoading] = useState(true);
  const activeTicket = useMemo(() => tickets.find((t) => t.id === activeTicketId) || tickets[0], [tickets, activeTicketId]);
  const [matchingCompany, setMatchingCompany] = useState(null);
  const [project, setProject] = useState(null);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange((firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || "User",
          email: firebaseUser.email,
          phone: firebaseUser.phoneNumber || ""
        });
        setRoute("dashboard");
      } else {
        // User is signed out
        setUser(null);
        setRoute("landing");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

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
            <ApplicationForm onSubmit={handleApplicationSubmit} onCancel={() => goto("dashboard")} user={user} />
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
