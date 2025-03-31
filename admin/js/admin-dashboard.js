// Check if user is logged in
document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (isLoggedIn !== 'true') {
        window.location.href = 'login.html';
        return;
    }

    // Load current database preview
    loadDatabasePreview();
});

// Handle Excel file upload
document.getElementById('excelUploadForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const fileInput = document.getElementById('excelFile');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select a file');
        return;
    }
    
    if (!file.name.endsWith('.xlsx')) {
        alert('Please upload an Excel file (.xlsx)');
        return;
    }
    
    try {
        const formData = new FormData();
        formData.append('excelFile', file);
        
        // In a real application, this would be an API endpoint
        // For demo purposes, we'll simulate the upload
        await simulateExcelUpload(formData);
        
        alert('Database updated successfully!');
        loadDatabasePreview(); // Refresh the preview
    } catch (error) {
        alert('Error updating database: ' + error.message);
    }
});

// Function to simulate Excel upload (replace with actual API call in production)
async function simulateExcelUpload(formData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate successful upload
            resolve();
        }, 1000);
    });
}

// Function to load database preview
async function loadDatabasePreview() {
    try {
        // In a real application, this would fetch from an API
        const previewData = await fetchDatabasePreview();
        
        const tableBody = document.getElementById('databasePreview');
        tableBody.innerHTML = previewData.map(item => `
            <tr>
                <td>${item.code}</td>
                <td>${item.description}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading database preview:', error);
        alert('Error loading database preview');
    }
}

// Function to simulate database preview fetch (replace with actual API call in production)
async function fetchDatabasePreview() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    code: '8525',
                    description: 'Transmission apparatus for radio-broadcasting or television'
                },
                {
                    code: '8527',
                    description: 'Reception apparatus for radio-broadcasting'
                }
            ]);
        }, 500);
    });
}

// Add logout functionality
function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    window.location.href = 'login.html';
} 