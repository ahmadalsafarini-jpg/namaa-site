import { useState } from "react";
import { Card, PrimaryButton, Input } from "../ui";
import { createUser } from "../../firebase/auth";
import { createUserProfile } from "../../firebase/firestore";

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
              // Create Firebase Auth user
              const authResult = await createUser(form.email, form.password, {
                name: form.name,
                phone: form.phone
              });
              
              if (authResult.success) {
                // Create user profile in Firestore
                const profileResult = await createUserProfile(authResult.user.uid, {
                  name: form.name,
                  email: form.email,
                  phone: form.phone,
                  role: 'customer'
                });
                
                if (profileResult.success) {
                  onRegistered({ 
                    id: authResult.user.uid, 
                    ...form,
                    uid: authResult.user.uid
                  });
                } else {
                  setError(profileResult.error);
                }
              } else {
                setError(authResult.error);
              }
            } catch (err) {
              setError("An unexpected error occurred. Please try again.");
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
