# 🔌 API Documentation - ELEV8 E-Commerce

## Base URL
```
https://api.yourdomain.com/v1
```

## Authentication
All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer {token}
```

---

## 📋 API Endpoints

### 1. Authentication APIs

#### **POST** `/auth/register`
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "userId": "usr_abc123xyz",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "expiresIn": 86400
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Email already exists",
  "errors": [
    {
      "field": "email",
      "message": "This email is already registered"
    }
  ]
}
```

---

#### **POST** `/auth/login`
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "userId": "usr_abc123xyz",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "expiresIn": 86400
  }
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Invalid credentials",
  "errors": [
    {
      "field": "password",
      "message": "Email or password is incorrect"
    }
  ]
}
```

---

#### **POST** `/auth/refresh`
Refresh access token using refresh token.

**Request:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "token": "new_access_token_here",
    "expiresIn": 86400
  }
}
```

---

#### **GET** `/auth/me`
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer {token}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "userId": "usr_abc123xyz",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "addresses": [
      {
        "id": "addr_123",
        "type": "home",
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "country": "USA",
        "isDefault": true
      }
    ],
    "createdAt": "2026-01-01T00:00:00Z"
  }
}
```

---

#### **POST** `/auth/logout`
Logout user and invalidate token.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### 2. Cart APIs

#### **GET** `/cart`
Get user's cart (requires authentication).

**Headers:**
```
Authorization: Bearer {token}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "cartId": "cart_xyz789",
    "userId": "usr_abc123xyz",
    "items": [
      {
        "cartItemId": "item_001",
        "productId": "prod-001",
        "name": "Artisan Leather Messenger Bag",
        "price": 189.99,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa",
        "subtotal": 379.98
      },
      {
        "cartItemId": "item_002",
        "productId": "prod-003",
        "name": "Premium Wireless Headphones",
        "price": 349.00,
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
        "subtotal": 349.00
      }
    ],
    "itemCount": 3,
    "subtotal": 728.98,
    "tax": 65.61,
    "shipping": 0.00,
    "total": 794.59,
    "updatedAt": "2026-01-05T10:30:00Z"
  }
}
```

**Response (Empty Cart - 200):**
```json
{
  "success": true,
  "data": {
    "cartId": "cart_xyz789",
    "userId": "usr_abc123xyz",
    "items": [],
    "itemCount": 0,
    "subtotal": 0,
    "tax": 0,
    "shipping": 0,
    "total": 0
  }
}
```

---

#### **POST** `/cart/items`
Add item to cart.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "productId": "prod-001",
  "quantity": 2
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Item added to cart",
  "data": {
    "cartItemId": "item_001",
    "productId": "prod-001",
    "quantity": 2,
    "cartTotal": {
      "itemCount": 2,
      "total": 379.98
    }
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Product out of stock",
  "errors": [
    {
      "field": "productId",
      "message": "This product is currently unavailable"
    }
  ]
}
```

---

#### **PUT** `/cart/items/{cartItemId}`
Update cart item quantity.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "quantity": 3
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Cart updated",
  "data": {
    "cartItemId": "item_001",
    "quantity": 3,
    "subtotal": 569.97,
    "cartTotal": {
      "itemCount": 4,
      "total": 918.97
    }
  }
}
```

---

#### **DELETE** `/cart/items/{cartItemId}`
Remove item from cart.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Item removed from cart",
  "data": {
    "cartTotal": {
      "itemCount": 1,
      "total": 349.00
    }
  }
}
```

---

#### **DELETE** `/cart`
Clear entire cart.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Cart cleared"
}
```

---

### 3. Order APIs

#### **POST** `/orders`
Place a new order (COD).

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "street": "123 Main St",
    "apartment": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "billingAddress": {
    "sameAsShipping": true
  },
  "paymentMethod": "COD",
  "notes": "Please call before delivery"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "orderId": "ORD-20260105-ABC123",
    "orderNumber": "ABC123",
    "status": "pending",
    "paymentMethod": "COD",
    "items": [
      {
        "productId": "prod-001",
        "name": "Artisan Leather Messenger Bag",
        "price": 189.99,
        "quantity": 2,
        "subtotal": 379.98
      }
    ],
    "shippingAddress": {
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1234567890",
      "street": "123 Main St",
      "apartment": "Apt 4B",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "pricing": {
      "subtotal": 379.98,
      "tax": 34.20,
      "shipping": 0.00,
      "total": 414.18
    },
    "estimatedDelivery": "2026-01-10T00:00:00Z",
    "createdAt": "2026-01-05T10:30:00Z"
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Order validation failed",
  "errors": [
    {
      "field": "shippingAddress.zipCode",
      "message": "Invalid ZIP code format"
    }
  ]
}
```

---

