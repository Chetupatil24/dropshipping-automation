#!/bin/bash
# =============================================================
# Ruthan Dropshipping — GCP Full Deploy Script
# Usage:  bash deploy.sh
# =============================================================

set -e

# Ensure gcloud is on PATH
export PATH="$HOME/google-cloud-sdk/bin:$PATH"

REGION="asia-south1"
SERVICE="ruthan-backend-api"
# TODO: Replace with your actual GCP Project ID (from GCP Console top bar)
PROJECT=$(gcloud config get project 2>/dev/null || echo "my-first-project")

BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log()    { echo -e "${GREEN}✔ $1${NC}"; }
warn()   { echo -e "${YELLOW}⚠ $1${NC}"; }
error()  { echo -e "${RED}✘ $1${NC}"; exit 1; }
header() { echo -e "\n${BOLD}=== $1 ===${NC}\n"; }

# ── Step 1: Check tools ───────────────────────────────────────
header "Checking Required Tools"

command -v gcloud   >/dev/null 2>&1 || error "gcloud not found. Run: bash setup-gcloud.sh"
command -v firebase >/dev/null 2>&1 || error "firebase not found. Run: npm install -g firebase-tools"
command -v npm      >/dev/null 2>&1 || error "npm not found"
log "All tools found"

# ── Step 2: Auth check ────────────────────────────────────────
header "Checking Authentication"

GCLOUD_ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>/dev/null)
if [ -z "$GCLOUD_ACCOUNT" ]; then
  warn "Not logged in to gcloud. Opening browser..."
  gcloud auth login
fi
log "gcloud: $(gcloud config get account 2>/dev/null)"

FIREBASE_ACCOUNT=$(firebase login:list 2>/dev/null | grep "✔" | head -1 || echo "")
if [ -z "$FIREBASE_ACCOUNT" ]; then
  warn "Not logged in to Firebase. Opening browser..."
  firebase login
fi
log "Firebase: logged in"

# ── Step 3: Set GCP project ───────────────────────────────────
header "Setting GCP Project"

gcloud config set project $PROJECT 2>/dev/null || {
  warn "Project '$PROJECT' not found. Listing your projects..."
  gcloud projects list
  echo ""
  read -p "Enter your GCP Project ID: " PROJECT
  gcloud config set project $PROJECT
}
log "GCP Project: $PROJECT"

# ── Step 4: Enable required APIs ─────────────────────────────
header "Enabling GCP APIs"

gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  --quiet 2>/dev/null && log "APIs enabled" || warn "Some APIs may already be enabled"

# ── Step 5: Load .env to get secrets ─────────────────────────
header "Loading Environment Variables"

if [ ! -f .env ]; then
  error ".env file not found. Please create it from .env.example"
fi

set -a
source .env
set +a
log ".env loaded"

# Prompt for secrets that should NOT be in .env
if [ -z "$JWT_SECRET" ] || [ "$JWT_SECRET" = "your_jwt_secret_key_change_this_in_production" ]; then
  JWT_SECRET=$(openssl rand -hex 32)
  log "Generated secure JWT_SECRET: $JWT_SECRET"
  echo "JWT_SECRET=$JWT_SECRET" >> .env
fi

# ── Step 6: Deploy Backend to Cloud Run ──────────────────────
header "Deploying Backend to Cloud Run ($REGION)"

DB_PASS_ENCODED=$(python3 -c "import urllib.parse, sys; print(urllib.parse.quote(sys.argv[1]))" "${DB_PASSWORD:-}" 2>/dev/null || echo "${DB_PASSWORD:-}")

gcloud run deploy $SERVICE \
  --source . \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080 \
  --min-instances 0 \
  --max-instances 10 \
  --memory 512Mi \
  --cpu 1 \
  --concurrency 80 \
  --timeout 60 \
  --set-env-vars "NODE_ENV=production,PORT=8080" \
  --set-env-vars "SUPABASE_URL=${SUPABASE_URL}" \
  --set-env-vars "SUPABASE_KEY=${SUPABASE_KEY}" \
  --set-env-vars "SUPABASE_SERVICE_ROLE=${SUPABASE_SERVICE_ROLE}" \
  --set-env-vars "DATABASE_URL=${DATABASE_URL}" \
  --set-env-vars "CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME}" \
  --set-env-vars "CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY}" \
  --set-env-vars "CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET}" \
  --set-env-vars "JWT_SECRET=${JWT_SECRET}" \
  --set-env-vars "JWT_EXPIRE=7d" \
  --set-env-vars "FRONTEND_URL=https://ruthan.com,ADMIN_URL=https://admin.ruthan.com" \
  --quiet

BACKEND_URL=$(gcloud run services describe $SERVICE --region $REGION --format="value(status.url)")
log "Backend deployed: $BACKEND_URL"

# ── Step 7: Update frontend env with backend URL ─────────────
header "Updating Frontend Environment"

cat > frontend/.env.production << EOF
NEXT_PUBLIC_API_URL=${BACKEND_URL}
NEXT_PUBLIC_RAZORPAY_KEY=${RAZORPAY_KEY_ID:-rzp_live_replace_me}
NEXT_PUBLIC_SITE_URL=https://ruthan.com
NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_KEY}
EOF
log "frontend/.env.production updated with: $BACKEND_URL"

# ── Step 8: Deploy Frontend to Firebase ──────────────────────
header "Deploying Frontend to Firebase Hosting"

firebase experiments:enable webframeworks --non-interactive 2>/dev/null || true

cd frontend
npm install --legacy-peer-deps --silent
npm run build
cd ..

firebase use $PROJECT --non-interactive 2>/dev/null || firebase use --add
firebase deploy --only hosting --non-interactive

log "Frontend deployed!"

# ── Done ─────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}${GREEN}╔══════════════════════════════════════════╗"
echo -e "║     🚀 RUTHAN DEPLOYMENT COMPLETE!       ║"
echo -e "╚══════════════════════════════════════════╝${NC}"
echo ""
echo -e "  Backend API : ${BOLD}${BACKEND_URL}${NC}"
echo -e "  Health Check: ${BOLD}${BACKEND_URL}/health${NC}"
echo -e "  Frontend    : ${BOLD}https://ruthan-dropshipping.web.app${NC}"
echo ""
echo -e "  ${YELLOW}Set custom domain ruthan.com:${NC}"
echo -e "  Firebase Console → Hosting → Add custom domain"
echo ""
