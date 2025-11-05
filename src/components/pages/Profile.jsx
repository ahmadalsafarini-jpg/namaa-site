import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Save, RotateCcw, Shield, Bell, Trash2, CheckCircle } from "lucide-react";
import { Card, Input, PrimaryButton, GhostButton } from "../ui";

const Profile = ({ user = {}, onSave }) => {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave && onSave({ name, email, phone });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setName(user.name || "");
    setEmail(user.email || "");
    setPhone(user.phone || "");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Gradient Mesh Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-emerald-50 to-blue-50"></div>
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-violet-400 to-purple-400 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 flex items-center gap-3">
            <div className="h-12 w-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <User className="h-6 w-6 text-white" />
            </div>
            Profile Settings
          </h1>
          <p className="mt-2 text-slate-600">
            Manage your account information and preferences
          </p>
        </motion.div>

        {/* Success Message */}
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 flex items-center gap-3 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl"
          >
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <p className="text-sm font-medium text-emerald-900">Profile updated successfully!</p>
          </motion.div>
        )}

        {/* Profile Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Card className="p-8 shadow-xl border-2 border-slate-100 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <User className="h-5 w-5 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-emerald-500" />
                    Full Name
                  </div>
                </label>
                <Input 
                  value={name} 
                  onChange={setName}
                  placeholder="Your full name"
                  className="h-12"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-emerald-500" />
                    Email Address
                  </div>
                </label>
                <Input 
                  type="email" 
                  value={email} 
                  onChange={setEmail}
                  placeholder="your.email@company.com"
                  className="h-12"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-emerald-500" />
                    Phone Number
                  </div>
                </label>
                <Input 
                  type="tel" 
                  value={phone} 
                  onChange={setPhone}
                  placeholder="+974 XXXX XXXX"
                  className="h-12"
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <Save className="h-5 w-5" />
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-medium hover:border-emerald-300 hover:bg-emerald-50 transition-all"
                >
                  <RotateCcw className="h-5 w-5" />
                  Reset
                </button>
              </div>
            </form>
          </Card>
        </motion.div>

        {/* Additional Settings */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Security */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg text-slate-900">Security</h3>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Manage your password and authentication settings
              </p>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Change Password →
              </button>
            </Card>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Bell className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-bold text-lg text-slate-900">Notifications</h3>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Configure how you receive updates and alerts
              </p>
              <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                Manage Preferences →
              </button>
            </Card>
          </motion.div>
        </div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-6"
        >
          <Card className="border-2 border-red-100 bg-red-50/50">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 h-10 w-10 bg-red-100 rounded-xl flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-red-900 mb-2">Danger Zone</h3>
                <p className="text-sm text-red-700 mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <button className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline">
                  Delete Account
                </button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
