# CertifyPro - Blockchain-Based Certificate Verification Platform

CertifyPro is a comprehensive platform for issuing, managing, and verifying digital certificates using blockchain technology. It connects Issuers (Organizations), Holders (Individuals), and Verifiers (Employers/Public) in a secure ecosystem.

## 🚀 Key Features

### 1. Certificate Verification System
*   **Unique Verification IDs**: Every certificate is assigned a unique, 8-character alphanumeric ID (e.g., `A1B2C3`) for easy reference.
*   **QR Code Integration**: Automatically generates QR codes for each certificate using ZXing. Scanning the QR code instantly directs to the verification page.
*   **Public Verification Page**: A dedicated, public-facing page (`/verify/:id`) allows anyone to validate a certificate's authenticity without logging in.
*   **Blockchain Validation**: Verifies the certificate's integrity against its blockchain hash to ensure it hasn't been tampered with.

### 2. Certificate Request & Issuance Workflow
*   **Request System**: Individuals can request certificates directly from registered Issuers via their profile pages.
*   **Approval Dashboard**: Issuers have a dedicated dashboard to view, approve, or reject pending certificate requests.
*   **Automated Issuance**: Upon approval, certificates are automatically generated, signed, and assigned a Verification ID and QR code.

### 3. User Profiles & Management
*   **Individual Profiles**: Showcase earned certificates, skills, and track the status of sent certificate requests.
*   **Issuer Profiles**: Display organization details, issued certificates statistics, and manage incoming requests.
*   **Profile Picture Management**: Users can upload and update their profile pictures, which are securely stored in AWS S3.
*   **Certificate Details Modal**: Interactive popup to view certificate details, download PDF (planned), and copy Verification IDs.

### 4. Security & Technology
*   **Role-Based Access Control**: Distinct roles for Admins, Issuers, and Individuals.
*   **Secure Authentication**: JWT-based authentication for API security.
*   **Public Access Control**: Configured security policies to allow public access to verification endpoints while protecting user data.

## 🛠️ Tech Stack

### Frontend
*   **Framework**: React, TypeScript
*   **Styling**: Tailwind CSS
*   **Animations**: Framer Motion
*   **Icons**: Lucide React
*   **HTTP Client**: Axios

### Backend
*   **Language**: Java 17
*   **Framework**: Spring Boot 3.2.0
*   **Security**: Spring Security with JWT
*   **Database**: PostgreSQL (Production) / H2 (Development)
*   **ORM**: Spring Data JPA with Hibernate
*   **Storage**: AWS SDK for Java (S3)
*   **Utilities**: ZXing (QR Codes), Lombok, MapStruct
*   **Documentation**: Swagger/OpenAPI

## 🏃‍♂️ Getting Started

### Prerequisites
*   Node.js & npm
*   Java JDK 17+
*   Maven 3.6+
*   PostgreSQL 14+ (optional for dev)

### Project Structure

The project is organized into two main directories:

```
project/
├── frontend/        # React + TypeScript application
│   ├── src/
│   ├── package.json
│   └── README.md
├── backend/         # Spring Boot API
│   ├── src/
│   ├── pom.xml
│   └── README.md
└── README.md        # This file
```

### 1. Clone the repository
```bash
git clone <repository-url>
cd project
```

### 2. Backend Setup
Navigate to the backend directory:
```bash
cd backend
```

**Configuration**:
*   **Development (H2)**: No configuration needed. Just run with `dev` profile.
*   **Production (PostgreSQL)**: Update `src/main/resources/application.yml` with your database credentials.

**Run the Backend**:
```bash
# Development mode (H2 database with test data)
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Production mode
mvn spring-boot:run
```
The backend will start on `http://localhost:8080`.

**For detailed backend setup**, see [backend/README.md](backend/README.md) or [backend/SETUP_GUIDE.md](backend/SETUP_GUIDE.md)

### 3. Frontend Setup
Navigate to the frontend directory:
```bash
cd ../frontend
```

