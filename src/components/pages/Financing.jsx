import { useState } from "react";
import { Card, PrimaryButton, GhostButton, Select, TextArea, Pill } from "../ui";

const Financing = ({ application, company, onSubmit, onCancel }) => {
  const [type, setType] = useState("");
  const [org, setOrg] = useState("");
  const [notes, setNotes] = useState("");
  const can = type && org;
  
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Financing Application</h2>
        <Pill variant="info">Application: {application.projectName}</Pill>
      </div>
      <Card>
        <div className="mb-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
          <p className="font-medium">Options</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li><span className="font-medium">PPA:</span> Pay per kWh generated, no upfront cost.</li>
            <li><span className="font-medium">Solar Leasing:</span> Fixed monthly leasing fee.</li>
          </ul>
        </div>
        <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={(e) => { 
          e.preventDefault(); 
          if (!can) return; 
          onSubmit({ type, org, notes, company }); 
        }}>
          <Select 
            label="Financing type" 
            value={type} 
            onChange={setType} 
            required 
            options={["PPA", "Solar Leasing"]} 
          />
          <Select 
            label="Institution" 
            value={org} 
            onChange={setOrg} 
            required 
            options={["QDB", "QNB", "Kahramaa"]} 
          />
          <TextArea 
            label="Notes" 
            value={notes} 
            onChange={setNotes} 
            placeholder="Any additional context..." 
          />
          <div className="md:col-span-2 flex items-center gap-3 pt-2">
            <PrimaryButton type="submit">Submit Financing Request</PrimaryButton>
            <GhostButton onClick={onCancel}>Cancel</GhostButton>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Financing;
