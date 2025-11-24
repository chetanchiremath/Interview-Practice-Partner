# 📚 Deployment Documentation Index

Welcome! This directory contains everything you need to deploy your Interview Practice Partner application to Vercel.

---

## 🎯 Start Here

**New to Vercel?** Follow this path:

1. **Read First**: [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)
   - Complete step-by-step guide
   - Beginner-friendly with detailed explanations
   - Includes troubleshooting section
   - **Time needed**: 30-45 minutes

2. **Keep Open**: [VERCEL_DEPLOYMENT_CHECKLIST.md](./VERCEL_DEPLOYMENT_CHECKLIST.md)
   - Print this or keep it open in another window
   - Check off items as you complete them
   - Ensures you don't miss any steps

3. **Quick Reference**: [VERCEL_QUICK_REFERENCE.md](./VERCEL_QUICK_REFERENCE.md)
   - Quick lookup for commands and settings
   - Use this after your first deployment
   - Handy for future updates

---

## 📖 Document Overview

### Primary Guides

| Document | Purpose | When to Use |
|----------|---------|-------------|
| **VERCEL_DEPLOYMENT_GUIDE.md** | Complete deployment tutorial | First-time deployment |
| **VERCEL_DEPLOYMENT_CHECKLIST.md** | Step-by-step checklist | During deployment |
| **VERCEL_QUICK_REFERENCE.md** | Quick command reference | After first deployment |
| **DEPLOYMENT.md** | General deployment info | Alternative platforms |

### Configuration Files

| File | Location | Purpose |
|------|----------|---------|
| `vercel.json` | `/backend/vercel.json` | Backend deployment config |
| `vercel.json` | `/frontend/vercel.json` | Frontend deployment config |

---

## 🚀 Quick Start (TL;DR)

If you're experienced with Vercel:

```bash
# 1. Deploy Backend
- Import repo → Root: backend → Deploy
- Copy backend URL

# 2. Deploy Frontend  
- Import repo → Root: frontend → Deploy
- Set NEXT_PUBLIC_API_URL to backend URL

# 3. Link them
- Update backend FRONTEND_URL to frontend URL
- Redeploy backend
```

**Environment Variables:**
- Backend: `NODE_ENV`, `FRONTEND_URL`, (optional: `GEMINI_API_KEY`)
- Frontend: `NEXT_PUBLIC_API_URL`

---

## 🎓 Learning Path

### For Complete Beginners

1. **Understand the Architecture** (5 min)
   - Read the "Overview" section in VERCEL_DEPLOYMENT_GUIDE.md
   - Look at the architecture diagram

2. **Prepare Your Project** (10 min)
   - Follow Part 1 of VERCEL_DEPLOYMENT_GUIDE.md
   - Test builds locally

3. **Deploy Backend** (15 min)
   - Follow Part 2 of VERCEL_DEPLOYMENT_GUIDE.md
   - Use VERCEL_DEPLOYMENT_CHECKLIST.md

4. **Deploy Frontend** (15 min)
   - Follow Part 3 of VERCEL_DEPLOYMENT_GUIDE.md
   - Use VERCEL_DEPLOYMENT_CHECKLIST.md

5. **Link & Test** (10 min)
   - Follow Parts 4 & 5 of VERCEL_DEPLOYMENT_GUIDE.md
   - Complete testing checklist

### For Experienced Developers

1. Review VERCEL_QUICK_REFERENCE.md (2 min)
2. Check vercel.json files are present (1 min)
3. Deploy using Vercel dashboard or CLI (10 min)
4. Set environment variables (5 min)
5. Test deployment (5 min)

---

## 🔧 Configuration Files Explained

### Backend vercel.json
```json
{
  "version": 2,
  "builds": [{"src": "dist/server.js", "use": "@vercel/node"}],
  "routes": [{"src": "/(.*)", "dest": "dist/server.js"}]
}
```
- Tells Vercel to use the compiled `dist/server.js` file
- Routes all requests to the Express server

### Frontend vercel.json
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```
- Specifies Next.js framework
- Defines build commands (usually auto-detected)

---

## 🌐 Deployment Architecture

```
User Browser
     ↓
Frontend (Next.js)
https://your-frontend.vercel.app
     ↓ (API Calls)
Backend (Express)
https://your-backend.vercel.app
     ↓ (AI Requests)
