import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCircle, Info, AlertTriangle, X, Check, Archive, Trash2, Filter } from "lucide-react";
import { Card, Pill } from "../ui";

const Notifications = () => {
  const [filter, setFilter] = useState("all"); // all, status, matching, financing
  const [items, setItems] = useState([
    { id: 1, type: "status", title: "Application Approved", desc: "Your solar project application has been approved and is moving to the next stage.", ts: "2h", read: false },
    { id: 2, type: "matching", title: "New Offer Available", desc: "Sunrise Solar submitted an updated competitive offer for your project.", ts: "1d", read: false },
    { id: 3, type: "financing", title: "Financing Submitted", desc: "Your financing request was successfully sent to Qatar Development Bank.", ts: "3d", read: true },
    { id: 4, type: "status", title: "Document Uploaded", desc: "New design documents are available for download in your project portal.", ts: "5d", read: true },
  ]);

  const iconFor = (type) => {
    if (type === "status") return { icon: <CheckCircle className="h-5 w-5" />, color: "bg-emerald-100 text-emerald-600" };
    if (type === "matching") return { icon: <Info className="h-5 w-5" />, color: "bg-blue-100 text-blue-600" };
    if (type === "financing") return { icon: <AlertTriangle className="h-5 w-5" />, color: "bg-amber-100 text-amber-600" };
    return { icon: <Bell className="h-5 w-5" />, color: "bg-slate-100 text-slate-600" };
  };

  const filteredItems = filter === "all" ? items : items.filter(i => i.type === filter);
  const unreadCount = items.filter(i => !i.read).length;

  const markAsRead = (id) => {
    setItems(items.map(i => i.id === id ? { ...i, read: true } : i));
  };

  const deleteNotification = (id) => {
    setItems(items.filter(i => i.id !== id));
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Gradient Mesh Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-emerald-50 to-blue-50"></div>
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      </div>
      
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 flex items-center gap-3">
                <div className="h-12 w-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Bell className="h-6 w-6 text-white" />
                </div>
                Notifications
              </h1>
              <p className="mt-2 text-slate-600">
                Stay updated with your solar project progress
              </p>
            </div>
            {unreadCount > 0 && (
              <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full font-medium">
                <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                {unreadCount} Unread
              </div>
            )}
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="h-4 w-4 text-slate-600 flex-shrink-0" />
            {[
              { value: "all", label: "All" },
              { value: "status", label: "Status Updates" },
              { value: "matching", label: "Offers" },
              { value: "financing", label: "Financing" }
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  filter === f.value
                    ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg"
                    : "bg-white text-slate-700 border-2 border-slate-200 hover:border-emerald-300"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Notifications List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Card className="divide-y divide-slate-200 shadow-xl border-2 border-slate-100">
            {filteredItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-2xl mb-4">
                  <Bell className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Notifications</h3>
                <p className="text-slate-600">You're all caught up! Check back later for updates.</p>
              </div>
            ) : (
              filteredItems.map((n, index) => {
                const iconData = iconFor(n.type);
                return (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`group flex items-start gap-4 p-5 hover:bg-slate-50 transition-all duration-300 ${
                      !n.read ? "bg-emerald-50/30" : ""
                    }`}
                  >
                    {/* Icon */}
                    <div className={`flex-shrink-0 h-12 w-12 ${iconData.color} rounded-xl flex items-center justify-center shadow-sm`}>
                      {iconData.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h4 className="font-semibold text-slate-900">{n.title}</h4>
                          {!n.read && (
                            <span className="inline-block mt-1 text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                              New
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 whitespace-nowrap">{n.ts} ago</span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{n.desc}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!n.read && (
                        <button
                          onClick={() => markAsRead(n.id)}
                          className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(n.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </Card>
        </motion.div>

        {/* Footer Actions */}
        {filteredItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-6 flex items-center justify-center gap-4"
          >
            <button
              onClick={() => setItems(items.map(i => ({ ...i, read: true })))}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:text-emerald-600 transition-colors"
            >
              <Check className="h-4 w-4" />
              Mark all as read
            </button>
            <button
              onClick={() => setItems([])}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:text-red-600 transition-colors"
            >
              <Archive className="h-4 w-4" />
              Clear all
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
