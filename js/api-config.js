// ===================================
// API Configuration File
// Change backend settings here
// ===================================

// ===================================
// BACKEND SELECTION
// Change this to switch backends: 'supabase', 'rest', or 'mock'
// ===================================
const API_BACKEND_TYPE = 'supabase';

// ===================================
// BACKEND CONFIGURATIONS
// ===================================
const API_BACKENDS = {
    // Supabase Backend Configuration
    supabase: {
        type: 'supabase',
        url: 'https://pmlhajcdqsfxlfvkzljw.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtbGhhamNkcXNmeGxmdmt6bGp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MjMzNTEsImV4cCI6MjA4MzE5OTM1MX0.3nWHcHvZgn96GA1psf7InSReZ7r11x1IDdfKcI9L11M',
        functionsUrl: 'https://pmlhajcdqsfxlfvkzljw.supabase.co/functions/v1'
    },
    
    // Custom REST API Configuration
    rest: {
        type: 'rest',
        baseURL: 'https://api.yourdomain.com/v1',
        timeout: 30000,
        headers: {
            'Content-Type': 'application/json'
        }
    },
    
    // Mock/Development Backend Configuration
    mock: {
        type: 'mock',
        baseURL: 'http://localhost:3000/api/v1',
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json'
        }
    }
};

// ===================================
// HELPER FUNCTIONS
// ===================================

// Get current backend configuration
function getAPIConfig() {
    return API_BACKENDS[API_BACKEND_TYPE];
}

// Check if using Supabase
function isSupabaseBackend() {
    return API_BACKEND_TYPE === 'supabase';
}

// Check if using custom REST API
function isRestBackend() {
    return API_BACKEND_TYPE === 'rest';
}

// Check if using mock backend
function isMockBackend() {
    return API_BACKEND_TYPE === 'mock';
}

// Get backend type
function getBackendType() {
    return API_BACKEND_TYPE;
}

// ===================================
// FEATURE FLAGS (Optional)
// Enable/disable features based on backend
// ===================================
const API_FEATURES = {
    // Real-time updates (Supabase only)
    realtime: isSupabaseBackend(),
    
    // File uploads
    fileUploads: true,
    
    // Advanced search
    advancedSearch: true,
    
    // Email notifications
    emailNotifications: true,
    
    // Push notifications
    pushNotifications: false
};

// ===================================
// API ENDPOINTS (for REST backends)
// These are used when BACKEND_TYPE is 'rest' or 'mock'
// ===================================
const API_ENDPOINTS = {
    // Authentication
    auth: {
        register: '/auth/register',
        login: '/auth/login',
        logout: '/auth/logout',
        profile: '/auth/me',
        refresh: '/auth/refresh'
    },
    
    // Cart
    cart: {
        get: '/cart',
        add: '/cart/items',
        update: (id) => `/cart/items/${id}`,
        remove: (id) => `/cart/items/${id}`,
        clear: '/cart'
    },
    
    // Orders
    orders: {
        create: '/orders',
        list: '/orders',
        get: (id) => `/orders/${id}`,
        cancel: (id) => `/orders/${id}`
    },
    
    // Addresses
    addresses: {
        list: '/addresses',
        create: '/addresses',
        update: (id) => `/addresses/${id}`,
        delete: (id) => `/addresses/${id}`
    }
};

// ===================================
// EXPORT CONFIGURATION
// These will be used by api.js
// ===================================

// Make configuration available globally
window.API_CONFIG = {
    backendType: API_BACKEND_TYPE,
    backend: getAPIConfig(),
    endpoints: API_ENDPOINTS,
    features: API_FEATURES,
    
    // Helper methods
    isSupabase: isSupabaseBackend,
    isRest: isRestBackend,
    isMock: isMockBackend,
    getType: getBackendType
};

console.log('✅ API Config loaded:', window.API_CONFIG.backendType);