import React, { useState } from "react";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, AlertCircle, ArrowRight, Sparkles } from "lucide-react";
import { Card } from "../ui";
import { PrimaryButton } from "../ui/Buttons";
import { Input } from "../ui/FormInputs";
import { signInUser } from "../../firebase/auth";

// Helper function to convert Firebase auth errors to user-friendly messages
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
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled.';
    default:
      if (error.includes('password')) {
        return 'Incorrect password. Please try again.';
      }
      if (error.includes('email') || error.includes('user')) {
        return 'No account found with this email address.';
      }
      return 'Invalid email or password. Please check your credentials.';
  }
};

const SignIn = ({ onLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const can = email && password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!can) return;
    
    setError("");
    setLoading(true);
    
    try {
      const result = await signInUser(email, password);
      if (result.success) {
        onLoggedIn({
          uid: result.user.uid || result.user.id,
          name: result.user.displayName || result.user.name || "User",
          email: result.user.email || email,
          phone: result.user.phoneNumber || result.user.phone || ""
        });
      } else {
        const errorMessage = getAuthErrorMessage(result.error);
        setError(errorMessage);
      }
    } catch (err) {
      const errorMessage = getAuthErrorMessage(err.message);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl mb-4 shadow-lg"
          >
            <LogIn className="h-8 w-8 text-white" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-600">
            Sign in to access your solar energy portal
          </p>
        </div>

        {/* Sign In Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Card className="p-8 shadow-2xl border-2 border-slate-100">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Input */}
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
                  required
                  placeholder="your.email@company.com"
                  className="h-12"
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-emerald-500" />
                    Password
                  </div>
                </label>
                <Input 
                  type="password" 
                  value={password} 
                  onChange={setPassword} 
                  required
                  placeholder="Enter your password"
                  className="h-12"
                />
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
                    <p className="text-sm font-medium text-red-900">Sign In Failed</p>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !can}
                className="group w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 px-6 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02]"
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
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
                  <span className="px-4 bg-white text-slate-500">Don't have an account?</span>
                </div>
              </div>

              {/* Register Link */}
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('nav:goto', { detail: 'register' }))}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 text-base font-medium text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-300"
              >
                <Sparkles className="h-5 w-5 text-emerald-500" />
                Create New Account
              </button>
            </form>
          </Card>
        </motion.div>

        {/* Footer Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-6 text-center text-sm text-slate-600"
        >
          <p>Need help? Contact us at <a href="mailto:info@namaa.energy" className="text-emerald-600 hover:text-emerald-700 font-medium">info@namaa.energy</a></p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignIn;
