# 🔧 Implementation Guide for Backend Developers

## Overview
This guide helps you implement the backend API to support the ELEV8 e-commerce frontend with cart, authentication, and COD order functionality.

---

## 📋 Prerequisites

### Required Technologies
- **Backend Framework**: Node.js (Express), Python (Django/Flask), PHP (Laravel), or any REST API framework
- **Database**: PostgreSQL, MySQL, or MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Email Service**: SendGrid, AWS SES, or similar (for order confirmations)

### Frontend Configuration
Update the API base URL in `/js/api.js`:
```javascript
const API_CONFIG = {
    baseURL: 'https://your-api-domain.com/v1',  // Change this!
    timeout: 30000
};
```

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    user_id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Addresses Table
```sql
CREATE TABLE addresses (
    address_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    type ENUM('home', 'work', 'other') DEFAULT 'home',
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    street VARCHAR(255) NOT NULL,
    apartment VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

### Carts Table
```sql
CREATE TABLE carts (
    cart_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

### Cart Items Table
```sql
CREATE TABLE cart_items (
    cart_item_id VARCHAR(50) PRIMARY KEY,
    cart_id VARCHAR(50) NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES carts(cart_id) ON DELETE CASCADE
);
```

### Orders Table
```sql
CREATE TABLE orders (
    order_id VARCHAR(50) PRIMARY KEY,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    payment_method VARCHAR(50) NOT NULL,
    payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    subtotal DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) NOT NULL,
    shipping DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    notes TEXT,
    tracking_number VARCHAR(100),
    estimated_delivery DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

### Order Items Table
```sql
CREATE TABLE order_items (
    order_item_id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_image VARCHAR(500),
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);
```

### Shipping Addresses (for orders)
```sql
CREATE TABLE order_shipping_addresses (
    id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    street VARCHAR(255) NOT NULL,
    apartment VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);
```

### Order Timeline Table
```sql
CREATE TABLE order_timeline (
    id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);
```

---

## 🔐 Authentication Implementation

### JWT Token Structure
```javascript
{
  "userId": "usr_abc123xyz",
  "email": "user@example.com",
  "iat": 1704470400,  // Issued at
  "exp": 1704556800   // Expires in 24 hours
}
```

### Password Hashing
- Use **bcrypt** with salt rounds = 10
- Never store plain-text passwords

### Example (Node.js):
```javascript
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Hash password
const hashedPassword = await bcrypt.hash(password, 10);

// Verify password
const isValid = await bcrypt.compare(inputPassword, hashedPassword);

// Generate token
const token = jwt.sign(
    { userId: user.userId, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
);

// Verify token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

---

## 🛒 Cart Logic Implementation

### Calculate Cart Totals
```javascript
function calculateCartTotals(cartItems, products) {
    let subtotal = 0;
    
    cartItems.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
            subtotal += product.price * item.quantity;
        }
    });
    
    const tax = subtotal * 0.09; // 9% tax
    const shipping = subtotal >= 100 ? 0 : 15; // Free over $100
    const total = subtotal + tax + shipping;
    
    return {
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        shipping: parseFloat(shipping.toFixed(2)),
        total: parseFloat(total.toFixed(2))
    };
}
```

### Add to Cart Logic
```javascript
async function addToCart(userId, productId, quantity) {
    // 1. Get or create cart for user
    let cart = await Cart.findOne({ userId });
    if (!cart) {
        cart = await Cart.create({ 
            cartId: generateId('cart_'),
            userId 
        });
    }
    
    // 2. Check if product already in cart
    let cartItem = await CartItem.findOne({ 
        cartId: cart.cartId, 
        productId 
    });
    
    if (cartItem) {
        // Update quantity
        cartItem.quantity += quantity;
        await cartItem.save();
    } else {
        // Add new item
        await CartItem.create({
            cartItemId: generateId('item_'),
            cartId: cart.cartId,
            productId,
            quantity
        });
    }
    
    return cart;
}
```

---

## 📦 Order Placement Logic

### Create Order Process
```javascript
async function createOrder(userId, orderData) {
    // 1. Get cart items
    const cart = await getCartWithItems(userId);
    if (!cart || cart.items.length === 0) {
        throw new Error('Cart is empty');
    }
    
    // 2. Calculate totals
    const totals = calculateCartTotals(cart.items);
    
    // 3. Generate order number
    const orderNumber = generateOrderNumber(); // e.g., ABC123
    const orderId = `ORD-${new Date().toISOString().split('T')[0]}-${orderNumber}`;
    
    // 4. Create order
    const order = await Order.create({
        orderId,
        orderNumber,
        userId,
        status: 'pending',
        paymentMethod: 'COD',
        paymentStatus: 'pending',
        ...totals,
        notes: orderData.notes || '',
        estimatedDelivery: getEstimatedDelivery() // +7 days
    });
    
    // 5. Create order items
    for (const item of cart.items) {
        await OrderItem.create({
            orderItemId: generateId('oi_'),
            orderId: order.orderId,
            productId: item.productId,
            productName: item.name,
            productImage: item.image,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity
        });
    }
    
    // 6. Save shipping address
    await OrderShippingAddress.create({
        id: generateId('addr_'),
        orderId: order.orderId,
        ...orderData.shippingAddress
    });
    
    // 7. Create timeline entry
    await OrderTimeline.create({
        id: generateId('tl_'),
        orderId: order.orderId,
        status: 'pending',
        message: 'Order placed'
    });
    
    // 8. Clear cart
    await CartItem.deleteMany({ cartId: cart.cartId });
    
    // 9. Send confirmation email
    await sendOrderConfirmationEmail(userId, order);
    
    return order;
}
```

### Order Number Generation
```javascript
function generateOrderNumber() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
```

---

## 📧 Email Notifications

### Order Confirmation Email
```javascript
async function sendOrderConfirmationEmail(userId, order) {
    const user = await User.findOne({ userId });
    
    const emailData = {
        to: user.email,
        subject: `Order Confirmation - #${order.orderNumber}`,
        template: 'order-confirmation',
        data: {
            userName: `${user.firstName} ${user.lastName}`,
            orderNumber: order.orderNumber,
            orderId: order.orderId,
            items: order.items,
            total: order.total,
            estimatedDelivery: order.estimatedDelivery
        }
    };
    
    await emailService.send(emailData);
}
```

---

## 🔒 Security Best Practices

### Input Validation
```javascript
// Example validation middleware
function validateOrderData(req, res, next) {
    const schema = Joi.object({
        shippingAddress: Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            phone: Joi.string().pattern(/^[\d\s\-\+\(\)]+$/).required(),
            street: Joi.string().required(),
            city: Joi.string().required(),
            state: Joi.string().required(),
            zipCode: Joi.string().pattern(/^\d{5}(-\d{4})?$/).required(),
            country: Joi.string().required()
        }),
        paymentMethod: Joi.string().valid('COD').required(),
        notes: Joi.string().allow('')
    });
    
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: error.details.map(d => ({
                field: d.path.join('.'),
                message: d.message
            }))
        });
    }
    
    next();
}
```

### Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    message: {
        success: false,
        message: 'Too many requests, please try again later'
    }
});

app.use('/api/', limiter);
```

