// ===================================
// Authentication JavaScript
// ===================================

// ===================================
// Theme Management
// ===================================
function initTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// ===================================
// Login Form Handler
// ===================================
function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear errors
        clearFormErrors();
        
        // Get form data
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        // Validate
        let hasError = false;
        
        if (!Validator.email(email)) {
            showFieldError('email', 'Please enter a valid email address');
            hasError = true;
        }
        
        if (!password) {
            showFieldError('password', 'Password is required');
            hasError = true;
        }
        
        if (hasError) return;
        
        // Show loading state
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Logging in...';
        
        try {
            const response = await AuthAPI.login(email, password);
            
            if (response.success) {
                Toast.success('Login successful!');

                // Sync local cart to server
                console.log('🔄 Triggering cart sync after login...');
                try {
                    await CartSync.autoSyncAfterLogin();
                } catch (error) {
                    console.error('Cart sync error:', error);
                    // Don't block login if sync fails
                }
                
                // Redirect
                const returnUrl = localStorage.getItem('returnUrl') || 'index.html';
                localStorage.removeItem('returnUrl');
                
                setTimeout(() => {
                    window.location.href = returnUrl;
                }, 500);
            } else {
                Toast.error(response.message || 'Login failed');
                
                // Show field-specific errors
                if (response.errors) {
                    response.errors.forEach(error => {
                        showFieldError(error.field, error.message);
                    });
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            Toast.error('An error occurred. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Login';
        }
    });
}

// ===================================
// Register Form Handler
// ===================================
function initRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear errors
        clearFormErrors();
        
        // Get form data
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;
        
        // Validate
        let hasError = false;
        
        if (!Validator.required(firstName)) {
            showFieldError('firstName', 'First name is required');
            hasError = true;
        }
        
        if (!Validator.required(lastName)) {
            showFieldError('lastName', 'Last name is required');
            hasError = true;
        }
        
        if (!Validator.email(email)) {
            showFieldError('email', 'Please enter a valid email address');
            hasError = true;
        }
        
        if (!Validator.phone(phone)) {
            showFieldError('phone', 'Please enter a valid phone number');
            hasError = true;
        }
        
        if (!Validator.password(password)) {
            showFieldError('password', 'Password must be at least 8 characters with uppercase, lowercase, and number');
            hasError = true;
        }
        
        if (password !== confirmPassword) {
            showFieldError('confirmPassword', 'Passwords do not match');
            hasError = true;
        }
        
        if (!terms) {
            Toast.error('Please accept the terms and conditions');
            hasError = true;
        }
        
        if (hasError) return;
        
        // Show loading state
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Creating account...';
        
        try {
            const response = await AuthAPI.register({
                firstName,
                lastName,
                email,
                phone,
                password
            });
            
            if (response.success) {
                Toast.success('Account created successfully!');
                
                // Sync local cart to server
                console.log('🔄 Triggering cart sync after registration...');
                try {
                    await CartSync.autoSyncAfterLogin();
                } catch (error) {
                    console.error('Cart sync error:', error);
                    // Don't block registration if sync fails
                }

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                Toast.error(response.message || 'Registration failed');
                
                // Show field-specific errors
                if (response.errors) {
                    response.errors.forEach(error => {
                        showFieldError(error.field, error.message);
                    });
                }
            }
        } catch (error) {
            console.error('Registration error:', error);
            Toast.error('An error occurred. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Create Account';
        }
    });
}

// ===================================
// Helper Functions
// ===================================
function showFieldError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorSpan = document.getElementById(`${fieldId}Error`);
    
    if (input) {
        input.classList.add('error');
    }
    
    if (errorSpan) {
        errorSpan.textContent = message;
    }
}

function clearFormErrors() {
    document.querySelectorAll('.form-input').forEach(input => {
        input.classList.remove('error');
    });
    
    document.querySelectorAll('.form-error').forEach(span => {
        span.textContent = '';
    });
}

// ===================================
// Initialize
// ===================================
function init() {
    initTheme();
    
    // Check if already logged in
    if (Auth.isLoggedIn()) {
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage === 'login.html' || currentPage === 'register.html') {
            window.location.href = 'index.html';
            return;
        }
    }
    
    initLoginForm();
    initRegisterForm();
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