Google Gemini AI
```

**Key Points:**
- Users only access the frontend URL
- Frontend communicates with backend internally
- Backend handles all AI interactions
- Both hosted on Vercel separately

---

## 📋 Environment Variables

### Backend Environment Variables

| Variable | Value | Required | Notes |
|----------|-------|----------|-------|
| `NODE_ENV` | `production` | Yes | Sets production mode |
| `FRONTEND_URL` | Frontend URL | Yes | For CORS configuration |
| `GEMINI_API_KEY` | Your API key | No* | *Only for Mode 2 (centralized key) |
| `PORT` | `9000` | No | Vercel sets this automatically |

### Frontend Environment Variables

| Variable | Value | Required | Notes |
|----------|-------|----------|-------|
| `NEXT_PUBLIC_API_URL` | Backend URL | Yes | Must start with `NEXT_PUBLIC_` |

---

## 🎯 Deployment Modes

### Mode 1: User-Provided API Keys (Recommended)

**Best for**: Public hosting, personal projects

**Setup:**
- Don't set `GEMINI_API_KEY` in backend
- Users enter their own API key in the app
- Zero API costs for you

**Pros:**
- ✅ No API costs
- ✅ Infinite scaling
- ✅ No quota concerns

### Mode 2: Centralized API Key

**Best for**: Private/internal use, controlled user base

**Setup:**
- Set `GEMINI_API_KEY` in backend environment
- Users don't need to provide a key
- You pay for all API usage

**Pros:**
- ✅ Simpler for users
- ✅ No setup required

**Cons:**
- ❌ You pay for usage
- ❌ Quota limits apply

---

## 🐛 Troubleshooting

### Quick Fixes

| Problem | Solution |
|---------|----------|
| Build fails | Run `npm run build` locally to see errors |
| CORS errors | Redeploy backend after setting `FRONTEND_URL` |
| Env vars not working | Redeploy after changing environment variables |
| 404 errors | Check Root Directory is set correctly |
| API key errors | Verify `NEXT_PUBLIC_API_URL` is set |

### Detailed Help

See the **Troubleshooting** section in VERCEL_DEPLOYMENT_GUIDE.md for:
- Common error messages
- Step-by-step solutions
- How to read Vercel logs
- When to check browser console

---

## 💰 Costs

### Vercel Free Tier
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Serverless functions (100GB-hours)

**Sufficient for**: Personal projects, portfolios, small apps

### Estimated Monthly Costs

**Mode 1 (User-Provided Keys):**
- Hosting: $0 (free tier)
- API: $0 (users use their free quota)
- **Total: $0/month**

**Mode 2 (Centralized Key):**
- Hosting: $0 (free tier)
- API: Free tier covers ~50 interviews/day
- **Total: $0-10/month** (depending on usage)

---

## ✅ Success Checklist

Your deployment is successful when:

- [x] Backend health endpoint returns 200 OK
- [x] Frontend loads without errors
- [x] Can start an interview
- [x] AI responds to messages
- [x] No CORS errors in browser console
- [x] Users can access via frontend URL only

---

## 📚 Additional Resources

### Official Documentation
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel CLI Guide](https://vercel.com/docs/cli)

### Project Documentation
- [README.md](./README.md) - Project overview
- [QUICK_START.md](./QUICK_START.md) - Local development setup

---

## 🆘 Getting Help

If you're stuck:

1. **Check the guides**: Most issues are covered in VERCEL_DEPLOYMENT_GUIDE.md
2. **Review logs**: Vercel dashboard → Deployments → Runtime Logs
3. **Test locally**: Ensure `npm run build` works locally
4. **Check console**: Browser console (F12) for frontend errors
5. **Verify env vars**: Settings → Environment Variables

---

## 🔄 Updating Your Deployment

After initial deployment:

1. **Push to GitHub**: Vercel auto-deploys from `main` branch
2. **Preview deployments**: Other branches get preview URLs
3. **Rollback**: Deployments → Click old deployment → Promote
4. **Environment variables**: Remember to redeploy after changing

---

## 📝 Next Steps After Deployment

- [ ] Test all features thoroughly
- [ ] Share frontend URL with users
- [ ] Set up custom domain (optional)
- [ ] Enable Vercel Analytics
- [ ] Monitor usage and logs
- [ ] Create user documentation for API key setup (Mode 1)

---

**Happy Deploying! 🚀**

*Last Updated: 2025-11-25*
