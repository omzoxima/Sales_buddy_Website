# Azure App Service Deployment Guide (Git)

This guide covers deploying the SalesBuddy website to Azure App Service using Local Git or GitHub Actions, avoiding pushing the 33MB `demo-video.mp4` to your repository.

## 1. Local Preparation

We have already optimized the project for deployment:
- **`next.config.js`**: Set to `output: 'standalone'` (creates a tiny 30MB build).
- **Video URLs**: Externalized to `NEXT_PUBLIC_DEMO_VIDEO_URL`.
- **`.gitignore`**: Ignores `public/demo-video.mp4` so it won't bloat your Git repo.

### Test Locally
Make sure you set the variable in `.env.local` to test the OneDrive link:
```env
NEXT_PUBLIC_DEMO_VIDEO_URL="https://zoxima0-my.sharepoint.com/:v:/g/personal/om_prakash_zoxima_com/IQAg2ItJU5KMTY7VuG3lFoJxAeZKSXs4UbBYAb9LMNOW79E?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&download=1"
```
*(Note: I've added `&download=1` to the OneDrive link. OneDrive viewer links don't always work natively in HTML `<video>` tags unless forced to download/stream raw data).*

---

## 2. Create Azure App Service

1. Go to the Azure Portal.
2. Create a new **Web App** (App Service).
3. **Publish**: Code
4. **Runtime Stack**: Node 20 LTS (or 18 LTS)
5. **Operating System**: Linux
6. Choose your Region & Pricing Plan (Basic B1 or higher recommended for build memory).

---

## 3. Configure Environment Variables in Azure

Before pushing the code, configure all your secrets in Azure.
1. In your App Service, go to **Settings** > **Environment variables**.
2. Add all the keys from your local `.env.local` file:
   - `GRAPH_TENANT_ID`, `GRAPH_CLIENT_ID`, etc.
   - `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST`, etc.
   - `RESEND_API_KEY`, `SMTP_*`
   - `AGENT_API_URL`, `SALESBUDDY_AGENT_URL`
   - **`NEXT_PUBLIC_DEMO_VIDEO_URL`** (Use your OneDrive link with `&download=1` appended).

---

## 4. Deploying via Git

### Option A: GitHub Actions (Recommended)
1. In App Service, go to **Deployment Center**.
2. Source: **GitHub**.
3. Authenticate and select your Repository and Branch.
4. Azure will automatically create a `.github/workflows/` file in your repo and trigger a build.

### Option B: Local Git (Direct Push)
1. Go to **Deployment Center**.
2. Source: **Local Git**.
3. Save. You'll get a Git Clone URI.
4. Go to **Deployment Credentials** to set up a username/password or use user-level credentials.
5. In your local terminal:
   ```bash
   git remote add azure <Your-Git-Clone-URI>
   git push azure main
   ```
Azure will automatically run `npm install` and `npm run build`. 

Because we configured `output: 'standalone'`, Azure's Oryx build server will handle running the optimized build. 

---

## 5. Startup Command (Important)

In Azure App Service (Linux Node), you must tell it how to start the standalone build.

1. Go to **Settings** > **Configuration** > **General settings**.
2. In the **Startup Command** box, enter:
   ```bash
   node server.js
   ```
   *(Azure automatically sets the working directory, and the standalone build outputs a `server.js` file).*

Save and restart your App Service. Your application is now live, loading the video from OneDrive, and using a fraction of the disk space!
