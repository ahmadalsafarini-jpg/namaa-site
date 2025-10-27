import React, { useState, useEffect } from "react";
import { Loader2, Users, Building, Eye, Edit, Trash2, Plus, Zap, UserPlus, X } from "lucide-react";
import { Card, PrimaryButton, GhostButton, Input } from "../ui";
import { subscribeToAllApplications, updateApplication, deleteApplication, getAllEnergyCompanies, createEnergyCompany, deleteEnergyCompany, assignClientToCompany, unassignClientFromCompany } from "../../firebase/realtime-db";

const AdminDashboard = ({ onLogout, onViewClient }) => {
  const [activeTab, setActiveTab] = useState("clients");
  const [applications, setApplications] = useState([]);
  const [energyCompanies, setEnergyCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: "", username: "", password: "", contactEmail: "", contactPhone: "" });
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedCompanyForAssign, setSelectedCompanyForAssign] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToAllApplications((apps) => {
      setApplications(apps || []);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    loadEnergyCompanies();
  }, []);

  const loadEnergyCompanies = async () => {
    const result = await getAllEnergyCompanies();
    if (result.success) {
      setEnergyCompanies(result.data);
    }
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    if (!newCompany.name || !newCompany.username || !newCompany.password) {
      alert("Please fill in Name, Username, and Password");
      return;
    }

    const result = await createEnergyCompany(newCompany);
    if (result.success) {
      alert("Energy company created successfully!");
      setNewCompany({ name: "", username: "", password: "", contactEmail: "", contactPhone: "" });
      setShowCompanyForm(false);
      loadEnergyCompanies();
    } else {
      alert(`Failed to create company: ${result.error}`);
    }
  };

  const handleDeleteCompany = async (companyId) => {
    if (confirm('Are you sure you want to delete this energy company?')) {
      const result = await deleteEnergyCompany(companyId);
      if (result.success) {
        loadEnergyCompanies();
      } else {
        alert(`Failed to delete: ${result.error}`);
      }
    }
  };

  const handleAssignClient = async (applicationId) => {
    if (!selectedCompanyForAssign) return;
    
    const app = applications.find(a => a.id === applicationId);
    const result = await assignClientToCompany(selectedCompanyForAssign, applicationId);
    if (result.success) {
      alert(`Client "${app?.projectName}" assigned successfully!`);
      setShowAssignModal(false);
      setSelectedCompanyForAssign(null);
      loadEnergyCompanies();
    } else {
      alert(`Failed to assign: ${result.error}`);
    }
  };

  const handleUnassignClient = async (companyId, applicationId) => {
    const app = applications.find(a => a.id === applicationId);
    if (confirm(`Unassign "${app?.projectName}" from this company?`)) {
      const result = await unassignClientFromCompany(companyId, applicationId);
      if (result.success) {
        loadEnergyCompanies();
      } else {
        alert(`Failed to unassign: ${result.error}`);
      }
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.facilityType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await updateApplication(appId, { status: newStatus });
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleDeleteApplication = async (appId) => {
    if (confirm('Are you sure you want to delete this application?')) {
      try {
        await deleteApplication(appId);
      } catch (error) {
        console.error('Error deleting application:', error);
        alert('Failed to delete application');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      "Under Review": "bg-blue-100 text-blue-800",
      "Matched": "bg-purple-100 text-purple-800",
      "Approved": "bg-green-100 text-green-800",
      "In Execution": "bg-orange-100 text-orange-800",
      "Completed": "bg-emerald-100 text-emerald-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-slate-600">Manage clients, applications, and energy companies</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-600">
                <Users className="h-4 w-4 inline mr-1" />
                {applications.length} Applications | {energyCompanies.length} Companies
              </div>
              <GhostButton onClick={onLogout}>
                Logout
              </GhostButton>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-slate-200 -mb-px">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setActiveTab('clients')}
                className={`px-1 pb-3 text-sm font-medium border-b-2 ${
                  activeTab === 'clients' 
                    ? 'border-emerald-600 text-emerald-600' 
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="h-4 w-4 inline mr-2" />
                Client Applications
              </button>
              <button
                onClick={() => setActiveTab('companies')}
                className={`px-1 pb-3 text-sm font-medium border-b-2 ${
                  activeTab === 'companies' 
                    ? 'border-emerald-600 text-emerald-600' 
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Zap className="h-4 w-4 inline mr-2" />
                Energy Companies
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'clients' && (
          <>
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Matched">Matched</option>
                  <option value="Approved">Approved</option>
                  <option value="In Execution">In Execution</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="text-sm text-slate-600 flex items-center">
                <Building className="h-4 w-4 mr-1" />
                Showing {filteredApplications.length} of {applications.length}
              </div>
            </div>

            {/* Applications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApplications.map((app) => (
                <Card key={app.id} className="hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{app.projectName}</h3>
                      <p className="text-sm text-slate-600">{app.facilityType} • {app.location}</p>
                      {app.assignedCompanyId && (
                        <p className="text-xs text-emerald-600 mt-1">
                          ✓ Assigned to company
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setSelectedCompanyForAssign(null);
                          setShowAssignModal(app.id);
                        }}
                        className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                        title="Assign to Company"
                      >
                        <UserPlus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onViewClient(app)}
                        className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                        title="View Client Portal"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteApplication(app.id)}
                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                        title="Delete Application"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Status:</span>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className={`px-2 py-1 text-xs rounded-full border-0 ${getStatusColor(app.status)}`}
                      >
                        <option value="Under Review">Under Review</option>
                        <option value="Matched">Matched</option>
                        <option value="Approved">Approved</option>
                        <option value="In Execution">In Execution</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">System Type:</span>
                      <span className="font-medium">{app.systemType}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Created:</span>
                      <span className="font-medium">
                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Unknown'}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-slate-200">
                      <PrimaryButton 
                        onClick={() => onViewClient(app)}
                        className="w-full"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Manage Client
                      </PrimaryButton>
                    </div>
                  </div>

                  {/* Assign Modal */}
                  {showAssignModal === app.id && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <Card className="w-full max-w-md p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">Assign to Company</h3>
                          <button
                            onClick={() => setShowAssignModal(false)}
                            className="p-1 hover:bg-slate-100 rounded"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm text-slate-600 mb-4">
                          Assign "{app.projectName}" to an energy company:
                        </p>
                        <div className="space-y-2 mb-4">
                          {energyCompanies.map(company => (
                            <button
                              key={company.id}
                              onClick={() => {
                                setSelectedCompanyForAssign(company.id);
                                handleAssignClient(app.id);
                              }}
                              className="w-full text-left px-4 py-3 border border-slate-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
                            >
                              <div className="font-medium">{company.name}</div>
                              <div className="text-xs text-slate-500">
                                {company.assignedClients?.length || 0} clients assigned
                              </div>
                            </button>
                          ))}
                        </div>
                        {energyCompanies.length === 0 && (
                          <p className="text-sm text-slate-500 text-center py-4">
                            No energy companies available. Create one in the Energy Companies tab.
                          </p>
                        )}
                      </Card>
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {filteredApplications.length === 0 && (
              <div className="text-center py-12">
                <Building className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No applications found</h3>
                <p className="text-slate-600">
                  {searchTerm || statusFilter !== "all" 
                    ? "Try adjusting your search or filter criteria"
                    : "No applications have been submitted yet"
                  }
                </p>
              </div>
            )}
          </>
        )}

        {activeTab === 'companies' && (
          <>
            {/* Add Company Button */}
            <div className="mb-6">
              <PrimaryButton onClick={() => setShowCompanyForm(!showCompanyForm)}>
                <Plus className="h-4 w-4 mr-2" />
                {showCompanyForm ? 'Cancel' : 'Add Energy Company'}
              </PrimaryButton>
            </div>

            {/* Company Form */}
            {showCompanyForm && (
              <Card className="mb-6 p-6">
                <h3 className="text-lg font-semibold mb-4">Create New Energy Company</h3>
                <form onSubmit={handleCreateCompany} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Company Name *"
                    value={newCompany.name}
                    onChange={(value) => setNewCompany({ ...newCompany, name: value })}
                    required
                    placeholder="e.g., Sunrise Solar"
                  />
                  <Input
                    label="Username *"
                    value={newCompany.username}
                    onChange={(value) => setNewCompany({ ...newCompany, username: value })}
                    required
                    placeholder="e.g., sunrise_solar"
                  />
                  <Input
                    label="Password *"
                    type="password"
                    value={newCompany.password}
                    onChange={(value) => setNewCompany({ ...newCompany, password: value })}
                    required
                    placeholder="Secure password"
                  />
                  <Input
                    label="Contact Email"
                    type="email"
                    value={newCompany.contactEmail}
                    onChange={(value) => setNewCompany({ ...newCompany, contactEmail: value })}
                    placeholder="contact@company.com"
                  />
                  <Input
                    label="Contact Phone"
                    type="tel"
                    value={newCompany.contactPhone}
                    onChange={(value) => setNewCompany({ ...newCompany, contactPhone: value })}
                    placeholder="+974 XXXX XXXX"
                  />
                  <div className="md:col-span-2 flex gap-3">
                    <PrimaryButton type="submit">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Company
                    </PrimaryButton>
                    <GhostButton type="button" onClick={() => setShowCompanyForm(false)}>
                      Cancel
                    </GhostButton>
                  </div>
                </form>
              </Card>
            )}

            {/* Companies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {energyCompanies.map((company) => (
                <Card key={company.id} className="hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{company.name}</h3>
                      <p className="text-xs text-slate-500">@{company.username}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteCompany(company.id)}
                      className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                      title="Delete Company"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {company.contactEmail && (
                      <div className="text-sm">
                        <span className="text-slate-600">Email: </span>
                        <span className="font-medium">{company.contactEmail}</span>
                      </div>
                    )}
                    {company.contactPhone && (
                      <div className="text-sm">
                        <span className="text-slate-600">Phone: </span>
                        <span className="font-medium">{company.contactPhone}</span>
                      </div>
                    )}
                    <div className="text-sm">
                      <span className="text-slate-600">Assigned Clients: </span>
                      <span className="font-medium">{company.assignedClients?.length || 0}</span>
                    </div>

                    {/* Assigned Clients List */}
                    {company.assignedClients && company.assignedClients.length > 0 && (
                      <div className="pt-3 border-t border-slate-200">
                        <p className="text-xs font-medium text-slate-700 mb-2">Assigned Projects:</p>
                        <div className="space-y-1">
                          {company.assignedClients.map(clientId => {
                            const app = applications.find(a => a.id === clientId);
                            if (!app) return null;
                            return (
                              <div key={clientId} className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded">
                                <span className="truncate">{app.projectName}</span>
                                <button
                                  onClick={() => handleUnassignClient(company.id, clientId)}
                                  className="text-red-600 hover:text-red-800 ml-2"
                                  title="Unassign"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="pt-3 border-t border-slate-200 text-xs text-slate-500">
                      Created: {company.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'Unknown'}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {energyCompanies.length === 0 && !showCompanyForm && (
              <div className="text-center py-12">
                <Zap className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No energy companies yet</h3>
                <p className="text-slate-600 mb-4">
                  Create your first energy company to start assigning clients
                </p>
                <PrimaryButton onClick={() => setShowCompanyForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Energy Company
                </PrimaryButton>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

