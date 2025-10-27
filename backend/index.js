const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Create email transporter
const createTransporter = () => {
  // Support multiple email providers
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // Use App Password for Gmail
      }
    });
  } else if (process.env.EMAIL_SERVICE === 'smtp') {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  } else {
    // Default to Gmail
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }
};

// Send email notification for new application
const sendApplicationNotification = async (applicationData) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: `New Solar Application Submitted - ${applicationData.projectName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">🌞 New Solar Application Submitted</h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #334155;">Application Details</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Project Name:</td>
              <td style="padding: 8px 0; color: #0f172a;">${applicationData.projectName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Facility Type:</td>
              <td style="padding: 8px 0; color: #0f172a;">${applicationData.facilityType}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Location:</td>
              <td style="padding: 8px 0; color: #0f172a;">${applicationData.location}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: bold;">System Type:</td>
              <td style="padding: 8px 0; color: #0f172a;">${applicationData.systemType}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Status:</td>
              <td style="padding: 8px 0; color: #0f172a;">
                <span style="background-color: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 12px; font-size: 12px;">
                  ${applicationData.status || 'Under Review'}
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: bold;">User ID:</td>
              <td style="padding: 8px 0; color: #0f172a;">${applicationData.userId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Submitted:</td>
              <td style="padding: 8px 0; color: #0f172a;">${new Date(applicationData.createdAt).toLocaleString()}</td>
            </tr>
          </table>
          
          ${applicationData.notes ? `
            <div style="margin-top: 16px;">
              <p style="color: #64748b; font-weight: bold; margin-bottom: 8px;">Notes:</p>
              <p style="color: #0f172a; background-color: white; padding: 12px; border-radius: 6px; margin: 0;">
                ${applicationData.notes}
              </p>
            </div>
          ` : ''}
          
          ${applicationData.loadProfile ? `
            <div style="margin-top: 16px;">
              <p style="color: #64748b; font-weight: bold; margin-bottom: 8px;">Load Profile:</p>
              <p style="color: #0f172a; margin: 0;">${applicationData.loadProfile}</p>
            </div>
          ` : ''}
        </div>
        
        ${applicationData.files && (applicationData.files.bills?.length || applicationData.files.photos?.length || applicationData.files.load?.length) ? `
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #334155;">📎 Uploaded Files</h3>
            
            ${applicationData.files.bills?.length ? `
              <p style="margin: 8px 0;">
                <strong>Energy Bills:</strong> ${applicationData.files.bills.length} file(s)
              </p>
            ` : ''}
            
            ${applicationData.files.photos?.length ? `
              <p style="margin: 8px 0;">
                <strong>Site Photos:</strong> ${applicationData.files.photos.length} file(s)
              </p>
            ` : ''}
            
            ${applicationData.files.load?.length ? `
              <p style="margin: 8px 0;">
                <strong>Load Data:</strong> ${applicationData.files.load.length} file(s)
              </p>
            ` : ''}
          </div>
        ` : ''}
        
        <div style="margin-top: 30px; padding: 20px; background-color: #eff6ff; border-radius: 8px;">
          <p style="margin: 0; color: #1e40af; text-align: center;">
            Log in to your admin dashboard to review and manage this application.
          </p>
        </div>
        
        <div style="margin-top: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
          <p>This is an automated notification from Namaa Solar Platform</p>
          <p style="margin-top: 8px;">
            📧 <a href="mailto:info@namaa.energy" style="color: #64748b;">info@namaa.energy</a> | 
            📞 <a href="tel:+97433085766" style="color: #64748b;">+974 3308 5766</a>
          </p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Namaa Backend Server is running',
    timestamp: new Date().toISOString()
  });
});

// Endpoint to send application notification
app.post('/api/notify/application', async (req, res) => {
  try {
    const applicationData = req.body;
    
    // Validate required fields
    if (!applicationData.projectName || !applicationData.userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: projectName and userId are required' 
      });
    }

    // Send email notification
    const result = await sendApplicationNotification(applicationData);
    
    if (result.success) {
      res.json({ 
        success: true, 
        message: 'Email notification sent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to send email notification',
        details: result.error
      });
    }
  } catch (error) {
    console.error('Error in /api/notify/application:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Test email endpoint (for testing configuration)
app.post('/api/test-email', async (req, res) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: 'Test Email - Namaa Backend',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>✅ Email Configuration Test</h2>
          <p>If you're reading this, your email configuration is working correctly!</p>
          <p><strong>Server Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    res.json({ 
      success: true, 
      message: 'Test email sent successfully',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║   🌞 Namaa Backend Server Running          ║
║                                            ║
║   Port: ${PORT}                              ║
║   Environment: ${process.env.NODE_ENV || 'development'}                 ║
║                                            ║
║   Endpoints:                               ║
║   - GET  /api/health                       ║
║   - POST /api/notify/application           ║
║   - POST /api/test-email                   ║
╚════════════════════════════════════════════╝
  `);
  
  // Check email configuration
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn('⚠️  WARNING: Email credentials not configured. Please set EMAIL_USER and EMAIL_PASSWORD in .env file.');
  } else {
    console.log('✅ Email service configured successfully');
  }
});

module.exports = app;

