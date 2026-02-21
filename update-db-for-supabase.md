# Database Switch Guide

To ensure your existing API works flawlessly with Supabase:
1. Since your backend already uses Sequelize and Postgres (`pg` npm package), no code changes are strictly necessary for the backend controllers to talk to Supabase Postgres besides changing the `DATABASE_URL`!
2. You simply set `DATABASE_URL` in your Fly.io secrets to the *Transaction pooler* or *Session pooler* connection string provided by Supabase.
3. Keep the JWT Auth setup for the backend for now unless a complete frontend rewrite matches the Supabase JS Client specifications. The provided schema perfectly accommodates your existing fields.
