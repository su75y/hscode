# Multi-Tools Hub

A web application for managing and searching HS codes, with admin functionality for database updates.

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm (Node Package Manager)

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd multi-tools-hub
```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the following variables in `.env`:
     - `DB_PASSWORD`: Your MySQL root password
     - `JWT_SECRET`: A secure random string for JWT encryption

3. Run the setup script:
```bash
# On Windows
setup.bat

# On Linux/Mac
./setup.sh
```

4. Access the application:
   - Main application: http://localhost:3000
   - Admin login: http://localhost:3000/admin/login.html
     - Username: admin
     - Password: admin123 (change this in .env)

## Excel File Format

When uploading HS codes via Excel, ensure your file has the following format:

| HS Code | Description |
|---------|-------------|
| 8525    | Transmission apparatus for radio-broadcasting... |
| 8527    | Reception apparatus for radio-broadcasting... |

- File must be in .xlsx format
- First row must contain column headers: "HS Code" and "Description"
- HS Code column should contain valid HS codes
- Description column should contain detailed descriptions

## Security Notes

1. Change the default admin credentials in `.env`
2. Use a strong JWT secret key
3. Enable HTTPS in production
4. Regularly backup the database

## Development

To run the application in development mode with auto-reload:

```bash
npm run dev
```

## License

MIT License 