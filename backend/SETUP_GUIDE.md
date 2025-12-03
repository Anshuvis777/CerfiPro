# Maven Installation & Backend Setup Guide

## 🚀 Quick Solution: Download Maven Manually

Since Maven isn't installed on your system, here are the easiest ways to get the backend running:

---

## Option 1: Install Maven (Recommended)

### Step 1: Download Maven
1. Go to: https://maven.apache.org/download.cgi
2. Download: **apache-maven-3.9.5-bin.zip** (Binary zip archive)

### Step 2: Extract Maven
1. Extract the ZIP file to: `C:\Program Files\Apache\maven`
2. You should have: `C:\Program Files\Apache\maven\bin\mvn.cmd`

### Step 3: Add to PATH
1. Open **System Properties** → **Environment Variables**
2. Under **System Variables**, find **Path** and click **Edit**
3. Click **New** and add: `C:\Program Files\Apache\maven\bin`
4. Click **OK** on all windows

### Step 4: Verify Installation
Open a **NEW** PowerShell window and run:
```powershell
mvn -version
```

### Step 5: Run the Backend
```powershell
cd c:\Projects\Frontend\project\backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

---

## Option 2: Use IntelliJ IDEA (Easiest!)

If you have IntelliJ IDEA installed:

1. **Open the backend folder** in IntelliJ IDEA
2. IntelliJ will automatically detect it's a Maven project
3. Wait for dependencies to download
4. **Right-click** on `CertifyProApplication.java`
5. Select **Run 'CertifyProApplication'**
6. The backend will start automatically!

---

## Option 3: Use VS Code with Java Extension

1. Install **Extension Pack for Java** in VS Code
2. Open the `backend` folder
3. VS Code will detect Maven and download dependencies
4. Press **F5** or click **Run** → **Start Debugging**

---

## Option 4: Manual JAR Build (Advanced)

If you can get Maven installed temporarily:

```powershell
# Build the JAR file
mvn clean package -DskipTests

# Run the JAR
java -jar target/certifypro-backend-1.0.0.jar --spring.profiles.active=dev
```

---

## ✅ Verification

Once Maven is installed and backend is running, you should see:

```
Started CertifyProApplication in X.XXX seconds
```

Then access:
- **Backend API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **H2 Console**: http://localhost:8080/h2-console

---

## 🔗 Test with Frontend

Once backend is running:

1. Your frontend is already running on http://localhost:5173
2. Go to http://localhost:5173/login
3. Login with:
   - **Email**: `john@example.com`
   - **Password**: `password123`
4. You should be logged in successfully!

---

## 🆘 Troubleshooting

### "mvn: command not found" after installation
- Close and reopen PowerShell/Terminal
- Verify PATH was added correctly
- Try: `$env:Path` to see current PATH

### Port 8080 already in use
```powershell
# Find process using port 8080
netstat -ano | findstr :8080

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

### Java not found
Download and install Java 17 from:
https://adoptium.net/temurin/releases/

---

## 📝 Quick Reference

**Test Users** (password: `password123`):
- `john@example.com` - INDIVIDUAL
- `issuer@certifypro.com` - ISSUER
- `admin@certifypro.com` - ADMIN
- `recruiter@techcorp.com` - EMPLOYER

**Key Endpoints**:
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `POST /api/certificates/issue` - Issue certificate (ISSUER)
- `POST /api/verify` - Verify certificate

---

## 💡 Recommended: Use IntelliJ IDEA

The **easiest way** to run the backend is using IntelliJ IDEA Community Edition (free):

1. Download: https://www.jetbrains.com/idea/download/
2. Open the `backend` folder
3. Click the green play button next to `CertifyProApplication`
4. Done! No Maven installation needed.
