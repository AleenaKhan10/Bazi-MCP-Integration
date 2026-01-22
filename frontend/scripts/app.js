/* =========================================
   BaZi Report Generator - Main JavaScript
   Handles form submission, API calls, and UI
   With comprehensive input validation
   ========================================= */

// API Configuration
const API_BASE_URL = 'http://localhost:8000';  // Backend server URL

// DOM Elements - Get references to all interactive elements
const form = document.getElementById('baziForm');
const submitBtn = document.getElementById('submitBtn');
const spinner = document.getElementById('spinner');
const errorMessage = document.getElementById('errorMessage');
const resultsCard = document.getElementById('resultsCard');
const formCard = document.querySelector('.form-card');

// Result display elements
const baziChars = document.getElementById('baziChars');
const dayMaster = document.getElementById('dayMaster');
const zodiac = document.getElementById('zodiac');
const htmlLink = document.getElementById('htmlLink');
const pdfLink = document.getElementById('pdfLink');
const newReportBtn = document.getElementById('newReportBtn');

/* =========================================
   Input Validation Functions
   ========================================= */

/**
 * Validate birth date
 * - Required
 * - Not in future
 * - Not before 1900
 */
function validateDate(dateStr) {
    if (!dateStr || dateStr.trim() === '') {
        return { valid: false, message: 'Birth date is required' };
    }

    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today

    const minDate = new Date('1900-01-01');

    // Check if valid date
    if (isNaN(date.getTime())) {
        return { valid: false, message: 'Please enter a valid date' };
    }

    // Check not in future
    if (date > today) {
        return { valid: false, message: 'Birth date cannot be in the future' };
    }

    // Check not before 1900
    if (date < minDate) {
        return { valid: false, message: 'Birth date must be after 1900' };
    }

    return { valid: true };
}

/**
 * Validate location
 * - Required
 * - Minimum 3 characters
 */
function validateLocation(location) {
    if (!location || location.trim() === '') {
        return { valid: false, message: 'Birth location is required' };
    }

    const trimmed = location.trim();

    if (trimmed.length < 3) {
        return { valid: false, message: 'Location must be at least 3 characters' };
    }

    if (trimmed.length > 100) {
        return { valid: false, message: 'Location is too long (max 100 characters)' };
    }

    return { valid: true };
}

/**
 * Validate time
 * - Required only
 */
function validateTime(timeStr) {
    if (!timeStr || timeStr.trim() === '') {
        return { valid: false, message: 'Birth time is required' };
    }
    return { valid: true };
}

/**
 * Validate gender
 * - Required
 * - Must be male or female
 */
function validateGender(gender) {
    if (!gender) {
        return { valid: false, message: 'Please select a gender' };
    }

    if (gender !== 'male' && gender !== 'female') {
        return { valid: false, message: 'Gender must be male or female' };
    }

    return { valid: true };
}

/**
 * Validate all form inputs
 * Returns { valid: boolean, errors: string[] }
 */
function validateForm(data) {
    const errors = [];

    // Validate date
    const dateResult = validateDate(data.birth_date);
    if (!dateResult.valid) {
        errors.push(dateResult.message);
    }

    // Validate time
    const timeResult = validateTime(data.birth_time);
    if (!timeResult.valid) {
        errors.push(timeResult.message);
    }

    // Validate location
    const locationResult = validateLocation(data.location);
    if (!locationResult.valid) {
        errors.push(locationResult.message);
    }

    // Validate gender
    const genderResult = validateGender(data.gender);
    if (!genderResult.valid) {
        errors.push(genderResult.message);
    }

    return {
        valid: errors.length === 0,
        errors: errors
    };
}

/* =========================================
   Form Submission Handler
   ========================================= */
form.addEventListener('submit', async (e) => {
    e.preventDefault();  // Stop page reload
    hideError();

    // Get form data
    const formData = new FormData(form);
    const data = {
        birth_date: formData.get('birth_date'),
        birth_time: formData.get('birth_time'),
        location: formData.get('location')?.trim(),
        gender: formData.get('gender')
    };

    // Validate all inputs
    const validation = validateForm(data);
    if (!validation.valid) {
        // Show first error (or all joined)
        showError(validation.errors[0]);
        return;
    }

    // Start loading state
    setLoading(true);
    hideResults();

    try {
        // Call backend API
        const response = await fetch(`${API_BASE_URL}/api/generate-report`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        // Parse response
        const result = await response.json();

        // Check for errors
        if (!response.ok) {
            // Handle rate limit error
            if (response.status === 429) {
                throw new Error('Rate limit exceeded. Please wait a few minutes before trying again.');
            }
            throw new Error(result.detail?.message || result.error || 'Report generation failed');
        }

        // Show results
        displayResults(result);

    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'Something went wrong. Please try again.');
    } finally {
        setLoading(false);
    }
});

/* =========================================
   Display Results
   ========================================= */
function displayResults(result) {
    // Update BaZi summary
    baziChars.textContent = result.bazi_summary['八字'] || '-';
    dayMaster.textContent = result.bazi_summary['日主'] || '-';
    zodiac.textContent = result.bazi_summary['生肖'] || '-';

    // Set download links - Use backend URL for static files
    htmlLink.href = `${API_BASE_URL}${result.files.html}`;
    pdfLink.href = `${API_BASE_URL}${result.files.pdf}`;

    // Show results, hide form
    formCard.style.display = 'none';
    resultsCard.classList.add('visible');

    // Scroll to results
    resultsCard.scrollIntoView({ behavior: 'smooth' });
}

/* =========================================
   New Report Button
   ========================================= */
newReportBtn.addEventListener('click', () => {
    // Reset form
    form.reset();
    hideError();

    // Hide results, show form
    resultsCard.classList.remove('visible');
    formCard.style.display = 'block';

    // Scroll to form
    formCard.scrollIntoView({ behavior: 'smooth' });
});

/* =========================================
   Loading State Helper
   ========================================= */
function setLoading(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
    } else {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
    }
}

/* =========================================
   Error Handling
   ========================================= */
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('visible');

    // Scroll to error
    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function hideError() {
    errorMessage.classList.remove('visible');
    errorMessage.textContent = '';
}

/* =========================================
   Hide Results
   ========================================= */
function hideResults() {
    resultsCard.classList.remove('visible');
}

/* =========================================
   Date Input - Set constraints
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('birthDate');
    const today = new Date().toISOString().split('T')[0];

    // Set date constraints
    dateInput.max = today;           // Can't select future dates
    dateInput.min = '1900-01-01';    // Can't select before 1900

    // Default time if not set
    const timeInput = document.getElementById('birthTime');
    if (!timeInput.value) {
        timeInput.value = '12:00';
    }

    // Add real-time validation on location
    const locationInput = document.getElementById('location');
    locationInput.addEventListener('blur', () => {
        const result = validateLocation(locationInput.value);
        if (!result.valid) {
            locationInput.classList.add('invalid');
        } else {
            locationInput.classList.remove('invalid');
        }
    });
});
