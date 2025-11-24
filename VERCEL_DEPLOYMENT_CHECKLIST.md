# Vercel Deployment Checklist

Use this checklist to ensure you don't miss any steps during deployment.

---

## 📋 Pre-Deployment Checklist

### Local Testing
- [ ] Backend builds successfully
  ```bash
  cd backend
  npm install
  npm run build
  # Check that dist/server.js exists
  ```

- [ ] Frontend builds successfully
  ```bash
  cd frontend
  npm install
  npm run build
  ```

- [ ] Both run locally without errors
  ```bash
  # Terminal 1
  cd backend && npm run dev
  
  # Terminal 2
  cd frontend && npm run dev
  ```

### Repository Setup
- [ ] All code is committed to Git
  ```bash
  git add .
  git commit -m "Prepare for Vercel deployment"
  git push origin main
  ```

- [ ] Repository is on GitHub/GitLab/Bitbucket
- [ ] `vercel.json` files exist in both `backend/` and `frontend/` folders

### Vercel Account
- [ ] Created account at [vercel.com](https://vercel.com)
- [ ] Connected GitHub/GitLab/Bitbucket account
- [ ] Verified email address

---

## 🚀 Backend Deployment Checklist

### Import Project
- [ ] Clicked "Add New" → "Project" in Vercel
- [ ] Found and imported your repository
- [ ] Selected correct repository

### Configure Backend
- [ ] Set Root Directory to: `backend`
- [ ] Set Framework Preset to: `Other`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Install Command: `npm install`

### Environment Variables
- [ ] Added `NODE_ENV` = `production`
- [ ] Added `FRONTEND_URL` = (leave empty for now)
- [ ] (Optional) Added `GEMINI_API_KEY` if using Mode 2

### Deploy & Test
- [ ] Clicked "Deploy"
- [ ] Waited for deployment to complete (1-3 minutes)
- [ ] Copied backend URL: `___________________________`
- [ ] Tested health endpoint: `https://your-backend.vercel.app/health`
- [ ] Received successful response

---

## 🎨 Frontend Deployment Checklist

### Import Project Again
- [ ] Clicked "Add New" → "Project" in Vercel
- [ ] Found and imported your repository (same one)
- [ ] Selected correct repository

### Configure Frontend
- [ ] Set Root Directory to: `frontend`
- [ ] Framework Preset auto-detected as: `Next.js`
- [ ] Build Command: `npm run build` (auto-filled)
- [ ] Output Directory: `.next` (auto-filled)
- [ ] Install Command: `npm install` (auto-filled)

### Environment Variables
- [ ] Added `NEXT_PUBLIC_API_URL` = `https://your-backend.vercel.app`
  - ⚠️ Replace with your actual backend URL from above

### Deploy & Test
- [ ] Clicked "Deploy"
- [ ] Waited for deployment to complete (2-4 minutes)
- [ ] Copied frontend URL: `___________________________`
- [ ] Opened frontend URL in browser
- [ ] Landing page loads correctly

---

## 🔗 Linking Frontend & Backend Checklist

### Update Backend Environment
- [ ] Went to backend project in Vercel dashboard
- [ ] Clicked "Settings" → "Environment Variables"
- [ ] Updated `FRONTEND_URL` to your frontend URL
- [ ] Saved changes

### Redeploy Backend
- [ ] Went to "Deployments" tab
- [ ] Clicked "..." menu on latest deployment
- [ ] Clicked "Redeploy"
- [ ] Confirmed redeployment
- [ ] Waited for redeployment to complete (1-2 minutes)

---

## ✅ Final Testing Checklist

### Backend Tests
- [ ] Health endpoint works: `https://your-backend.vercel.app/health`
- [ ] Returns JSON response with status "ok"
- [ ] No errors in Vercel function logs

### Frontend Tests
- [ ] Landing page loads: `https://your-frontend.vercel.app`
- [ ] All interview roles display correctly
- [ ] No console errors (press F12 to check)

### Integration Tests
- [ ] Can select an interview role
- [ ] Can choose interaction mode (Text/Voice)
- [ ] Can start an interview
- [ ] Interview page loads correctly
- [ ] Can send a message
- [ ] AI responds to messages
- [ ] No CORS errors in console
- [ ] Can end interview session

### API Key Tests (Mode 1 only)
- [ ] Modal appears asking for API key
- [ ] Can enter API key
- [ ] Key is saved to localStorage
- [ ] Can start interview after entering key
- [ ] AI responds using the provided key

---

## 📝 Post-Deployment Checklist

### Documentation
- [ ] Saved backend URL: `___________________________`
- [ ] Saved frontend URL: `___________________________`
- [ ] Updated README.md with deployment URLs (optional)
- [ ] Documented any custom configurations

### Sharing
- [ ] Shared frontend URL with users
- [ ] Created instructions for users to get API keys (if Mode 1)
- [ ] Set up custom domain (optional)

### Monitoring
- [ ] Checked Vercel Analytics dashboard
- [ ] Reviewed function logs for errors
- [ ] Set up error notifications (optional)

### Security
- [ ] Verified environment variables are set correctly
- [ ] Confirmed API keys are not exposed in frontend code
- [ ] Checked that `.env` files are in `.gitignore`
- [ ] Reviewed CORS settings

---

## 🎉 Success Criteria

Your deployment is successful when:

✅ **Backend**
- Health endpoint returns 200 OK
- No errors in Vercel logs
- CORS configured correctly

✅ **Frontend**
- Landing page loads without errors
- All UI elements display correctly
- Can navigate between pages

✅ **Integration**
- Frontend can communicate with backend
- AI responds to user messages
- No CORS or network errors
- Sessions work end-to-end

✅ **User Experience**
- Users can access the app via frontend URL
- Interview flow works smoothly
- API key modal works (if Mode 1)
- No visible errors or broken features

---

## 🐛 If Something Goes Wrong

### Check These First
1. [ ] Build logs in Vercel dashboard
2. [ ] Runtime logs in Vercel dashboard
3. [ ] Browser console (F12) for frontend errors
4. [ ] Environment variables are set correctly
5. [ ] URLs don't have typos or trailing slashes

### Common Fixes
- **Build fails**: Run `npm run build` locally to see errors
- **CORS errors**: Redeploy backend after setting `FRONTEND_URL`
- **Env vars not working**: Redeploy after changing them
- **404 errors**: Check Root Directory is set correctly

### Get Help
- [ ] Reviewed `VERCEL_DEPLOYMENT_GUIDE.md` troubleshooting section
- [ ] Checked Vercel documentation
- [ ] Searched Vercel community forums

---

## 📊 URLs Reference

Fill in your URLs here for quick reference:

| Service | URL | Status |
|---------|-----|--------|
| **Backend** | `https://_________________________.vercel.app` | ⬜ |
| **Frontend** | `https://_________________________.vercel.app` | ⬜ |
| **Custom Domain** | `https://_________________________` | ⬜ (optional) |

---

## 🔄 Future Updates

When you push code to GitHub:
- [ ] Understand that Vercel auto-deploys from `main` branch
- [ ] Other branches create preview deployments
- [ ] Can view all deployments in Vercel dashboard
- [ ] Can rollback to previous deployments if needed

---

**Deployment Date**: _______________

**Deployed By**: _______________

**Notes**:
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

---

✨ **Congratulations on your deployment!** ✨
