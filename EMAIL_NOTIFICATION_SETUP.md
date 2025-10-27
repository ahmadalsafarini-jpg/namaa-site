# 📧 Email Notification Setup Guide

This guide will help you set up email notifications for new application submissions on the Namaa Solar Platform.

## 🎯 Overview

When a user submits a new solar application, you will automatically receive an email notification with:
- Application details (project name, facility type, location, system type)
- User information
- Uploaded files summary
- Application status
- Submission timestamp

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Configure Backend Email Settings

1. **Navigate to the backend folder:**
   ```bash
   cd backend
   ```

2. **Create a `.env` file** (copy from template):
   ```bash
   copy env-template.txt .env
   ```

3. **Edit the `.env` file** with your email credentials:

#### Option A: Using Gmail (Recommended - Easiest)

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Email Service Configuration
EMAIL_SERVICE=gmail

# Gmail Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-here

# Admin Email (where notifications will be sent)
ADMIN_EMAIL=admin@namaa.energy
```

**Important:** For Gmail, you MUST use an "App Password", not your regular password.

**How to Get Gmail App Password:**
1. Go to your Google Account: https://myaccount.google.com/
2. Click "Security" in the left menu
3. Under "Signing in to Google", click "2-Step Verification" (enable it if not already)
4. Scroll down and click "App passwords"
5. Select "Mail" and "Other (Custom name)"
6. Name it "Namaa Backend" and click "Generate"
7. Copy the 16-character password and paste it in `EMAIL_PASSWORD`

#### Option B: Using Custom SMTP

```env
EMAIL_SERVICE=smtp

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-username
SMTP_PASSWORD=your-smtp-password

ADMIN_EMAIL=admin@namaa.energy
```

### Step 2: Configure Frontend

1. **Navigate to the project root:**
   ```bash
   cd ..
   ```

2. **Update your `.env` file** (in the root folder) to include:
   ```env
   VITE_BACKEND_URL=http://localhost:3001
   ```

### Step 3: Start the Backend Server

Open a **new terminal** and run:

```bash
cd backend
npm run dev
```

You should see:
```
╔════════════════════════════════════════════╗
║   🌞 Namaa Backend Server Running          ║
║                                            ║
║   Port: 3001                               ║
║   Environment: development                 ║
║                                            ║
║   Endpoints:                               ║
║   - GET  /api/health                       ║
║   - POST /api/notify/application           ║
║   - POST /api/test-email                   ║
╚════════════════════════════════════════════╝
✅ Email service configured successfully
```

### Step 4: Start the Frontend

In your **existing terminal** (or a new one), run:

```bash
npm run dev
```

---

## ✅ Testing Email Notifications

### Test 1: Health Check

Open your browser and go to:
```
http://localhost:3001/api/health
```

You should see:
```json
{
  "status": "ok",
  "message": "Namaa Backend Server is running",
  "timestamp": "2024-..."
}
```

### Test 2: Send Test Email

Use this command to send a test email:

**PowerShell:**
```powershell
Invoke-WebRequest -Uri "http://localhost:3001/api/test-email" -Method POST -ContentType "application/json"
```

**Or use Postman/Thunder Client:**
- Method: POST
- URL: `http://localhost:3001/api/test-email`
- Click Send

You should receive a test email at your `ADMIN_EMAIL` address.

### Test 3: Submit a Real Application

1. Go to your website: `http://localhost:5173`
2. Login or register as a user
3. Go to "New Application"
4. Fill out and submit the form

You should receive a beautiful email notification with all the application details! 🎉

---

## 📧 Email Notification Features

### What's Included in the Email:

✅ **Application Details:**
- Project Name
- Facility Type
- Location
- System Type
- Status
- User ID
- Submission Date/Time

✅ **Additional Information:**
- Notes (if provided)
- Load Profile (if provided)

✅ **File Upload Summary:**
- Energy Bills count
- Site Photos count
- Load Data count

