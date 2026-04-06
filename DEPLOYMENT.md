# 🚀 Deployment Guide: Shift N Go Finance Tracker

This document outlines the available deployment paths for the **Shift N Go Finance Tracker**, a Next.js 15 application. Based on the current repository structure, you have several robust options for hosting.

## 🆓 The Zero-Cost Path (Recommended)
For most individual developers and small businesses, the following stack provides a powerful, professional-grade production environment for **$0/month**.

### 1. Frontend: Vercel (Hobby Plan)
Vercel is the native home of Next.js and offers the most seamless free hosting experience.

**Deployment Steps:**
1.  **Push to GitHub**: Ensure your latest code is pushed to a GitHub repository.
2.  **Import to Vercel**: Go to [vercel.com](https://vercel.com/new), sign in with GitHub, and select your project.
3.  **Environment Variables**: During setup, expand the "Environment Variables" section and paste your `.env.local` keys (see the variables table below).
4.  **Deploy**: Click "Deploy". Your site will be live on a `*.vercel.app` subdomain within minutes.

### 2. Database: MongoDB Atlas (M0 Cluster)
A free "M0" cluster provides 512MB-5GB of storage, which is more than enough for a typical dealership track.

**Setup Steps:**
1.  Sign up at [mongodb.com](https://www.mongodb.com/cloud/atlas/register).
2.  Create a new project and build a **Shared Cluster** (select the "Free" M0 option).
3.  In **Network Access**, add `0.0.0.0/0` (allow access from anywhere) so Vercel can connect.
4.  In **Database Access**, create a user with a strong password.
5.  Get your connection string (e.g., `mongodb+srv://...`) and use it for `MONGODB_URI`.

### 3. Auth: Auth0 (Free Plan)
Auth0's free tier supports up to 7,500 active users.

**Production Config:**
1.  In your Auth0 Application settings, update your **Allowed Callback URLs** to include your Vercel URL (e.g., `https://your-app.vercel.app/api/auth/callback`).
2.  Add your Vercel URL to **Allowed Logout URLs** and **Allowed Web Origins**.

---

## 🛠️ Infrastructure Options (Advanced)
If you prefer AWS or containerization, these options are also viable but may incur costs after free trials expire.

**Commands:**
```bash
# Build the image
docker build -t shift-n-go-finance .

# Run locally to test
docker run -p 3000:3000 \
  -e MONGODB_URI=your_uri \
  -e AUTH0_SECRET=your_secret \
  # ... other environment variables ...
  shift-n-go-finance
```

---

### Option 4: AWS Amplify
The repository contains an `amplify.yml` file. AWS Amplify has a free tier for 12 months, but it becomes "Pay-as-you-go" thereafter. Use this if you are already invested in the AWS ecosystem.

## 🔑 Critical Environment Variables
Regardless of your chosen platform, you **MUST** configure these environment variables for the application to function:

| Variable | Description |
| :--- | :--- |
| `MONGODB_URI` | Your MongoDB connection string (Atlas or self-hosted). |
| `AUTH0_SECRET` | A 32-byte secret for session encryption. Generate with `openssl rand -hex 32`. |
| `AUTH0_BASE_URL` | The production URL of your application (e.g., `https://shift-n-go.com`). |
| `AUTH0_ISSUER_BASE_URL` | Your Auth0 domain URL. |
| `AUTH0_CLIENT_ID` | Your Auth0 application client ID. |
| `AUTH0_CLIENT_SECRET` | Your Auth0 application client secret. |

---

## 🏗️ Pre-Deployment Checklist
- [ ] **Auth0 Callback URLs**: In your Auth0 dashboard, ensure `https://your-domain.com/api/auth/callback` is authorized.
- [ ] **MongoDB Whitelisting**: If using MongoDB Atlas, whitelist the IP address of your hosting provider or use `0.0.0.0/0` (with caution).
- [ ] **Production Build**: Verify the build locally using `npm run build && npm run start` before pushing changes.

---

## 🧪 Validating Your Deployment
After deployment, verify that:
1.  The dashboard loads correctly.
2.  Auth0 login/logout flow functions as expected.
3.  Database operations (inventory logs) persist between sessions.
