# Vercel Deployment Quick Reference

## 🚀 Quick Deploy Checklist

### Before You Start
- [ ] Have a Vercel account (sign up at vercel.com)
- [ ] Code is pushed to GitHub/GitLab/Bitbucket
- [ ] Backend builds successfully locally (`cd backend && npm run build`)
- [ ] Frontend builds successfully locally (`cd frontend && npm run build`)

---

## 📝 Deployment Order

### 1️⃣ Deploy Backend First
```
1. Go to vercel.com → Add New → Project
2. Import your repository
3. Root Directory: backend
4. Framework: Other
5. Build Command: (leave empty or default)
6. Output Directory: (leave empty or default)
7. Environment Variables:
   - NODE_ENV=production
   - FRONTEND_URL=(leave empty for now)
8. Deploy
9. Copy the backend URL: https://your-backend.vercel.app
```

### 2️⃣ Deploy Frontend Second
```
1. Go to vercel.com → Add New → Project
2. Import your repository again
3. Root Directory: frontend
4. Framework: Next.js
5. Build Command: npm run build
6. Environment Variables:
   - NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
7. Deploy
8. Copy the frontend URL: https://your-frontend.vercel.app
```

### 3️⃣ Link Them Together
```
1. Go to backend project → Settings → Environment Variables
2. Update FRONTEND_URL=https://your-frontend.vercel.app
3. Go to Deployments → Redeploy latest
```

---

## 🔑 Environment Variables Reference

### Backend Environment Variables
| Variable | Value | Required |
|----------|-------|----------|
| `NODE_ENV` | `production` | Yes |
| `FRONTEND_URL` | `https://your-frontend.vercel.app` | Yes |
| `GEMINI_API_KEY` | Your API key | Only for Mode 2 |
| `PORT` | `9000` | No (Vercel sets this) |

### Frontend Environment Variables
| Variable | Value | Required |
|----------|-------|----------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend.vercel.app` | Yes |

---

## ✅ Testing Checklist

After deployment:
- [ ] Backend health check works: `https://your-backend.vercel.app/health`
- [ ] Frontend loads: `https://your-frontend.vercel.app`
- [ ] Can start an interview
- [ ] AI responds to messages
- [ ] No CORS errors in browser console (F12)

---

## 🐛 Common Issues & Fixes

### "Application Error" on Backend
```bash
# Check build logs in Vercel dashboard
# Ensure backend builds locally:
cd backend
npm run build
# Check that dist/server.js exists
```

### CORS Errors
```
1. Verify FRONTEND_URL is set in backend
2. Redeploy backend after setting FRONTEND_URL
3. Ensure URLs match exactly (with https://)
```

### Frontend Can't Connect
```
1. Check NEXT_PUBLIC_API_URL in frontend settings
2. Verify backend URL is correct
3. Test backend health endpoint
4. Redeploy frontend
```

### Environment Variables Not Working
```
Remember: You MUST redeploy after changing environment variables!
```

---

## 📱 Share With Users

**Give users this URL only:**
```
https://your-frontend.vercel.app
```

**Do NOT share the backend URL** - it's used internally by the frontend.

---

## 🔄 Updating Your App

When you push code to GitHub:
- ✅ Vercel automatically deploys
- ✅ Main branch → Production
- ✅ Other branches → Preview deployments

---

## 💡 Pro Tips

1. **Custom Domains**: Go to Settings → Domains to add your own domain
2. **View Logs**: Deployments → Click deployment → Runtime Logs
3. **Rollback**: Deployments → Click old deployment → Promote to Production
4. **Preview Deployments**: Every git branch gets its own preview URL

---

## 📊 Vercel Free Tier Limits

- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Serverless functions: 100GB-hours
- ✅ Custom domains
- ✅ Automatic HTTPS

**More than enough for personal projects!**

---

## 🆘 Need More Help?

See the full guide: `VERCEL_DEPLOYMENT_GUIDE.md`

---

**Last Updated**: 2025-11-25
