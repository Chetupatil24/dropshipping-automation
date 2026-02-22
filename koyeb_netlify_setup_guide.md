# Koyeb + Netlify Deployment Guide

This guide covers deploying your Backend to Koyeb and your Frontend to Netlify.

## Step 1: Deploy Backend to Koyeb

1.  **Sign up:** Go to [Koyeb.com](https://www.koyeb.com) and create an account using your GitHub.
2.  **Create Service:** Click **Create App**.
3.  **Choose Source:** Select **GitHub** and authorize access to your `dropshipping-automation` repository.
4.  **Configure Service:**
    *   **Builder Engine:** Choose **Buildpack** or let it auto-detect based on `package.json`.
    *   **Work directory:** Ensure this is set to **`backend`**.
    *   **Run command:** `node server.js`
    *   **Environment variables:** Add your Supabase, Cloudinary, and Vendor keys exactly as they appear in your `.env` file. Be sure to include `PORT=8080` and `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true`.
    *   **Instance:** Choose the **Free/Eco** instance.
    *   **Name:** Give it a name like `ruthan-backend`.
5.  **Deploy:** Click **Deploy**. Koyeb will build and start your Node.js API. Note the generated public URL (e.g., `https://ruthan-backend-yourname.koyeb.app`).

## Step 2: Deploy Frontend to Netlify

1.  **Sign up:** Go to [Netlify.com](https://www.netlify.com) and sign in.
2.  **Add New Site:** Click **Add new site** -> **Import an existing project** from GitHub.
3.  **Select Repo:** Choose your `dropshipping-automation` repository.
4.  **Configure Build Settings:**
    *   **Base directory:** `frontend`
    *   **Build command:** `npm run build`
    *   **Publish directory:** `.next`
5.  **Environment Variables:** Add these critical frontend variables:
    *   `NEXT_PUBLIC_API_URL`: (Paste the Koyeb URL you got from Step 1)
    *   `NEXT_PUBLIC_SUPABASE_URL`: (Your Supabase URL)
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Your Supabase Public Anon Key)
6.  **Deploy:** Click **Deploy Site**. Netlify will automatically detect Next.js and build your frontend.
