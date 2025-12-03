# CertifyPro Backend

Spring Boot backend for the CertifyPro Digital Certificate Verification Platform.

## Features

- 🔐 JWT-based authentication with role-based access control
- 📜 Certificate issuance and management
- ✅ Blockchain-based certificate verification
- 🔍 QR code generation for certificates
- 👥 Multi-role support (Individual, Issuer, Employer, Admin)
- 📊 RESTful API with comprehensive endpoints
- 🛡️ Spring Security integration
- 📝 Input validation and error handling
- 📚 Swagger/OpenAPI documentation

## Tech Stack

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security** with JWT
- **Spring Data JPA** with Hibernate
- **PostgreSQL** (production) / **H2** (development)
- **Lombok** for boilerplate reduction
- **MapStruct** for DTO mapping
- **ZXing** for QR code generation
- **Swagger/OpenAPI** for API documentation

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL 14+ (for production) or use H2 (for development)

## Getting Started

### 1. Clone the repository

```bash
cd c:\Projects\Frontend\project\backend
```

### 2. Configure Database

#### For Development (H2 in-memory database)
No configuration needed! Just run with the `dev` profile.

#### For Production (PostgreSQL)
Update `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/certifypro
    username: your_username
    password: your_password
```

### 3. Build the project

```bash
mvn clean install
```

### 4. Run the application

#### Development mode (H2 database with test data)
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

#### Production mode (PostgreSQL)
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## Default Test Users

When running in development mode, the following test users are created:

| Email | Username | Password | Role |
|-------|----------|----------|------|
| admin@certifypro.com | admin | password123 | ADMIN |
| issuer@certifypro.com | issuer | password123 | ISSUER |
| john@example.com | johndoe | password123 | INDIVIDUAL |
| recruiter@techcorp.com | sarah_recruiter | password123 | EMPLOYER |

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/logout` - Logout (client-side)

### Certificates
- `POST /api/certificates/issue` - Issue certificate (ISSUER only)
- `GET /api/certificates/my-certificates` - Get user's certificates
- `GET /api/certificates/issued` - Get issued certificates (ISSUER only)
- `GET /api/certificates/{id}` - Get certificate by ID
- `DELETE /api/certificates/{id}/revoke` - Revoke certificate (ISSUER only)

### Verification
- `POST /api/verify` - Verify certificate by ID
- `GET /api/verify/{certificateId}` - Verify certificate by ID

### Users
- `GET /api/users/profile` - Get current user profile
- `GET /api/users/{username}` - Get user profile by username

## API Documentation

Swagger UI is available at: `http://localhost:8080/swagger-ui.html`

OpenAPI JSON: `http://localhost:8080/v3/api-docs`

## Database Access (Development Mode)

H2 Console is available at: `http://localhost:8080/h2-console`

- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: (leave empty)

## Project Structure

```
src/main/java/com/certifypro/
├── config/              # Configuration classes
│   ├── SecurityConfig.java
│   ├── CorsConfig.java
│   └── DataInitializer.java
├── controller/          # REST Controllers
│   ├── AuthController.java
│   ├── CertificateController.java
│   ├── UserController.java
│   └── VerificationController.java
├── dto/                 # Data Transfer Objects
│   ├── request/
│   └── response/
├── entity/              # JPA Entities
│   ├── User.java
│   ├── Certificate.java
│   ├── Skill.java
│   └── Notification.java
├── exception/           # Exception Handling
│   └── GlobalExceptionHandler.java
├── repository/          # JPA Repositories
├── security/            # Security Components
│   ├── JwtTokenProvider.java
│   ├── JwtAuthenticationFilter.java
│   └── CustomUserDetailsService.java
├── service/             # Business Logic
│   ├── AuthService.java
│   └── CertificateService.java
└── util/                # Utility Classes
    ├── QRCodeGenerator.java
    └── BlockchainUtil.java
```

## Environment Variables

For production, set these environment variables:

```bash
JWT_SECRET=your-secret-key-here
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

## Testing

Run tests with:

```bash
mvn test
```

## Frontend Integration

Update the frontend API base URL to point to this backend:

```typescript
// In frontend: src/services/api.ts
const API = axios.create({
  baseURL: "http://localhost:8080/api",
});
```

## Security Features

- ✅ BCrypt password encryption (strength 12)
- ✅ JWT token authentication (7-day expiration)
- ✅ Role-based access control
- ✅ CORS configuration for frontend
- ✅ Input validation
- ✅ Global exception handling
- ✅ SQL injection prevention (JPA)

## Blockchain Integration

Currently using a mock blockchain implementation with SHA-256 hashing. The structure is ready for real blockchain integration (Ethereum, Hyperledger, etc.).

To integrate with a real blockchain:
1. Update `BlockchainUtil.java` with actual blockchain SDK
2. Configure blockchain network connection
3. Update verification logic

## License

MIT License

## Support

For issues or questions, please create an issue in the repository.
