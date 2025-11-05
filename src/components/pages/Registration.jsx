import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, User, Mail, Phone, Lock, AlertCircle, CheckCircle, Sparkles, ArrowRight } from "lucide-react";
import { Card, PrimaryButton, Input } from "../ui";
import { createUser, registerUser } from "../../firebase/auth";
import { createUserProfile } from "../../firebase/firestore";

const getAuthErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred. Please try again.';
  
  switch (error) {
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please check your credentials.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please try signing in instead.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled.';
    default:
      if (error.includes('password')) {
        return 'Password should be at least 6 characters.';
      }
      if (error.includes('email') || error.includes('already')) {
        return 'An account with this email already exists. Please try signing in instead.';
      }
      return 'Registration failed. Please try again.';
  }
};

const Registration = ({ lead, onRegistered }) => {
  const [form, setForm] = useState({ 
    name: lead?.name || "", 
    email: lead?.email || "", 
    phone: lead?.phone || "", 
    password: "" 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const can = form.name && form.email && form.phone && form.password.length >= 6;
  
  const handleSubmit = async (e) => {
            e.preventDefault(); 
            if (!can || loading) return; 
            
            setLoading(true);
            setError("");
            
            try {
              const authResult = await createUser(form.email, form.password, {
                name: form.name,
                phone: form.phone
              });
              
              if (authResult.success) {
        const user = authResult.user;
        
        if (user.uid) {
          try {
            const profileResult = await createUserProfile(user.uid, {
                  name: form.name,
                  email: form.email,
                  phone: form.phone,
                  role: 'customer'
                });
                
            if (!profileResult.success) {
              console.warn('Firestore profile creation failed:', profileResult.error);
            }
          } catch (profileError) {
            console.warn('Firestore profile creation error:', profileError);
          }
        }
        
                  onRegistered({ 
          id: user.uid || user.id, 
          name: user.displayName || form.name,
          email: user.email || form.email,
          phone: user.phoneNumber || form.phone,
          uid: user.uid || user.id
                  });
                } else {
        const errorMessage = getAuthErrorMessage(authResult.error);
        setError(errorMessage);
              }
            } catch (err) {
      const errorMessage = getAuthErrorMessage(err.message);
      setError(errorMessage);
              console.error("Registration error:", err);
            } finally {
              setLoading(false);
            }
  };
  
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-12">
      {/* Dynamic Gradient Mesh Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-emerald-50 to-blue-50"></div>
      <div className="absolute inset-0 opacity-35">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl mb-4 shadow-lg"
          >
            <UserPlus className="h-8 w-8 text-white" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Create Your Account
          </h1>
          <p className="text-slate-600">
            Join leading facilities in Qatar's clean energy transformation
          </p>
        </div>

        {/* Registration Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Card className="p-8 shadow-2xl border-2 border-slate-100">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-emerald-500" />
                      Full Name
                    </div>
                  </label>
                  <Input 
                    value={form.name} 
                    onChange={(v) => setForm((s) => ({ ...s, name: v }))} 
                    required
                    placeholder="Enter your full name"
                    className="h-12"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-emerald-500" />
                      Email Address
                    </div>
                  </label>
                  <Input 
                    type="email" 
                    value={form.email} 
                    onChange={(v) => setForm((s) => ({ ...s, email: v }))} 
                    required
                    placeholder="Enter your email address"
                    className="h-12"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-emerald-500" />
                      Phone Number
                    </div>
                  </label>
                  <Input 
                    type="tel" 
                    value={form.phone} 
                    onChange={(v) => setForm((s) => ({ ...s, phone: v }))} 
                    required
                    placeholder="+974 XXXX XXXX"
                    className="h-12"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-emerald-500" />
                      Password
                    </div>
                  </label>
                  <Input 
                    type="password" 
                    value={form.password} 
                    onChange={(v) => setForm((s) => ({ ...s, password: v }))} 
                    required
                    placeholder="Minimum 6 characters"
                    className="h-12"
                  />
                  <p className="text-xs text-slate-500 mt-1">Minimum 6 characters</p>
                </div>
              </div>

              {/* Error Message */}
          {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-3 p-4 rounded-xl border-2 border-red-200 bg-red-50"
                >
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-900">Registration Failed</p>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </motion.div>
              )}

              {/* Benefits List */}
              <div className="bg-emerald-50 rounded-xl p-6 border-2 border-emerald-100">
                <h3 className="text-sm font-semibold text-emerald-900 mb-3">What you'll get:</h3>
                <div className="space-y-2">
                  {[
                    "Access to vetted solar companies",
                    "Institutional financing options",
                    "Real-time project tracking",
                    "ESG impact reporting"
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-emerald-800">
                      <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
            </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !can}
                className="group w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 px-6 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02]"
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500">Already have an account?</span>
                </div>
              </div>

              {/* Sign In Link */}
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('nav:goto', { detail: 'login' }))}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 text-base font-medium text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-300"
              >
                <Sparkles className="h-5 w-5 text-emerald-500" />
                Sign In Instead
              </button>
        </form>
      </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-6 text-center text-sm text-slate-600"
        >
          <p>
            By creating an account, you agree to our{" "}
            <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">Privacy Policy</a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Registration;
