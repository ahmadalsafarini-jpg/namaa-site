import { useState, useEffect } from "react";
import { Loader2, CalendarDays, MapPin, Building, Zap, Upload, Plus, Minus, Banknote, HandCoins, Info as InfoIcon } from "lucide-react";
import { Card, PrimaryButton, GhostButton, Pill, Progress, Select, TextArea } from "../ui";
import { STATUS_FLOW, MOCK_COMPANIES } from "../../constants";
import { progressForStatus, formatDate } from "../../utils";
import { getUserApplications, subscribeToUserApplications, deleteApplication } from "../../firebase/realtime-db";

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

  useEffect(() => {
    if (!user?.uid) return;

    setApplicationsLoading(true);
    
    // Subscribe to real-time updates for applications
    const unsubscribe = subscribeToUserApplications(user.uid, (apps) => {
      console.log('📊 Apps updated:', apps?.length, 'apps, selectedApplicationId:', selectedApplicationId);
      setApplications(apps || []);
      setApplicationsLoading(false);
      
      // Set the selected application based on selectedApplicationId or first application
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

  // Update selected application when selectedApplicationId changes
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
        // If we deleted the currently selected application, clear the selection
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
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Applications & Tickets</h2>
        </div>
        <Card>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading applications...</span>
          </div>
        </Card>
      </div>
    );
  }

  if (applications.length === 0) {
  return (
      <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Applications & Tickets</h2>
      </div>
      <Card>
          <div className="text-center py-8">
            <p className="text-slate-600">No applications found. Create your first application to get started.</p>
          </div>
        </Card>
      </div>
    );
  }

  const progress = selectedApplication ? progressForStatus(selectedApplication.status) : 0;
  
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Applications & Tickets</h2>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <CalendarDays className="h-4 w-4" /> {formatDate()}
        </div>
      </div>

      {/* Selected Application Details */}
      <Card>
          {selectedApplication ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{selectedApplication.projectName}</h3>
                  <p className="text-xs text-slate-500 mt-1">Submitted on {selectedApplication.createdAt ? new Date(selectedApplication.createdAt).toLocaleDateString() : 'Unknown'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Pill variant={selectedApplication.status === "Completed" ? "success" : "info"}>
                    {selectedApplication.status}
                  </Pill>
                  <button
                    onClick={() => handleDeleteApplication(selectedApplication.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      deleteConfirm === selectedApplication.id 
                        ? "bg-red-500 text-white hover:bg-red-600" 
                        : "text-red-500 hover:text-red-600 hover:bg-red-50"
                    }`}
                    disabled={deleting}
                    title={deleteConfirm === selectedApplication.id ? "Click again to confirm deletion" : "Delete application"}
                  >
                     <Minus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Tabs bar styled like the screenshot */}
              <div className="mt-3 border-b border-slate-200">
                <div className="-mb-px flex items-center gap-6">
                  <button
                    onClick={() => setActiveTab('project')}
                    className={`px-1 pb-2 text-sm font-medium border-b-2 ${activeTab === 'project' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
                  >
                    Project
                  </button>
                  <button
                    onClick={() => setActiveTab('matching')}
                    className={`px-1 pb-2 text-sm font-medium border-b-2 ${activeTab === 'matching' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
                  >
                    Matching
                  </button>
                  <button
                    onClick={() => setActiveTab('financing')}
                    className={`px-1 pb-2 text-sm font-medium border-b-2 ${activeTab === 'financing' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
                  >
                    Financing
                  </button>
                </div>
              </div>
              
              {activeTab === 'project' && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Facility Type:</span>
                  <div className="font-medium">{selectedApplication.facilityType}</div>
                </div>
                <div>
                  <span className="text-slate-600">Location:</span>
                  <div className="font-medium">{selectedApplication.location}</div>
                </div>
                <div>
                  <span className="text-slate-600">System Type:</span>
                  <div className="font-medium">{selectedApplication.systemType}</div>
                </div>
                <div>
                  <span className="text-slate-600">Load Profile:</span>
                  <div className="font-medium">{selectedApplication.loadProfile || 'Not specified'}</div>
                </div>
              </div>
              )}

               {selectedApplication.notes && (
                 <div>
                   <span className="text-slate-600 text-sm">Notes:</span>
                   <div className="text-sm mt-1 p-2 bg-slate-50 rounded-lg">{selectedApplication.notes}</div>
                 </div>
               )}

              {activeTab === 'project' && selectedApplication.files && (
                 <div>
                   <span className="text-slate-600 text-sm">Uploaded Files:</span>
                   <div className="mt-2 space-y-4">
                     {/* Energy Bills */}
                     {selectedApplication.files.bills && selectedApplication.files.bills.length > 0 && (
                       <div>
                         <h4 className="text-xs font-medium text-slate-700 mb-2">Energy Bills ({selectedApplication.files.bills.length})</h4>
                         <div className="space-y-1">
                           {selectedApplication.files.bills.map((file, index) => (
                             <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                               <div className="flex items-center gap-2">
                                 <Upload className="h-4 w-4 text-slate-500" />
                                 <span className="text-sm font-medium">{file.name}</span>
                                 <span className="text-xs text-slate-500">({Math.round(file.size / 1024)} KB)</span>
                               </div>
                               <a 
                                 href={file.url} 
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 className="text-xs text-blue-600 hover:text-blue-800 underline"
                               >
                                 View
                               </a>
                             </div>
                           ))}
                         </div>
                       </div>
                     )}
                     
                     {/* Site Photos */}
                     {selectedApplication.files.photos && selectedApplication.files.photos.length > 0 && (
                       <div>
                         <h4 className="text-xs font-medium text-slate-700 mb-2">Site Photos ({selectedApplication.files.photos.length})</h4>
                         <div className="space-y-1">
                           {selectedApplication.files.photos.map((file, index) => (
                             <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                               <div className="flex items-center gap-2">
                                 <Upload className="h-4 w-4 text-slate-500" />
                                 <span className="text-sm font-medium">{file.name}</span>
                                 <span className="text-xs text-slate-500">({Math.round(file.size / 1024)} KB)</span>
                               </div>
                               <a 
                                 href={file.url} 
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 className="text-xs text-blue-600 hover:text-blue-800 underline"
                               >
                                 View
                               </a>
                             </div>
                           ))}
                         </div>
                       </div>
                     )}
                     
                     {/* Load Data */}
                     {selectedApplication.files.load && selectedApplication.files.load.length > 0 && (
                       <div>
                         <h4 className="text-xs font-medium text-slate-700 mb-2">Load Data ({selectedApplication.files.load.length})</h4>
                         <div className="space-y-1">
                           {selectedApplication.files.load.map((file, index) => (
                             <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                               <div className="flex items-center gap-2">
                                 <Upload className="h-4 w-4 text-slate-500" />
                                 <span className="text-sm font-medium">{file.name}</span>
                                 <span className="text-xs text-slate-500">({Math.round(file.size / 1024)} KB)</span>
                               </div>
                               <a 
                                 href={file.url} 
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 className="text-xs text-blue-600 hover:text-blue-800 underline"
                               >
                                 View
                               </a>
                             </div>
                           ))}
                         </div>
                       </div>
                     )}
                   </div>
                 </div>
               )}

              {activeTab === 'project' && (
              <div>
                <span className="text-slate-600 text-sm">Progress:</span>
                <div className="mt-2"><Progress value={progress} /></div>
          </div>
              )}

              {activeTab === 'project' && (
              <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
            {STATUS_FLOW.filter((s) => s !== "Pending").map((s) => (
              <div key={s} className={`rounded-xl border px-3 py-2 text-center text-xs ${
                    STATUS_FLOW.indexOf(s) <= STATUS_FLOW.indexOf(selectedApplication.status)
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-white text-slate-500"
              }`}>
                {s}
              </div>
            ))}
          </div>
              )}

              {activeTab === 'project' && (
              <div className="flex flex-wrap items-center gap-3 pt-4">
                {selectedApplication.status !== "Completed" && (
                  <PrimaryButton onClick={() => onAdvance(selectedApplication)}>
                    Advance Status
              </PrimaryButton>
            )}
                {selectedApplication.status === "Matched" && (
                  <GhostButton onClick={() => setActiveTab('matching')}>View Matching & Offers</GhostButton>
                )}
              </div>
              )}

              {/* Documents and Live Performance Section */}
              {activeTab === 'project' && (
              <div className="grid gap-3 md:grid-cols-2 mt-6">
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
                  <div className="mt-3 rounded-xl bg-slate-50 p-4 text-sm">Today's generation: 2,340 kWh</div>
                </Card>
              </div>
              )}

              {activeTab === 'matching' && (
                <div className="mt-3 grid gap-4 md:grid-cols-3">
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
                        <PrimaryButton onClick={() => { onGoProject && onGoProject(); }} className="w-full">
                          Proceed & Pay <Banknote className="h-4 w-4" />
                        </PrimaryButton>
                        <GhostButton onClick={() => { setSelectedCompany(c); setActiveTab('financing'); }}>
                          Apply for Financing <HandCoins className="h-4 w-4" />
                        </GhostButton>
                        <button 
                          onClick={() => alert('A clarification request was sent.')} 
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200"
                        >
                          Request More Info <InfoIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {activeTab === 'financing' && (
                <div className="mt-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Financing Application</h3>
                    <Pill variant="info">Application: {selectedApplication.projectName}</Pill>
                  </div>
                  <Card>
                    <div className="mb-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800"><p className="font-medium">Options</p><ul className="mt-2 list-inside list-disc space-y-1"><li><span className="font-medium">PPA:</span> Pay per kWh generated, no upfront cost.</li><li><span className="font-medium">Solar Leasing:</span> Fixed monthly leasing fee.</li></ul></div>
                    <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={(e)=>{ e.preventDefault(); if(!(finType && finOrg)) return; alert(`Financing submitted to ${finOrg} (${finType})`); }}>
                      <Select label="Financing type" value={finType} onChange={setFinType} required options={["PPA","Solar Leasing"]} />
                      <Select label="Institution" value={finOrg} onChange={setFinOrg} required options={["QDB","QNB","Kahramaa"]} />
                      <TextArea label="Notes" value={finNotes} onChange={setFinNotes} placeholder="Any additional context..." />
                      <div className="md:col-span-2 flex items-center gap-3 pt-2"><PrimaryButton type="submit">Submit Financing Request</PrimaryButton><GhostButton onClick={()=> setActiveTab('matching')}>Cancel</GhostButton></div>
                    </form>
                  </Card>
                </div>
              )}

              {deleteConfirm === selectedApplication.id && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800 font-medium">⚠️ Delete Confirmation</p>
                  <p className="text-sm text-red-700 mt-1">
                    Are you sure you want to delete "{selectedApplication.projectName}"? 
                    This action cannot be undone.
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => handleDeleteApplication(selectedApplication.id)}
                      disabled={deleting}
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 disabled:opacity-50"
                    >
                      {deleting ? "Deleting..." : "Yes, Delete"}
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      disabled={deleting}
                      className="px-3 py-1 bg-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-300 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <p className="text-xs text-slate-500">
                Notifications (email/SMS) will be sent on status changes in production.
              </p>
          </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-600">Select an application to view details</p>
        </div>
          )}
      </Card>
    </div>
  );
};

export default TicketStatus;
