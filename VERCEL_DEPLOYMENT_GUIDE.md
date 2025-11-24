# Complete Vercel Deployment Guide

This guide will walk you through deploying both the **frontend** and **backend** to Vercel as separate deployments, then linking them together.

---

## 📋 Prerequisites

Before you begin, make sure you have:

1. **A Vercel Account** - Sign up at [vercel.com](https://vercel.com) (free tier is sufficient)
2. **Git Repository** - Your code should be in a GitHub, GitLab, or Bitbucket repository
3. **Node.js installed** - For testing locally (optional but recommended)

---

## 🎯 Overview of the Setup

Here's what we'll accomplish:

```
┌─────────────────┐         ┌─────────────────┐
│   Frontend      │────────▶│    Backend      │
│   (Vercel)      │  API    │    (Vercel)     │
│   Next.js App   │  Calls  │   Express API   │
└─────────────────┘         └─────────────────┘
        │                            │
        │                            │
        ▼                            ▼
    Users access              Handles API logic
    this URL only             & Gemini AI calls
```

**Users will only access the frontend URL**. The frontend will communicate with the backend behind the scenes.

---

## 📦 Part 1: Prepare Your Project

### Step 1: Create Vercel Configuration Files

We need to create `vercel.json` files for both frontend and backend to tell Vercel how to deploy them.

#### 1.1 Create Backend Vercel Config

Create a file at `backend/vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.ts"
    }
  ]
}
```

#### 1.2 Create Frontend Vercel Config (Optional)

Next.js projects work automatically on Vercel, but you can create `frontend/vercel.json` for custom settings:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

### Step 2: Update Backend for Vercel

Vercel serverless functions work differently. We need to ensure the backend is compatible.

#### 2.1 Check TypeScript Build

Make sure your backend has a `tsconfig.json` and builds correctly:

```bash
cd backend
npm run build
```

This should create a `dist` folder with compiled JavaScript.

### Step 3: Commit Changes to Git

```bash
git add .
git commit -m "Add Vercel configuration files"
git push origin main
```

---

## 🚀 Part 2: Deploy Backend to Vercel

### Step 1: Log into Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"** (recommended) or your preferred method

### Step 2: Import Your Project

1. Click **"Add New..."** → **"Project"**
2. You'll see a list of your GitHub repositories
3. Find your `Interview-Practice-Partner` repository
4. Click **"Import"**

### Step 3: Configure Backend Deployment

Now comes the important part - configuring the backend:

1. **Framework Preset**: Select **"Other"** (since it's Express, not Next.js)

2. **Root Directory**: Click **"Edit"** and set it to `backend`
   - This tells Vercel to only deploy the backend folder

3. **Build Settings**:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Environment Variables**: Click **"Add Environment Variables"**
   
   Add these variables:
   
   | Name | Value | Notes |
   |------|-------|-------|
   | `NODE_ENV` | `production` | Required |
   | `PORT` | `9000` | Optional (Vercel sets this automatically) |
   | `FRONTEND_URL` | Leave empty for now | We'll add this after deploying frontend |
   | `GEMINI_API_KEY` | Leave empty | Only if using Mode 2 (centralized key) |

5. Click **"Deploy"**

### Step 4: Wait for Backend Deployment

- Vercel will build and deploy your backend
- This usually takes 1-3 minutes
- You'll see a progress screen with build logs

### Step 5: Get Your Backend URL

Once deployed, you'll see:
- ✅ **Deployment successful**
- A URL like: `https://your-project-backend.vercel.app`

**IMPORTANT**: Copy this URL! You'll need it for the frontend.

### Step 6: Test Your Backend

Open a new browser tab and visit:
```
https://your-project-backend.vercel.app/health
```

You should see a response like:
```json
{
  "status": "ok",
  "timestamp": "2025-11-24T..."
}
```

If you see this, your backend is working! 🎉

---

## 🎨 Part 3: Deploy Frontend to Vercel

### Step 1: Import Project Again

1. Go back to Vercel dashboard
2. Click **"Add New..."** → **"Project"**
3. Find your `Interview-Practice-Partner` repository again
4. Click **"Import"**

### Step 2: Configure Frontend Deployment

1. **Framework Preset**: Select **"Next.js"** (Vercel will auto-detect this)

2. **Root Directory**: Click **"Edit"** and set it to `frontend`
   - This tells Vercel to only deploy the frontend folder

3. **Build Settings** (usually auto-filled):
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

4. **Environment Variables**: Click **"Add Environment Variables"**
   
   Add this variable:
   
   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_API_URL` | `https://your-project-backend.vercel.app` |
   
   ⚠️ **Replace** `your-project-backend.vercel.app` with your actual backend URL from Part 2, Step 5

5. Click **"Deploy"**

### Step 3: Wait for Frontend Deployment

- Vercel will build and deploy your frontend
- This usually takes 2-4 minutes
- You'll see build logs

### Step 4: Get Your Frontend URL

Once deployed, you'll see:
- ✅ **Deployment successful**
- A URL like: `https://your-project-frontend.vercel.app`

**This is the URL you'll share with users!** 🎉

---

## 🔗 Part 4: Link Frontend and Backend

Now we need to update the backend to allow requests from the frontend.

### Step 1: Update Backend Environment Variables

1. Go to your Vercel dashboard
2. Click on your **backend** project
3. Go to **"Settings"** → **"Environment Variables"**
4. Find the `FRONTEND_URL` variable (or add it if missing)
5. Set its value to: `https://your-project-frontend.vercel.app`
   - Replace with your actual frontend URL
6. Click **"Save"**

### Step 2: Redeploy Backend

After changing environment variables, you need to redeploy:

1. Go to the **"Deployments"** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Click **"Redeploy"** again to confirm

Wait for the redeployment to complete (1-2 minutes).

---

## ✅ Part 5: Test the Complete Setup

### Step 1: Open Your Frontend

Visit your frontend URL in a browser:
```
https://your-project-frontend.vercel.app
```

### Step 2: Test the Application

1. You should see the landing page with interview roles
2. If using **Mode 1** (user-provided keys):
   - You'll see a modal asking for a Gemini API key
   - Enter your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Click "Save"

3. Select an interview role (e.g., "Software Engineer")
4. Choose interaction mode (Text or Voice)
5. Click **"Start Interview"**

### Step 3: Verify Communication

If everything works:
- ✅ The interview starts
- ✅ You can send messages
- ✅ The AI responds
- ✅ No CORS errors in browser console (press F12 to check)

---

## 🎛️ Part 6: Optional Configurations

### Custom Domain (Optional)

Want to use your own domain instead of `.vercel.app`?

1. Go to your frontend project in Vercel
2. Click **"Settings"** → **"Domains"**
3. Click **"Add"**
4. Enter your domain (e.g., `interview-practice.com`)
5. Follow the DNS configuration instructions

### Environment Variables for Different Modes

#### Mode 1: User-Provided API Keys (Recommended)

**Backend:**
```
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```
(Don't set `GEMINI_API_KEY`)

**Frontend:**
```
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
```

#### Mode 2: Centralized API Key

**Backend:**
```
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**Frontend:**
```
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
```

---

## 🐛 Troubleshooting

### Issue 1: "Application Error" on Backend

**Symptoms**: Backend URL shows "Application Error"

**Solutions**:
1. Check build logs in Vercel dashboard
2. Ensure `npm run build` works locally
3. Verify `dist/server.js` exists after build
4. Check that `vercel.json` points to correct file

### Issue 2: CORS Errors

**Symptoms**: Browser console shows "CORS policy" errors

**Solutions**:
1. Verify `FRONTEND_URL` is set correctly in backend
2. Make sure you redeployed backend after setting `FRONTEND_URL`
3. Check that frontend URL matches exactly (with https://)

### Issue 3: Frontend Can't Connect to Backend

**Symptoms**: API calls fail, network errors

**Solutions**:
1. Verify `NEXT_PUBLIC_API_URL` is set in frontend
2. Make sure backend URL is correct (with https://)
3. Test backend health endpoint directly
4. Redeploy frontend after changing environment variables

### Issue 4: Build Fails

**Symptoms**: Deployment fails during build

**Solutions**:
1. Test build locally: `npm run build`
2. Check for TypeScript errors
3. Ensure all dependencies are in `package.json`
4. Check build logs in Vercel for specific errors

### Issue 5: Environment Variables Not Working

**Symptoms**: App behaves as if env vars aren't set

**Solutions**:
1. Environment variables require a redeploy to take effect
2. For frontend, env vars must start with `NEXT_PUBLIC_`
3. Check spelling and capitalization
4. Verify in Settings → Environment Variables

---

## 📊 Monitoring Your Deployments

### View Logs

1. Go to your project in Vercel
2. Click **"Deployments"**
3. Click on any deployment
4. Click **"Runtime Logs"** to see live logs

### Analytics

Vercel provides free analytics:
1. Go to **"Analytics"** tab
2. View page views, performance, etc.

### Automatic Deployments

Vercel automatically deploys when you push to GitHub:
- Push to `main` branch → Production deployment
- Push to other branches → Preview deployment

---

## 💰 Costs

### Free Tier Includes:
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Serverless functions (100GB-hours)

This is more than enough for personal projects and testing!

---

## 🎉 You're Done!

Your application is now live on Vercel! Here's what you have:

- ✅ **Frontend**: `https://your-frontend.vercel.app` (share this with users)
- ✅ **Backend**: `https://your-backend.vercel.app` (used internally by frontend)
- ✅ **Automatic HTTPS**: Both deployments are secure
- ✅ **Auto-deploy**: Push to GitHub → Automatic deployment
- ✅ **Scalable**: Vercel handles scaling automatically

### Next Steps:

1. **Share your frontend URL** with users
2. **Monitor usage** in Vercel dashboard
3. **Set up custom domain** (optional)
4. **Enable analytics** to track usage

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel CLI Guide](https://vercel.com/docs/cli)
- [Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)

---

## 🆘 Need Help?

If you encounter issues:

1. Check the troubleshooting section above
2. Review Vercel build logs
3. Test locally with `npm run build` and `npm start`
4. Check browser console for errors (F12)

---

**Happy Deploying! 🚀**
