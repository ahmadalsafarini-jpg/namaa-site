import { useState, useEffect } from "react";
import { Loader2, CalendarDays, MapPin, Building, Zap, Upload, Plus } from "lucide-react";
import { Card, PrimaryButton, GhostButton, Pill, Progress } from "../ui";
import { STATUS_FLOW } from "../../constants";
import { progressForStatus, formatDate } from "../../utils";
import { getUserApplications, subscribeToUserApplications } from "../../firebase/realtime-db";

const TicketStatus = ({ user, onAdvance, onGoMatching, onNewApplication, loading = false, selectedApplicationId = null }) => {
  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    if (!user?.uid) return;

    setApplicationsLoading(true);
    
    // Subscribe to real-time updates for applications
    const unsubscribe = subscribeToUserApplications(user.uid, (apps) => {
      setApplications(apps || []);
      setApplicationsLoading(false);
      
      // Set the selected application based on selectedApplicationId or first application
      if (apps && apps.length > 0) {
        if (selectedApplicationId) {
          const foundApp = apps.find(app => app.id === selectedApplicationId);
          if (foundApp) {
            setSelectedApplication(foundApp);
          } else {
            setSelectedApplication(apps[0]);
          }
        } else if (!selectedApplication) {
          setSelectedApplication(apps[0]);
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
      } else {
        setSelectedApplication(applications[0]);
      }
    }
  }, [selectedApplicationId, applications]);

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

      <div className="grid gap-6 lg:grid-cols-[1fr,2fr]">
        {/* Applications List */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Your Applications</h3>
            <GhostButton 
              onClick={onNewApplication}
              className="flex items-center justify-center w-6 h-6 p-0"
            >
              <Plus className="h-3 w-3" />
            </GhostButton>
          </div>
          <div className="space-y-3">
            {applications.map((app) => (
              <div 
                key={app.id} 
                className={`rounded-xl border p-3 cursor-pointer transition-colors ${
                  selectedApplication?.id === app.id 
                    ? "border-blue-300 bg-blue-50" 
                    : "border-slate-200 hover:border-slate-300"
                }`}
                onClick={() => setSelectedApplication(app)}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">{app.projectName}</div>
                  <Pill variant={app.status === "Completed" ? "success" : "info"}>{app.status}</Pill>
                </div>
                <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
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
                <div className="mt-2">
                  <Progress value={progressForStatus(app.status)} />
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Submitted: {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Unknown'}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Selected Application Details */}
        <Card>
          {selectedApplication ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{selectedApplication.projectName}</h3>
                <Pill variant={selectedApplication.status === "Completed" ? "success" : "info"}>
                  {selectedApplication.status}
                </Pill>
              </div>
              
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

               {selectedApplication.notes && (
                 <div>
                   <span className="text-slate-600 text-sm">Notes:</span>
                   <div className="text-sm mt-1 p-2 bg-slate-50 rounded-lg">{selectedApplication.notes}</div>
                 </div>
               )}

               {selectedApplication.files && (
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

              <div>
                <span className="text-slate-600 text-sm">Progress:</span>
                <div className="mt-2"><Progress value={progress} /></div>
          </div>

              <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
            {STATUS_FLOW.map((s) => (
              <div key={s} className={`rounded-xl border px-3 py-2 text-center text-xs ${
                    STATUS_FLOW.indexOf(s) <= STATUS_FLOW.indexOf(selectedApplication.status)
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-white text-slate-500"
              }`}>
                {s}
              </div>
            ))}
          </div>

              <div className="flex flex-wrap items-center gap-3 pt-4">
                {selectedApplication.status !== "Completed" && (
                  <PrimaryButton onClick={() => onAdvance(selectedApplication)}>
                    Advance Status
              </PrimaryButton>
            )}
                {selectedApplication.status === "Matched" && (
                  <GhostButton onClick={onGoMatching}>View Matching & Offers</GhostButton>
                )}
              </div>

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
    </div>
  );
};

export default TicketStatus;
