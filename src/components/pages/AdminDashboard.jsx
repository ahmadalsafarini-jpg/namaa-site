import React, { useState, useEffect } from "react";
import { Loader2, Users, Building, Calendar, Eye, Edit, Trash2 } from "lucide-react";
import { Card, PrimaryButton, GhostButton, Pill } from "../ui";
import { formatDate } from "../../utils";
import { subscribeToAllApplications, updateApplication, deleteApplication } from "../../firebase/realtime-db";

const AdminDashboard = ({ onLogout, onViewClient }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const unsubscribe = subscribeToAllApplications((apps) => {
      setApplications(apps || []);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
      "Pending": "bg-yellow-100 text-yellow-800",
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
          <p className="text-slate-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-slate-600">Manage all client applications and projects</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-600">
                <Users className="h-4 w-4 inline mr-1" />
                {applications.length} Applications
              </div>
              <GhostButton onClick={onLogout}>
                Logout
              </GhostButton>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6">
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
              <option value="Pending">Pending</option>
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
                </div>
                <div className="flex items-center gap-1">
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
                    <option value="Pending">Pending</option>
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
      </div>
    </div>
  );
};

export default AdminDashboard;
