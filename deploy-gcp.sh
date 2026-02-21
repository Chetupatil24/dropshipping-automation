#!/bin/bash
# Quick GCP Deployment Script for Ruthan Platform

set -e

echo "🚀 Ruthan GCP Deployment Script"
echo "================================="
echo ""

# Configuration
PROJECT_ID="ruthan-dropshipping"
REGION="asia-south1"
DB_INSTANCE="ruthan-db"
REDIS_INSTANCE="ruthan-redis"
DB_PASSWORD=""
DOMAIN="ruthan.com"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Functions
log_info() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

# Step 1: Initialize
echo "Step 1: Setting up GCP project..."
gcloud config set project $PROJECT_ID || {
    log_warn "Project doesn't exist. Creating..."
    gcloud projects create $PROJECT_ID --name="Ruthan Dropshipping"
    gcloud config set project $PROJECT_ID
}
log_info "Project set to $PROJECT_ID"

# Step 2: Enable APIs
echo ""
echo "Step 2: Enabling required APIs..."
gcloud services enable \
  run.googleapis.com \
  sql-component.googleapis.com \
  sqladmin.googleapis.com \
  redis.googleapis.com \
  storage-api.googleapis.com \
  cloudbuild.googleapis.com
log_info "APIs enabled"

# Step 3: Get database password
echo ""
read -sp "Enter database password (will be hidden): " DB_PASSWORD
echo ""

# Step 4: Create Cloud SQL
echo ""
echo "Step 3: Creating Cloud SQL instance (this takes 5-10 minutes)..."
gcloud sql instances create $DB_INSTANCE \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=$REGION \
  --root-password=$DB_PASSWORD 2>/dev/null || log_warn "Database already exists"

gcloud sql databases create dropshipping_db \
  --instance=$DB_INSTANCE 2>/dev/null || log_warn "Database already exists"

gcloud sql users create ruthan \
  --instance=$DB_INSTANCE \
  --password=$DB_PASSWORD 2>/dev/null || log_warn "User already exists"

log_info "Cloud SQL ready"

# Step 5: Create Redis
echo ""
echo "Step 4: Creating Memorystore Redis (this takes 5-10 minutes)..."
gcloud redis instances create $REDIS_INSTANCE \
  --size=1 \
  --region=$REGION \
  --tier=basic \
  --redis-version=redis_6_x 2>/dev/null || log_warn "Redis already exists"
log_info "Redis ready"

# Step 6: Create storage bucket
echo ""
echo "Step 5: Creating Cloud Storage bucket..."
gsutil mb -l $REGION gs://ruthan-product-images 2>/dev/null || log_warn "Bucket already exists"
gsutil iam ch allUsers:objectViewer gs://ruthan-product-images
log_info "Storage bucket ready"

# Step 7: Get connection details
echo ""
echo "Step 6: Getting connection details..."
CLOUD_SQL_CONNECTION=$(gcloud sql instances describe $DB_INSTANCE --format="value(connectionName)")
REDIS_HOST=$(gcloud redis instances describe $REDIS_INSTANCE --region=$REGION --format="value(host)")

log_info "Cloud SQL Connection: $CLOUD_SQL_CONNECTION"
log_info "Redis Host: $REDIS_HOST"

# Step 8: Deploy backend
echo ""
echo "Step 7: Deploying backend..."
cd backend

gcloud run deploy ruthan-backend \
  --source . \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --add-cloudsql-instances $CLOUD_SQL_CONNECTION \
  --set-env-vars="NODE_ENV=production,PORT=5000,REDIS_HOST=$REDIS_HOST,DATABASE_URL=postgresql://ruthan:$DB_PASSWORD@/dropshipping_db?host=/cloudsql/$CLOUD_SQL_CONNECTION" \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10

BACKEND_URL=$(gcloud run services describe ruthan-backend --region=$REGION --format="value(status.url)")
log_info "Backend deployed: $BACKEND_URL"

cd ..

# Step 9: Deploy frontend
echo ""
echo "Step 8: Deploying frontend..."
cd frontend

# Update frontend env
cat > .env.production <<EOF
NEXT_PUBLIC_API_URL=$BACKEND_URL
NEXT_PUBLIC_SITE_URL=https://$DOMAIN
EOF

gcloud run deploy ruthan-frontend \
  --source . \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10

FRONTEND_URL=$(gcloud run services describe ruthan-frontend --region=$REGION --format="value(status.url)")
log_info "Frontend deployed: $FRONTEND_URL"

cd ..

# Step 10: Summary
echo ""
echo "================================="
echo "🎉 Deployment Complete!"
echo "================================="
echo ""
echo "Your services are live:"
echo "  Frontend: $FRONTEND_URL"
echo "  Backend:  $BACKEND_URL"
echo ""
echo "Next steps:"
echo "  1. Configure your domain DNS to point to these URLs"
echo "  2. Run database migrations"
echo "  3. Seed initial data"
echo "  4. Test the application"
echo ""
echo "Database connection:"
echo "  Connection name: $CLOUD_SQL_CONNECTION"
echo "  Redis host: $REDIS_HOST"
echo ""
echo "Estimated monthly cost: $55-60"
echo ""
