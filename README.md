# TRUST Clinical Services - Clinical Trial Recruitment Platform

A comprehensive MERN stack application for clinical trial recruitment, connecting sponsors, CROs, clinical sites, and vendors to streamline participant recruitment processes.

## 🏥 Overview

TRUST Clinical Services provides a complete platform for clinical trial recruitment with features including:

- **Nurse-Led Pre-Screening**: Reduce screen-fail rates with professional pre-screening
- **Community Outreach**: IRB-approved materials and targeted recruitment campaigns
- **Role-Based Access Control**: Admin, Sponsor, and Site user interfaces
- **Participant Management**: Complete workflow from potential to enrolled participants
- **File Management**: Document upload and management system
- **Real-Time Analytics**: Dashboard with enrollment tracking and reporting

## 🚀 Live Demo

- **Frontend**: [https://adetorok.github.io/TRUST/](https://adetorok.github.io/TRUST/)
- **Backend API**: [https://api.trustclinicalservices.com](https://api.trustclinicalservices.com)

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **React Helmet Async** for SEO
- **Chart.js** for analytics

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Multer** for file uploads
- **Bcrypt** for password hashing
- **Zod** for validation

### Deployment
- **GitHub Pages** for frontend
- **MongoDB Atlas** for database
- **GitHub Actions** for CI/CD

## 📁 Project Structure

```
trust-clinical-services/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json
├── backend/                 # Node.js backend API
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

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 8+
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/adetorok/Trust-Live.git
   cd Trust-Live
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Setup**
   
   Create `.env` file in the backend directory:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/trust
   JWT_SECRET=your-jwt-secret
   JWT_EXPIRES=12h
   PORT=4000
   BASE_URL=http://localhost:5173
   ```

4. **Seed the database**
   ```bash
   npm run seed
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

   - Frontend: http://localhost:5173
   - Backend: http://localhost:4000

## 👥 User Roles & Access

### Admin
- Full system access
- User management
- Site and study management
- Analytics and reporting
- File upload/download

### Sponsor/CRO
- Study management
- Site assignment
- Participant overview (masked PII)
- Enrollment tracking
- File metadata access

### Site/Vendor
- Participant management
- File upload/download
- Status transitions
- Full PII access for assigned participants

## 📊 Key Features

### Participant Workflow
1. **Potential** → Initial inquiry
2. **PendingConsent** → Consent form sent
3. **Screening** → Pre-screening process
4. **Enrolled** → Successfully enrolled
5. **Completed/Disqualified/Withdrawn** → Final states

### File Management
- Upload participant documents
- Consent forms and screening materials
- Bulk site list uploads
- Role-based access controls
- File type validation

### Analytics Dashboard
- Enrollment tracking
- Site performance metrics
- Participant status distribution
- Real-time updates

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Participants
- `GET /api/participants` - List participants
- `POST /api/participants` - Create participant
- `PUT /api/participants/:id` - Update participant
- `POST /api/participants/:id/transition` - Change status
- `POST /api/participants/:id/notes` - Add notes

### Files
- `POST /api/files/participants/:id/upload` - Upload files
- `GET /api/files/:entityType/:id/files` - List files
- `GET /api/files/download/:fileId` - Download file
- `DELETE /api/files/:fileId` - Delete file

## 🚀 Deployment

### Frontend (GitHub Pages)
1. Push to main branch
2. GitHub Actions automatically builds and deploys
3. Available at: https://adetorok.github.io/TRUST/

### Backend (Production)
1. Set up MongoDB Atlas cluster
2. Configure environment variables
3. Deploy to your preferred hosting service
4. Update frontend API URL

## 📝 Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/trust
JWT_SECRET=your-secure-jwt-secret
JWT_EXPIRES=12h
PORT=4000
BASE_URL=https://adetorok.github.io/TRUST/
NODE_ENV=production
```

### Frontend (.env)
```env
VITE_API_URL=https://api.trustclinicalservices.com
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run backend tests
cd backend && npm test

# Run frontend tests
cd frontend && npm test
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions:
- Email: info@trustclinicalservices.com
- Website: https://trustclinicalservices.com

## 🔗 Links

- [Live Demo](https://adetorok.github.io/TRUST/)
- [API Documentation](https://api.trustclinicalservices.com/docs)
- [GitHub Repository](https://github.com/adetorok/Trust-Live)

---

**TRUST Clinical Services** - Accelerating Clinical Trial Recruitment Through Technology