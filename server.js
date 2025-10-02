import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Helper function to send emails
async function sendEmail(to, subject, text) {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: to,
      subject: subject,
      text: text,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0d9488;">TRACS - Trial Recruitment and Clinical Services</h2>
          <p>Thank you for your interest in our services!</p>
          <p>Click the link below to access your personalized proposal:</p>
          <a href="${text}" style="background-color: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
            Access Your Proposal
          </a>
          <p style="color: #666; font-size: 14px;">This link will expire in 24 hours for security purposes.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', to);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// API Routes

// POST /api/quotes/sponsor
app.post('/api/quotes/sponsor', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, role } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { 
        email: email, 
        scope: 'sponsor',
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        role: role
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    // Create verification link
    const link = `${process.env.BASE_URL || 'http://localhost:5173'}/auth/verify?token=${token}&dest=/sponsor/proposal`;
    
    // Send email
    await sendEmail(email, 'Your Sponsor Proposal - TRACS', link);
    
    // Store lead data (in production, save to database)
    console.log('Sponsor lead:', { firstName, lastName, email, phone, role });
    
    res.json({ success: true, message: 'Check your email for access link' });
  } catch (error) {
    console.error('Error processing sponsor quote:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/quotes/site
app.post('/api/quotes/site', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, role } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { 
        email: email, 
        scope: 'site',
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        role: role
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    // Create verification link
    const link = `${process.env.BASE_URL || 'http://localhost:5173'}/auth/verify?token=${token}&dest=/site/proposal`;
    
    // Send email
    await sendEmail(email, 'Your Site Proposal - TRACS', link);
    
    // Store lead data (in production, save to database)
    console.log('Site lead:', { firstName, lastName, email, phone, role });
    
    res.json({ success: true, message: 'Check your email for access link' });
  } catch (error) {
    console.error('Error processing site quote:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/verify
app.get('/api/auth/verify', (req, res) => {
  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }
    
    // Verify JWT token
    const payload = jwt.verify(token, JWT_SECRET);
    
    res.json({ 
      success: true, 
      email: payload.email, 
      scope: payload.scope,
      firstName: payload.firstName,
      lastName: payload.lastName,
      phone: payload.phone,
      role: payload.role
    });
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

// POST /api/meetings
app.post('/api/meetings', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, company, preferredTimes, path } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !preferredTimes) {
      return res.status(400).json({ error: 'Required fields missing' });
    }
    
    // Send internal notification email
    const notificationEmail = `
      New Meeting Request from TRACS Website:
      
      Name: ${firstName} ${lastName}
      Email: ${email}
      Phone: ${phone || 'Not provided'}
      Company: ${company || 'Not provided'}
      Preferred Times: ${preferredTimes}
      Proposal Type: ${path}
      
      Please follow up within 24 hours.
    `;
    
    await sendEmail(
      process.env.SALES_INBOX || process.env.SMTP_USER, 
      'New Meeting Request - TRACS', 
      notificationEmail
    );
    
    // Store meeting request (in production, save to database)
    console.log('Meeting request:', { firstName, lastName, email, phone, company, preferredTimes, path });
    
    res.json({ success: true, message: 'Meeting request submitted successfully' });
  } catch (error) {
    console.error('Error processing meeting request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend URL: ${process.env.BASE_URL || 'http://localhost:5173'}`);
});

