# CertifyPro - Frontend

React + TypeScript frontend application for the CertifyPro platform.

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **TailwindCSS** for styling
- **React Router** for navigation

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
# Build for production
npm run build
```

### Preview Production Build

```bash
# Preview production build locally
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── contexts/       # React contexts (Auth, etc.)
│   ├── services/       # API service layer
│   ├── layouts/        # Layout components
│   └── App.tsx         # Main app component
├── index.html          # HTML entry point
└── vite.config.ts      # Vite configuration
```

## Backend Integration

The frontend connects to the Spring Boot backend API. Make sure to:

1. Start the backend server first (default: `http://localhost:8080`)
2. Update API endpoints in `src/services/` if using different backend URL

## Environment Variables

Create a `.env` file if needed for environment-specific configuration:

```
VITE_API_URL=http://localhost:8080
```
