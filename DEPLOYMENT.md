# CertifyPro Deployment Guide

This guide outlines the steps to deploy the CertifyPro application (Backend + Frontend) to a production environment.

## 📋 Prerequisites

*   **Server/Cloud Instance**: A server (e.g., AWS EC2, DigitalOcean Droplet) or Cloud Platform (e.g., Render, Railway, AWS).
*   **Database**: PostgreSQL database instance (e.g., Render Postgres, Railway Postgres, Supabase, or AWS RDS).
*   **Storage**: AWS S3 Bucket for profile pictures.
*   **Tools**: Java 17 (JDK), Maven, Node.js (v18+), Git.

---

## 🛠️ 1. Backend Deployment (Spring Boot)

### Step 1.1: Prepare Environment Variables
The backend relies on environment variables for sensitive configuration. Set these on your server or cloud platform:

```bash
# Database Configuration
export DATABASE_URL=jdbc:postgresql://<your-db-host>:5432/<your-db-name>
export DB_USERNAME=<your-db-username>
export DB_PASSWORD=<your-db-password>

# Security
export JWT_SECRET=<your-secure-random-secret-key> # Generate a long random string (min 256-bit)

# Mail Configuration (Gmail App Password)
export MAIL_USERNAME=<your-email@gmail.com>
export MAIL_PASSWORD=<your-app-password>

# AWS S3 Configuration (CRITICAL: Do not hardcode these!)
export AWS_S3_BUCKET_NAME=<your-bucket-name>
export AWS_S3_REGION=<your-region> # e.g., ap-southeast-2
export AWS_ACCESS_KEY_ID=<your-access-key>
export AWS_SECRET_ACCESS_KEY=<your-secret-key>

# Frontend URL (for CORS and QR Codes)
export APP_FRONTEND_URL=https://<your-frontend-domain.com>

# Active Profile
export SPRING_PROFILES_ACTIVE=prod
```

### Step 1.2: Build the JAR File
Navigate to the backend directory and build the application:

```bash
cd backend
./mvnw clean package -DskipTests
```
This will generate a JAR file in `target/certifypro-backend-1.0.0.jar`.

### Step 1.3: Run the Application
Run the JAR file:

```bash
java -jar target/certifypro-backend-1.0.0.jar
```
*Note: For a real server, use a process manager like `systemd` or `pm2` to keep the app running.*

---

## 🌐 2. Frontend Deployment (React)

### Step 2.1: Update API Configuration
Ensure your frontend code points to the production backend URL.
The frontend uses `VITE_API_URL` to determine the backend location.

### Step 2.2: Set Environment Variables
Set this in your CI/CD pipeline (e.g., Vercel, Netlify):

```env
VITE_API_URL=https://<your-backend-domain.com>/api
```

### Step 2.3: Build the Static Files
Build the frontend:

```bash
cd frontend
npm install
npm run build
```
This creates a `dist` folder containing the optimized static files.

### Step 2.4: Serve the Application
*   **Vercel/Netlify**: Connect your repo, set root directory to `frontend`, build command to `npm run build`, and publish directory to `dist`.
*   **Nginx/Apache**: Configure to serve the `dist` folder as the root.

---

## 🔄 3. Code Changes Applied

The project is now fully configured for secure deployment:
1.  **Security**: AWS Credentials, JWT Secret, and Database credentials are all pulled from environment variables.
2.  **Database**: Configured to use PostgreSQL for production while maintaining H2 support for local development (`dev` profile).
3.  **CORS**: Dynamically allows your production frontend URL.

---

## 🚀 Summary Checklist

1.  [ ] **PostgreSQL**: Database is running and credentials are ready.
2.  [ ] **AWS S3**: Bucket is created and IAM user keys are generated.
3.  [ ] **Backend**: Env vars (`DATABASE_URL`, `AWS_SECRET_ACCESS_KEY`, etc.) are set on the host.
4.  [ ] **Frontend**: `VITE_API_URL` is set pointing to the backend.
5.  [ ] **Verification**: Login works, file uploads to S3 work, and certificates are generated correctly.