**Run the Frontend**:
```bash
npm install
npm run dev
```
The frontend will start on `http://localhost:5173`.

**For detailed frontend setup**, see [frontend/README.md](frontend/README.md)

## 🔑 Default Test Users (Dev Mode)

| Email | Username | Password | Role |
|-------|----------|----------|------|
| admin@certifypro.com | admin | password123 | ADMIN |
| issuer@certifypro.com | issuer | password123 | ISSUER |
| john@example.com | johndoe | password123 | INDIVIDUAL |
| recruiter@techcorp.com | sarah_recruiter | password123 | EMPLOYER |

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/verify` - Verify JWT token

### Certificates
- `POST /api/certificates/issue` - Issue certificate (ISSUER only)
- `GET /api/certificates/my-certificates` - Get user's certificates
- `GET /api/certificates/issued` - Get issued certificates (ISSUER only)
- `GET /api/certificates/{id}` - Get certificate by ID

### Verification
- `GET /api/certificates/verify/{verificationId}` - Public verification by ID (No auth required)
- `POST /api/verify` - Verify certificate by UUID

### Certificate Requests
- `POST /api/requests` - Create a new certificate request
- `GET /api/requests/my-requests` - Get current user's requests
- `GET /api/requests/pending` - Get pending requests (ISSUER only)
- `PUT /api/requests/{id}/approve` - Approve request (ISSUER only)
- `PUT /api/requests/{id}/reject` - Reject request (ISSUER only)

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/profile/picture` - Upload profile picture (S3)
- `DELETE /api/users/profile/picture` - Delete profile picture

## ⚙️ Environment Variables

For production, set these environment variables:

```bash
JWT_SECRET=your-secret-key-here
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
APP_FRONTEND_URL=http://localhost:5173  # For QR code links

# AWS S3 Configuration
AWS_S3_BUCKET_NAME=your-bucket-name
AWS_S3_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

## 📂 Project Structure

```
src/main/java/com/certifypro/
├── config/              # Configuration (Security, S3, CORS)
├── controller/          # REST Controllers
├── dto/                 # Data Transfer Objects
├── entity/              # JPA Entities (User, Certificate, Request)
├── repository/          # JPA Repositories
├── security/            # JWT & Auth Components
├── service/             # Business Logic (Certificates, S3, QR)
└── util/                # Utilities (Blockchain, QR Gen)
```

## 📝 Recent Updates
*   **Fixed**: "NULL not allowed for column VERIFICATION_ID" error during certificate issuance.
*   **Added**: Public verification endpoint `/api/certificates/verify/**`.
*   **UI**: Enhanced profile pages with request tracking and certificate details popups.
*   **Cloud**: Integrated AWS S3 for secure profile picture storage.

## 📄 License
<img width="1896" height="815" alt="image" src="https://github.com/user-attachments/assets/0da66f12-64a3-4f11-aad6-5d45cc236daf" />

<img width="1914" height="816" alt="image" src="https://github.com/user-attachments/assets/f471befc-a64b-49d0-8ca9-a5f16614d93a" />
<img width="1891" height="806" alt="image" src="https://github.com/user-attachments/assets/09ab41e1-c7b5-44d7-94c4-97505c26f033" />
<img width="1879" height="806" alt="image" src="https://github.com/user-attachments/assets/ab057106-4865-4e43-b6d1-89115e27b50e" />
<img width="1872" height="790" alt="image" src="https://github.com/user-attachments/assets/6a7cf9d4-31f2-46ae-bf43-38c3e840844a" />
<img width="1906" height="792" alt="image" src="https://github.com/user-attachments/assets/08408a19-b4d9-4dcc-b9b1-97c2ae112593" />
<img width="1116" height="698" alt="image" src="https://github.com/user-attachments/assets/3f5e120a-4105-4c0b-b82a-9cf08cb3c608" />
<img width="1096" height="821" alt="image" src="https://github.com/user-attachments/assets/3628fb84-03cd-43c8-a4e7-167c5707a28d" />



MIT License
