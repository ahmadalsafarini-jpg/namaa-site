import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
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
  Profile,
  EnergyCompanyLogin,
  EnergyCompanyDashboard,
  EnergyCompanyClientDetail
} from "./components/pages";
import { nextStatus } from "./utils";
import { onAuthStateChange, signOutUser } from "./firebase/auth";
import { getUserApplications, subscribeToUserApplications, updateApplication, loginEnergyCompany } from "./firebase/realtime-db";

// SEO: title and meta description per route
const ROUTE_META = {
  landing: { title: "Namaa Energy | Solar Solutions in Qatar", description: "Namaa Energy provides solar energy solutions and sustainable power for homes and businesses in Qatar." },
  login: { title: "Sign In | Namaa Energy", description: "Sign in to your Namaa Energy account." },
  register: { title: "Register | Namaa Energy", description: "Create your Namaa Energy account." },
  dashboard: { title: "Dashboard | Namaa Energy", description: "Manage your projects and applications." },
  application: { title: "New Application | Namaa Energy", description: "Submit a new solar project application." },
  ticket: { title: "Project Status | Namaa Energy", description: "Track your project progress and offers." },
  notifications: { title: "Notifications | Namaa Energy", description: "Your notifications." },
  help: { title: "Help | Namaa Energy", description: "Get help and contact support." },
  profile: { title: "Profile | Namaa Energy", description: "Manage your profile and settings." },
  "admin-login": { title: "Admin Login | Namaa Energy", description: "Administrator sign in." },
  "admin-dashboard": { title: "Admin Dashboard | Namaa Energy", description: "Manage applications and energy companies." },
  "admin-client": { title: "Client Detail | Namaa Energy", description: "View and manage client application." },
  "energy-company-login": { title: "Energy Company Portal | Namaa Energy", description: "Sign in to the energy company portal." },
  "energy-company-dashboard": { title: "Dashboard | Namaa Energy", description: "Energy company assigned clients." },
  "energy-company-client": { title: "Client Detail | Namaa Energy", description: "View and manage assigned client." },
};

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

  // Energy Company state
  const [energyCompany, setEnergyCompany] = useState(null);
  const [selectedCompanyClient, setSelectedCompanyClient] = useState(null);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event) => {
      const route = event.state?.route || window.location.hash.slice(1) || 'landing';
      setRoute(route);
    };

    window.addEventListener('popstate', handlePopState);

    // Set initial route from URL hash
    const initialRoute = window.location.hash.slice(1) || 'landing';
    if (initialRoute !== 'landing') {
      setRoute(initialRoute);
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigation event listener
  useEffect(() => {
    const handleNavigation = (event) => {
      goto(event.detail);
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
        // User is signed out — preserve admin/energy-company route
        setUser(null);
        setApplications([]);
        setActiveApplicationId(null);
        setRoute((prev) =>
          prev.startsWith("admin-") || prev.startsWith("energy-company-") ? prev : "landing"
        );
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Restore admin/energy-company session on load when URL hash indicates those routes
  useEffect(() => {
    const hash = (window.location.hash || "").slice(1);
    if (hash.startsWith("admin-")) {
      if (sessionStorage.getItem("adminSession")) {
        setIsAdmin(true);
        if (hash === "admin-login" || hash === "admin-client") {
          setRoute("admin-dashboard");
          window.history.replaceState({ route: "admin-dashboard" }, "", "#admin-dashboard");
        }
      } else if (hash === "admin-dashboard" || hash === "admin-client") {
        setRoute("admin-login");
        window.history.replaceState({ route: "admin-login" }, "", "#admin-login");
      }
    } else if (hash.startsWith("energy-company-")) {
      try {
        const stored = sessionStorage.getItem("energyCompanySession");
        if (stored) {
          setEnergyCompany(JSON.parse(stored));
        } else if (hash === "energy-company-dashboard" || hash === "energy-company-client") {
          setRoute("energy-company-login");
          window.history.replaceState({ route: "energy-company-login" }, "", "#energy-company-login");
        }
      } catch (_) {
        sessionStorage.removeItem("energyCompanySession");
      }
    }
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

  const goto = (r) => {
    setRoute(r);
    // Push to browser history
    window.history.pushState({ route: r }, '', `#${r}`);
  };

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
    
    setActiveApplicationId(application.id);
    
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
    
    const appId = activeApplication?.id;
    if (!appId) return;

    setApplications((prev) => prev.map((a) => (a.id === appId ? { ...a, status: "Approved" } : a)));
    await updateApplicationStatus("Approved");
    
    setTimeout(async () => {
      try {
        setApplications((prev) => prev.map((a) => (a.id === appId ? { ...a, status: "In Execution" } : a)));
        await updateApplicationStatus("In Execution");
      } catch (error) {
        console.error('Error updating to In Execution:', error);
      }
    }, 600);
    
    setTimeout(async () => {
      try {
        setApplications((prev) => prev.map((a) => (a.id === appId ? { ...a, status: "Completed" } : a)));
        await updateApplicationStatus("Completed");
        setProject({ name: activeApplication?.projectName, phase: "Installation" }); 
        goto("project");
      } catch (error) {
        console.error('Error updating to Completed:', error);
      }
    }, 1600);
  };

  const handleApplyFinancing = (company) => { setMatchingCompany(company); goto("financing"); };
  const handleFinancingSubmit = async (payload) => {
    const app = activeApplication;
    if (!app) return;
    
    setApplications((prev) => prev.map((a) => (a.id === app.id ? { ...a, status: "Under Review" } : a))); 
    
    try {
      await updateApplication(app.id, { status: "Under Review" });
    } catch (error) {
      console.error('Error updating application status:', error);
    }
    
    alert(`Financing submitted to ${payload.org} for ${payload.type}. Application set to Under Financing Review.`); 
    setProject({ name: app.projectName, phase: "Financing" }); 
    goto("project"); 
  };
  const handleMoreInfo = (company) => { alert(`A clarification request was sent to ${company.name}. They will revise their offer.`); };

  // Admin handlers
  const handleAdminLogin = () => {
    sessionStorage.setItem("adminSession", "1");
    setIsAdmin(true);
    goto("admin-dashboard");
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem("adminSession");
    setIsAdmin(false);
    setSelectedClient(null);
    goto("landing");
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

  // Energy Company handlers
  const handleEnergyCompanyLogin = async (username, password) => {
    try {
      const result = await loginEnergyCompany(username, password);
      if (result.success) {
        sessionStorage.setItem("energyCompanySession", JSON.stringify(result.data));
        setEnergyCompany(result.data);
        goto("energy-company-dashboard");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      throw error;
    }
  };

  const handleEnergyCompanyLogout = () => {
    sessionStorage.removeItem("energyCompanySession");
    setEnergyCompany(null);
    setSelectedCompanyClient(null);
    goto("landing");
  };

  const handleViewCompanyClient = (client) => {
    setSelectedCompanyClient(client);
    setRoute("energy-company-client");
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

  const meta = ROUTE_META[route] || ROUTE_META.landing;

  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
      </Helmet>
      {!route.startsWith('admin-') && !route.startsWith('energy-company-') && <TopNav onNavigate={goto} route={route} user={user} onLogout={handleLogout} />}

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

        {/* Energy Company Routes */}
        {route === "energy-company-login" && (
          <motion.div key="energy-company-login" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <EnergyCompanyLogin onLogin={handleEnergyCompanyLogin} />
          </motion.div>
        )}

        {route === "energy-company-dashboard" && energyCompany && (
          <motion.div key="energy-company-dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <EnergyCompanyDashboard 
              company={energyCompany} 
              onLogout={handleEnergyCompanyLogout} 
              onViewClient={handleViewCompanyClient}
            />
          </motion.div>
        )}

        {route === "energy-company-client" && energyCompany && selectedCompanyClient && (
          <motion.div key="energy-company-client" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <EnergyCompanyClientDetail 
              client={selectedCompanyClient} 
              company={energyCompany}
              onBack={() => setRoute("energy-company-dashboard")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
