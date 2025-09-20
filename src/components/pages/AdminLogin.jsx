import React, { useState } from "react";
import { Card, PrimaryButton, Input } from "../ui";

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) return;
    
    setError("");
    setLoading(true);
    
    // Simulate authentication delay
    setTimeout(() => {
      if (password === "ahmadbasem") {
        onLogin();
      } else {
        setError("Invalid password");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="max-w-md w-full px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Admin Portal</h1>
          <p className="mt-2 text-slate-600">Enter password to access admin dashboard</p>
        </div>
        
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Enter admin password"
              required
            />
            
            {error && (
              <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            )}
            
            <PrimaryButton type="submit" disabled={loading} className="w-full">
              {loading ? "Authenticating..." : "Access Admin Dashboard"}
            </PrimaryButton>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