✅ **Professional Email Design:**
- Branded colors (green for solar)
- Clean, responsive HTML layout
- Direct links to view uploaded files
- Contact information footer

---

## 🔧 Troubleshooting

### Problem: "Email notification error"

**Solution 1: Check Backend is Running**
- Make sure the backend server is running on port 3001
- Check the terminal for any error messages

**Solution 2: Verify Email Credentials**
- Double-check your EMAIL_USER and EMAIL_PASSWORD in `backend/.env`
- For Gmail, make sure you're using an App Password, not your regular password

**Solution 3: Check CORS**
- The backend has CORS enabled by default
- If you're running on different ports, CORS should work automatically

### Problem: Gmail "Less secure app" error

**Solution:**
- Don't use "less secure app access" (deprecated by Google)
- Use App Passwords instead (see Step 1 above)
- Make sure 2-Step Verification is enabled on your Google Account

### Problem: Port 3001 already in use

**Solution:**
Change the port in `backend/.env`:
```env
PORT=3002
```

And update the frontend `.env`:
```env
VITE_BACKEND_URL=http://localhost:3002
```

### Problem: Email not received

**Solution:**
1. Check your spam/junk folder
2. Verify the ADMIN_EMAIL is correct in `backend/.env`
3. Try sending a test email first (Test 2 above)
4. Check backend terminal for error messages

---

## 🔒 Security Best Practices

### ✅ DO:
- Use App Passwords for Gmail (never regular passwords)
- Keep `.env` files out of version control (already in `.gitignore`)
- Use environment variables for sensitive data
- Enable 2-Step Verification on your email account

### ❌ DON'T:
- Never commit `.env` files to Git
- Don't share your App Password
- Don't use your personal email password
- Don't disable 2-Step Verification

---

## 🌐 Production Deployment

When deploying to production (e.g., Vercel, Netlify, Heroku):

### Backend Deployment:

1. **Deploy Backend Separately** (e.g., Heroku, Railway, Render)
   - Set environment variables in your hosting platform
   - Update `ADMIN_EMAIL` to your production email
   - Set `NODE_ENV=production`

2. **Update Frontend Environment Variable:**
   ```env
   VITE_BACKEND_URL=https://your-backend-domain.com
   ```

### Recommended Backend Hosting:
- **Railway** (Free tier, easy setup): https://railway.app/
- **Render** (Free tier): https://render.com/
- **Heroku** (Paid): https://heroku.com/

---

## 📊 Email Notification Flow

```
User Submits Application
         ↓
Frontend: ApplicationForm.jsx
         ↓
Firebase: createApplication() saves to database
         ↓
Backend API: /api/notify/application
         ↓
Nodemailer: Sends formatted email
         ↓
Admin Email: You receive notification! 📧
```

---

## 🎨 Customizing Email Template

To customize the email appearance, edit:
```
backend/index.js
```

Look for the `sendApplicationNotification` function around line 50. You can modify:
- Email subject
- HTML template
- Colors and styling
- Additional information to include

---

## 📝 Additional Features

### Want More Notifications?

You can easily add notifications for:
- ✅ Status changes (when application moves to "Matched", "Approved", etc.)
- ✅ File uploads
- ✅ Admin actions
- ✅ User messages

Just create new endpoints in `backend/index.js` and call them from the frontend!

### Want SMS Notifications?

You can integrate services like:
- Twilio (most popular)
- MessageBird
- Nexmo

---

## 💡 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Check backend terminal for error messages
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly

---

## 🎉 Success Checklist

- [ ] Backend `.env` file created with email credentials
- [ ] Frontend `.env` updated with VITE_BACKEND_URL
- [ ] Backend server running on port 3001
- [ ] Frontend server running on port 5173
- [ ] Health check returns "ok" status
- [ ] Test email received successfully
- [ ] Real application submission sends email notification

Once all checkboxes are complete, your email notification system is ready! 🚀

---

**Need Help?** Contact: info@namaa.energy | +974 3308 5766

