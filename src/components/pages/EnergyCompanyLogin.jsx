import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, LogIn, AlertCircle } from "lucide-react";
import { Input, PrimaryButton, Card } from "../ui";

const EnergyCompanyLogin = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    setLoading(true);
    
    try {
      await onLogin(username, password);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl mb-4">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Energy Company Portal</h1>
            <p className="text-slate-600 mt-2">Sign in to manage your assigned clients</p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">Login Failed</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Username"
              type="text"
              value={username}
              onChange={setUsername}
              placeholder="Enter your username"
              required
              autoComplete="username"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />

            <PrimaryButton
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </>
              )}
            </PrimaryButton>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-600">
              Need access? Contact the admin team
            </p>
            <p className="text-xs text-slate-500 mt-2">
              📧 info@namaa.energy | 📞 +974 3308 5766
            </p>
          </div>
        </Card>

        {/* Back to Home Link */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-sm text-slate-600 hover:text-emerald-600 transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default EnergyCompanyLogin;

