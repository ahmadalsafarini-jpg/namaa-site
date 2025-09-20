import { useState, useEffect } from "react";
import { Mail, CalendarDays, Building, MapPin, Zap } from "lucide-react";
import { Card, PrimaryButton, Pill, Progress } from "../ui";
import { formatDate, progressForStatus } from "../../utils";
import { getUserApplications, subscribeToUserApplications } from "../../firebase/realtime-db";

const Dashboard = ({ user, applications, onOpen, onApplicationClick }) => {
  const [firestoreApplications, setFirestoreApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    // Subscribe to real-time updates for applications
    const unsubscribe = subscribeToUserApplications(user.uid, (apps) => {
      setFirestoreApplications(apps || []);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // Use Firestore applications if available, fallback to props
  const displayApplications = firestoreApplications.length > 0 ? firestoreApplications : applications;

  return (
  <div className="mx-auto max-w-6xl px-4 py-10">
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-2xl font-semibold">Welcome, {user.name.split(" ")[0]} 👋</h2>
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <Mail className="h-4 w-4" /> {user.email}
      </div>
    </div>

    <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
      <Card>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Start a new application</h3>
          <Pill variant="outline"><CalendarDays className="h-4 w-4" /> {formatDate()}</Pill>
        </div>
        <p className="mt-2 text-sm text-slate-600">Provide facility details, upload bills and choose your preferred system.</p>
        <div className="mt-4">
          <PrimaryButton onClick={onOpen}>Open Application Form</PrimaryButton>
        </div>
      </Card>
      <Card>
        <h3 className="font-semibold">Your applications</h3>
        <div className="mt-3 grid gap-3">
          {loading && <p className="text-sm text-slate-600">Loading applications...</p>}
          {!loading && displayApplications.length === 0 && <p className="text-sm text-slate-600">No applications yet. Create your first application.</p>}
          {displayApplications.map((app) => (
            <button
              key={app.id}
              onClick={() => onApplicationClick && onApplicationClick(app)}
              className="w-full rounded-xl border border-slate-200 p-3 text-left hover:border-slate-300 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="font-medium">{app.projectName}</div>
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
              <div className="mt-2"><Progress value={progressForStatus(app.status)} /></div>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                <span>{app.systemType}</span>
                <span>Submitted: {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Unknown'}</span>
              </div>
            </button>
          ))}
        </div>
      </Card>
    </div>
  </div>
  );
};

export default Dashboard;
