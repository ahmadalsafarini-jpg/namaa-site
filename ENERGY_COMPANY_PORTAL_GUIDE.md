# ⚡ Energy Company Portal - Complete Guide

## 🎯 Overview

The Energy Company Portal allows solar installation companies to manage their assigned clients directly through the Namaa platform. This feature enables seamless collaboration between admins, energy companies, and clients.

---

## 🏗️ Architecture

### **Three Portal System:**

1. **👥 Client Portal** - For facility owners submitting solar applications
2. **🔧 Admin Portal** - For Namaa admins managing all applications and companies
3. **⚡ Energy Company Portal** - For solar companies managing their assigned clients

---

## 🚀 Features

### **Admin Capabilities:**
✅ Create energy company accounts
✅ Assign/unassign clients to energy companies
✅ View all energy companies and their assigned clients
✅ Manage energy company login credentials
✅ Delete energy companies
✅ Full control over client applications

### **Energy Company Capabilities:**
✅ View all assigned clients
✅ Update client application status
✅ Upload documents (energy bills, site photos, load data)
✅ Edit client information
✅ Real-time updates when new clients are assigned
✅ Search and filter assigned clients

---

## 📋 How It Works

### **Step 1: Admin Creates Energy Company**

1. Admin logs in to Admin Portal
2. Goes to "Energy Companies" tab
3. Clicks "Add Energy Company"
4. Fills in:
   - Company Name (e.g., "Sunrise Solar")
   - Username (e.g., "sunrise_solar")
   - Password (secure password)
   - Contact Email (optional)
   - Contact Phone (optional)
5. Clicks "Create Company"

### **Step 2: Admin Assigns Clients**

1. Admin goes to "Client Applications" tab
2. Clicks the "Assign" icon (👥 UserPlus) on any application
3. Selects the energy company from the list
4. Client is now visible in the energy company's portal

### **Step 3: Energy Company Logs In**

1. Energy company goes to the landing page
2. Clicks "Energy Company Portal" link at the bottom (in footer)
3. Enters username and password
4. Accesses their dashboard with assigned clients

### **Step 4: Energy Company Manages Clients**

1. Views all assigned clients in dashboard
2. Clicks "View & Manage" on any client
3. Can:
   - Update project status
   - Edit client information
   - Upload documents
   - Add notes
   - Track progress

---

## 🗂️ File Structure

```
src/
├── components/
│   └── pages/
│       ├── EnergyCompanyLogin.jsx           # Login page for energy companies
│       ├── EnergyCompanyDashboard.jsx       # Dashboard showing assigned clients
│       ├── EnergyCompanyClientDetail.jsx    # Detailed client management view
│       └── AdminDashboard.jsx               # Admin portal with company management
├── firebase/
│   └── realtime-db.js                       # Energy company CRUD operations
└── App.jsx                                   # Routing for energy company portal
```

---

## 🔐 Security

### **Authentication:**
- Simple username/password authentication
- Passwords stored in Firebase Realtime Database
- Each energy company can only access their assigned clients
- No cross-company data visibility

### **Data Access:**
- Energy companies can only view/edit clients assigned to them
- Admins have full access to all data
- Clients can only see their own applications

---

## 📊 Database Structure

