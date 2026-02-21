# Railway Setup Guide

This guide explains how to connect this repository to Railway and deploy the app (monorepo: backend, frontend, admin, worker).

1. Create a Railway project and connect your GitHub repo.

2. Add plugins:
   - Postgres (Railway Postgres) or attach external Postgres
   - Redis (Railway Redis) or attach external Redis

3. In Railway project settings -> Variables, add values from `.env.railway` (copy/paste). Required at minimum:
   - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
   - `REDIS_HOST`, `REDIS_PORT`
   - `JWT_SECRET`
   - `NODE_ENV=production`

4. Ensure `railway.json` exists at repo root (this repo has `railway.json` and `Procfile`).
   - `railway.json` tells Railway to use Nixpacks builder.
   - `Procfile` declares process types: `web`, `worker`, `frontend`, `admin`.

5. Build behavior
   - We added a `postinstall` script to root `package.json` that installs and builds `frontend` and `admin-dashboard` during `npm ci` on the build step. If you prefer separate deployments for frontends, remove those entries from `Procfile` and deploy to Vercel.

6. Deployment
   - Connect repository and push to `main`. Railway will run the build and start processes according to `Procfile`.
   - If you want only the backend on Railway, remove `frontend` and `admin` lines from `Procfile` and deploy frontends to Vercel.

7. Troubleshooting
   - If environment validation fails on server start, check logs and ensure all required variables are present. The validator will block server start if DB/Redis are unreachable.
   - To test DB connection manually, in Railway console run: `psql` or use connection string given by the Postgres plugin.

8. Useful commands (Railway CLI)
```bash
# Login and link
railway login
railway link
railway up
```

If you want, I can prepare a minimal `railway.json` per-service configuration or remove frontend processes so Railway only hosts the API + worker. Tell me which services you want Railway to run.