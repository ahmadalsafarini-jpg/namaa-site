import React, { useState } from "react";
import { Card } from "../ui";
import { PrimaryButton } from "../ui/Buttons";
import { Input } from "../ui/FormInputs";
import { loginUser } from "../../firebase/auth";

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
      const user = await loginUser({ email, password });
      onLoggedIn(user);
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h2 className="text-2xl font-semibold">Sign in</h2>
      <p className="mt-1 text-slate-600">Welcome back to Namaa.</p>
      
      <Card className="mt-6">
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <Input 
            label="Email" 
            type="email" 
            value={email} 
            onChange={setEmail} 
            required 
          />
          <Input 
            label="Password" 
            type="password" 
            value={password} 
            onChange={setPassword} 
            required 
          />
          
          {error && (
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
              {error}
            </div>
          )}
          
          <PrimaryButton type="submit" disabled={loading || !can}>
            {loading ? "Signing in..." : "Sign in"}
          </PrimaryButton>
        </form>
      </Card>
    </div>
  );
};

export default SignIn;
