Google Cloud deployment commands are strictly executed using the `gcloud` and `firebase` CLIs. We will use the terminal instead of a web UI for speed and to ensure error-free infrastructure creation.

**Let's deploy your Backend to Cloud Run first.**

1. Ensure you have the `gcloud` CLI installed locally. If you do not, run: `curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-cli-466.0.0-linux-x86_64.tar.gz && tar -xf google-cloud-cli-466.0.0-linux-x86_64.tar.gz && ./google-cloud-sdk/install.sh`
2. Authenticate: `gcloud auth login`
3. Tell Google which project to use: `gcloud config set project your-gcp-project-id` (replace with the ID from your dashboard).
4. Run the exact deploy command provided in the `gcp-deploy.md` guide.

Let me know once you have authenticated with `gcloud`!
