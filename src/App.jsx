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
  AdminLogin,
  AdminDashboard,
  ClientDetail,
  Notifications,
  Help,
  Profile
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
  
  // Admin state
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  // Navigation event listener
  useEffect(() => {
    const handleNavigation = (event) => {
      const targetRoute = event.detail;
      console.log('🚀 Navigation event received:', targetRoute);
      setRoute(targetRoute);
    };

    window.addEventListener('nav:goto', handleNavigation);
    return () => window.removeEventListener('nav:goto', handleNavigation);
  }, []);

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

  // Ensure activeApplication is set when needed
  useEffect(() => {
    if (applications.length > 0 && !activeApplicationId) {
      setActiveApplicationId(applications[0].id);
    }
  }, [applications, activeApplicationId]);

  // Load user's applications from Realtime Database
  const loadUserApplications = async (userId) => {
    if (!userId) return;
    
    setApplicationsLoading(true);
    try {
      const result = await getUserApplications(userId);
      if (result.success) {
        setApplications(result.applications || []);
        // Set the first application as active if none is selected
        if (result.applications && result.applications.length > 0) {
          setActiveApplicationId((prev) => prev || result.applications[0].id);
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
      if (applications && applications.length > 0) {
        setActiveApplicationId((prev) => prev || applications[0].id);
      }
    });

    return () => unsubscribe();
  }, [user?.uid]);

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
    
    console.log('🚀 Advancing status for:', application.projectName, 'from', application.status, 'to', newStatus);
    console.log('🔒 Setting activeApplicationId to:', application.id);
    
    // Ensure we maintain the current selection
    setActiveApplicationId(application.id);
    
    // Save to Realtime Database
    try {
      const result = await updateApplication(application.id, { status: newStatus });
      if (!result.success) {
        console.error('Failed to update application status:', result.error);
      } else {
        console.log('✅ Status updated successfully in database');
      }
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  useEffect(() => {
    // No external navigation now; matching/financing live inside Ticket page
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

  // Admin handlers
  const handleAdminLogin = () => {
    setIsAdmin(true);
    setRoute("admin-dashboard");
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setSelectedClient(null);
    setRoute("landing");
  };

  const handleViewClient = (client) => {
    setSelectedClient(client);
    setRoute("admin-client");
  };

  const handleClientSave = (updatedClient) => {
    setSelectedClient(updatedClient);
    // Update the applications list
    setApplications(prev => prev.map(app => 
      app.id === updatedClient.id ? updatedClient : app
    ));
  };

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
      {!route.startsWith('admin-') && <TopNav onNavigate={goto} route={route} user={user} onLogout={handleLogout} />}

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

        {route === "notifications" && (
          <motion.div key="notifications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Notifications />
          </motion.div>
        )}

        {route === "help" && (
          <motion.div key="help" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Help />
          </motion.div>
        )}

        {route === "profile" && (
          <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Profile user={user || {}} onSave={(u)=> setUser(prev => ({ ...prev, ...u }))} />
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
             <TicketStatus 
               user={user}
               onAdvance={advanceStatus}
               onGoProject={() => goto("project")}
               onGoMatching={() => setRoute("ticket")}
               onGoFinancing={() => setRoute("ticket")}
               onNewApplication={() => goto("application")}
               loading={applicationsLoading}
               selectedApplicationId={activeApplicationId}
               onSelectApplication={(id) => setActiveApplicationId(id)}
             />
          </motion.div>
        )}


        {/* Admin Routes */}
        {route === "admin-login" && (
          <motion.div key="admin-login" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <AdminLogin onLogin={handleAdminLogin} />
          </motion.div>
        )}

        {route === "admin-dashboard" && isAdmin && (
          <motion.div key="admin-dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <AdminDashboard onLogout={handleAdminLogout} onViewClient={handleViewClient} />
          </motion.div>
        )}

        {route === "admin-client" && isAdmin && selectedClient && (
          <motion.div key="admin-client" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <ClientDetail 
              application={selectedClient} 
              onBack={() => setRoute("admin-dashboard")} 
              onSave={handleClientSave}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
