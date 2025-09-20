import { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { Card, PrimaryButton, GhostButton, Input, Select, TextArea, FilePicker } from "../ui";
import { formatDate } from "../../utils";
import { createApplication, updateApplication, uploadMultipleFiles } from "../../firebase/realtime-db";
import { COUNTRIES } from "../../constants";

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
  const [uploadedFiles, setUploadedFiles] = useState({ bills: [], photos: [], load: [] });
  const [uploadingFiles, setUploadingFiles] = useState({ bills: [], photos: [], load: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const can = f.projectName && f.facilityType && f.location && f.systemType;

  // Function to upload files immediately when selected
  const uploadFilesImmediately = async (fileList, category) => {
    if (!fileList || fileList.length === 0) {
      // Clear uploaded files if no files selected
      setUploadedFiles(prev => ({
        ...prev,
        [category]: []
      }));
      return;
    }
    
    // Find new files that haven't been uploaded yet
    const currentUploadedFiles = uploadedFiles[category] || [];
    const currentUploadedNames = currentUploadedFiles.map(f => f.fileName);
    const newFiles = fileList.filter(file => !currentUploadedNames.includes(file.name));
    
    if (newFiles.length === 0) {
      return;
    }
    
    // Generate a temporary application ID for file organization
    const tempAppId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Mark new files as uploading
    setUploadingFiles(prev => ({
      ...prev,
      [category]: [...prev[category], ...newFiles]
    }));
    
    try {
      const uploadResult = await uploadMultipleFiles(newFiles, user?.uid || "anonymous", tempAppId);
      
      if (uploadResult.success) {
        // Add only new uploaded files to the uploadedFiles state
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
      // Remove files from uploading state
      setUploadingFiles(prev => ({
        ...prev,
        [category]: prev[category].filter(file => !newFiles.includes(file))
      }));
    }
  };

  // Sync uploaded files with selected files when files change
  useEffect(() => {
    // Clean up uploaded files that are no longer selected
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

  // Clear success message after 5 seconds and reset form
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
        // Reset form after success
        setF({ 
          projectName: "", 
          facilityType: "", 
          location: "", 
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

  
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">Application Form</h2>
      </div>
      <Card>
        <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={async (e) => {
          e.preventDefault();
          if (!can || loading || success) return;
          
          // Check if files are still uploading
          const isUploading = Object.values(uploadingFiles).some(files => files.length > 0);
          if (isUploading) {
            setError("Please wait for file uploads to complete before submitting.");
            return;
          }
          
          setLoading(true);
          setError("");
          setSuccess(false);
          
          // Add a timeout to prevent infinite loading
          const timeoutId = setTimeout(() => {
            console.warn("Form submission timeout - forcing loading to false");
            setLoading(false);
          }, 30000); // 30 second timeout
          
          try {
            // First, create the application to get an ID
            const applicationData = { 
              projectName: f.projectName,
              facilityType: f.facilityType,
              location: f.location,
              loadProfile: f.loadProfile,
              systemType: f.systemType,
              notes: f.notes,
              files: [], // Will be updated with file URLs after upload
              userId: user?.uid || "anonymous",
              userEmail: user?.email || "",
              userName: user?.name || ""
            };
            
            // Create application first to get an ID
            const applicationResult = await createApplication(applicationData);
            
            if (applicationResult.success) {
              // Use pre-uploaded files
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
              
              // Update application with file URLs
              const updatedApplicationData = {
                ...applicationData,
                files: organizedFiles
              };
              
              // Update the application with file information
              const updateResult = await updateApplication(applicationResult.id, {
                files: organizedFiles
              });
              
              if (updateResult.success) {
                // Show success message
                setSuccess(true);
                
                // Set loading to false before navigation
                setLoading(false);
                
                // Add a small delay to ensure UI updates before navigation
                setTimeout(() => {
                  // Call the original onSubmit with application data
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
        }}>
          {success && (
            <div className="md:col-span-2 rounded-xl bg-green-50 p-4 text-sm text-green-800 border border-green-200">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Application submitted successfully!</span>
              </div>
              <p className="mt-1">Your application has been saved and a ticket has been created for tracking.</p>
            </div>
          )}
          
          
          {error && (
            <div className="md:col-span-2 rounded-xl bg-red-50 p-4 text-sm text-red-800 border border-red-200">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Submission failed</span>
              </div>
              <p className="mt-1">{error}</p>
            </div>
          )}
          <Input label="Project name" value={f.projectName} onChange={(v) => setF((s) => ({ ...s, projectName: v }))} required />
          <Select 
            label="Facility type" 
            value={f.facilityType} 
            onChange={(v) => setF((s) => ({ ...s, facilityType: v }))} 
            required 
            options={["Residential","Commercial", "Industrial", "Educational", "Healthcare", "Agricultural"]} 
          />
          <Select 
            label="Location" 
            value={f.location} 
            onChange={(v) => setF((s) => ({ ...s, location: v }))} 
            required 
            options={COUNTRIES} 
          />
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
                onChange={(list) => {
                  setFiles((s) => ({ ...s, bills: list }));
                  // Upload files immediately
                  uploadFilesImmediately(list, 'bills');
                }} 
              />
              {uploadingFiles.bills.length > 0 && (
                <div className="text-xs text-blue-600">
                  Uploading {uploadingFiles.bills.length} file(s)...
                </div>
              )}
              {uploadedFiles.bills.length > 0 && (
                <div className="text-xs text-green-600">
                  ✓ {uploadedFiles.bills.length} file(s) uploaded successfully
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <span className="text-sm text-slate-600">Upload site photos</span>
              <FilePicker 
                id="photos" 
                caption="Choose files" 
                count={files.photos.length} 
                onChange={(list) => {
                  setFiles((s) => ({ ...s, photos: list }));
                  // Upload files immediately
                  uploadFilesImmediately(list, 'photos');
                }} 
              />
              {uploadingFiles.photos.length > 0 && (
                <div className="text-xs text-blue-600">
                  Uploading {uploadingFiles.photos.length} file(s)...
                </div>
              )}
              {uploadedFiles.photos.length > 0 && (
                <div className="text-xs text-green-600">
                  ✓ {uploadedFiles.photos.length} file(s) uploaded successfully
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <span className="text-sm text-slate-600">Upload load data</span>
              <FilePicker 
                id="load" 
                caption="Choose files" 
                count={files.load.length} 
                onChange={(list) => {
                  setFiles((s) => ({ ...s, load: list }));
                  // Upload files immediately
                  uploadFilesImmediately(list, 'load');
                }} 
              />
              {uploadingFiles.load.length > 0 && (
                <div className="text-xs text-blue-600">
                  Uploading {uploadingFiles.load.length} file(s)...
                </div>
              )}
              {uploadedFiles.load.length > 0 && (
                <div className="text-xs text-green-600">
                  ✓ {uploadedFiles.load.length} file(s) uploaded successfully
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2 flex items-center gap-3 pt-2">
            <PrimaryButton type="submit" disabled={loading || success || Object.values(uploadingFiles).some(files => files.length > 0)}>
              <Upload className="h-4 w-4" /> 
              {Object.values(uploadingFiles).some(files => files.length > 0) 
                ? "Uploading Files... Please Wait" 
                : loading 
                  ? "Submitting..." 
                  : success 
                    ? "Submitted Successfully!" 
                    : "Submit Application"
              }
            </PrimaryButton>
            <GhostButton onClick={onCancel}>Cancel</GhostButton>
            <span className="text-sm text-slate-500">
              {Object.values(uploadingFiles).some(files => files.length > 0) 
                ? "Please wait for all files to upload before submitting." 
                : success 
                  ? "Form will reset automatically" 
                  : "A ticket will be auto-generated."
              }
            </span>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ApplicationForm;
