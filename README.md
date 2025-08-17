# MedMaster Landing Site

A standalone landing page for MedMaster built with React, TypeScript, and Vite.

## 🚀 Features

- **Modern Stack**: React 18, TypeScript, Vite, Tailwind CSS
- **Authentication**: Firebase Auth integration with email/password and Google sign-in
- **Payment Integration**: Stripe payment processing for subscriptions
- **Responsive Design**: Mobile-first responsive design
- **Performance Optimized**: Code splitting, lazy loading, and optimized builds
- **SEO Ready**: Meta tags and structured data

## 🛠️ Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required environment variables:
- `VITE_API_URL`: Backend API URL
- `VITE_FIREBASE_*`: Firebase configuration
- `VITE_APP_ENV`: Environment (development/production)

### Development Server

```bash
npm run dev
```

Runs on `http://localhost:3001`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🚀 Deployment

### Vercel Deployment

The site is configured for deployment on Vercel:

```bash
# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy
```

### Domain Configuration

- **Production**: `medmaster.site`
- **Staging**: Auto-generated Vercel URL

### Environment Variables (Production)

Set these in Vercel dashboard:

```
VITE_API_URL=https://your-backend-domain.com
VITE_APP_ENV=production
VITE_FIREBASE_API_KEY=your-production-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## 🏗️ Architecture

### Project Structure

```
src/
├── components/          # React components
├── contexts/           # React contexts (Auth, etc.)
├── hooks/              # Custom React hooks
├── services/           # API services
├── config/             # Configuration files
├── utils/              # Utility functions
└── main.tsx           # App entry point
```

### Key Components

- **LandingPage**: Main landing page with hero, features, pricing
- **AuthModal**: Authentication modal with login/signup
- **PricingPage**: Subscription plans and payment
- **AuthContext**: Global authentication state management

## 🔗 Integration

### Backend API

Connects to the shared MedMaster backend for:
- User authentication
- Subscription management
- Payment processing

### Cross-Origin Setup

Configured for cross-origin authentication between:
- Landing site: `medmaster.site`
- Main app: `app.medmaster.com`

## 📝 Notes

- Built as a separate application from the main MedMaster app
- Shares authentication and payment systems
- Optimized for conversion and performance
- Mobile-first responsive design