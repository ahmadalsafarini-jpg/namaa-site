import { useState, useEffect } from "react";
import { Mail, CalendarDays } from "lucide-react";
import { Card, PrimaryButton, Pill, Progress } from "../ui";
import { formatDate, progressForStatus } from "../../utils";
import { getUserTickets, subscribeToUserTickets } from "../../firebase/firestore";

const Dashboard = ({ user, tickets, onOpen }) => {
  const [firestoreTickets, setFirestoreTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    // Subscribe to real-time updates
    const unsubscribe = subscribeToUserTickets(user.uid, (tickets) => {
      setFirestoreTickets(tickets);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // Use Firestore tickets if available, fallback to props
  const displayTickets = firestoreTickets.length > 0 ? firestoreTickets : tickets;

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
        <h3 className="font-semibold">Your tickets</h3>
        <div className="mt-3 grid gap-3">
          {loading && <p className="text-sm text-slate-600">Loading tickets...</p>}
          {!loading && displayTickets.length === 0 && <p className="text-sm text-slate-600">No tickets yet. Create your first application.</p>}
          {displayTickets.map((t) => (
            <div key={t.id} className="rounded-xl border border-slate-200 p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">{t.name}</div>
                <Pill variant={t.status === "Completed" ? "success" : "info"}>{t.status}</Pill>
              </div>
              <div className="mt-2"><Progress value={progressForStatus(t.status)} /></div>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                <span>{t.systemType}</span>
                <span>Submitted: {t.submittedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
  );
};

export default Dashboard;
