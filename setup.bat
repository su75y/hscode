@echo off
echo Setting up Multi-Tools Hub...

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

:: Install dependencies
echo Installing dependencies...
call npm install

:: Check if MySQL is installed
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo MySQL is not installed. Please install MySQL first.
    pause
    exit /b 1
)

:: Create database and tables
echo Setting up database...
mysql -u root -p < database.sql

:: Create uploads directory if it doesn't exist
if not exist "uploads" mkdir uploads

:: Start the server
echo Starting the server...
npm start

pause 