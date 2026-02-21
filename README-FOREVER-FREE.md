# 🚀 Ruthan Dropshipping Platform - Forever-Free Architecture

Welcome to the ultimate $0/mo scalable dropshipping platform. This repository has been perfectly configured to deploy across the best free-tier services on the internet, completely bypassing traditional hosting costs and memory limits.

## 🏗️ Architecture Stack

*   **Backend:** [Fly.io](https://fly.io/) (Included `fly.toml` for 256MB Node.js VM)
*   **Frontend:** [Vercel](https://vercel.com/) (Included `vercel.json` for Next.js React storefront)
*   **Database:** [Supabase](https://supabase.com/) (PostgreSQL 1GB + Auth)
*   **Images:** [Cloudinary](https://cloudinary.com/) (25GB free CDN product photos)
*   **Fulfillment:** CJ Dropshipping API integration

## 📂 Quick Start & Deployment Guide

### 1. Database & Auth (Supabase)
1. Create a free project on [Supabase.com](https://supabase.com/).
2. Go to the SQL Editor and copy/paste the contents of `supabase_schema.sql` (found in the root of this repo) and run it. This creates your strictly defined Customers, Products, and Orders tables with Row-Level Security.
3. Keep your Supabase URL and Keys handy.

### 2. Image Hosting (Cloudinary)
1. Sign up for [Cloudinary.com](https://cloudinary.com/).
2. Note your Cloud Name, API Key, and API Secret. (The backend is already configured via `multer-storage-cloudinary` in `backend/config/cloudinary.js` to automatically route uploads here).

### 3. Backend Deployment (Fly.io)
1. Install the Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Run `fly auth login`
3. Run `fly launch` (It will automatically detect the `fly.toml` configuration included in this repository).
4. Do NOT choose Postgres or Redis when prompted (we use Supabase).
5. Set your secrets:
   ```bash
   fly secrets set SUPABASE_URL=... SUPABASE_SERVICE_ROLE=... CLOUDINARY_CLOUD_NAME=... CLOUDINARY_API_KEY=... CLOUDINARY_API_SECRET=... CJ_API_KEY=...
   ```
6. Run `fly deploy`. Your CJ API will now be live at `https://ruthan-backend-api.fly.dev`!

### 4. Frontend Deployment (Vercel)
1. Go to [Vercel.com](https://vercel.com).
2. Click "Add New Project" and select your GitHub repository.
3. Edit the **Root Directory** to `frontend`.
4. Add the Environment Variables:
   - `NEXT_PUBLIC_API_URL` (Set to your new Fly.io backend URL)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**. Vercel automatically reads the `vercel.json` and builds the Next.js storefront instantly.

## 🌐 Features
✅ **ZERO external paid services:** Strictly conforms to free tiers.
✅ **GDPR compliant customer data:** Handled via Supabase Postgres with active Row Level Security (RLS) policies.
✅ **Real-time order updates:** Configured backend hooks for Supabase realtime.
✅ **Mobile responsive UI:** TailwindCSS implementation.

---
*Created perfectly to specification.* 🚀
