# CertifyPro - Backend

Spring Boot backend API for the CertifyPro platform.

## Tech Stack

- **Spring Boot 3.x**
- **Java 17+**
- **PostgreSQL** for database
- **Spring Security** with JWT authentication
- **Spring Data JPA** for data access
- **Maven** for dependency management

## Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.6+ (or use included Maven wrapper)
- PostgreSQL database

### Database Setup

1. Install PostgreSQL
2. Create a database for CertifyPro
3. Update database configuration in `src/main/resources/application.properties`

### Installation & Running

For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)

**Quick Start:**

```bash
# Using Maven wrapper (Windows)
mvnw.cmd spring-boot:run

# Or use the start script
start.bat
```

The API will be available at `http://localhost:8080`

## Project Structure

```
backend/
├── src/main/java/com/certifypro/
│   ├── controller/      # REST API controllers
│   ├── service/         # Business logic layer
│   ├── repository/      # Data access layer
│   ├── model/           # Entity models
│   ├── dto/             # Data transfer objects
│   ├── config/          # Configuration classes
│   └── security/        # Security & JWT configuration
├── src/main/resources/
│   └── application.properties  # Application configuration
└── pom.xml              # Maven dependencies
```

## API Documentation

Once the application is running, API documentation is available at:
- Swagger UI: `http://localhost:8080/swagger-ui.html` (if configured)

## Key Features

- JWT-based authentication
- Certificate management
- Skill verification
- QR code generation for certificates
- Storage service for certificate files
- Notification system

## Configuration

Edit `src/main/resources/application.properties` to configure:
- Database connection
- JWT secret key
- Server port
- File upload settings
- CORS settings
