# Setup Guide - Dropshipping Automation Platform

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 15+ installed
- Redis 7+ installed
- npm or yarn package manager

## Installation Steps

### 1. Clone and Install Dependencies

```bash
cd dropshipping-automation

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install admin dashboard dependencies
cd ../admin-dashboard
npm install

cd ..
```

### 2. Database Setup

**Start PostgreSQL:**
```bash
# On Ubuntu/Debian
sudo service postgresql start

# On macOS with Homebrew
brew services start postgresql

# On Windows
# Start from Services or pgAdmin
```

**Create Database:**
```bash
psql -U postgres
CREATE DATABASE dropshipping_db;
\q
```

### 3. Redis Setup

**Start Redis:**
```bash
# On Ubuntu/Debian
sudo service redis-server start

# On macOS with Homebrew
brew services start redis

# On Windows
# Download from https://github.com/microsoftarchive/redis/releases
redis-server
```

### 4. Environment Configuration

**Create `.env` file:**
```bash
cp .env.example .env
```

**Edit `.env` with your credentials:**

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dropshipping_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_random_secret_key_min_32_chars

# Razorpay (Sign up at https://razorpay.com)
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Shiprocket (Sign up at https://shiprocket.in)
SHIPROCKET_EMAIL=your_email@example.com
SHIPROCKET_PASSWORD=your_password

# Email (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Twilio (Optional - for SMS/WhatsApp)
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890

# Anthropic (Optional - for AI chatbot)
ANTHROPIC_API_KEY=sk-ant-xxxxx
```

**Frontend Environment:**
Create `frontend/.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_RAZORPAY_KEY=rzp_test_xxxxx
```

**Admin Dashboard Environment:**
Create `admin-dashboard/.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 5. Database Migration

The database will auto-sync when you start the backend server for the first time. Tables will be created automatically.

### 6. Create Admin User

**Start the backend server temporarily:**
```bash
npm run dev
```

**In another terminal, create admin user using psql or API:**
```bash
# Using psql
psql -U postgres -d dropshipping_db

INSERT INTO users (id, email, password, "firstName", "lastName", role, "isActive", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@example.com',
  -- Password: admin123 (hashed)
  '$2a$10$YourHashedPasswordHere',
  'Admin',
  'User',
  'admin',
  true,
  NOW(),
  NOW()
);
```

**Or use the API to register and then update role in database:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123",
    "firstName": "Admin",
    "lastName": "User"
  }'

# Then update role in database
psql -U postgres -d dropshipping_db
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

### 7. Start Development Servers

**Terminal 1 - Backend:**
```bash
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run frontend
```

**Terminal 3 - Admin Dashboard:**
```bash
npm run admin
```

**Terminal 4 - Background Jobs:**
```bash
npm run jobs
```

### 8. Access Applications

- **Customer Frontend:** http://localhost:3000
- **Admin Dashboard:** http://localhost:3001
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/health

## Initial Configuration

### 1. Login to Admin Panel
- Go to http://localhost:3001/login
- Email: admin@example.com
- Password: admin123

### 2. Add Suppliers
Navigate to Suppliers section and add your supplier integrations:
- AliExpress
- CJ Dropshipping
- IndiaMART
- Custom suppliers

### 3. Import Products
- Use the import feature to bulk import products from suppliers
- Or manually add products through the admin panel

### 4. Configure Shipping
- Set up Shiprocket API credentials
- Configure pickup location
- Set shipping rates

### 5. Payment Gateway Setup

**Razorpay:**
1. Sign up at https://razorpay.com
2. Get API keys from Dashboard → Settings → API Keys
3. Add keys to `.env`
4. Set up webhook URL: `https://yourdomain.com/api/webhooks/payment`
5. Enable required payment methods (UPI, Cards, Wallets, NetBanking)

### 6. Test Order Flow
1. Browse products on customer frontend
2. Add to cart
3. Checkout
4. Use Razorpay test card: 4111 1111 1111 1111
5. Verify order appears in admin panel
6. Check automated emails

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
sudo service postgresql status

# Check connection
psql -U postgres -d dropshipping_db -c "SELECT 1"
```

### Redis Connection Issues
```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG
```

### Port Already in Use
```bash
# Find process using port
lsof -i :5000
# Kill process
kill -9 <PID>
```

### Cannot Login
- Verify admin user exists in database
- Check JWT_SECRET is set in .env
- Clear browser localStorage

### Jobs Not Running
- Ensure Redis is running
- Check worker process: `npm run jobs`
- View logs: `tail -f logs/combined.log`

## Testing

### Test Backend API
```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","firstName":"Test","lastName":"User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Get products
curl http://localhost:5000/api/products
```

### Test Payment Integration
Use Razorpay test credentials:
- Test Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

## Next Steps

1. **Production Deployment** - See DEPLOYMENT.md
2. **SSL Certificate** - Set up HTTPS
3. **Domain Configuration** - Point your domain to server
4. **Email Configuration** - Use production SMTP
5. **Monitoring** - Set up logging and alerts
6. **Backup Strategy** - Configure automated backups

## Support

For issues:
1. Check logs in `logs/` directory
2. Review environment variables
3. Ensure all services are running
4. Check API connectivity

## Security Checklist

- [ ] Changed default admin password
- [ ] Updated JWT_SECRET to strong random value
- [ ] Configured proper CORS origins
- [ ] Set up rate limiting
- [ ] Enabled HTTPS in production
- [ ] Secured database with strong password
- [ ] Protected API keys and secrets
- [ ] Configured firewall rules
