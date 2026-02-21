# Deployment Guide - Dropshipping Automation Platform

## Deployment Options

### Option 1: Docker Deployment (Recommended)

#### Prerequisites
- Docker installed
- Docker Compose installed
- Domain name (optional but recommended)

#### Steps

1. **Build Docker Images:**
```bash
docker-compose build
```

2. **Update Environment Variables:**
Edit `docker-compose.yml` or create `.env.production`:
```bash
NODE_ENV=production
DB_HOST=postgres
REDIS_HOST=redis
# Add all other production credentials
```

3. **Start Services:**
```bash
docker-compose up -d
```

4. **Check Status:**
```bash
docker-compose ps
docker-compose logs -f
```

5. **Access Applications:**
- Backend: http://your-server-ip:5000
- Frontend: Deploy separately or use reverse proxy

#### Stop Services:
```bash
docker-compose down
```

#### Restart Services:
```bash
docker-compose restart
```

---

### Option 2: Manual Deployment on VPS

#### Recommended Providers
- **DigitalOcean** - $6/month Droplet
- **AWS EC2** - t3.micro or t3.small
- **Linode** - Shared CPU instances
- **Hetzner** - Cloud VPS

#### Server Requirements
- **Minimum:** 2 CPU cores, 4GB RAM, 50GB SSD
- **Recommended:** 4 CPU cores, 8GB RAM, 100GB SSD
- **OS:** Ubuntu 22.04 LTS

#### Deployment Steps

**1. Server Setup:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Redis
sudo apt install -y redis-server

# Install Nginx
sudo apt install -y nginx

# Install PM2 (Process Manager)
sudo npm install -g pm2
```

**2. Create Application User:**
```bash
sudo adduser dropship
sudo usermod -aG sudo dropship
su - dropship
```

**3. Clone and Setup Application:**
```bash
cd /home/dropship
git clone <your-repo-url> dropshipping-automation
cd dropshipping-automation

# Install dependencies
npm install
cd frontend && npm install && cd ..
cd admin-dashboard && npm install && cd ..
```

**4. Configure Database:**
```bash
sudo -u postgres psql
CREATE DATABASE dropshipping_db;
CREATE USER dropship_user WITH PASSWORD 'strong_password';
GRANT ALL PRIVILEGES ON DATABASE dropshipping_db TO dropship_user;
\q
```

**5. Setup Environment:**
```bash
cp .env.example .env
nano .env
# Update with production credentials
```

**6. Build Frontend Applications:**
```bash
# Build customer frontend
cd frontend
npm run build
cd ..

# Build admin dashboard
cd admin-dashboard
npm run build
cd ..
```

**7. Start with PM2:**
```bash
# Start backend
pm2 start backend/server.js --name "dropship-api"

# Start job worker
pm2 start backend/jobs/worker.js --name "dropship-worker"

# Start frontend (if not using static hosting)
cd frontend
pm2 start npm --name "dropship-frontend" -- start

# Start admin dashboard
cd ../admin-dashboard
pm2 start npm --name "dropship-admin" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

**8. Configure Nginx as Reverse Proxy:**

Create `/etc/nginx/sites-available/dropship`:
```nginx
# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

# Customer Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Admin Dashboard
server {
    listen 80;
    server_name admin.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/dropship /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**9. Setup SSL with Let's Encrypt:**
```bash
sudo apt install -y certbot python3-certbot-nginx

# Get certificates
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo certbot --nginx -d api.yourdomain.com
sudo certbot --nginx -d admin.yourdomain.com

# Auto-renewal is configured automatically
sudo certbot renew --dry-run
```

---

### Option 3: Platform as a Service (PaaS)

#### Heroku Deployment

**1. Install Heroku CLI:**
```bash
curl https://cli-assets.heroku.com/install.sh | sh
heroku login
```

**2. Create Apps:**
```bash
# Backend
heroku create dropship-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Add Redis
heroku addons:create heroku-redis:mini

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret
# ... add all other env vars
```

**3. Deploy:**
```bash
git push heroku main
heroku ps:scale web=1 worker=1
```

#### Vercel (for Frontend)

**1. Install Vercel CLI:**
```bash
npm i -g vercel
```

**2. Deploy Frontend:**
```bash
cd frontend
vercel --prod
```

**3. Deploy Admin Dashboard:**
```bash
cd admin-dashboard
vercel --prod
```

---

### Railway (monorepo)

Railway can run this monorepo by using the root `railway.json` build configuration and a `Procfile` to declare processes. Add the required environment variables (Postgres, Redis, JWT_SECRET, provider keys) in the Railway project settings.

- Ensure the root `start` script launches the backend (`node backend/server.js`) — this repo already uses `npm start`.
- Railway will run the root build; the `Procfile` contains process entries:
    - `web`: backend API
    - `worker`: background job worker
    - `frontend`: builds and serves the Next.js storefront
    - `admin`: builds and serves the admin Next.js app

Basic steps:

1. Create a new Railway project and connect your GitHub repo.
2. In Railway, add a Postgres plugin and a Redis plugin (or external providers) and copy credentials to project environment variables.
3. In Railway project settings, add all required env vars from `.env.example` (at minimum: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET`, `REDIS_HOST`, `REDIS_PORT`).
4. Deploy — Railway will run the Nixpacks build and then start process types from `Procfile`.

