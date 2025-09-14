import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TopNav from "./components/layout/TopNav";
import {
  Landing, 
  SignIn,
  Registration, 
  Dashboard, 
  ApplicationForm, 
  TicketStatus, 
  Matching, 
  Financing, 
  FinalProject 
} from "./components/pages";
import { nextStatus, progressForStatus } from "./utils";
import { onAuthStateChange, getCurrentUser, signOutUser } from "./firebase/auth";
import { getUserApplications, subscribeToUserApplications, updateApplication } from "./firebase/realtime-db";


/******************** Root App ********************/
export default function NamaaPrototype() {
  const [route, setRoute] = useState("landing");
  const [lead, setLead] = useState(null);
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [activeApplicationId, setActiveApplicationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const activeApplication = useMemo(() => applications.find((a) => a.id === activeApplicationId) || applications[0], [applications, activeApplicationId]);
  const [matchingCompany, setMatchingCompany] = useState(null);
  const [project, setProject] = useState(null);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange((firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        const userData = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || "User",
          email: firebaseUser.email,
          phone: firebaseUser.phoneNumber || ""
        };
        setUser(userData);
        setRoute("dashboard");
        
        // Load user's applications from Realtime Database
        loadUserApplications(userData.uid);
      } else {
        // User is signed out
        setUser(null);
        setApplications([]);
        setActiveApplicationId(null);
        setRoute("landing");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load user's applications from Realtime Database
  const loadUserApplications = async (userId) => {
    if (!userId) return;
    
    setApplicationsLoading(true);
    try {
      const result = await getUserApplications(userId);
      if (result.success) {
        setApplications(result.applications || []);
        // Set the first application as active if none is selected
        if (result.applications && result.applications.length > 0 && !activeApplicationId) {
          setActiveApplicationId(result.applications[0].id);
        }
      } else {
        console.error('Failed to load applications:', result.error);
        setApplications([]);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
      setApplications([]);
    } finally {
      setApplicationsLoading(false);
    }
  };

  // Subscribe to real-time application updates
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = subscribeToUserApplications(user.uid, (applications) => {
      setApplications(applications || []);
      // Set the first application as active if none is selected
      if (applications && applications.length > 0 && !activeApplicationId) {
        setActiveApplicationId(applications[0].id);
      }
    });

    return () => unsubscribe();
  }, [user?.uid, activeApplicationId]);

  const goto = (r) => setRoute(r);

  const handleLeadSubmit = (l) => { setLead(l); goto("register"); };
  const handleRegistered = (u) => { setUser(u); goto("dashboard"); };
  const handleLoggedIn = (u) => { setUser(u); goto("dashboard"); };
  const handleLogout = async () => { 
    try {
      const result = await signOutUser();
      if (!result.success) {
        console.error('Logout failed:', result.error);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null); 
    setRoute("landing"); 
  };
  const handleApplicationSubmit = (application) => { 
    setApplications((s) => [application, ...s]); 
    setActiveApplicationId(application.id); 
    goto("ticket"); 
  };

  const handleApplicationClick = (application) => {
    setActiveApplicationId(application.id);
    goto("ticket");
  };

  const advanceStatus = async (application) => {
    if (!application) return;
    
    const newStatus = nextStatus(application.status);
    
    // Save to Realtime Database
    try {
      const result = await updateApplication(application.id, { status: newStatus });
      if (!result.success) {
        console.error('Failed to update application status:', result.error);
      }
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  useEffect(() => {
    const app = activeApplication;
    if (app && app.status === "Matched") {
      const to = setTimeout(() => goto("matching"), 600);
      return () => clearTimeout(to);
    }
  }, [applications]);

  const handleProceedPay = async (company) => {
    alert(`Payment to ${company.name} simulated ✅`);
    
    // Update to Approved status
    const updateApplicationStatus = async (status) => {
      if (!activeApplication) return;
      try {
        await updateApplication(activeApplication.id, { status });
      } catch (error) {
        console.error('Error updating application status:', error);
      }
    };
    
    setApplications((prev) => prev.map((a) => (a.id === activeApplication.id ? { ...a, status: "Approved" } : a)));
    await updateApplicationStatus("Approved");
    
    setTimeout(async () => {
      setApplications((prev) => prev.map((a) => (a.id === activeApplication.id ? { ...a, status: "In Execution" } : a)));
      await updateApplicationStatus("In Execution");
    }, 600);
    
    setTimeout(async () => { 
      setApplications((prev) => prev.map((a) => (a.id === activeApplication.id ? { ...a, status: "Completed" } : a))); 
      await updateApplicationStatus("Completed");
      setProject({ name: activeApplication.projectName, phase: "Installation" }); 
      goto("project"); 
    }, 1600);
  };

  const handleApplyFinancing = (company) => { setMatchingCompany(company); goto("financing"); };
  const handleFinancingSubmit = async (payload) => { 
    setApplications((prev) => prev.map((a) => (a.id === activeApplication.id ? { ...a, status: "Under Review" } : a))); 
    
    // Update application status in database
    if (activeApplication) {
      try {
        await updateApplication(activeApplication.id, { status: "Under Review" });
      } catch (error) {
        console.error('Error updating application status:', error);
      }
    }
    
    alert(`Financing submitted to ${payload.org} for ${payload.type}. Application set to Under Financing Review.`); 
    setProject({ name: activeApplication.projectName, phase: "Financing" }); 
    goto("project"); 
  };
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
      <TopNav onNavigate={goto} route={route} user={user} onLogout={handleLogout} />

      <AnimatePresence mode="wait">
        {route === "landing" && (
          <motion.div key="landing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Landing onLeadSubmit={handleLeadSubmit} />
          </motion.div>
        )}

        {route === "login" && (
          <motion.div key="login" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <SignIn onLoggedIn={handleLoggedIn} />
          </motion.div>
        )}

        {route === "register" && (
          <motion.div key="register" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Registration lead={lead} onRegistered={handleRegistered} />
          </motion.div>
        )}

         {route === "dashboard" && user && (
           <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
             <Dashboard user={user} applications={applications} onOpen={() => goto("application")} onApplicationClick={handleApplicationClick} />
           </motion.div>
         )}

        {route === "application" && (
          <motion.div key="application" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <ApplicationForm onSubmit={handleApplicationSubmit} onCancel={() => goto("dashboard")} user={user} />
          </motion.div>
        )}

         {route === "ticket" && (
           <motion.div key="ticket" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
             <TicketStatus user={user} onAdvance={advanceStatus} onGoMatching={() => goto("matching")} onNewApplication={() => goto("application")} loading={applicationsLoading} selectedApplicationId={activeApplicationId} />
           </motion.div>
         )}

         {route === "matching" && activeApplication && (
           <motion.div key="matching" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
             <Matching application={activeApplication} onProceedPay={handleProceedPay} onFinancing={handleApplyFinancing} onMoreInfo={handleMoreInfo} />
           </motion.div>
         )}

         {route === "financing" && activeApplication && (
           <motion.div key="financing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
             <Financing application={activeApplication} company={matchingCompany} onSubmit={handleFinancingSubmit} onCancel={() => goto("matching")} />
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
