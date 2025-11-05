import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, CalendarDays, Building, MapPin, Zap, Plus, FileText, TrendingUp, Clock, ChevronRight, Sparkles, BarChart3 } from "lucide-react";
import { Card, PrimaryButton, Pill, Progress } from "../ui";
import { formatDate, progressForStatus } from "../../utils";
import { getUserApplications, subscribeToUserApplications } from "../../firebase/realtime-db";

const Dashboard = ({ user, applications, onOpen, onApplicationClick }) => {
  const [firestoreApplications, setFirestoreApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = subscribeToUserApplications(user.uid, (apps) => {
      setFirestoreApplications(apps || []);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const displayApplications = firestoreApplications.length > 0 ? firestoreApplications : applications;

  // Calculate stats
  const stats = {
    total: displayApplications.length,
    active: displayApplications.filter(a => a.status !== "Completed").length,
    completed: displayApplications.filter(a => a.status === "Completed").length,
    inProgress: displayApplications.filter(a => a.status === "In Execution").length
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Gradient Mesh Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-emerald-50 to-cyan-50"></div>
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Welcome back, {user.name.split(" ")[0]}! 👋
              </h1>
              <p className="mt-2 text-slate-600 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {user.email}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
              <CalendarDays className="h-4 w-4 text-emerald-500" />
              {formatDate()}
      </div>
    </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={{
            animate: { transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Total Projects", value: stats.total, icon: <FileText className="h-6 w-6" />, color: "from-blue-500 to-cyan-500", bg: "bg-blue-50" },
            { label: "Active", value: stats.active, icon: <TrendingUp className="h-6 w-6" />, color: "from-emerald-500 to-green-500", bg: "bg-emerald-50" },
            { label: "In Progress", value: stats.inProgress, icon: <Clock className="h-6 w-6" />, color: "from-amber-500 to-orange-500", bg: "bg-amber-50" },
            { label: "Completed", value: stats.completed, icon: <Sparkles className="h-6 w-6" />, color: "from-purple-500 to-pink-500", bg: "bg-purple-50" }
          ].map((stat, index) => (
            <motion.div key={stat.label} variants={fadeInUp}>
              <Card className="hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-emerald-100">
        <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                  <div className={`h-14 w-14 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                    <div className={`bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                      {stat.icon}
                    </div>
        </div>
        </div>
      </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* New Application Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:col-span-1"
          >
            <Card className="h-full bg-gradient-to-br from-emerald-500 to-blue-500 text-white shadow-2xl border-0 hover:shadow-3xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Plus className="h-6 w-6" />
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium">
                  Quick Action
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-3">Start New Project</h3>
              <p className="text-emerald-100 mb-6 leading-relaxed">
                Provide facility details, upload energy bills, and choose your preferred solar system.
              </p>
              
              <button
                onClick={onOpen}
                className="group w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white text-emerald-600 px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Plus className="h-5 w-5" />
                New Application
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Card>
          </motion.div>

          {/* Applications List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="lg:col-span-2"
          >
            <Card className="h-full shadow-xl border-2 border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Your Applications</h3>
                <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                  <BarChart3 className="h-4 w-4" />
                  {displayApplications.length} {displayApplications.length === 1 ? 'Project' : 'Projects'}
                </div>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {loading && (
                  <div className="flex items-center justify-center py-12">
                    <div className="h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                
                {!loading && displayApplications.length === 0 && (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-2xl mb-4">
                      <FileText className="h-8 w-8 text-slate-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">No Applications Yet</h4>
                    <p className="text-slate-600 mb-4">Create your first solar project application to get started</p>
                    <button
                      onClick={onOpen}
                      className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      <Plus className="h-4 w-4" />
                      Create Application
            </button>
                  </div>
                )}
                
                {displayApplications.map((app, index) => (
                  <motion.button
                    key={app.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => onApplicationClick && onApplicationClick(app)}
                    className="w-full group"
                  >
                    <div className="rounded-2xl border-2 border-slate-200 bg-white p-5 text-left hover:border-emerald-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg text-slate-900 group-hover:text-emerald-600 transition-colors">
                            {app.projectName}
                          </h4>
                          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              {app.facilityType}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {app.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Zap className="h-3 w-3" />
                              {app.systemType}
                            </div>
                          </div>
                        </div>
                        <Pill variant={app.status === "Completed" ? "success" : "info"}>
                          {app.status}
                        </Pill>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                          <span className="font-medium">Progress</span>
                          <span>{progressForStatus(app.status).toFixed(0)}%</span>
                        </div>
                        <Progress value={progressForStatus(app.status)} />
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <span className="text-xs text-slate-500">
                          Submitted: {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Unknown'}
                        </span>
                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </motion.button>
          ))}
        </div>
      </Card>
          </motion.div>
        </div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Card className="hover:shadow-lg transition-all duration-300 hover:border-emerald-100 cursor-pointer" onClick={() => window.dispatchEvent(new CustomEvent('nav:goto', { detail: 'help' }))}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Documentation</h4>
                <p className="text-sm text-slate-600">Guides & FAQs</p>
              </div>
            </div>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 hover:border-emerald-100 cursor-pointer" onClick={() => window.dispatchEvent(new CustomEvent('nav:goto', { detail: 'notifications' }))}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Notifications</h4>
                <p className="text-sm text-slate-600">Updates & Alerts</p>
              </div>
            </div>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 hover:border-emerald-100 cursor-pointer" onClick={() => window.dispatchEvent(new CustomEvent('nav:goto', { detail: 'profile' }))}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Mail className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Support</h4>
                <p className="text-sm text-slate-600">Contact Us</p>
              </div>
            </div>
          </Card>
        </motion.div>
    </div>
  </div>
  );
};

export default Dashboard;
