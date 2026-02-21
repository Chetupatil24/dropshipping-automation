# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+91234567890"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "customer"
  },
  "token": "jwt_token"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer {token}
```

---

## Products

### Get All Products
```http
GET /products?page=1&limit=20&category=electronics&search=phone
```

**Response:**
```json
{
  "products": [...],
  "total": 100,
  "page": 1,
  "totalPages": 5
}
```

### Get Single Product
```http
GET /products/:id
```

### Get Product by Slug
```http
GET /products/slug/:slug
```

### Create Product (Admin Only)
```http
POST /products
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Product description",
  "price": 999.99,
  "costPrice": 500.00,
  "sku": "PROD-001",
  "stock": 100,
  "category": "Electronics",
  "images": ["image1.jpg", "image2.jpg"],
  "supplierId": "uuid"
}
```

### Update Product (Admin Only)
```http
PUT /products/:id
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "price": 899.99,
  "stock": 150
}
```

### Delete Product (Admin Only)
```http
DELETE /products/:id
Authorization: Bearer {admin_token}
```

---

## Orders

### Create Order
```http
POST /orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "items": [
    {
      "productId": "uuid",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address1": "123 Main St",
    "address2": "Apt 4B",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400001",
    "country": "India",
    "phone": "+919876543210"
  },
  "customerEmail": "john@example.com",
  "customerPhone": "+919876543210"
}
```

**Response:**
```json
{
  "order": {
    "id": "uuid",
    "orderNumber": "ORD-123456",
    "status": "pending",
    "total": 1999.98,
    "items": [...]
  }
}
```

### Get User Orders
```http
GET /orders/my-orders?page=1&limit=10
Authorization: Bearer {token}
```

### Get Single Order
```http
GET /orders/:id
Authorization: Bearer {token}
```

### Track Order
```http
GET /orders/:id/track
```

**Response:**
```json
{
  "orderNumber": "ORD-123456",
  "status": "shipped",
  "trackingNumber": "TRACK123",
  "trackingUrl": "https://shiprocket.co/tracking/TRACK123",
  "shippingProvider": "Shiprocket"
}
```

### Cancel Order
```http
POST /orders/:id/cancel
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "Changed my mind"
}
```

---

## Payments

### Create Payment Order
```http
POST /payments/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "orderId": "uuid"
}
```

**Response:**
```json
{
  "id": "razorpay_order_id",
  "amount": 199998,
  "currency": "INR",
  "keyId": "rzp_test_xxxxx"
}
```

### Verify Payment
```http
POST /payments/verify
Authorization: Bearer {token}
Content-Type: application/json

{
  "razorpay_order_id": "order_xxxxx",
  "razorpay_payment_id": "pay_xxxxx",
  "razorpay_signature": "signature_xxxxx",
  "orderId": "uuid"
}
```

### Handle Payment Failure
```http
POST /payments/failure
Authorization: Bearer {token}
Content-Type: application/json

{
  "orderId": "uuid",
  "error": {
    "description": "Payment failed"
  }
}
```

---

## Admin

### Get Dashboard Metrics
```http
GET /admin/dashboard
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "todayOrders": 25,
  "todaySales": 45000,
  "pendingOrders": 5,
  "totalRevenue": 500000,
  "lowStockCount": 3,
  "lowStockProducts": [...]
}
```

### Get All Orders (Admin)
```http
GET /admin/orders?page=1&limit=20&status=pending&paymentStatus=paid
Authorization: Bearer {admin_token}
```

### Update Order Status
```http
PUT /admin/orders/:id/status
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "shipped",
  "trackingNumber": "TRACK123",
  "trackingUrl": "https://shiprocket.co/tracking/TRACK123",
  "shippingProvider": "Shiprocket"
}
```

### Sync Inventory Manually
```http
POST /admin/sync-inventory
Authorization: Bearer {admin_token}
```

---

## Webhooks

### Razorpay Payment Webhook
```http
POST /webhooks/payment
X-Razorpay-Signature: signature
Content-Type: application/json

{
  "event": "payment.captured",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_xxxxx",
        "amount": 199998,
        "currency": "INR",
        "status": "captured",
        "notes": {
          "orderId": "uuid"
        }
      }
    }
  }
}
```

### Shipping Status Webhook
```http
POST /webhooks/shipping
Content-Type: application/json

{
  "orderId": "uuid",
  "status": "delivered",
  "trackingNumber": "TRACK123"
}
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

---

## Order Status Values

- `pending` - Order created, awaiting payment
- `payment_pending` - Payment initiated
- `payment_failed` - Payment failed
- `confirmed` - Payment successful
- `processing` - Order being prepared
- `shipped` - Order shipped
- `delivered` - Order delivered
- `cancelled` - Order cancelled
- `refunded` - Order refunded

---

## Payment Status Values

- `pending` - Payment not initiated
- `paid` - Payment successful
- `failed` - Payment failed
- `refunded` - Payment refunded

---

## Rate Limits

- **General API:** 100 requests per 15 minutes
- **Auth endpoints:** 5 requests per 15 minutes
- **Payment endpoints:** 10 requests per hour

---

## Example: Complete Order Flow

```javascript
// 1. Register/Login
const { data: auth } = await axios.post('/api/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});

const token = auth.token;

// 2. Browse Products
const { data: products } = await axios.get('/api/products');

// 3. Create Order
const { data: order } = await axios.post('/api/orders', {
  items: [{ productId: 'uuid', quantity: 1 }],
  shippingAddress: {...},
  customerEmail: 'user@example.com',
  customerPhone: '+919876543210'
}, {
  headers: { Authorization: `Bearer ${token}` }
});

// 4. Create Payment
const { data: payment } = await axios.post('/api/payments/create', {
  orderId: order.order.id
}, {
  headers: { Authorization: `Bearer ${token}` }
});

// 5. Process Payment with Razorpay
const options = {
  key: payment.keyId,
  amount: payment.amount,
  currency: payment.currency,
  order_id: payment.id,
  handler: async function(response) {
    // 6. Verify Payment
    await axios.post('/api/payments/verify', {
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
      orderId: order.order.id
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};

const razorpay = new Razorpay(options);
razorpay.open();

// 7. Track Order
const { data: tracking } = await axios.get(`/api/orders/${order.order.id}/track`);
```

---

## Error Response Format

```json
{
  "error": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

---

## Testing

### Test Cards (Razorpay)
- **Success:** 4111 1111 1111 1111
- **Failure:** 4111 1111 1111 1234
- **CVV:** Any 3 digits
- **Expiry:** Any future date

### Test Environment
- Use `rzp_test_` keys for testing
- All test transactions are fake
- No real money is charged
