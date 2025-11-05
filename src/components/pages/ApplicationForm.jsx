import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Building, MapPin, Zap, FileText, Image, BarChart3, Check, AlertCircle, Loader, ArrowLeft, Sparkles, CheckCircle } from "lucide-react";
import { Card, PrimaryButton, GhostButton, Input, Select, TextArea, FilePicker, MapPicker } from "../ui";
import { formatDate } from "../../utils";
import { createApplication, updateApplication, uploadMultipleFiles } from "../../firebase/realtime-db";
import { COUNTRIES } from "../../constants";

const ApplicationForm = ({ onSubmit, onCancel, user }) => {
  const [f, setF] = useState({ 
    projectName: "", 
    facilityType: "", 
    location: "", 
    coordinates: null,
    loadProfile: "", 
    systemType: "", 
    notes: "" 
  });
  const [files, setFiles] = useState({ bills: [], photos: [], load: [] });
  const [uploadedFiles, setUploadedFiles] = useState({ bills: [], photos: [], load: [] });
  const [uploadingFiles, setUploadingFiles] = useState({ bills: [], photos: [], load: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const can = f.projectName && f.facilityType && f.location && f.systemType;
  
  // Function to upload files immediately when selected
  const uploadFilesImmediately = async (fileList, category) => {
    if (!fileList || fileList.length === 0) {
      setUploadedFiles(prev => ({
        ...prev,
        [category]: []
      }));
      return;
    }
    
    const currentUploadedFiles = uploadedFiles[category] || [];
    const currentUploadedNames = currentUploadedFiles.map(f => f.fileName);
    const newFiles = fileList.filter(file => !currentUploadedNames.includes(file.name));
    
    if (newFiles.length === 0) {
      return;
    }
    
    const tempAppId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    setUploadingFiles(prev => ({
      ...prev,
      [category]: [...prev[category], ...newFiles]
    }));
    
    try {
      const uploadResult = await uploadMultipleFiles(newFiles, user?.uid || "anonymous", tempAppId, category);
      
      if (uploadResult.success) {
        setUploadedFiles(prev => ({
          ...prev,
          [category]: [...prev[category], ...uploadResult.files]
        }));
      } else {
        console.error(`Failed to upload ${category} files:`, uploadResult.errors);
        setError(`Failed to upload some ${category} files: ${uploadResult.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(`Error uploading ${category} files:`, error);
      setError(`Error uploading ${category} files: ${error.message}`);
    } finally {
      setUploadingFiles(prev => ({
        ...prev,
        [category]: prev[category].filter(file => !newFiles.includes(file))
      }));
    }
  };

  useEffect(() => {
    Object.keys(files).forEach(category => {
      const selectedFiles = files[category] || [];
      const selectedNames = selectedFiles.map(f => f.name);
      
      setUploadedFiles(prev => ({
        ...prev,
        [category]: (prev[category] || []).filter(uploadedFile => 
          selectedNames.includes(uploadedFile.fileName)
        )
      }));
    });
  }, [files]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
        setF({ 
          projectName: "", 
          facilityType: "", 
          location: "", 
          coordinates: null,
          loadProfile: "", 
          systemType: "", 
          notes: "" 
        });
        setFiles({ bills: [], photos: [], load: [] });
        setUploadedFiles({ bills: [], photos: [], load: [] });
        setUploadingFiles({ bills: [], photos: [], load: [] });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = async (e) => {
          e.preventDefault();
    if (!can || loading || success) return;
    
    const isUploading = Object.values(uploadingFiles).some(files => files.length > 0);
    if (isUploading) {
      setError("Please wait for file uploads to complete before submitting.");
      return;
    }
          
          setLoading(true);
          setError("");
    setSuccess(false);
    
    const timeoutId = setTimeout(() => {
      console.warn("Form submission timeout - forcing loading to false");
      setLoading(false);
    }, 30000);
    
    try {
      const applicationData = { 
        projectName: f.projectName,
        facilityType: f.facilityType,
        location: f.location,
        coordinates: f.coordinates,
        loadProfile: f.loadProfile,
              systemType: f.systemType, 
        notes: f.notes,
        files: [],
        userId: user?.uid || "anonymous",
        userEmail: user?.email || "",
        userName: user?.name || ""
      };
      
      const applicationResult = await createApplication(applicationData);
      
      if (applicationResult.success) {
        const organizedFiles = {
          bills: uploadedFiles.bills.map(file => ({
            name: file.fileName,
            url: file.downloadURL,
            size: file.size,
            type: file.type,
            path: file.filePath
          })),
          photos: uploadedFiles.photos.map(file => ({
            name: file.fileName,
            url: file.downloadURL,
            size: file.size,
            type: file.type,
            path: file.filePath
          })),
          load: uploadedFiles.load.map(file => ({
            name: file.fileName,
            url: file.downloadURL,
            size: file.size,
            type: file.type,
            path: file.filePath
          }))
        };
        
        const updateResult = await updateApplication(applicationResult.id, {
          files: organizedFiles
        });
        
        if (updateResult.success) {
          setSuccess(true);
          setLoading(false);
          
          setTimeout(() => {
              onSubmit({ 
              id: applicationResult.id,
              ...applicationData,
              files: organizedFiles
              });
          }, 100);
        } else {
          setError(`Failed to update application with files: ${updateResult.error}`);
          setLoading(false);
        }
            } else {
        setError(`Failed to save application: ${applicationResult.error}`);
        setLoading(false);
            }
          } catch (err) {
      console.error("Form submission error:", err);
            setError("An unexpected error occurred. Please try again.");
          } finally {
      clearTimeout(timeoutId);
            setLoading(false);
          }
  };

  const FileUploadSection = ({ category, icon: Icon, label, hint }) => {
    const isUploading = uploadingFiles[category].length > 0;
    const uploadCount = uploadedFiles[category].length;
    
    return (
      <div className="relative">
        <label className="block text-sm font-medium text-slate-700 mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Icon className="h-4 w-4 text-emerald-600" />
            </div>
            <span>{label}</span>
            {hint && <span className="text-slate-500 text-xs">({hint})</span>}
          </div>
        </label>
        
        <FilePicker 
          id={category}
          caption={uploadCount > 0 ? `${uploadCount} file(s) selected` : "Choose files"}
          count={files[category].length} 
          onChange={(list) => {
            setFiles((s) => ({ ...s, [category]: list }));
            uploadFilesImmediately(list, category);
          }} 
        />
        
        <AnimatePresence>
          {isUploading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 mt-2 text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200"
            >
              <Loader className="h-3 w-3 animate-spin" />
              Uploading {uploadingFiles[category].length} file(s)...
            </motion.div>
          )}
          
          {!isUploading && uploadCount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 mt-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200"
            >
              <CheckCircle className="h-3 w-3" />
              {uploadCount} file(s) uploaded successfully
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Gradient Mesh Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50"></div>
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 -right-40 w-96 h-96 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-0 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-1/2 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-emerald-600 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <FileText className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
                New Solar Application
              </h1>
              <p className="mt-1 text-slate-600">
                Complete the form below to start your solar journey
              </p>
            </div>
          </div>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <Card className="bg-emerald-50 border-2 border-emerald-200">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-12 w-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                    <Check className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-emerald-900">Application Submitted Successfully!</h3>
                    <p className="text-sm text-emerald-700 mt-1">
                      Your application has been saved and a ticket has been created for tracking. You'll be redirected to your dashboard shortly.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <Card className="bg-red-50 border-2 border-red-200">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-12 w-12 bg-red-500 rounded-xl flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-red-900">Submission Failed</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
            </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Card className="p-8 shadow-2xl border-2 border-slate-100">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section 1: Project Details */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Building className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Project Details</h2>
                    <p className="text-sm text-slate-600">Tell us about your facility</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-emerald-500" />
                        Project Name *
                      </div>
                    </label>
                    <Input 
                      value={f.projectName} 
                      onChange={(v) => setF((s) => ({ ...s, projectName: v }))} 
                      required
                      placeholder="e.g., Al Wakrah Manufacturing Plant"
                      className="h-12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-emerald-500" />
                        Facility Type *
                      </div>
                    </label>
                    <Select 
                      value={f.facilityType} 
                      onChange={(v) => setF((s) => ({ ...s, facilityType: v }))} 
                      required 
                      options={["Villa (Residential)", "Flat (Residential)", "Commercial", "Industrial (Subsidized)", "Bulk Industrial", "Hotel", "Government", "Educational", "Healthcare", "Productive Farms", "EZAB (Livestock)", "Water Tanker"]}
                      className="h-12"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-emerald-500" />
                        Pin Your Location on Map *
                      </div>
                    </label>
                    <MapPicker
                      value={f.coordinates}
                      onChange={(coords) => setF((s) => ({ 
                        ...s, 
                        coordinates: coords,
                        location: `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`
                      }))}
                      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-emerald-500" />
                        Load Profile (kWh/month)
                      </div>
                    </label>
          <Input 
            value={f.loadProfile} 
            onChange={(v) => setF((s) => ({ ...s, loadProfile: v }))} 
            placeholder="e.g., 120,000" 
                      className="h-12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-emerald-500" />
                        System Type *
                      </div>
                    </label>
          <Select 
            value={f.systemType} 
            onChange={(v) => setF((s) => ({ ...s, systemType: v }))} 
            required 
            options={["On-grid", "Off-grid", "Hybrid"]} 
                      className="h-12"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-emerald-500" />
                        Additional Notes
                      </div>
                    </label>
          <TextArea 
            value={f.notes} 
            onChange={(v) => setF((s) => ({ ...s, notes: v }))} 
                      placeholder="Any specific requirements or details we should know about your project..."
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t-2 border-slate-100"></div>

              {/* Section 2: Document Upload */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Upload className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Upload Documents</h2>
                    <p className="text-sm text-slate-600">Attach relevant files to support your application</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FileUploadSection 
                    category="bills"
                    icon={FileText}
                    label="Energy Bills"
                    hint="Last 12 months"
                  />
                  
                  <FileUploadSection 
                    category="photos"
                    icon={Image}
                    label="Site Photos"
                    hint="Facility images"
                  />
                  
                  <FileUploadSection 
                    category="load"
                    icon={BarChart3}
                    label="Load Data"
                    hint="Optional"
              />
            </div>
          </div>

              {/* Divider */}
              <div className="border-t-2 border-slate-100"></div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
                <div className="text-sm text-slate-600">
                  {Object.values(uploadingFiles).some(files => files.length > 0) ? (
                    <span className="flex items-center gap-2 text-blue-600">
                      <Loader className="h-4 w-4 animate-spin" />
                      Please wait for all files to upload...
                    </span>
                  ) : success ? (
                    <span className="flex items-center gap-2 text-emerald-600">
                      <Check className="h-4 w-4" />
                      Form will reset automatically
                    </span>
                  ) : (
                    <span>* Required fields</span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-medium hover:border-emerald-300 hover:bg-emerald-50 transition-all"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    disabled={loading || success || !can || Object.values(uploadingFiles).some(files => files.length > 0)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loading ? (
                      <>
                        <Loader className="h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : success ? (
                      <>
                        <Check className="h-5 w-5" />
                        Submitted Successfully!
                      </>
                    ) : Object.values(uploadingFiles).some(files => files.length > 0) ? (
                      <>
                        <Loader className="h-5 w-5 animate-spin" />
                        Uploading Files...
                      </>
                    ) : (
                      <>
                        <Upload className="h-5 w-5" />
                        Submit Application
                      </>
                    )}
                  </button>
                </div>
          </div>
        </form>
      </Card>
        </motion.div>

        {/* Info Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8 text-center text-sm text-slate-600"
        >
          <p>
            Upon submission, a tracking ticket will be automatically generated. 
            You'll receive updates on your application status via email.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ApplicationForm;
