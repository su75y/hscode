// Function to fetch HS codes from database
async function fetchHSCodes() {
    try {
        // In a real application, this would be an API endpoint
        const response = await fetch('/api/hs-codes');
        if (!response.ok) {
            throw new Error('Failed to fetch HS codes');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching HS codes:', error);
        return [];
    }
}

// Function to search HS codes
async function searchHSCodes(query) {
    query = query.toLowerCase();
    const hsCodes = await fetchHSCodes();
    
    return hsCodes.filter(item => 
        item.code.includes(query) ||
        item.description.toLowerCase().includes(query)
    );
}

// Function to display search results
function displayResults(results) {
    const resultsContainer = document.getElementById('searchResults');
    const tableBody = document.getElementById('resultsTableBody');
    
    if (results.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="2" class="text-center">No results found. Please try a different search term.</td>
            </tr>
        `;
    } else {
        tableBody.innerHTML = results.map(item => `
            <tr>
                <td>${item.code}</td>
                <td>${item.description}</td>
            </tr>
        `).join('');
    }
    
    resultsContainer.classList.remove('d-none');
}

// Handle form submission
document.getElementById('hsCodeSearchForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (query) {
        const results = await searchHSCodes(query);
        displayResults(results);
    }
});

// Add input event listener for real-time search
document.getElementById('searchInput').addEventListener('input', async function(e) {
    const query = e.target.value.trim();
    if (query) {
        const results = await searchHSCodes(query);
        displayResults(results);
    } else {
        document.getElementById('searchResults').classList.add('d-none');
    }
}); 