### **Energy Company Object:**
```javascript
{
  id: "company_id_123",
  name: "Sunrise Solar",
  username: "sunrise_solar",
  password: "secure_password",
  contactEmail: "contact@sunrisesolar.com",
  contactPhone: "+974 XXXX XXXX",
  assignedClients: ["app_id_1", "app_id_2", "app_id_3"],
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

### **Application with Company Assignment:**
```javascript
{
  id: "app_id_1",
  projectName: "Solar Project 1",
  // ... other application fields ...
  assignedCompanyId: "company_id_123",  // ID of assigned company
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

---

## 🎨 UI/UX Features

### **Admin Dashboard:**
- **Two Tabs:**
  1. Client Applications - Manage all client apps
  2. Energy Companies - Manage energy company accounts
- **Quick Actions:**
  - Assign client button on each application card
  - View company details
  - Delete companies
  - Create new companies

### **Energy Company Dashboard:**
- **Client Grid View** - All assigned clients in cards
- **Search & Filter** - Find clients by name, status, location
- **Real-time Updates** - Automatic refresh when clients are assigned/unassigned
- **Status Indicators** - Visual status badges for each client
- **File Count** - Shows number of uploaded files per client

### **Client Detail Page (Energy Company View):**
- **Edit Information** - Update project details
- **Change Status** - Update project progress
- **Upload Documents** - Add energy bills, site photos, load data
- **Progress Tracker** - Visual progress bar and status steps
- **Client Info** - View user ID, application ID, timestamps

---

## 🔄 Workflow Example

### **Scenario: New Solar Installation Project**

1. **Client submits application** via Client Portal
2. **Admin receives notification** (email)
3. **Admin reviews application** in Admin Portal
4. **Admin assigns to "Sunrise Solar"** energy company
5. **Sunrise Solar logs in** to Energy Company Portal
6. **Sunrise Solar sees new client** in dashboard
7. **Sunrise Solar opens client details**
8. **Reviews uploaded documents** (energy bills, photos)
9. **Updates status** from "Under Review" → "Matched"
10. **Uploads preliminary design documents**
11. **Admin monitors progress** from Admin Portal
12. **Client sees status updates** in their Ticket page

---

## 📝 API Functions

### **Firebase Operations (src/firebase/realtime-db.js):**

```javascript
// Create new energy company
createEnergyCompany(companyData)

// Get all energy companies
getAllEnergyCompanies()

// Get specific energy company
getEnergyCompany(companyId)

// Login energy company
loginEnergyCompany(username, password)

// Update energy company
updateEnergyCompany(companyId, updates)

// Delete energy company
deleteEnergyCompany(companyId)

// Assign client to company
assignClientToCompany(companyId, applicationId)

// Unassign client from company
unassignClientFromCompany(companyId, applicationId)

// Get company's assigned clients
getCompanyAssignedClients(companyId)

// Subscribe to real-time client updates
subscribeToCompanyClients(companyId, callback)
```

---

## 🎯 Testing the Portal

### **Test Scenario 1: Create Energy Company**

1. **Login as Admin:**
   - Go to landing page
   - Click "Admin Portal" in footer
   - Enter password: `ahmadbasem`

2. **Create Company:**
   - Click "Energy Companies" tab
   - Click "Add Energy Company"
   - Enter:
     - Name: "Test Solar Co"
     - Username: "testsolar"
     - Password: "test123"
   - Click "Create Company"

3. **Verify:**
   - Company appears in grid
   - Shows "0 clients assigned"

### **Test Scenario 2: Assign Client**

1. **Go to "Client Applications" tab**
2. **Find any application**
3. **Click the UserPlus (👥) icon**
4. **Select "Test Solar Co"**
5. **Verify:**
   - Success message appears
   - Application shows "✓ Assigned to company"

### **Test Scenario 3: Energy Company Login**

1. **Go to landing page** (or logout from admin)
2. **Click "Energy Company Portal"** in footer
3. **Enter credentials:**
   - Username: `testsolar`
   - Password: `test123`
4. **Verify:**
   - Dashboard loads
   - Assigned client appears in grid
   - Shows "1 Assigned Client"

### **Test Scenario 4: Manage Client**

1. **In Energy Company Dashboard**
2. **Click "View & Manage"** on the client card
3. **Try updating:**
   - Change status to "Matched"
   - Add notes
   - Upload a document
   - Click "Save Changes"
4. **Verify:**
   - Success message appears
   - Changes reflected in dashboard
   - Admin can see updates in Admin Portal
   - Client can see status update in Ticket page

---

## 🔧 Configuration

### **Admin Password:**
Located in: `src/components/pages/AdminLogin.jsx`
```javascript
const ADMIN_PASSWORD = "ahmadbasem";
```

### **Status Flow:**
Located in: `src/constants/index.js`
```javascript
const STATUS_FLOW = [
  "Under Review",
  "Matched",
  "Approved",
  "In Execution",
  "Completed",
];
```

---

## 🚨 Troubleshooting

### **Issue: Energy company can't log in**
**Solution:**
- Verify username/password are correct (case-sensitive)
- Check Firebase Realtime Database for company record
- Ensure company was created successfully

### **Issue: Assigned clients not showing**
**Solution:**
- Check Firebase for `assignedClients` array in company record
- Verify application has `assignedCompanyId` field
- Try logging out and back in

### **Issue: Can't upload files**
**Solution:**
- Ensure Firebase Storage is enabled
- Check storage rules allow uploads
- Verify file size is under limits

### **Issue: Status updates not saving**
**Solution:**
- Check browser console for errors
- Verify Firebase Realtime Database rules
- Ensure company has permission to update application

---

## 🎨 Customization

### **Change Company Portal Colors:**
Update in respective component files:
```jsx
// Primary color (green/emerald)
className="bg-emerald-500 text-white"

// Hover states
className="hover:bg-emerald-600"

// Borders
className="border-emerald-300"
```

### **Add More Company Fields:**
Update `createEnergyCompany` function and form in `AdminDashboard.jsx`:
```javascript
const [newCompany, setNewCompany] = useState({
  name: "",
  username: "",
  password: "",
  contactEmail: "",
  contactPhone: "",
  // Add new fields here
  website: "",
  address: "",
  licenseNumber: ""
});
```

### **Customize Permissions:**
Modify what energy companies can do in `EnergyCompanyClientDetail.jsx`:
```javascript
// Example: Make some fields read-only
<Input
  label="Project Name"
  value={editedClient.projectName}
  onChange={(value) => setEditedClient({ ...editedClient, projectName: value })}
  disabled={true}  // Make read-only
/>
```

---

## 📚 Related Documentation

- **Email Notifications**: See `EMAIL_NOTIFICATION_SETUP.md`
- **Firebase Setup**: See `FIREBASE_ENABLE_SERVICES.md`
- **File Organization**: See `FILE_ORGANIZATION_GUIDE.md`
- **Admin Portal**: See main `README.md`

---

## 🎉 Success Checklist

- [ ] Admin can create energy companies
- [ ] Admin can assign clients to companies
- [ ] Energy company can log in successfully
- [ ] Energy company can view assigned clients
- [ ] Energy company can update client status
- [ ] Energy company can upload documents
- [ ] Energy company can edit client information
- [ ] Real-time updates work correctly
- [ ] Admin can unassign clients
- [ ] Admin can delete energy companies

---

## 🚀 Next Steps

**Potential Enhancements:**
1. **Email Notifications** - Notify energy companies when clients are assigned
2. **Company Dashboard Analytics** - Show statistics, charts, performance metrics
3. **Document Templates** - Provide standard templates for quotes, contracts
4. **Client Communication** - Built-in messaging between company and client
5. **Payment Integration** - Handle payments directly through the portal
6. **Multi-user Access** - Allow multiple employees from same company
7. **Role-based Permissions** - Different access levels within companies
8. **Mobile App** - Native iOS/Android apps for energy companies
9. **API Access** - RESTful API for third-party integrations
10. **Reporting** - Generate PDF reports, invoices, proposals

---

**Need Help?**  
📧 info@namaa.energy | 📞 +974 3308 5766

---

**Built with ❤️ for the renewable energy sector**

