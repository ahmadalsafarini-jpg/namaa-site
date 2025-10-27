import { useState, useEffect } from "react";
import { Loader2, Building, Eye, LogOut, Users, FileText } from "lucide-react";
import { Card, PrimaryButton, GhostButton, Pill } from "../ui";
import { progressForStatus, formatDate } from "../../utils";
import { subscribeToCompanyClients } from "../../firebase/realtime-db";

const EnergyCompanyDashboard = ({ company, onLogout, onViewClient }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!company?.id) return;

    setLoading(true);
    
    // Subscribe to real-time updates for assigned clients
    const unsubscribe = subscribeToCompanyClients(company.id, (apps) => {
      setClients(apps || []);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [company?.id]);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.facilityType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
          <p className="text-slate-600">Loading your clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{company.name}</h1>
              <p className="text-slate-600">Manage your assigned solar clients</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-600">
                <Users className="h-4 w-4 inline mr-1" />
                {clients.length} Assigned {clients.length === 1 ? 'Client' : 'Clients'}
              </div>
              <GhostButton onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
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
              placeholder="Search clients..."
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
            Showing {filteredClients.length} of {clients.length}
          </div>
        </div>

        {/* Clients Grid */}
        {filteredClients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <Card key={client.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{client.projectName}</h3>
                    <p className="text-sm text-slate-600">{client.facilityType} • {client.location}</p>
                  </div>
                  <button
                    onClick={() => onViewClient(client)}
                    className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                    title="View Client Details"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Status:</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(client.status)}`}>
                      {client.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">System Type:</span>
                    <span className="font-medium">{client.systemType}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Progress:</span>
                    <span className="font-medium">{progressForStatus(client.status).toFixed(0)}%</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Submitted:</span>
                    <span className="font-medium">
                      {client.createdAt ? new Date(client.createdAt).toLocaleDateString() : 'Unknown'}
                    </span>
                  </div>

                  {/* Files Summary */}
                  {client.files && (
                    <div className="pt-3 border-t border-slate-200">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <FileText className="h-3 w-3" />
                        <span>
                          {(client.files.bills?.length || 0) + (client.files.photos?.length || 0) + (client.files.load?.length || 0)} files uploaded
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-200">
                    <PrimaryButton 
                      onClick={() => onViewClient(client)}
                      className="w-full"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View & Manage
                    </PrimaryButton>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Building className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              {clients.length === 0 ? 'No clients assigned yet' : 'No clients found'}
            </h3>
            <p className="text-slate-600">
              {clients.length === 0 
                ? 'Contact the admin to get clients assigned to your company'
                : 'Try adjusting your search or filter criteria'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnergyCompanyDashboard;

