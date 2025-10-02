# TRACS - Trial Recruitment and Clinical Services

A comprehensive web application for clinical trial recruitment services, built with React frontend and Node.js/Express backend.

## Features

- **Dual User Flows**: Separate landing pages and proposals for Sponsors/CROs and Sites/Vendors
- **Magic Link Authentication**: Secure email-based access to proposal pages
- **Interactive Cost Calculators**: Real-time pricing for different service configurations
- **Meeting Request System**: Integrated scheduling for follow-up meetings
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

## Project Structure

```
tracs-app/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── utils/           # API and auth utilities
│   │   └── App.jsx          # Main app component
│   ├── package.json
│   └── vite.config.js
├── server.js                 # Express backend
├── package.json              # Root package.json
└── env.example              # Environment variables template
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Email service credentials (Gmail, SendGrid, etc.)

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd tracs-app
   npm run install-all
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   JWT_SECRET=your-super-secret-jwt-key
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   SALES_INBOX=sales@tracs-recruitment.com
   FRONTEND_URL=http://localhost:5173
   PORT=4000
   ```

3. **Start the development servers:**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on http://localhost:4000
   - Frontend development server on http://localhost:5173

### Production Deployment

1. **Build the frontend:**
   ```bash
   npm run build
   ```

2. **Start the production server:**
   ```bash
   npm start
   ```

## User Flows

### 1. Sponsor/CRO Flow
1. Visit `/sponsor` landing page
2. Fill out quote request form
3. Receive email with magic link
4. Click link to access `/sponsor/proposal`
5. Use interactive cost calculator
6. Request meeting for finalization

### 2. Site/Vendor Flow
1. Visit `/site` landing page
2. Fill out quote request form
3. Receive email with magic link
4. Click link to access `/site/proposal`
5. Use interactive cost calculator
6. Request meeting for finalization

## API Endpoints

- `POST /api/quotes/sponsor` - Submit sponsor quote request
- `POST /api/quotes/site` - Submit site quote request
- `GET /api/auth/verify` - Verify magic link token
- `POST /api/meetings` - Submit meeting request

## Technology Stack

### Frontend
- React 18
- React Router DOM
- Chart.js (for data visualization)
- Tailwind CSS
- Vite (build tool)

### Backend
- Node.js
- Express.js
- JWT (authentication)
- Nodemailer (email service)
- CORS (cross-origin requests)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `JWT_SECRET` | Secret key for JWT token signing | Yes |
| `EMAIL_USER` | Email service username | Yes |
| `EMAIL_PASS` | Email service password/app password | Yes |
| `SALES_INBOX` | Email for meeting request notifications | No |
| `FRONTEND_URL` | Frontend URL for email links | Yes |
| `PORT` | Server port | No (default: 4000) |

## Email Configuration

The application uses Nodemailer for sending emails. Configure your email service:

### Gmail
1. Enable 2-factor authentication
2. Generate an App Password
3. Use your Gmail address and app password in `.env`

### Other Services
Update the transporter configuration in `server.js` for your preferred email service.

## Security Features

- JWT tokens with 24-hour expiration
- Email domain validation (blocks personal emails)
- CORS protection
- Input validation and sanitization
- Secure session management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

