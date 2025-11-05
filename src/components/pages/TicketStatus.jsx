import { useState, useEffect, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CalendarDays, MapPin, Building, Zap, Upload, Plus, Minus, Banknote, HandCoins, Info as InfoIcon, FileText, Image, BarChart3, Download, TrendingUp, CheckCircle, Clock, AlertCircle, ExternalLink, ChevronRight } from "lucide-react";
import { Card, PrimaryButton, GhostButton, Pill, Progress, Select, TextArea, SavingsCalculator } from "../ui";
import { STATUS_FLOW } from "../../constants";
import { progressForStatus, formatDate } from "../../utils";
import { getUserApplications, subscribeToUserApplications, deleteApplication } from "../../firebase/realtime-db";

// Generate offers based on application data
const generateOffers = (application) => {
  if (!application) return [];
  
  // Extract application data
  const monthlyKwh = parseFloat(String(application.loadProfile || 0).replace(/[^0-9.]/g, '')) || 0;
  const annualKwh = monthlyKwh * 12;
  const facilityType = application.facilityType || "Commercial";
  const systemType = application.systemType || "Grid-Tied";
  
  // Calculate required system size (kWp)
  // Average Qatari solar production: ~1,600 kWh per kWp per year
  const solarProductionPerKw = 1600; // kWh per kWp per year
  const requiredSystemSize = annualKwh > 0 ? Math.ceil(annualKwh / solarProductionPerKw) : 10; // Default to 10kWp if no data
  
  // Price per kWp varies by facility type and system size
  const getPricePerKw = (size, facilityType) => {
    // Base prices in QAR per kWp
    let basePrice = 3500; // QAR per kWp base price
    
    // Adjust for facility type
    if (facilityType.includes("Residential") || facilityType.includes("Villa") || facilityType.includes("Flat")) {
      basePrice = 3800; // Residential slightly higher
    } else if (facilityType.includes("Commercial")) {
      basePrice = 3500; // Commercial standard
    } else if (facilityType.includes("Industrial")) {
      basePrice = 3200; // Industrial bulk discount
    }
    
    // Volume discounts for larger systems
    if (size >= 100) {
      basePrice *= 0.85; // 15% discount for 100kWp+
    } else if (size >= 50) {
      basePrice *= 0.90; // 10% discount for 50kWp+
    } else if (size >= 20) {
      basePrice *= 0.95; // 5% discount for 20kWp+
    }
    
    return basePrice;
  };
  
  const basePricePerKw = getPricePerKw(requiredSystemSize, facilityType);
  
  // Generate 3 different offers with variations
  const companies = [
    {
      id: "qatar-solar-premium",
      name: "Qatar Solar Premium",
      score: 4.9,
      sizeVariation: 1.05, // 5% larger system
      priceVariation: 1.08, // 8% premium
      warranty: 15,
      timeline: 60 + Math.floor(requiredSystemSize / 10) // Base 60 days + 1 day per 10kWp
    },
    {
      id: "green-energy-solutions",
      name: "Green Energy Solutions",
      score: 4.7,
      sizeVariation: 1.0, // Exact match
      priceVariation: 1.0, // Standard pricing
      warranty: 12,
      timeline: 75 + Math.floor(requiredSystemSize / 10)
    },
    {
      id: "desert-sun-epc",
      name: "Desert Sun EPC",
      score: 4.6,
      sizeVariation: 0.95, // 5% smaller system (more efficient)
      priceVariation: 0.92, // 8% discount
      warranty: 10,
      timeline: 90 + Math.floor(requiredSystemSize / 10)
    }
  ];
  
  return companies.map((company, index) => {
    const systemSizeKw = Math.round(requiredSystemSize * company.sizeVariation);
    const totalCost = Math.round(systemSizeKw * basePricePerKw * company.priceVariation);
    
    // Format cost in QAR
    const formatQAR = (amount) => {
      return new Intl.NumberFormat('en-QA', {
        style: 'currency',
        currency: 'QAR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    };
    
    return {
      id: company.id,
      name: company.name,
      size: `${systemSizeKw} kWp`,
      cost: formatQAR(totalCost),
      warranty: `${company.warranty} years`,
      timeline: `${company.timeline} days`,
      score: company.score,
      systemSizeKw: systemSizeKw,
      totalCost: totalCost
    };
  });
};

const TicketStatus = ({ user, onAdvance, onGoMatching, onGoProject, onGoFinancing, onNewApplication, loading = false, selectedApplicationId = null, onSelectApplication }) => {
  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState("project");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [finType, setFinType] = useState("");
  const [finOrg, setFinOrg] = useState("");
  const [finNotes, setFinNotes] = useState("");
  const [requestingOffer, setRequestingOffer] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    setApplicationsLoading(true);
    
    const unsubscribe = subscribeToUserApplications(user.uid, (apps) => {
      console.log('📊 Apps updated:', apps?.length, 'apps, selectedApplicationId:', selectedApplicationId);
      setApplications(apps || []);
      setApplicationsLoading(false);
      
      if (apps && apps.length > 0) {
        if (selectedApplicationId) {
          const foundApp = apps.find(app => app.id === selectedApplicationId);
          if (foundApp) {
            console.log('✅ Setting selected app to:', foundApp.projectName);
            setSelectedApplication(foundApp);
            onSelectApplication && onSelectApplication(foundApp.id);
          } else {
            console.log('❌ SelectedApplicationId not found, falling back to first app');
            setSelectedApplication(apps[0]);
            onSelectApplication && onSelectApplication(apps[0].id);
          }
        } else {
          console.log('⚠️ No selectedApplicationId, setting to first app');
          setSelectedApplication(apps[0]);
          onSelectApplication && onSelectApplication(apps[0].id);
        }
      }
    });

    return () => unsubscribe();
  }, [user?.uid, selectedApplicationId]);

  useEffect(() => {
    if (selectedApplicationId && applications.length > 0) {
      const foundApp = applications.find(app => app.id === selectedApplicationId);
      if (foundApp) {
        setSelectedApplication(foundApp);
      }
    }
  }, [selectedApplicationId, applications]);

  const handleDeleteApplication = async (applicationId) => {
    if (!deleteConfirm) {
      setDeleteConfirm(applicationId);
      return;
    }

    if (deleteConfirm !== applicationId) {
      setDeleteConfirm(null);
      return;
    }

    setDeleting(true);
    try {
      const result = await deleteApplication(applicationId);
      if (result.success) {
        if (selectedApplication?.id === applicationId) {
          setSelectedApplication(null);
        }
        setDeleteConfirm(null);
      } else {
        alert(`Failed to delete application: ${result.error}`);
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      alert('An unexpected error occurred while deleting the application.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading || applicationsLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Gradient Mesh Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-emerald-300 to-teal-300 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-cyan-300 to-blue-300 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
              <span className="mt-4 text-lg text-slate-600">Loading applications...</span>
          </div>
        </Card>
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
  return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Gradient Mesh Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-emerald-300 to-teal-300 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-cyan-300 to-blue-300 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      </div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-2xl mb-6">
                <FileText className="h-10 w-10 text-slate-400" />
          </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No Applications Found</h3>
              <p className="text-slate-600 mb-6">Create your first solar application to get started</p>
              <button
                onClick={onNewApplication}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <Plus className="h-5 w-5" />
                Create Application
              </button>
        </Card>
          </motion.div>
          </div>
      </div>
    );
  }

  const progress = selectedApplication ? progressForStatus(selectedApplication.status) : 0;
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Gradient Mesh Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50"></div>
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-emerald-300 to-teal-300 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-cyan-300 to-blue-300 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-300 to-indigo-300 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
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
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 flex items-center gap-3">
                <div className="h-12 w-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                Applications & Tickets
              </h1>
              <p className="mt-2 text-slate-600">Track and manage your solar projects</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
              <CalendarDays className="h-4 w-4 text-emerald-500" />
              {formatDate()}
        </div>
          </div>
        </motion.div>

        {/* Selected Application Card */}
        {selectedApplication && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card className="p-8 shadow-2xl border-2 border-slate-100 mb-6">
              {/* Application Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedApplication.projectName}</h2>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      Submitted: {selectedApplication.createdAt ? new Date(selectedApplication.createdAt).toLocaleDateString() : 'Unknown'}
                  </div>
                  <div className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      {selectedApplication.facilityType}
                  </div>
                  <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {selectedApplication.location}
                  </div>
                </div>
                </div>
                <div className="flex items-center gap-3">
                <Pill variant={selectedApplication.status === "Completed" ? "success" : "info"}>
                  {selectedApplication.status}
                </Pill>
                  <button
                    onClick={() => handleDeleteApplication(selectedApplication.id)}
                    className={`p-2.5 rounded-xl transition-all ${
                      deleteConfirm === selectedApplication.id 
                        ? "bg-red-500 text-white hover:bg-red-600 shadow-lg" 
                        : "text-red-500 hover:text-red-600 hover:bg-red-50 border-2 border-red-200"
                    }`}
                    disabled={deleting}
                    title={deleteConfirm === selectedApplication.id ? "Click again to confirm deletion" : "Delete application"}
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              {/* Tabs */}
              <div className="border-b-2 border-slate-200 mb-6">
                <div className="-mb-0.5 flex items-center gap-8">
                  {[
                    { key: 'project', label: 'Project Overview', icon: Building },
                    { key: 'matching', label: 'Matching & Offers', icon: CheckCircle },
                    { key: 'financing', label: 'Financing', icon: Banknote }
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`group flex items-center gap-2 px-1 pb-4 text-sm font-medium border-b-2 transition-all ${
                        activeTab === tab.key 
                          ? 'border-emerald-500 text-emerald-600' 
                          : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                      }`}
                    >
                      <tab.icon className={`h-4 w-4 ${activeTab === tab.key ? 'text-emerald-500' : 'text-slate-400 group-hover:text-slate-600'}`} />
                      {tab.label}
                    </button>
                  ))}
                </div>
                </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'project' && (
                  <motion.div
                    key="project"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Project Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { label: 'Facility Type', value: selectedApplication.facilityType, icon: Building },
                        { label: 'Location', value: selectedApplication.location, icon: MapPin },
                        { label: 'System Type', value: selectedApplication.systemType, icon: Zap },
                        { label: 'Load Profile', value: selectedApplication.loadProfile || 'Not specified', icon: BarChart3 }
                      ].map((item, index) => (
                        <div key={index} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                          <div className="flex items-center gap-2 text-xs text-slate-600 mb-2">
                            <item.icon className="h-3 w-3" />
                            {item.label}
                </div>
                          <div className="font-semibold text-slate-900">{item.value}</div>
                </div>
                      ))}
              </div>

                    {/* Notes */}
               {selectedApplication.notes && (
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-center gap-2 text-sm font-medium text-blue-900 mb-2">
                          <FileText className="h-4 w-4" />
                          Additional Notes
                        </div>
                        <p className="text-sm text-blue-800">{selectedApplication.notes}</p>
                 </div>
               )}

                    {/* Progress Section */}
                 <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-slate-900">Project Progress</h3>
                        <span className="text-sm font-medium text-emerald-600">{progress.toFixed(0)}% Complete</span>
                               </div>
                      <Progress value={progress} className="mb-4" />
                      
                      {/* Status Steps */}
                      <div className="flex items-center gap-2 w-full">
                        {STATUS_FLOW.map((s, index) => {
                          const isActive = STATUS_FLOW.indexOf(s) <= STATUS_FLOW.indexOf(selectedApplication.status);
                          const isCurrent = s === selectedApplication.status;
                          const isLast = index === STATUS_FLOW.length - 1;
                          
                          return (
                            <Fragment key={s}>
                              <div
                                className={`relative rounded-xl border-2 px-3 py-3 text-center transition-all flex-1 min-w-0 ${
                                  isCurrent
                                    ? "border-emerald-500 bg-emerald-500 text-white shadow-lg scale-105"
                                    : isActive
                                      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                                      : "border-slate-200 bg-white text-slate-500"
                                }`}
                              >
                                {isActive && (
                                  <div className="absolute -top-2 -right-2">
                                    <CheckCircle className="h-5 w-5 text-emerald-500 bg-white rounded-full" />
                                  </div>
                                )}
                                <div className="text-xs font-medium whitespace-nowrap truncate">{s}</div>
                             </div>
                              {!isLast && (
                                <ChevronRight 
                                  className={`h-5 w-5 flex-shrink-0 ${
                                    isActive ? "text-emerald-500" : "text-slate-300"
                                  }`}
                                />
                              )}
                            </Fragment>
                          );
                        })}
                         </div>
                       </div>

                    {/* Savings Calculator */}
                    <SavingsCalculator 
                      monthlyKwh={selectedApplication.loadProfile ? parseFloat(String(selectedApplication.loadProfile).replace(/[^0-9.]/g, '')) : 0}
                      facilityType={selectedApplication.facilityType}
                    />

                    {/* Uploaded Files */}
                    {selectedApplication.files && (
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Uploaded Documents</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {['bills', 'photos', 'load'].map((category) => {
                            const files = selectedApplication.files[category] || [];
                            const icons = { bills: FileText, photos: Image, load: BarChart3 };
                            const labels = { bills: 'Energy Bills', photos: 'Site Photos', load: 'Load Data' };
                            const Icon = icons[category];
                            
                            return (
                              <div key={category} className="bg-white rounded-xl p-4 border-2 border-slate-200">
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Icon className="h-4 w-4 text-blue-600" />
                                  </div>
                       <div>
                                    <div className="font-semibold text-sm text-slate-900">{labels[category]}</div>
                                    <div className="text-xs text-slate-500">{files.length} file(s)</div>
                                  </div>
                                </div>
                                {files.length > 0 ? (
                                  <div className="space-y-2">
                                    {files.map((file, index) => (
                                      <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                        <div className="flex-1 min-w-0">
                                          <div className="text-xs font-medium text-slate-900 truncate">{file.name}</div>
                                          <div className="text-xs text-slate-500">{Math.round(file.size / 1024)} KB</div>
                               </div>
                               <a 
                                 href={file.url} 
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                          className="ml-2 p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                               >
                                          <ExternalLink className="h-3 w-3" />
                               </a>
                             </div>
                           ))}
                                  </div>
                                ) : (
                                  <p className="text-xs text-slate-500 text-center py-4">No files uploaded</p>
                                )}
                              </div>
                            );
                          })}
                         </div>
                       </div>
                     )}
                     
                    {/* Documents and Live Performance */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      {/* Documents Card */}
                      <Card className="hover:shadow-lg transition-all">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="h-10 w-10 bg-purple-100 rounded-xl flex items-center justify-center">
                            <FileText className="h-5 w-5 text-purple-600" />
                          </div>
                          <h4 className="font-bold text-lg text-slate-900">Project Documents</h4>
                               </div>
                        <div className="space-y-2">
                          {["Design.pdf", "Contract.pdf", "CommissioningReport.pdf"].map((d) => (
                            <div key={d} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                              <span className="text-sm font-medium text-slate-900">{d}</span>
                              <button 
                                onClick={() => alert(`Pretend download of ${d}`)}
                                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                              >
                                <Download className="h-3 w-3" />
                                Download
                              </button>
                             </div>
                           ))}
                         </div>
                      </Card>

                      {/* Live Performance Card */}
                      <Card className="bg-gradient-to-br from-emerald-500 to-blue-500 text-white border-0 hover:shadow-lg transition-all">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="h-10 w-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <TrendingUp className="h-5 w-5" />
                          </div>
                          <h4 className="font-bold text-lg">Live Performance</h4>
                        </div>
                        <p className="text-emerald-100 text-sm mb-4">Real-time system monitoring</p>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                          <div className="text-3xl font-bold mb-1">2,340 kWh</div>
                          <div className="text-emerald-100 text-sm">Today's Generation</div>
                       </div>
                      </Card>
                   </div>

                    {/* Action Buttons */}
                    {selectedApplication.status === "Overview" && (
                      <div className="pt-4">
                        <button
                          onClick={async () => {
                            if (onAdvance && selectedApplication && !requestingOffer) {
                              setRequestingOffer(true);
                              try {
                                await onAdvance(selectedApplication);
                                // Status will update automatically via Firebase subscription
                              } catch (error) {
                                console.error('Error requesting offer:', error);
                                alert('Failed to submit request. Please try again.');
                              } finally {
                                setRequestingOffer(false);
                              }
                            }
                          }}
                          disabled={requestingOffer}
                          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold hover:from-emerald-700 hover:to-teal-700 transition-all hover:scale-105 shadow-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                          {requestingOffer ? (
                            <>
                              <Loader2 className="h-6 w-6 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-6 w-6" />
                              Request an Offer
                              <ChevronRight className="h-6 w-6" />
                            </>
                          )}
                        </button>
                        <p className="text-sm text-slate-600 mt-3">
                          Click to submit your application for review and receive offers from solar companies
                        </p>
                       </div>
                     )}
                    {selectedApplication.status === "Matched" && (
                      <div className="pt-4">
                        <button
                          onClick={() => setActiveTab('matching')}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all hover:scale-105 shadow-lg"
                        >
                          View Matching & Offers
                          <ChevronRight className="h-5 w-5" />
                        </button>
                   </div>
               )}
                  </motion.div>
                )}

                {activeTab === 'matching' && (
                  <motion.div
                    key="matching"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Available Offers</h3>
                      <p className="text-slate-600">Compare proposals from vetted solar companies based on your application</p>
                      {selectedApplication && (
                        <div className="mt-3 flex flex-wrap gap-2 text-sm">
                          <Pill variant="info">Load: {parseFloat(String(selectedApplication.loadProfile || 0).replace(/[^0-9.]/g, '')) || 0} kWh/month</Pill>
                          <Pill variant="info">{selectedApplication.facilityType || "Commercial"}</Pill>
                          <Pill variant="info">{selectedApplication.systemType || "Grid-Tied"}</Pill>
                 </div>
               )}
                    </div>
                    
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {generateOffers(selectedApplication).map((c, index) => (
                        <motion.div
                          key={c.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="h-full hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-slate-100">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-bold text-lg text-slate-900">{c.name}</h4>
                              <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                                Score {c.score.toFixed(1)}
                              </div>
          </div>

                            <div className="space-y-3 mb-6">
                              {[
                                { label: 'System Size', value: c.size, icon: Zap },
                                { label: 'Cost', value: c.cost, icon: Banknote },
                                { label: 'Warranty', value: c.warranty, icon: CheckCircle },
                                { label: 'Timeline', value: c.timeline, icon: Clock }
                              ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                  <span className="flex items-center gap-2 text-sm text-slate-600">
                                    <item.icon className="h-3 w-3" />
                                    {item.label}
                                  </span>
                                  <span className="text-sm font-semibold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>

                            <div className="space-y-2">
                              <button
                                onClick={() => { onGoProject && onGoProject(); }}
                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                              >
                                Proceed & Pay
                                <Banknote className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => { setSelectedCompany(c); setActiveTab('financing'); }}
                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-emerald-300 text-emerald-700 rounded-xl font-medium hover:bg-emerald-50 transition-all"
                              >
                                Apply for Financing
                                <HandCoins className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => alert('A clarification request was sent.')} 
                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-all"
                              >
                                Request More Info
                                <InfoIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'financing' && (
                  <motion.div
                    key="financing"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Financing Application</h3>
                      <Pill variant="info">Application: {selectedApplication.projectName}</Pill>
                    </div>
                    
                    {/* Info Box */}
                    <div className="mb-6 bg-emerald-50 rounded-xl p-6 border-2 border-emerald-200">
                      <h4 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
                        <InfoIcon className="h-5 w-5" />
                        Financing Options
                      </h4>
                      <ul className="space-y-2 text-sm text-emerald-800">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <div><span className="font-semibold">PPA (Power Purchase Agreement):</span> Pay per kWh generated, no upfront cost</div>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <div><span className="font-semibold">Solar Leasing:</span> Fixed monthly leasing fee with no ownership transfer</div>
                        </li>
                      </ul>
                    </div>
                    
                    <Card className="p-8">
                      <form 
                        className="space-y-6" 
                        onSubmit={(e) => { 
                          e.preventDefault(); 
                          if (!(finType && finOrg)) return; 
                          alert(`Financing submitted to ${finOrg} (${finType})`); 
                        }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Financing Type *
                            </label>
                            <Select 
                              value={finType} 
                              onChange={setFinType} 
                              required 
                              options={["PPA","Solar Leasing"]}
                              className="h-12"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Financial Institution *
                            </label>
                            <Select 
                              value={finOrg} 
                              onChange={setFinOrg} 
                              required 
                              options={["QDB","QNB","Kahramaa"]}
                              className="h-12"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Additional Notes
                          </label>
                          <TextArea 
                            value={finNotes} 
                            onChange={setFinNotes} 
                            placeholder="Any additional context or requirements..."
                            rows={4}
                          />
              </div>

                        <div className="flex items-center gap-3 pt-4">
                          <button
                            type="submit"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                          >
                            <Banknote className="h-5 w-5" />
                            Submit Financing Request
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveTab('matching')}
                            className="px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-medium hover:border-emerald-300 hover:bg-emerald-50 transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Delete Confirmation */}
              <AnimatePresence>
                {deleteConfirm === selectedApplication.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6"
                  >
                    <Card className="bg-red-50 border-2 border-red-200">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 h-12 w-12 bg-red-500 rounded-xl flex items-center justify-center">
                          <AlertCircle className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-red-900 mb-1">⚠️ Delete Confirmation</h4>
                          <p className="text-sm text-red-700 mb-4">
                            Are you sure you want to delete "{selectedApplication.projectName}"? 
                            This action cannot be undone.
                          </p>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleDeleteApplication(selectedApplication.id)}
                              disabled={deleting}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 font-medium transition-all"
                            >
                              {deleting ? "Deleting..." : "Yes, Delete"}
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              disabled={deleting}
                              className="px-4 py-2 bg-white border-2 border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50 font-medium transition-all"
                            >
                              Cancel
                            </button>
                          </div>
          </div>
        </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer Note */}
              <div className="mt-6 pt-6 border-t-2 border-slate-100">
                <p className="text-xs text-center text-slate-500">
                  📧 Email and SMS notifications will be sent automatically on status changes
                </p>
              </div>
      </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TicketStatus;