### CORS Configuration
```javascript
const cors = require('cors');

app.use(cors({
    origin: ['https://yourdomain.com', 'http://localhost:8000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## 🧪 Testing API Endpoints

### Using cURL
```bash
# Register
curl -X POST https://api.yourdomain.com/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","firstName":"John","lastName":"Doe","phone":"+1234567890"}'

# Login
curl -X POST https://api.yourdomain.com/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Get Cart (authenticated)
curl -X GET https://api.yourdomain.com/v1/cart \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Add to Cart
curl -X POST https://api.yourdomain.com/v1/cart/items \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"productId":"prod-001","quantity":2}'

# Place Order
curl -X POST https://api.yourdomain.com/v1/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d @order-data.json
```

---

## 🚀 Deployment Checklist

### Environment Variables
```bash
# .env file
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/elev8
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRY=24h
CORS_ORIGIN=https://yourdomain.com
EMAIL_SERVICE_API_KEY=your-email-api-key
```

### Production Settings
- [ ] Enable HTTPS only
- [ ] Set secure cookie flags
- [ ] Enable CORS for production domain only
- [ ] Set up database backups
- [ ] Configure logging (Winston, Morgan, etc.)
- [ ] Set up error monitoring (Sentry, Rollbar)
- [ ] Enable rate limiting
- [ ] Use connection pooling for database
- [ ] Set up CDN for static assets
- [ ] Configure email service
- [ ] Test all API endpoints
- [ ] Load testing with 1000+ concurrent users

---

## 📊 Monitoring & Analytics

### Key Metrics to Track
- Order conversion rate
- Cart abandonment rate
- Average order value
- Registration rate
- API response times
- Error rates by endpoint
- User retention

### Recommended Tools
- **APM**: New Relic, DataDog
- **Logging**: ELK Stack, Loggly
- **Analytics**: Google Analytics, Mixpanel

---

## 🆘 Troubleshooting

### Common Issues

**Issue**: CORS errors in browser
**Solution**: Check CORS configuration, ensure frontend domain is whitelisted

**Issue**: JWT token expired
**Solution**: Implement token refresh logic, frontend already handles 401 responses

**Issue**: Cart not syncing after login
**Solution**: Merge local cart with server cart on login

**Issue**: Orders not creating
**Solution**: Check database constraints, validate all required fields

---

## 📞 Support

For implementation questions:
1. Review API documentation: `/API-DOCUMENTATION.md`
2. Check request/response samples
3. Test with Postman collection (create from docs)
4. Review frontend code in `/js/api.js`

---

**Last Updated**: January 2026
**API Version**: 1.0.0
