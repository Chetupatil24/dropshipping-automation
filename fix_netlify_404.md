# How to fix the "Page Not Found" (404) on Netlify

This issue simply means Netlify built the website BEFORE we finished pushing the `netlify.toml` configuration file, so it doesn't know where the homepage is yet.

**Here is the 10-second fix:**

1. Go back to your Netlify dashboard for this project (`funny-kangaroo` or whatever it is called).
2. Click on the **Deploys** tab at the top.
3. Click the **Trigger deploy** dropdown button on the right side.
4. Select **Deploy site** (or "Clear cache and deploy site").

Netlify will now pull the latest code (which contains our Next.js configuration) and rebuild it. 

Once it says "Published" again, click your green URL and the beautiful storefront will appear!
