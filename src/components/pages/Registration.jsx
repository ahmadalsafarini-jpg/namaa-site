import { useState } from "react";
import { Card, PrimaryButton, Input } from "../ui";
import { createUser, registerUser } from "../../firebase/auth";
import { createUserProfile } from "../../firebase/firestore";

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
      return 'An account with this email already exists. Please try signing in instead.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled.';
    default:
      // Check if it's a generic error message
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
  
  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h2 className="text-2xl font-semibold">Create your account</h2>
      <p className="mt-1 text-slate-600">Welcome! Finish your registration to access the portal.</p>
      <Card className="mt-6">
        <form
          className="grid gap-4"
          onSubmit={async (e) => { 
            e.preventDefault(); 
            if (!can || loading) return; 
            
            setLoading(true);
            setError("");
            
            try {
              // Try Firebase first, fallback to localStorage
              const authResult = await createUser(form.email, form.password, {
                name: form.name,
                phone: form.phone
              });
              
              if (authResult.success) {
                const user = authResult.user;
                
                // Try to create Firestore profile if Firebase user
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
          }}
        >
          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-800">
              {error}
            </div>
          )}
          <Input label="Full name" value={form.name} onChange={(v) => setForm((s) => ({ ...s, name: v }))} required />
          <Input label="Email" type="email" value={form.email} onChange={(v) => setForm((s) => ({ ...s, email: v }))} required />
          <Input label="Phone" type="tel" value={form.phone} onChange={(v) => setForm((s) => ({ ...s, phone: v }))} required />
          <Input label="Password (min 6)" type="password" value={form.password} onChange={(v) => setForm((s) => ({ ...s, password: v }))} required />
          <PrimaryButton type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Register & Continue"}
          </PrimaryButton>
        </form>
      </Card>
    </div>
  );
};

export default Registration;