#### **GET** `/orders`
Get user's order history.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (pending, processing, shipped, delivered, cancelled)

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "orderId": "ORD-20260105-ABC123",
        "orderNumber": "ABC123",
        "status": "processing",
        "itemCount": 2,
        "total": 414.18,
        "paymentMethod": "COD",
        "createdAt": "2026-01-05T10:30:00Z"
      },
      {
        "orderId": "ORD-20260103-XYZ789",
        "orderNumber": "XYZ789",
        "status": "delivered",
        "itemCount": 1,
        "total": 349.00,
        "paymentMethod": "COD",
        "createdAt": "2026-01-03T14:20:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalOrders": 25,
      "limit": 10
    }
  }
}
```

---

#### **GET** `/orders/{orderId}`
Get order details.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "orderId": "ORD-20260105-ABC123",
    "orderNumber": "ABC123",
    "status": "processing",
    "paymentMethod": "COD",
    "paymentStatus": "pending",
    "items": [
      {
        "productId": "prod-001",
        "name": "Artisan Leather Messenger Bag",
        "image": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa",
        "price": 189.99,
        "quantity": 2,
        "subtotal": 379.98
      }
    ],
    "shippingAddress": {
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1234567890",
      "street": "123 Main St",
      "apartment": "Apt 4B",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "pricing": {
      "subtotal": 379.98,
      "tax": 34.20,
      "shipping": 0.00,
      "total": 414.18
    },
    "timeline": [
      {
        "status": "pending",
        "timestamp": "2026-01-05T10:30:00Z",
        "message": "Order placed"
      },
      {
        "status": "processing",
        "timestamp": "2026-01-05T11:00:00Z",
        "message": "Order confirmed and being prepared"
      }
    ],
    "estimatedDelivery": "2026-01-10T00:00:00Z",
    "trackingNumber": null,
    "notes": "Please call before delivery",
    "createdAt": "2026-01-05T10:30:00Z",
    "updatedAt": "2026-01-05T11:00:00Z"
  }
}
```

---

#### **DELETE** `/orders/{orderId}`
Cancel an order (only if status is 'pending').

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "reason": "Changed my mind"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": {
    "orderId": "ORD-20260105-ABC123",
    "status": "cancelled",
    "refundAmount": 414.18,
    "refundMethod": "No payment was made (COD order)"
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Cannot cancel order",
  "errors": [
    {
      "message": "Order is already being processed and cannot be cancelled"
    }
  ]
}
```

---

### 4. Address APIs

#### **POST** `/addresses`
Add new shipping address.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "type": "home",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "street": "123 Main St",
  "apartment": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "USA",
  "isDefault": true
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Address added successfully",
  "data": {
    "addressId": "addr_123",
    "type": "home",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "street": "123 Main St",
    "apartment": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA",
    "isDefault": true
  }
}
```

---

#### **GET** `/addresses`
Get all saved addresses.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "addresses": [
      {
        "addressId": "addr_123",
        "type": "home",
        "firstName": "John",
        "lastName": "Doe",
        "phone": "+1234567890",
        "street": "123 Main St",
        "apartment": "Apt 4B",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "country": "USA",
        "isDefault": true
      }
    ]
  }
}
```

---

## 🔐 Error Codes

| Code | Description |
|------|-------------|
| 400  | Bad Request - Invalid input data |
| 401  | Unauthorized - Invalid or missing token |
| 403  | Forbidden - Insufficient permissions |
| 404  | Not Found - Resource doesn't exist |
| 409  | Conflict - Resource already exists |
| 429  | Too Many Requests - Rate limit exceeded |
| 500  | Internal Server Error |

---

## 📝 Common Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Specific error message"
    }
  ],
  "errorCode": "ERROR_CODE",
  "timestamp": "2026-01-05T10:30:00Z"
}
```

---

## 🔒 Security Notes

1. **Token Expiry**: Access tokens expire in 24 hours
2. **Rate Limiting**: Max 100 requests per minute per IP
3. **HTTPS Only**: All API calls must use HTTPS
4. **CORS**: Configure allowed origins in production
5. **Input Validation**: All inputs are validated and sanitized
6. **SQL Injection**: Use parameterized queries
7. **XSS Protection**: Sanitize all user inputs

---

## 🧪 Testing

### Sample Test User
```
Email: test@elev8.com
Password: TestPass123!
```

### Test API Base URL
```
https://api-staging.elev8.com/v1
```

---

## 📦 Sample Implementation (JavaScript)

```javascript
// Set base URL
const API_BASE_URL = 'https://api.yourdomain.com/v1';

// Get token from localStorage
const getToken = () => localStorage.getItem('authToken');

// Login
async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('authToken', data.data.token);
  }
  return data;
}

// Get Cart
async function getCart() {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return await response.json();
}

// Place Order
async function placeOrder(orderData) {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(orderData)
  });
  return await response.json();
}
```

---

**Last Updated:** January 2026  
**Version:** 1.0.0
