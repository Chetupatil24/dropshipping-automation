# Cloudflare Workers + Netlify Deployment Guide

This guide covers deploying your completely free backend API to Cloudflare Workers (1GB Storage) and your frontend to Netlify.

## Step 1: Set up Cloudflare KV Storage

1. Login to your [Cloudflare Dashboard](https://dash.cloudflare.com) (or sign up with GitHub/Google).
2. On the left menu, select **Workers & Pages**.
3. Under *Storage & Databases*, select **KV**.
4. Click **Create a namespace**.
5. Name it `ruthan-storage` and click **Add**.
6. **Important:** Note the Namespace ID generated next to your new KV store.

## Step 2: Deploy Backend to Cloudflare Workers

We use the Wrangler CLI to securely bundle and push your Node.js code to Cloudflare's Edge network.

1.  **Open your Terminal** on your local machine.
2.  Install Wrangler globally:
    ```bash
    npm install -g wrangler
    ```
3.  Log in to Cloudflare (this will open your browser):
    ```bash
    wrangler login
    ```
4.  Navigate to your backend folder:
    ```bash
    cd dropshipping-automation/backend
    ```
5.  Open the `wrangler.toml` file in this folder. Replace `replace-with-your-kv-namespace-id` with the ID from Step 1.
6.  **Add Secrets:** Your backend needs your Supabase, Cloudinary, and CJ API passwords securely stored. Run these commands one by one and paste the values when prompted:
    ```bash
    wrangler secret put SUPABASE_URL
    wrangler secret put SUPABASE_KEY
    wrangler secret put CLOUDINARY_CLOUD_NAME
    wrangler secret put CLOUDINARY_API_KEY
    wrangler secret put CLOUDINARY_API_SECRET
    wrangler secret put CJ_API_KEY
    ```
7.  Deploy the API:
    ```bash
    wrangler deploy
    ```
    *Cloudflare will provide a URL like `https://ruthan-api.yourusername.workers.dev`. Copy this!*

## Step 3: Deploy Frontend to Netlify

1.  Go to [Netlify.com](https://www.netlify.com) and log in with GitHub.
2.  Click **Add new site** -> **Import an existing project**.
3.  Select your `dropshipping-automation` repository.
4.  Configure Build Settings:
    *   **Base directory:** `frontend`
    *   **Build command:** `npm run build`
    *   **Publish directory:** `.next`
5.  **Environment Variables:** Add these critical variables:
    *   `NEXT_PUBLIC_API_URL`: (Paste the Cloudflare Workers URL you got from Step 2)
    *   `NEXT_PUBLIC_SUPABASE_URL`: (Your Supabase URL)
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Your Supabase Public Anon Key)
6.  Click **Deploy Site**.
