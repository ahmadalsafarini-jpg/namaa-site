import { useState } from "react";
import { Upload } from "lucide-react";
import { Card, PrimaryButton, GhostButton, Input, Select, TextArea, FilePicker } from "../ui";
import { formatDate } from "../../utils";
import { createTicket } from "../../firebase/firestore";

const ApplicationForm = ({ onSubmit, onCancel, user }) => {
  const [f, setF] = useState({ 
    projectName: "", 
    facilityType: "", 
    location: "", 
    loadProfile: "", 
    systemType: "", 
    notes: "" 
  });
  const [files, setFiles] = useState({ bills: [], photos: [], load: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const can = f.projectName && f.facilityType && f.location && f.systemType;
  
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Application Form</h2>
        <GhostButton onClick={onCancel}>Cancel</GhostButton>
      </div>
      <Card>
        <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={async (e) => {
          e.preventDefault();
          if (!can || loading) return;
          
          setLoading(true);
          setError("");
          
          try {
            const ticketData = { 
              name: f.projectName, 
              systemType: f.systemType, 
              status: "Pending", 
              submittedAt: formatDate(), 
              files, 
              details: f,
              userId: user?.uid || "anonymous"
            };
            
            // Save to Firestore
            const result = await createTicket(ticketData);
            
            if (result.success) {
              // Call the original onSubmit with the Firestore ID
              onSubmit({ 
                id: result.id, 
                ...ticketData 
              });
            } else {
              setError(result.error);
            }
          } catch (err) {
            setError("An unexpected error occurred. Please try again.");
            console.error("Application submission error:", err);
          } finally {
            setLoading(false);
          }
        }}>
          {error && (
            <div className="md:col-span-2 rounded-xl bg-red-50 p-4 text-sm text-red-800">
              {error}
            </div>
          )}
          <Input label="Project name" value={f.projectName} onChange={(v) => setF((s) => ({ ...s, projectName: v }))} required />
          <Select 
            label="Facility type" 
            value={f.facilityType} 
            onChange={(v) => setF((s) => ({ ...s, facilityType: v }))} 
            required 
            options={["Commercial", "Industrial", "Educational", "Healthcare", "Agricultural"]} 
          />
          <Input label="Location" value={f.location} onChange={(v) => setF((s) => ({ ...s, location: v }))} required />
          <Input 
            label="Load profile (kWh/month)" 
            value={f.loadProfile} 
            onChange={(v) => setF((s) => ({ ...s, loadProfile: v }))} 
            placeholder="e.g., 120,000" 
          />
          <Select 
            label="System type" 
            value={f.systemType} 
            onChange={(v) => setF((s) => ({ ...s, systemType: v }))} 
            required 
            options={["On-grid", "Off-grid", "Hybrid"]} 
          />
          <TextArea 
            label="Notes" 
            value={f.notes} 
            onChange={(v) => setF((s) => ({ ...s, notes: v }))} 
            placeholder="Any specifics we should know?" 
          />

          <div className="md:col-span-2 grid gap-4">
            <div className="grid gap-2">
              <span className="text-sm text-slate-600">Upload energy bills</span>
              <FilePicker 
                id="bills" 
                caption="Choose files" 
                hint={null} 
                count={files.bills.length} 
                onChange={(list) => setFiles((s) => ({ ...s, bills: list }))} 
              />
            </div>
            <div className="grid gap-2">
              <span className="text-sm text-slate-600">Upload site photos</span>
              <FilePicker 
                id="photos" 
                caption="Choose files" 
                count={files.photos.length} 
                onChange={(list) => setFiles((s) => ({ ...s, photos: list }))} 
              />
            </div>
            <div className="grid gap-2">
              <span className="text-sm text-slate-600">Upload load data</span>
              <FilePicker 
                id="load" 
                caption="Choose files" 
                count={files.load.length} 
                onChange={(list) => setFiles((s) => ({ ...s, load: list }))} 
              />
            </div>
          </div>

          <div className="md:col-span-2 flex items-center gap-3 pt-2">
            <PrimaryButton type="submit" disabled={loading}>
              <Upload className="h-4 w-4" /> {loading ? "Submitting..." : "Submit & Create Ticket"}
            </PrimaryButton>
            <span className="text-sm text-slate-500">A ticket will be auto-generated.</span>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ApplicationForm;
