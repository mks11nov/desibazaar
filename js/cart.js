// ===================================
// Cart Page JavaScript
// ===================================

let cartData = null;

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
// Header Scroll Effect
// ===================================
function initHeader() {
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ===================================
// Load Cart Data
// ===================================
async function loadCart() {
    try {
        if (Auth.isLoggedIn()) {
            // Load from server
            const response = await CartAPI.getCart();
            if (response.success) {
                cartData = response.data;
            } else {
                // Fallback to local cart
                cartData = getLocalCartData();
            }
        } else {
            // Load from local storage
            cartData = getLocalCartData();
        }

        displayCart();
        await Cart.updateCartBadge();
    } catch (error) {
        console.error('Error loading cart:', error);
        cartData = getLocalCartData();
        displayCart();
        // ✅ Update badge even on error
        await Cart.updateCartBadge();
    }
}

// ===================================
// Get Local Cart Data
// ===================================
function getLocalCartData() {
    const localCart = Cart.getLocalCart();
    const totals = Cart.calculateTotal();
    
    return {
        items: localCart.items,
        itemCount: localCart.items.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: parseFloat(totals.subtotal),
        tax: parseFloat(totals.tax),
        shipping: parseFloat(totals.shipping),
        total: parseFloat(totals.total)
    };
}

// ===================================
// Display Cart
// ===================================
function displayCart() {
    const emptyCart = document.getElementById('emptyCart');
    const cartContent = document.getElementById('cartContent');
    const cartItems = document.getElementById('cartItems');

    if (!cartData || cartData.items.length === 0) {
        emptyCart.style.display = 'flex';
        cartContent.style.display = 'none';
        return;
    }

    emptyCart.style.display = 'none';
    cartContent.style.display = 'grid';

    // Render cart items
    cartItems.innerHTML = '';
    cartData.items.forEach(item => {
        const cartItem = createCartItem(item);
        cartItems.appendChild(cartItem);
    });

    // Update summary
    updateCartSummary();
}

// ===================================
// Create Cart Item
// ===================================
function createCartItem(item) {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.dataset.productId = item.productId;

    const subtotal = (item.price * item.quantity).toFixed(2);

    div.innerHTML = `
        <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}" loading="lazy">
        </div>
        
        <div class="cart-item-details">
            <h3 class="cart-item-name">${item.name}</h3>
            <p class="cart-item-price">₹${item.price.toFixed(2)}</p>
        </div>
        
        <div class="cart-item-quantity">
            <button class="qty-btn qty-minus" aria-label="Decrease quantity">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
            </button>
            <input type="number" class="qty-input" value="${item.quantity}" min="1" max="99" aria-label="Quantity">
            <button class="qty-btn qty-plus" aria-label="Increase quantity">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
            </button>
        </div>
        
        <div class="cart-item-subtotal">
            ₹${subtotal}
        </div>
        
        <button class="cart-item-remove" aria-label="Remove item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
        </button>
    `;

    // Quantity controls
    const minusBtn = div.querySelector('.qty-minus');
    const plusBtn = div.querySelector('.qty-plus');
    const qtyInput = div.querySelector('.qty-input');
    const removeBtn = div.querySelector('.cart-item-remove');

    minusBtn.addEventListener('click', () => updateQuantity(item, item.quantity - 1));
    plusBtn.addEventListener('click', () => updateQuantity(item, item.quantity + 1));
    qtyInput.addEventListener('change', (e) => {
        const newQty = parseInt(e.target.value) || 1;
        updateQuantity(item, newQty);
    });
    removeBtn.addEventListener('click', () => removeItem(item));

    return div;
}

// ===================================
// Update Quantity
// ===================================
async function updateQuantity(item, newQuantity) {
    if (newQuantity < 1) {
        removeItem(item);
        return;
    }

    if (newQuantity > 99) {
        Toast.error('Maximum quantity is 99');
        return;
    }

    try {
        if (Auth.isLoggedIn()) {
            const response = await CartAPI.updateItem(item.cartItemId, newQuantity);
            if (response.success) {
                await loadCart();
            } else {
                Toast.error(response.message || 'Failed to update quantity');
            }
        } else {
            Cart.updateLocalCartItem(item.productId, newQuantity);
            await loadCart();
        }
    } catch (error) {
        console.error('Update quantity error:', error);
        Toast.error('Failed to update quantity');
    }
}

// ===================================
// Remove Item
// ===================================
async function removeItem(item) {
    if (!confirm('Remove this item from cart?')) {
        return;
    }

    try {
        if (Auth.isLoggedIn()) {
            const response = await CartAPI.removeItem(item.cartItemId);
            if (response.success) {
                Toast.success('Item removed from cart');
                await loadCart();
            } else {
                Toast.error(response.message || 'Failed to remove item');
            }
        } else {
            Cart.removeFromLocalCart(item.productId);
            Toast.success('Item removed from cart');
            await loadCart();
        }
    } catch (error) {
        console.error('Remove item error:', error);
        Toast.error('Failed to remove item');
    }
}

// ===================================
// Update Cart Summary
// ===================================
function updateCartSummary() {
    document.getElementById('summarySubtotal').textContent = `₹${cartData.subtotal.toFixed(2)}`;
    document.getElementById('summaryTax').textContent = `₹${cartData.tax.toFixed(2)}`;
    document.getElementById('summaryShipping').textContent = cartData.shipping === 0 ? 'FREE' : `₹${cartData.shipping.toFixed(2)}`;
    document.getElementById('summaryTotal').textContent = `₹${cartData.total.toFixed(2)}`;
}

// ===================================
// Checkout
// ===================================
function initCheckout() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    checkoutBtn.addEventListener('click', () => {
        if (!Auth.isLoggedIn()) {
            // Redirect to login with return URL
            localStorage.setItem('returnUrl', 'checkout.html');
            window.location.href = 'login.html';
        } else {
            window.location.href = 'checkout.html';
        }
    });
}

// ===================================
// User Menu
// ===================================
function initUserMenu() {
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');
    
    if (Auth.isLoggedIn()) {
        const user = Auth.getUser();
        userDropdown.innerHTML = `
            <div class="user-info">
                <strong>${user.firstName} ${user.lastName}</strong>
                <span>${user.email}</span>
            </div>
            <a href="orders.html" class="dropdown-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16 3h5v5M4 20L21 3"/>
                    <path d="M21 16v5h-5"/>
                    <path d="M15 15l6 6"/>
                    <path d="M4 4l5 5"/>
                </svg>
                My Orders
            </a>
            <button class="dropdown-item" id="logoutBtn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Logout
            </button>
        `;
        
        document.getElementById('logoutBtn').addEventListener('click', async () => {
            await AuthAPI.logout();
        });
    } else {
        userDropdown.innerHTML = `
            <a href="login.html" class="dropdown-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10 17 15 12 10 7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                Login
            </a>
            <a href="register.html" class="dropdown-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="8.5" cy="7" r="4"/>
                    <line x1="20" y1="8" x2="20" y2="14"/>
                    <line x1="23" y1="11" x2="17" y2="11"/>
                </svg>
                Register
            </a>
        `;
    }
    
    // Toggle dropdown
    userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        userDropdown.classList.remove('show');
    });
}

// ===================================
// Initialize Cart Page
// ===================================
function init() {
    initTheme();
    initHeader();
    initUserMenu();
    initCheckout();
    loadCart();
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
