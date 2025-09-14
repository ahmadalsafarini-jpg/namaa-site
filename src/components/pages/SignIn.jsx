import React, { useState } from "react";
import { Card } from "../ui";
import { PrimaryButton } from "../ui/Buttons";
import { Input } from "../ui/FormInputs";
import { signInUser } from "../../firebase/auth";

// Helper function to convert Firebase auth errors to user-friendly messages
const getAuthErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred. Please try again.';
  
  // Firebase auth error codes
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
      // Check if it's a generic error message
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
        // Handle specific Firebase auth errors
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
