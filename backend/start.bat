@echo off
echo ========================================
echo Starting CertifyPro Backend...
echo ========================================
echo.
echo Using Maven from IntelliJ IDEA
echo Running with dev profile (H2 database)
echo.
echo Backend will start on: http://localhost:8080
echo Swagger UI: http://localhost:8080/swagger-ui.html
echo H2 Console: http://localhost:8080/h2-console
echo.
echo Test Users (password: password123):
echo - john@example.com (INDIVIDUAL)
echo - issuer@certifypro.com (ISSUER)
echo - admin@certifypro.com (ADMIN)
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

set MAVEN_CMD="C:\Program Files\JetBrains\IntelliJ IDEA Community Edition 2025.2\plugins\maven\lib\maven3\bin\mvn.cmd"

%MAVEN_CMD% spring-boot:run -Dspring-boot.run.profiles=dev
