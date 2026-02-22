# Google Cloud Platform (GCP) Deployment Guide

You have decided to host on Google Cloud Platform (GCP) for the next 3 months to make everything perfect. This is a great choice as GCP provides enterprise-grade infrastructure.

We will use **Google Cloud Run** for the backend (it's serverless Docker, meaning it scales to 0 and costs nothing when there's no traffic) and **Firebase Hosting** or **Cloud Storage + Cloud CDN** for the frontend.

## Prerequisites

1.  **Google Cloud Account:** Ensure you have an active GCP account with billing enabled (GCP gives new users $300 in free credits for the first 90 days, which perfectly covers your 3-month timeline!).
2.  **Google Cloud CLI (`gcloud`):** You need this installed on your computer to deploy automatically. If you don't have it, we need to install it.

## The Architecture

*   **Database:** Supabase (Already configured and free)
*   **Image CDN:** Cloudinary (Already configured and free)
*   **Backend API:** Google Cloud Run (Using the `Dockerfile` just created)
*   **Frontend:** Google Firebase Hosting (Extremely fast, built for Next.js)

## Phase 1: Deploy Backend to Cloud Run

1.  Open your terminal in the `dropshipping-automation` root folder.
2.  Authenticate with Google Cloud:
    ```bash
    gcloud auth login
    ```
3.  Set your project ID (replace with your actual GCP project ID):
    ```bash
    gcloud config set project [YOUR-PROJECT-ID]
    ```
4.  Run the automated deployment command. This builds the Docker container and deploys it to Cloud Run. Make sure to replace the placeholder environment variables with your actual Supabase and Cloudinary keys:
    ```bash
    gcloud run deploy ruthan-backend-api \
      --source . \
      --region us-central1 \
      --allow-unauthenticated \
      --set-env-vars="NODE_ENV=production" \
      --set-env-vars="PORT=8080" \
      --set-env-vars="SUPABASE_URL=https://ccwnnradnszbwjfjfpvk.supabase.co" \
      --set-env-vars="SUPABASE_KEY=REDACTED_SUPABASE_KEY" \
      --set-env-vars="CLOUDINARY_CLOUD_NAME=dfgn2etwj" \
      --set-env-vars="CLOUDINARY_API_KEY=763814895541787" \
      --set-env-vars="CLOUDINARY_API_SECRET=REDACTED_CLOUDINARY_SECRET"
    ```
5.  After a few minutes, `gcloud` will output a **Service URL** (e.g., `https://ruthan-backend-api-xyz-uc.a.run.app`). **Save this URL!**

## Phase 2: Deploy Frontend to Firebase Hosting

Firebase Hosting has native, deep integration with Next.js applications and handles SSR (Server-Side Rendering) or Static Exports perfectly.

1.  Install the Firebase CLI:
    ```bash
    npm install -g firebase-tools
    ```
2.  Log in to Firebase:
    ```bash
    firebase login
    ```
3.  Initialize the project:
    ```bash
    firebase init hosting
    ```
    *   Select your GCP Project.
    *   When asked what directory to use as the public directory, type `frontend/out`
    *   Configure as a single-page app? **No**
    *   Set up automatic builds and deploys with GitHub? **Optional (can do later)**
4.  Update your `frontend/.env.production` file to point to your new Cloud Run API URL:
    ```
    NEXT_PUBLIC_API_URL=https://ruthan-backend-api-xyz-uc.a.run.app
    NEXT_PUBLIC_SUPABASE_URL=https://ccwnnradnszbwjfjfpvk.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=REDACTED_SUPABASE_KEY
    ```
5.  Build and Deploy:
    ```bash
    cd frontend
    npm run build
    firebase deploy --only hosting
    ```

Your entire stack will now be running on Google Cloud!
