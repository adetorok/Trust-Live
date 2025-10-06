# TRUST Clinical Services - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 8+
- MongoDB (local or Atlas)
- Git

### 1. Clone and Install

```bash
git clone https://github.com/adetorok/Trust-Live.git
cd Trust-Live
npm run install:all
```

### 2. Environment Configuration

#### Backend Environment (.env in backend/ directory)
```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/trust

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_EXPIRES=12h

# Server
PORT=4000
NODE_ENV=development

# CORS
BASE_URL=http://localhost:5173

# Optional: Email (if using email features)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

#### Frontend Environment (.env in frontend/ directory)
```env
# API Configuration
VITE_API_URL=http://localhost:4000

# Optional: Analytics
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

### 3. Database Setup

#### Option A: MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new cluster
3. Create database user
4. Whitelist your IP address
5. Get connection string and update `MONGO_URI`

#### Option B: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use `mongodb://localhost:27017/trust` as `MONGO_URI`

### 4. Seed Database

```bash
npm run seed
```

This creates:
- Admin user: `admin@trust.com` / `admin123`
- Sponsor user: `sponsor@acmepharma.com` / `sponsor123`
- Site user: `site@acmemedical.com` / `site123`
- Demo data (sites, studies, participants)

### 5. Start Development

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:4000

## 🔧 Development Commands

```bash
# Install all dependencies
npm run install:all

# Start both frontend and backend
npm run dev

# Start only backend
npm run dev:backend

# Start only frontend
npm run dev:frontend

# Build frontend for production
npm run build

# Seed database with demo data
npm run seed

# Run tests
npm test
```

## 📁 Project Structure

```
Trust-Live/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   └── seed/           # Database seeding
│   └── package.json
├── .github/workflows/       # GitHub Actions
├── package.json            # Root package.json
└── README.md
```

## 👥 User Accounts

After seeding, you can login with:

### Admin
- Email: `admin@trust.com`
- Password: `admin123`
- Access: Full system access

### Sponsor
- Email: `sponsor@acmepharma.com`
- Password: `sponsor123`
- Access: Study and site management

### Site
- Email: `site@acmemedical.com`
- Password: `site123`
- Access: Participant management

## 🚀 Deployment

### Frontend (GitHub Pages)
The frontend automatically deploys to GitHub Pages when you push to the main branch.

**Live URL**: https://adetorok.github.io/TRUST/

### Backend (Production)
1. Set up MongoDB Atlas cluster
2. Configure environment variables
3. Deploy to your preferred hosting service:
   - Heroku
   - Railway
   - DigitalOcean App Platform
   - AWS/GCP/Azure

## 🔒 Security Notes

1. **Never commit `.env` files**
2. **Use strong JWT secrets in production**
3. **Configure CORS properly for production domains**
4. **Set up proper MongoDB Atlas IP whitelisting**
5. **Use HTTPS in production**

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check `BASE_URL` in backend environment
   - Ensure frontend URL matches exactly

2. **Database Connection**
   - Verify MongoDB Atlas connection string
   - Check IP whitelist settings

3. **Build Failures**
   - Check Node.js version (18+)
   - Clear node_modules and reinstall
   - Check for missing environment variables

4. **File Upload Issues**
   - Check file size limits (10MB max)
   - Verify file type restrictions
   - Ensure uploads directory exists

### Getting Help

- Check GitHub Issues
- Review the main README.md
- Contact: info@trustclinicalservices.com

## 📚 Additional Resources

- [Main README](README.md)
- [Deployment Guide](deploy.md)
- [API Documentation](backend/README.md)
- [Frontend Documentation](frontend/README.md)

---

**Happy Coding! 🎉**
