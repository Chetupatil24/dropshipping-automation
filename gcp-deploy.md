# GCP Deployment Guide — Ruthan Dropshipping

## Architecture

| Service | Platform |
|---------|----------|
| Backend API | Google Cloud Run |
| Customer Frontend | Firebase Hosting (Next.js SSR) |
| Database | Supabase (already configured) |
| Image CDN | Cloudinary (already configured) |

---

## Step 1 — Install CLIs & Authenticate

```bash
# Google Cloud CLI
curl https://sdk.cloud.google.com | bash && exec -l $SHELL

# Firebase CLI
npm install -g firebase-tools

# Login
gcloud auth login
firebase login

# Set project
gcloud config set project ruthan-dropshipping
```

---

## Step 2 — Deploy Backend to Cloud Run

Run from the project root (uses the `Dockerfile`):

```bash
gcloud run deploy ruthan-backend-api \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --port 8080 \
  --min-instances 0 \
  --max-instances 10 \
  --memory 512Mi \
  --cpu 1 \
  --set-env-vars "NODE_ENV=production,PORT=8080" \
  --set-env-vars "SUPABASE_URL=https://ccwnnradnszbwjfjfpvk.supabase.co" \
  --set-env-vars "SUPABASE_KEY=REDACTED_SUPABASE_KEY" \
  --set-env-vars "SUPABASE_SERVICE_ROLE=REDACTED_SUPABASE_SERVICE_ROLE" \
  --set-env-vars "DATABASE_URL=postgresql://postgres:YOURPASSWORD@db.ccwnnradnszbwjfjfpvk.supabase.co:5432/postgres" \
  --set-env-vars "CLOUDINARY_CLOUD_NAME=dfgn2etwj,CLOUDINARY_API_KEY=763814895541787,CLOUDINARY_API_SECRET=REDACTED_CLOUDINARY_SECRET" \
  --set-env-vars "JWT_SECRET=REPLACE_WITH_STRONG_SECRET,JWT_EXPIRE=7d" \
  --set-env-vars "FRONTEND_URL=https://ruthan.com,ADMIN_URL=https://admin.ruthan.com"
```

After deploy, gcloud prints a Service URL:
`https://ruthan-backend-api-XXXXXXXX-el.a.run.app`

Verify it works:
```bash
curl https://ruthan-backend-api-XXXXXXXX-el.a.run.app/health
```

---

## Step 3 — Deploy Frontend to Firebase Hosting

1. Update `frontend/.env.production` with your Cloud Run URL:
```
NEXT_PUBLIC_API_URL=https://ruthan-backend-api-XXXXXXXX-el.a.run.app
NEXT_PUBLIC_RAZORPAY_KEY=rzp_live_xxxxxxxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=https://ruthan.com
```

2. Enable Firebase Next.js support:
```bash
firebase experiments:enable webframeworks
```

3. Deploy:
```bash
cd frontend && npm install && npm run build && cd ..
firebase deploy --only hosting
```

4. Connect domain: Firebase Console → Hosting → Add custom domain → `ruthan.com`

---

## Step 4 — CI/CD with Cloud Build (Auto-deploy on git push)

```bash
# Create Docker image repository
gcloud artifacts repositories create ruthan \
  --repository-format=docker \
  --location=asia-south1

# Connect GitHub and create build trigger
gcloud builds triggers create github \
  --repo-name=YOUR_REPO \
  --repo-owner=YOUR_GITHUB_USER \
  --branch-pattern='^main$' \
  --build-config=cloudbuild.yaml
```

Now every `git push origin main` builds + deploys automatically.

---

## Environment Variables

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `PORT` | `8080` |
| `DATABASE_URL` | Supabase connection string |
| `SUPABASE_URL` | `https://ccwnnradnszbwjfjfpvk.supabase.co` |
| `SUPABASE_KEY` | Supabase anon/publishable key |
| `SUPABASE_SERVICE_ROLE` | Supabase service key |
| `CLOUDINARY_CLOUD_NAME` | `dfgn2etwj` |
| `CLOUDINARY_API_KEY` | `763814895541787` |
| `CLOUDINARY_API_SECRET` | `REDACTED_CLOUDINARY_SECRET` |
| `JWT_SECRET` | Generate: `openssl rand -hex 32` |
| `RAZORPAY_KEY_ID` | Razorpay live key |
| `RAZORPAY_KEY_SECRET` | Razorpay live secret |
| `FRONTEND_URL` | `https://ruthan.com` |

---

## Useful Commands

```bash
# View Cloud Run logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=ruthan-backend-api" --limit 50

# Get service URL
gcloud run services describe ruthan-backend-api --region asia-south1 --format="value(status.url)"

# Update a single env var
gcloud run services update ruthan-backend-api --region asia-south1 --update-env-vars "KEY=value"
```

---

## Cost (~$0–5/month)

- Cloud Run: scales to 0, pay only per request
- Firebase Hosting: free tier covers most traffic
- Supabase: free tier (500MB DB, 2GB bandwidth)
- Cloudinary: free tier (25 credits/month)
