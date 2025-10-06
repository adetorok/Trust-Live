# Deployment Guide

This guide covers deploying the TRUST Clinical Services platform to production.

## 🚀 Quick Deployment

### 1. Frontend Deployment (GitHub Pages)

The frontend is automatically deployed to GitHub Pages when changes are pushed to the main branch.

**URL**: https://adetorok.github.io/TRUST/

**Configuration**:
- Build command: `npm run build`
- Output directory: `frontend/dist`
- Base path: `/TRUST/`

### 2. Backend Deployment

#### Option A: Heroku
1. Create a new Heroku app
2. Connect to GitHub repository
3. Set environment variables:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/trust
   JWT_SECRET=your-secure-jwt-secret
   JWT_EXPIRES=12h
   PORT=4000
   BASE_URL=https://adetorok.github.io/TRUST/
   NODE_ENV=production
   ```
4. Deploy from main branch

#### Option B: Railway
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

#### Option C: DigitalOcean App Platform
1. Create new app from GitHub
2. Configure build settings
3. Set environment variables
4. Deploy

### 3. Database Setup

#### MongoDB Atlas
1. Create a new cluster
2. Create database user
3. Whitelist IP addresses
4. Get connection string
5. Update `MONGO_URI` in environment variables

## 🔧 Environment Configuration

### Backend Environment Variables

```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/trust

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRES=12h

# Server
PORT=4000
NODE_ENV=production

# CORS
BASE_URL=https://adetorok.github.io/TRUST/

# Optional: Email (if using email features)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Frontend Environment Variables

```env
# API Configuration
VITE_API_URL=https://your-backend-url.com

# Optional: Analytics
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

## 📊 Monitoring & Maintenance

### Health Checks
- Backend: `GET /health`
- Frontend: Check GitHub Pages status

### Logs
- Backend logs available in hosting platform
- Frontend build logs in GitHub Actions

### Database Monitoring
- MongoDB Atlas provides built-in monitoring
- Set up alerts for connection issues

## 🔒 Security Considerations

1. **Environment Variables**: Never commit sensitive data
2. **CORS**: Configure properly for production domains
3. **Rate Limiting**: Already implemented in backend
4. **File Uploads**: Size limits and type validation in place
5. **Authentication**: JWT tokens with expiration

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check `BASE_URL` in backend environment
   - Ensure frontend URL matches exactly

2. **Database Connection**
   - Verify MongoDB Atlas connection string
   - Check IP whitelist settings

3. **File Upload Issues**
   - Check file size limits
   - Verify file type restrictions

4. **Build Failures**
   - Check GitHub Actions logs
   - Verify environment variables

### Support
- Check GitHub Issues
- Contact: info@trustclinicalservices.com

## 📈 Performance Optimization

1. **Frontend**
   - Images optimized
   - Code splitting implemented
   - Lazy loading for components

2. **Backend**
   - Database indexing
   - Rate limiting
   - File upload optimization

3. **Database**
   - Proper indexing on frequently queried fields
   - Connection pooling
   - Query optimization

## 🔄 Updates & Maintenance

### Regular Updates
1. Update dependencies monthly
2. Monitor security advisories
3. Backup database regularly
4. Test deployments in staging

### Backup Strategy
- MongoDB Atlas automatic backups
- Code repository as backup
- Environment variable backup (secure storage)

---

For additional support, please refer to the main README.md or contact the development team.
