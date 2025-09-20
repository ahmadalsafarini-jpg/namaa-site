import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, Upload, FileText, Trash2, Plus } from "lucide-react";
import { Card, PrimaryButton, GhostButton, Input, Select, TextArea, Pill, Progress } from "../ui";
import { STATUS_FLOW } from "../../constants";
import { progressForStatus, formatDate } from "../../utils";
import { updateApplication, uploadFile } from "../../firebase/realtime-db";

const ClientDetail = ({ application, onBack, onSave }) => {
  const [editedApp, setEditedApp] = useState(application);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newDocument, setNewDocument] = useState({ name: "", file: null });

  useEffect(() => {
    setEditedApp(application);
  }, [application]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateApplication(application.id, editedApp);
      onSave(editedApp);
      alert('Application updated successfully!');
    } catch (error) {
      console.error('Error saving application:', error);
      alert('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (category) => {
    if (!newDocument.file) return;
    
    setUploading(true);
    try {
      const result = await uploadFile(newDocument.file, application.userId, application.id);
      if (result.success) {
        const updatedFiles = {
          ...editedApp.files,
          [category]: [
            ...(editedApp.files?.[category] || []),
            {
              name: newDocument.name || newDocument.file.name,
              url: result.downloadURL,
              size: result.size,
              type: result.type
            }
          ]
        };
        setEditedApp({ ...editedApp, files: updatedFiles });
        setNewDocument({ name: "", file: null });
        alert('File uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (category, index) => {
    const updatedFiles = { ...editedApp.files };
    updatedFiles[category] = updatedFiles[category].filter((_, i) => i !== index);
    setEditedApp({ ...editedApp, files: updatedFiles });
  };

  const progress = progressForStatus(editedApp.status);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{editedApp.projectName}</h1>
                <p className="text-slate-600">Manage client application and documents</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Pill variant={editedApp.status === "Completed" ? "success" : "info"}>
                {editedApp.status}
              </Pill>
              <PrimaryButton onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Project Name"
                  value={editedApp.projectName || ""}
                  onChange={(value) => setEditedApp({ ...editedApp, projectName: value })}
                />
                <Select
                  label="Facility Type"
                  value={editedApp.facilityType || ""}
                  onChange={(value) => setEditedApp({ ...editedApp, facilityType: value })}
                  options={["Commercial", "Industrial", "Educational", "Healthcare", "Agricultural", "Residential"]}
                />
                <Select
                  label="Location"
                  value={editedApp.location || ""}
                  onChange={(value) => setEditedApp({ ...editedApp, location: value })}
                  options={["Qatar", "UAE", "Saudi Arabia", "Kuwait", "Bahrain", "Oman"]}
                />
                <Select
                  label="System Type"
                  value={editedApp.systemType || ""}
                  onChange={(value) => setEditedApp({ ...editedApp, systemType: value })}
                  options={["On-grid", "Off-grid", "Hybrid"]}
                />
                <Input
                  label="Load Profile (kWh/month)"
                  value={editedApp.loadProfile || ""}
                  onChange={(value) => setEditedApp({ ...editedApp, loadProfile: value })}
                />
                <Select
                  label="Status"
                  value={editedApp.status || ""}
                  onChange={(value) => setEditedApp({ ...editedApp, status: value })}
                  options={STATUS_FLOW}
                />
              </div>
              <TextArea
                label="Notes"
                value={editedApp.notes || ""}
                onChange={(value) => setEditedApp({ ...editedApp, notes: value })}
                placeholder="Additional notes about this application..."
              />
            </Card>

            {/* Progress */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">Project Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress: {Math.round(progress)}%</span>
                    <span>{editedApp.status}</span>
                  </div>
                  <Progress value={progress} />
                </div>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
                  {STATUS_FLOW.map((status) => (
                    <div
                      key={status}
                      className={`rounded-xl border px-3 py-2 text-center text-xs ${
                        STATUS_FLOW.indexOf(status) <= STATUS_FLOW.indexOf(editedApp.status)
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

            {/* Documents Management */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">Documents Management</h3>
              
              {/* Upload New Document */}
              <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                <h4 className="font-medium mb-3">Upload New Document</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    label="Document Name"
                    value={newDocument.name}
                    onChange={(value) => setNewDocument({ ...newDocument, name: value })}
                    placeholder="e.g., Design Report"
                  />
                  <div>
                    <label className="block text-sm text-slate-600 mb-2">File</label>
                    <input
                      type="file"
                      onChange={(e) => setNewDocument({ ...newDocument, file: e.target.files[0] })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div className="flex items-end">
                    <PrimaryButton
                      onClick={() => handleFileUpload('documents')}
                      disabled={!newDocument.file || uploading}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading ? "Uploading..." : "Upload"}
                    </PrimaryButton>
                  </div>
                </div>
              </div>

              {/* Document Categories */}
              {['bills', 'photos', 'load', 'documents'].map((category) => (
                <div key={category} className="mb-4">
                  <h4 className="font-medium capitalize mb-2">
                    {category === 'documents' ? 'Project Documents' : `${category} Files`}
                  </h4>
                  <div className="space-y-2">
                    {(editedApp.files?.[category] || []).map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-slate-500" />
                          <div>
                            <div className="font-medium text-sm">{file.name}</div>
                            <div className="text-xs text-slate-500">
                              {Math.round(file.size / 1024)} KB
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            View
                          </a>
                          <button
                            onClick={() => removeFile(category, index)}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {(!editedApp.files?.[category] || editedApp.files[category].length === 0) && (
                      <div className="text-sm text-slate-500 italic">No {category} files uploaded</div>
                    )}
                  </div>
                </div>
              ))}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Client Info */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">Client Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-slate-600">User ID:</span>
                  <div className="font-medium">{application.userId || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-slate-600">Created:</span>
                  <div className="font-medium">
                    {application.createdAt ? new Date(application.createdAt).toLocaleDateString() : 'Unknown'}
                  </div>
                </div>
                <div>
                  <span className="text-slate-600">Last Updated:</span>
                  <div className="font-medium">
                    {application.updatedAt ? new Date(application.updatedAt).toLocaleDateString() : 'Unknown'}
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <GhostButton 
                  onClick={() => setEditedApp({ ...editedApp, status: "Under Review" })}
                  className="w-full justify-start"
                >
                  Mark Under Review
                </GhostButton>
                <GhostButton 
                  onClick={() => setEditedApp({ ...editedApp, status: "Matched" })}
                  className="w-full justify-start"
                >
                  Mark Matched
                </GhostButton>
                <GhostButton 
                  onClick={() => setEditedApp({ ...editedApp, status: "Approved" })}
                  className="w-full justify-start"
                >
                  Mark Approved
                </GhostButton>
                <GhostButton 
                  onClick={() => setEditedApp({ ...editedApp, status: "Completed" })}
                  className="w-full justify-start"
                >
                  Mark Completed
                </GhostButton>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;
