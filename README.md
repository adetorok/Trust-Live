# TRUST - Trial Recruitment & Unified Subject Services

A clinical trial recruitment platform built with React (frontend) and Node.js/Express (backend).

## 🏗️ Monorepo Structure

```
/
├── frontend/          # React + Vite frontend
│   ├── public/        # Static assets
│   ├── src/           # Source code
│   ├── package.json   # Frontend dependencies
│   └── vite.config.js # Vite configuration
├── backend/           # Node.js + Express API
│   ├── src/           # Server source code
│   ├── package.json   # Backend dependencies
│   └── .env.example   # Environment variables template
├── .github/workflows/ # CI/CD workflows
└── backup/            # Original structure backup
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn
- MongoDB database

### Frontend Development

```bash
cd frontend
npm ci
npm run dev          # Start development server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend Development

```bash
cd backend
npm ci
cp .env.example .env  # Copy and configure environment variables
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm run seed         # Seed database (optional)
```

### Environment Variables

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:4000/api
```

#### Backend (.env)
```env
NODE_ENV=development
PORT=4000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES=7d
BASE_URL=http://localhost:5173
```

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm run build        # Should complete without errors
npm run preview      # Should serve on http://localhost:4173
```

### Backend Tests
```bash
cd backend
npm start            # Should start on http://localhost:4000
curl http://localhost:4000/health  # Should return {"ok":true}
```

## 🚀 Deployment

### Frontend (GitHub Pages)
The frontend is automatically deployed to GitHub Pages when pushing to the `main` branch.

### Backend
Deploy the backend to your preferred hosting service (Heroku, Railway, etc.).

## 📁 What Moved

- **Frontend**: All React code moved to `/frontend/`
- **Backend**: All API/server code moved to `/backend/`
- **Assets**: Static images moved to `/frontend/public/`
- **Configuration**: Environment files created for both apps

## 🔄 Rollback Plan

If you need to rollback to the original structure:

1. Checkout the backup: `git checkout backup/original-20251004-183514/ -- .`
2. Or restore from the backup directory: `cp -r backup/original-20251004-183514/* .`

## 🛠️ Development Commands

### Full Stack Development
```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

### Production Build
```bash
# Build frontend
cd frontend && npm run build

# Start backend
cd backend && npm start
```

## 📝 Notes

- The original structure is preserved in `backup/original-20251004-183514/`
- All paths and imports have been updated for the new structure
- Environment variables are properly configured for both development and production
- CI/CD workflow is set up for automatic frontend deployment