import { useState, useEffect } from "react";
import { ArrowLeft, Save, Upload, FileText, Download, Loader2 } from "lucide-react";
import { Card, PrimaryButton, GhostButton, Input, Select, TextArea, Progress } from "../ui";
import { STATUS_FLOW } from "../../constants";
import { progressForStatus } from "../../utils";
import { updateApplication, uploadFile } from "../../firebase/realtime-db";

const EnergyCompanyClientDetail = ({ client, company, onBack }) => {
  const [editedClient, setEditedClient] = useState(client);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadCategory, setUploadCategory] = useState("");

  useEffect(() => {
    setEditedClient(client);
  }, [client]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateApplication(editedClient.id, {
        projectName: editedClient.projectName,
        facilityType: editedClient.facilityType,
        location: editedClient.location,
        systemType: editedClient.systemType,
        status: editedClient.status,
        notes: editedClient.notes,
        loadProfile: editedClient.loadProfile
      });

      if (result.success) {
        alert("Client information updated successfully!");
      } else {
        alert(`Failed to update: ${result.error}`);
      }
    } catch (error) {
      console.error("Error saving client:", error);
      alert("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e, category) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadCategory(category);

    try {
      const file = files[0];
      const result = await uploadFile(file, editedClient.userId, editedClient.id, category);

      if (result.success) {
        // Update local state with new file
        const updatedFiles = {
          ...editedClient.files,
          [category]: [...(editedClient.files?.[category] || []), result.data]
        };

        await updateApplication(editedClient.id, { files: updatedFiles });
        setEditedClient({ ...editedClient, files: updatedFiles });
        
        alert("File uploaded successfully!");
      } else {
        alert(`Upload failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred during upload");
    } finally {
      setUploading(false);
      setUploadCategory("");
      e.target.value = ""; // Reset input
    }
  };

  const progress = progressForStatus(editedClient.status);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Client Details</h1>
                <p className="text-slate-600">{company.name}</p>
              </div>
            </div>
            <PrimaryButton onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </PrimaryButton>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Basic Information */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Project Name"
                value={editedClient.projectName || ""}
                onChange={(value) => setEditedClient({ ...editedClient, projectName: value })}
              />
              <Input
                label="Facility Type"
                value={editedClient.facilityType || ""}
                onChange={(value) => setEditedClient({ ...editedClient, facilityType: value })}
              />
              <Input
                label="Location"
                value={editedClient.location || ""}
                onChange={(value) => setEditedClient({ ...editedClient, location: value })}
              />
              <Input
                label="System Type"
                value={editedClient.systemType || ""}
                onChange={(value) => setEditedClient({ ...editedClient, systemType: value })}
              />
              <div className="md:col-span-2">
                <Select
                  label="Status"
                  value={editedClient.status || ""}
                  onChange={(value) => setEditedClient({ ...editedClient, status: value })}
                  options={STATUS_FLOW}
                />
              </div>
              <div className="md:col-span-2">
                <TextArea
                  label="Notes"
                  value={editedClient.notes || ""}
                  onChange={(value) => setEditedClient({ ...editedClient, notes: value })}
                  placeholder="Add notes about this client..."
                />
              </div>
              <div className="md:col-span-2">
                <Input
                  label="Load Profile"
                  value={editedClient.loadProfile || ""}
                  onChange={(value) => setEditedClient({ ...editedClient, loadProfile: value })}
                  placeholder="e.g., Average Monthly: 1000 kWh"
                />
              </div>
            </div>
          </Card>

          {/* Progress */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Project Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Overall Progress</span>
                  <span className="text-sm font-medium">{progress.toFixed(0)}%</span>
                </div>
                <Progress value={progress} />
              </div>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
                {STATUS_FLOW.map((status) => (
                  <div
                    key={status}
                    className={`rounded-xl border px-3 py-2 text-center text-xs ${
                      STATUS_FLOW.indexOf(status) <= STATUS_FLOW.indexOf(editedClient.status)
                        ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-white text-slate-500"
                    }`}
                  >
                    {status}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Uploaded Files */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Documents & Files</h3>
            
            {/* Energy Bills */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-slate-700">Energy Bills</h4>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload(e, 'bills')}
                    disabled={uploading}
                  />
                  <GhostButton as="span" disabled={uploading}>
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading && uploadCategory === 'bills' ? 'Uploading...' : 'Upload'}
                  </GhostButton>
                </label>
              </div>
              {editedClient.files?.bills && editedClient.files.bills.length > 0 ? (
                <div className="space-y-2">
                  {editedClient.files.bills.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-500" />
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-slate-500">({Math.round(file.size / 1024)} KB)</span>
                      </div>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                      >
                        <Download className="h-3 w-3" />
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No files uploaded yet</p>
              )}
            </div>

            {/* Site Photos */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-slate-700">Site Photos</h4>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'photos')}
                    disabled={uploading}
                  />
                  <GhostButton as="span" disabled={uploading}>
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading && uploadCategory === 'photos' ? 'Uploading...' : 'Upload'}
                  </GhostButton>
                </label>
              </div>
              {editedClient.files?.photos && editedClient.files.photos.length > 0 ? (
                <div className="space-y-2">
                  {editedClient.files.photos.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-500" />
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-slate-500">({Math.round(file.size / 1024)} KB)</span>
                      </div>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                      >
                        <Download className="h-3 w-3" />
                        View
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No photos uploaded yet</p>
              )}
            </div>

            {/* Load Data */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-slate-700">Load Data</h4>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.csv,.xlsx,.xls"
                    onChange={(e) => handleFileUpload(e, 'load')}
                    disabled={uploading}
                  />
                  <GhostButton as="span" disabled={uploading}>
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading && uploadCategory === 'load' ? 'Uploading...' : 'Upload'}
                  </GhostButton>
                </label>
              </div>
              {editedClient.files?.load && editedClient.files.load.length > 0 ? (
                <div className="space-y-2">
                  {editedClient.files.load.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-500" />
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-slate-500">({Math.round(file.size / 1024)} KB)</span>
                      </div>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                      >
                        <Download className="h-3 w-3" />
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No load data uploaded yet</p>
              )}
            </div>
          </Card>

          {/* Client Information */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Client Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600">User ID:</span>
                <div className="font-medium mt-1">{editedClient.userId}</div>
              </div>
              <div>
                <span className="text-slate-600">Application ID:</span>
                <div className="font-medium mt-1">{editedClient.id}</div>
              </div>
              <div>
                <span className="text-slate-600">Created:</span>
                <div className="font-medium mt-1">
                  {editedClient.createdAt ? new Date(editedClient.createdAt).toLocaleString() : 'Unknown'}
                </div>
              </div>
              <div>
                <span className="text-slate-600">Last Updated:</span>
                <div className="font-medium mt-1">
                  {editedClient.updatedAt ? new Date(editedClient.updatedAt).toLocaleString() : 'Unknown'}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnergyCompanyClientDetail;

