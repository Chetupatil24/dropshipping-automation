# Dropshipping Automation Platform

A fully automated dropshipping system with supplier integration, payment processing, order automation, and real-time inventory sync.

## Features

- 🚀 **Automated Order Processing** - From payment to supplier fulfillment
- 📦 **Real-time Inventory Sync** - Auto-sync with suppliers every hour
- 💳 **Payment Integration** - Razorpay for Indian market
- 🚚 **Shipping Automation** - Shiprocket & Delhivery integration
- 📊 **Admin Dashboard** - Real-time analytics and monitoring
- 💬 **Customer Support Bot** - AI-powered chatbot using Claude
- 📱 **WhatsApp & SMS** - Automated customer notifications
- 🔄 **Dynamic Pricing** - Auto-adjust based on competition
- 🌐 **PWA Frontend** - Fast, mobile-responsive storefront

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: PostgreSQL, Redis
- **Frontend**: Next.js, React, Tailwind CSS
- **Jobs**: Bull Queue
- **Payment**: Razorpay
- **Shipping**: Shiprocket, Delhivery
- **AI**: Anthropic Claude API

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker (optional)

### Installation

1. Clone and install dependencies:
```bash
npm install
cd frontend && npm install
cd ../admin-dashboard && npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your API keys
```

3. Start with Docker:
```bash
docker-compose up -d
```

Or manually:
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
npm run frontend

# Terminal 3 - Admin Dashboard
npm run admin

# Terminal 4 - Background Jobs
npm run jobs
```

4. Access:
- Frontend: http://localhost:3000
- Admin Dashboard: http://localhost:3001
- API: http://localhost:5000

## Project Structure

```
dropshipping-automation/
├── backend/
│   ├── config/          # Database, Redis, API configs
│   ├── models/          # Database models
│   ├── services/        # Business logic
│   ├── integrations/    # External APIs
│   ├── jobs/            # Background jobs
│   ├── routes/          # API routes
│   ├── middleware/      # Auth, validation
│   ├── utils/           # Helpers
│   └── server.js        # Entry point
├── frontend/            # Next.js customer storefront
├── admin-dashboard/     # React admin panel
└── docker-compose.yml
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order status
- `GET /api/orders/track/:id` - Track shipment

### Payments
- `POST /api/payments/create` - Create payment order
- `POST /api/webhooks/payment` - Razorpay webhook

### Admin
- `GET /api/admin/dashboard` - Dashboard metrics
- `GET /api/admin/orders` - List all orders
- `PUT /api/admin/orders/:id` - Update order

## Automation Features

### Inventory Sync
Runs every hour to sync product availability and pricing from suppliers.

### Order Processing
1. Payment confirmation webhook
2. Auto-validate order
3. Check supplier inventory
4. Place supplier order
5. Generate shipping label
6. Send customer notifications

### Customer Communications
- Order confirmation (Email + WhatsApp)
- Shipping updates (SMS)
- Delivery confirmation
- Review requests

## Configuration

### Payment Setup (Razorpay)
1. Sign up at https://razorpay.com
2. Get API keys from dashboard
3. Add to `.env`
4. Set webhook URL: `https://yourdomain.com/api/webhooks/payment`

### Shipping Setup (Shiprocket)
1. Sign up at https://shiprocket.in
2. Get API credentials
3. Add to `.env`
4. Configure pickup address in admin panel

### Supplier Integration
Add supplier API credentials in `.env` for:
- AliExpress Dropshipping
- CJ Dropshipping
- IndiaMART
- Custom suppliers

## Monitoring

View logs:
```bash
tail -f logs/combined.log
tail -f logs/error.log
```

Redis queue monitoring:
```bash
npm run queue:monitor
```

## Deployment

### AWS/Digital Ocean
```bash
# Build
docker build -t dropship-app .

# Deploy
docker run -d -p 5000:5000 --env-file .env dropship-app
```

### Environment Setup
- Set NODE_ENV=production
- Use managed PostgreSQL (RDS/DO)
- Use managed Redis (ElastiCache/DO)
- Set up SSL certificate
- Configure Cloudflare CDN

## Testing

```bash
npm test
```

## License

MIT
# dropshipping-automation
