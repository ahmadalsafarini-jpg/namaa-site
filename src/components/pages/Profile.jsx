import { useState } from "react";
import { Card, Input, PrimaryButton, GhostButton } from "../ui";

const Profile = ({ user = {}, onSave }) => {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phone || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave && onSave({ name, email, phone });
    alert('Profile saved');
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h2 className="text-2xl font-semibold mb-6">Profile Settings</h2>
      <Card>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <Input label="Name" value={name} onChange={setName} />
          <Input label="Email" type="email" value={email} onChange={setEmail} />
          <Input label="Phone" type="tel" value={phone} onChange={setPhone} />
          <div className="flex items-center gap-3">
            <PrimaryButton type="submit">Save</PrimaryButton>
            <GhostButton type="button" onClick={() => { setName(user.name || ""); setEmail(user.email || ""); setPhone(user.phone || ""); }}>Reset</GhostButton>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Profile;


