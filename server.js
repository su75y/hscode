require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const XLSX = require('xlsx');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const upload = multer({ dest: 'uploads/' });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database connection
const db = new sqlite3.Database('database.sqlite', (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// Admin login route
app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;
    
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign({ username, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Upload Excel file and update database
app.post('/api/admin/upload', verifyToken, upload.single('excelFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        // Validate data structure
        if (!data.every(row => row['HS Code'] && row['Description'])) {
            return res.status(400).json({ message: 'Invalid Excel format. Required columns: HS Code, Description' });
        }

        // Clear existing data
        db.run('DELETE FROM hs_codes', [], (err) => {
            if (err) {
                console.error('Error clearing database:', err);
                return res.status(500).json({ message: 'Error clearing database' });
            }

            // Insert new data
            const stmt = db.prepare('INSERT INTO hs_codes (code, description) VALUES (?, ?)');
            data.forEach(row => {
                stmt.run(row['HS Code'], row['Description']);
            });
            stmt.finalize();

            res.json({ message: 'Database updated successfully' });
        });
    } catch (error) {
        console.error('Error processing Excel file:', error);
        res.status(500).json({ message: 'Error processing Excel file' });
    }
});

// Get all HS codes
app.get('/api/hs-codes', (req, res) => {
    db.all('SELECT code, description FROM hs_codes', [], (err, rows) => {
        if (err) {
            console.error('Error fetching HS codes:', err);
            return res.status(500).json({ message: 'Error fetching HS codes' });
        }
        res.json(rows);
    });
});

// Get database preview (admin only)
app.get('/api/admin/hs-codes', verifyToken, (req, res) => {
    db.all('SELECT code, description FROM hs_codes LIMIT 10', [], (err, rows) => {
        if (err) {
            console.error('Error fetching database preview:', err);
            return res.status(500).json({ message: 'Error fetching database preview' });
        }
        res.json(rows);
    });
});

// Initialize database
function initializeDatabase() {
    db.run(`
        CREATE TABLE IF NOT EXISTS hs_codes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT NOT NULL,
            description TEXT NOT NULL
        )
    `, [], (err) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log('Database initialized successfully');
            // Insert sample data if table is empty
            db.get('SELECT COUNT(*) as count FROM hs_codes', [], (err, row) => {
                if (err) {
                    console.error('Error checking table:', err);
                } else if (row.count === 0) {
                    const sampleData = [
                        ['8525', 'Transmission apparatus for radio-broadcasting or television'],
                        ['8527', 'Reception apparatus for radio-broadcasting'],
                        ['8528', 'Monitors and projectors, not incorporating television reception apparatus']
                    ];
                    const stmt = db.prepare('INSERT INTO hs_codes (code, description) VALUES (?, ?)');
                    sampleData.forEach(([code, description]) => {
                        stmt.run(code, description);
                    });
                    stmt.finalize();
                    console.log('Sample data inserted');
                }
            });
        }
    });
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 