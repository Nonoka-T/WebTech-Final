// Regex patterns
const patterns = {
    // Letters and spaces only between 2 and 50 characters long.
    name: /^[a-zA-Z\s]{2,50}$/,
    // Basic email format: some text, then "@", then text, then "." then 2+ characters.
    email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    // Any characters (including line breaks) at least 10 characters long.
    message: /^[\s\S]{10,}$/,
};

//  Element references 
const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const successMsg = document.getElementById('success-msg');

const fields = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    message: document.getElementById('message'),
};

const errors = {
    name: document.getElementById('name-error'),
    email: document.getElementById('email-error'),
    message: document.getElementById('message-error'),
};

// Validate a single field 
function validateField(fieldName) {
    const value = fields[fieldName].value.trim();
    const isValid = patterns[fieldName].test(value);
    
    if (isValid) {
        errors[fieldName].classList.remove('is-visible');
        fields[fieldName].classList.remove('is-invalid');
    }   else {
        errors[fieldName].classList.add('is-visible');
        fields[fieldName].classList.add('is-invalid');
    }
    
    return isValid;
}

// Check all fields, enable/disable submit 
function updateSubmitState() {
    const allValid = Object.keys(patterns).every((fieldName) => {
        return patterns[fieldName].test(fields[fieldName].value.trim());
    });
    
    submitBtn.disabled = !allValid;
}

//Event listeners 
Object.keys(fields).forEach((fieldName) => {
    fields[fieldName].addEventListener('input', () => {
        validateField(fieldName);
        updateSubmitState();
    });
});

//Form submit 
form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const nameValid = validateField('name');
    const emailValid = validateField('email');
    const messageValid = validateField('message');
    
    if (!nameValid || !emailValid || !messageValid) {
        return;
    }

    // All valid - show success message, hide form
    form.classList.add('is-hidden');
    successMsg.classList.add('is-visible');
});