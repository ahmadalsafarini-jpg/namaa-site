# 🌞 Namaa Backend Server

Backend API server for the Namaa Solar Platform, providing email notification services and future extensibility.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file:**
   ```bash
   copy env-template.txt .env
   ```

3. **Configure email settings** in `.env`:
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ADMIN_EMAIL=admin@namaa.energy
   ```

4. **Start the server:**
   ```bash
   npm run dev    # Development with auto-reload
   npm start      # Production
   ```

## 📡 API Endpoints

### Health Check
```
GET /api/health
```
Returns server status and timestamp.

### Send Application Notification
```
POST /api/notify/application
Content-Type: application/json

{
  "projectName": "Solar Project 1",
  "facilityType": "Residential",
  "location": "Qatar",
  "systemType": "Grid-tied",
  "status": "Under Review",
  "userId": "user123",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Test Email
```
POST /api/test-email
```
Sends a test email to verify configuration.

## 🔧 Configuration

### Gmail Setup (Recommended)

1. Enable 2-Step Verification on your Google Account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the App Password in `.env`

### Custom SMTP Setup

```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-username
SMTP_PASSWORD=your-password
```

## 📧 Email Features

- Beautiful HTML email templates
- Application details with formatting
- File upload summaries
- Branded design (green solar theme)
- Contact information footer

## 🛠️ Tech Stack

- **Express.js** - Web framework
- **Nodemailer** - Email sending
- **CORS** - Cross-origin requests
- **dotenv** - Environment variables

## 📝 Development

```bash
npm run dev    # Start with nodemon (auto-reload)
npm start      # Start without auto-reload
```

## 🚀 Deployment

Deploy to platforms like:
- Railway
- Render
- Heroku
- Vercel (with serverless functions)

Set environment variables in your hosting platform's dashboard.

## 📚 Full Documentation

See `../EMAIL_NOTIFICATION_SETUP.md` for complete setup guide.

---

**Namaa Solar Platform** | Built with ❤️ for renewable energy