Notes:
- If you prefer to host the frontend separately (Vercel), remove `frontend` and `admin` entries from the `Procfile` and deploy those apps independently.
- If builds fail due to missing `NODE_ENV` or build-time envs, add those variables to Railway's build environment.


---

## Production Checklist

### Security
- [ ] Changed all default passwords
- [ ] Updated JWT_SECRET to 256-bit random string
- [ ] Configured CORS with specific origins
- [ ] Enabled HTTPS/SSL certificates
- [ ] Set up firewall (UFW or cloud firewall)
- [ ] Secured database with strong password
- [ ] Protected API keys in environment variables
- [ ] Enabled rate limiting
- [ ] Set up Content Security Policy
- [ ] Configured secure headers (helmet.js)

### Performance
- [ ] Enabled Redis caching
- [ ] Configured CDN for static assets (Cloudflare)
- [ ] Optimized database indexes
- [ ] Set up database connection pooling
- [ ] Enabled gzip compression in Nginx
- [ ] Configured image optimization
- [ ] Set up database query caching

### Monitoring
- [ ] Set up error logging (Sentry)
- [ ] Configure uptime monitoring (UptimeRobot)
- [ ] Set up performance monitoring (New Relic/DataDog)
- [ ] Configure log aggregation (ELK stack or Papertrail)
- [ ] Set up alerts for critical errors
- [ ] Monitor server resources (CPU, RAM, Disk)

### Backup
- [ ] Automated database backups (daily)
- [ ] Backup environment variables securely
- [ ] Test restore procedures
- [ ] Off-site backup storage (S3, Backblaze)

### DNS Configuration
```
A     @              -> your-server-ip
A     www            -> your-server-ip
A     api            -> your-server-ip
A     admin          -> your-server-ip
CNAME cdn            -> cdn-provider
```

### Environment Variables for Production

```bash
# Server
NODE_ENV=production
PORT=5000
API_URL=https://api.yourdomain.com

# Database (Use managed service in production)
DB_HOST=your-postgres-host
DB_PORT=5432
DB_NAME=dropshipping_db
DB_USER=dropship_user
DB_PASSWORD=strong_random_password
DB_SSL=true

# Redis (Use managed service in production)
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=strong_random_password

# JWT
JWT_SECRET=generate_with_openssl_rand_base64_32
JWT_EXPIRE=7d

# Production API Keys
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=live_secret
SHIPROCKET_EMAIL=production@email.com

# URLs
FRONTEND_URL=https://yourdomain.com
ADMIN_URL=https://admin.yourdomain.com
```

---

## Maintenance

### Update Application
```bash
cd /home/dropship/dropshipping-automation
git pull origin main
npm install
cd frontend && npm install && npm run build && cd ..
cd admin-dashboard && npm install && npm run build && cd ..
pm2 restart all
```

### View Logs
```bash
# PM2 logs
pm2 logs

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Application logs
tail -f logs/combined.log
tail -f logs/error.log
```

### Database Backup
```bash
# Create backup
pg_dump -U dropship_user dropshipping_db > backup_$(date +%Y%m%d).sql

# Restore backup
psql -U dropship_user dropshipping_db < backup_20260215.sql
```

### Monitor Resources
```bash
# Check PM2 status
pm2 status

# Check system resources
htop

# Check disk space
df -h

# Check memory
free -h
```

---

## Scaling

### Horizontal Scaling
- Load balancer (Nginx/HAProxy)
- Multiple backend instances
- Separate database server
- Redis cluster
- CDN for static assets

### Vertical Scaling
- Upgrade server resources
- Optimize database queries
- Enable caching
- Use database read replicas

---

## Troubleshooting

### Application Won't Start
```bash
pm2 logs dropship-api
# Check for errors in output
```

### Database Connection Issues
```bash
# Test connection
psql -h localhost -U dropship_user -d dropshipping_db

# Check PostgreSQL status
sudo systemctl status postgresql
```

### High CPU Usage
```bash
# Check processes
pm2 monit

# Optimize jobs
# Reduce sync frequency in scheduler
```

### Out of Memory
```bash
# Check memory
free -h

# Restart services
pm2 restart all

# Consider upgrading server
```

---

## Support & Resources

- **Documentation:** Check README.md and SETUP.md
- **Logs:** Always check logs first
- **Community:** Stack Overflow, GitHub Issues
- **Monitoring:** Set up alerts for critical issues

## Cost Estimate

**Monthly Running Costs:**
- VPS (4GB RAM): $12-24
- PostgreSQL (managed): $15-25
- Redis (managed): $10-15
- Domain: $10-15/year
- SSL: Free (Let's Encrypt)
- CDN: Free tier (Cloudflare)
- Total: ~$40-65/month

**Transaction Costs:**
- Razorpay: 2% per transaction
- SMS/Email: Variable
- Shipping API: Per label
