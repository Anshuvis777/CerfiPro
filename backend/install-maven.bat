@echo off
echo ========================================
echo CertifyPro Backend - Maven Installer
echo ========================================
echo.

REM Check if Maven is already installed
where mvn >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Maven is already installed!
    mvn -version
    echo.
    echo Starting backend...
    mvn spring-boot:run -Dspring-boot.run.profiles=dev
    exit /b 0
)

echo Maven is not installed.
echo.
echo Please choose an option:
echo.
echo 1. Download and install Maven automatically (requires admin)
echo 2. Open Maven download page in browser (manual install)
echo 3. View installation instructions
echo 4. Exit
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto auto_install
if "%choice%"=="2" goto manual_install
if "%choice%"=="3" goto show_instructions
if "%choice%"=="4" goto end

:auto_install
echo.
echo Opening Maven download page...
echo Please download apache-maven-3.9.5-bin.zip
echo Extract to C:\Program Files\Apache\maven
echo Then add C:\Program Files\Apache\maven\bin to your PATH
echo.
start https://maven.apache.org/download.cgi
pause
goto end

:manual_install
echo.
echo Opening Maven download page in your browser...
start https://maven.apache.org/download.cgi
echo.
echo After downloading:
echo 1. Extract to: C:\Program Files\Apache\maven
echo 2. Add to PATH: C:\Program Files\Apache\maven\bin
echo 3. Restart PowerShell
echo 4. Run: mvn spring-boot:run -Dspring-boot.run.profiles=dev
echo.
pause
goto end

:show_instructions
echo.
echo ========================================
echo Maven Installation Instructions
echo ========================================
echo.
echo 1. Download Maven from: https://maven.apache.org/download.cgi
echo    (Get apache-maven-3.9.5-bin.zip)
echo.
echo 2. Extract to: C:\Program Files\Apache\maven
echo.
echo 3. Add to System PATH:
echo    - Open System Properties ^> Environment Variables
echo    - Edit 'Path' under System Variables
echo    - Add: C:\Program Files\Apache\maven\bin
echo.
echo 4. Open NEW PowerShell and verify:
echo    mvn -version
echo.
echo 5. Run the backend:
echo    cd c:\Projects\Frontend\project\backend
echo    mvn spring-boot:run -Dspring-boot.run.profiles=dev
echo.
echo ========================================
echo Alternative: Use IntelliJ IDEA
echo ========================================
echo.
echo The EASIEST way is to use IntelliJ IDEA:
echo 1. Download IntelliJ IDEA Community (free)
echo 2. Open the backend folder
echo 3. Click Run button
echo 4. Done!
echo.
pause
goto end

:end
echo.
echo For more help, see SETUP_GUIDE.md
pause
