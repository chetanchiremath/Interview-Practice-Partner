# Quick Start Guide - Hosting with User-Provided API Keys

## 🎯 The Problem You Solved

**Before:** If you hosted this app, you'd have to:
- Pay for all API usage
- Worry about quota limits
- Risk running out of free tier
- Can't scale beyond your quota

**Now:** Each user provides their own FREE Gemini API key!
- ✅ Zero API costs for you
- ✅ Unlimited scaling
- ✅ Each user gets 1,500 free requests/day
- ✅ Perfect for public hosting

---

## 🚀 How to Deploy (5 Minutes)

### Step 1: Deploy Backend to Railway

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Create new project
cd backend
railway init

# 4. Set environment variables (in Railway dashboard)
FRONTEND_URL=https://your-app.vercel.app
# Don't set GEMINI_API_KEY - users will provide their own!

# 5. Deploy
railway up
```

Copy your Railway URL: `https://your-backend.railway.app`

### Step 2: Deploy Frontend to Vercel

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
cd frontend
vercel

# 3. Set environment variable (in Vercel dashboard)
NEXT_PUBLIC_API_URL=https://your-backend.railway.app

# 4. Deploy to production
vercel --prod
```

Copy your Vercel URL: `https://your-app.vercel.app`

### Step 3: Update Backend CORS

Go back to Railway dashboard and update:
```bash
FRONTEND_URL=https://your-app.vercel.app
```

Redeploy backend.

---

## 👤 User Experience

### First-Time User Flow

1. **User visits your app**
   ```
   https://your-app.vercel.app
   ```

2. **Modal appears: "API Key Required"**
   - Clean, professional modal
   - Instructions on how to get free key
   - Link to Google AI Studio

3. **User clicks "Get Free API Key"**
   - Opens https://makersuite.google.com/app/apikey
   - Signs in with Google
   - Clicks "Create API Key"
   - Copies key (starts with "AIza...")

4. **User pastes key in modal**
   - Validates format
   - Saves to browser localStorage
   - Modal closes

5. **User can now use the app!**
   - Key automatically included in all requests
   - No further setup needed

### Returning User Flow

1. User visits app
2. Key loaded from localStorage automatically
3. No modal, no setup
4. Just works! ✨

---

## 💰 Cost Breakdown

### Your Costs (Monthly)
| Service | Cost |
|---------|------|
| Railway (Backend) | $5 |
| Vercel (Frontend) | $0 (free tier) |
| Gemini API | $0 (users provide keys) |
| **Total** | **$5/month** |

### User Costs
| Service | Cost |
|---------|------|
| Gemini API | $0 (free tier) |
| Setup Time | 2 minutes |
| **Total** | **$0** |

### Gemini Free Tier (Per User)
- 15 requests per minute
- 1,500 requests per day
- 1 million tokens per month
- **Perfect for interview practice!**

---

## 🔒 Security & Privacy

### What's Secure?
✅ User API keys stored only in their browser  
✅ Keys sent via HTTPS headers  
✅ Keys never stored in your database  
✅ Each user uses their own quota  
✅ Rate limiting included (100 req/min per IP)  

### What Users Should Know
⚠️ Keep your API key private (like a password)  
⚠️ Don't share your key with others  
⚠️ You can regenerate your key anytime  

---

## 📊 Monitoring

### Railway Dashboard
- View backend logs
- Monitor memory/CPU usage
- Check request counts

### Vercel Dashboard
- View frontend analytics
- Monitor build status
- Check error rates

### Google AI Studio
- Users monitor their own quota
- View API usage
- Regenerate keys if needed

---

## 🐛 Common Issues

### Issue: "No API key provided"
**Solution:** User needs to enter their API key in the modal

### Issue: Modal doesn't appear
**Solution:** 
```javascript
// Clear localStorage and refresh
localStorage.clear()
location.reload()
```

### Issue: API calls fail
**Solution:** 
- Check key is valid (starts with "AIza")
- Check user hasn't exceeded quota
- Check backend middleware is working

### Issue: CORS errors
**Solution:**
- Verify `FRONTEND_URL` in Railway matches Vercel URL
- Redeploy backend after changing

---

## 📝 User Documentation

Add this to your app's help section:

```markdown
## How to Get Started

### 1. Get Your Free API Key
Visit [Google AI Studio](https://makersuite.google.com/app/apikey) and:
- Sign in with your Google account
- Click "Create API Key"
- Copy the key (starts with "AIza...")

### 2. Enter Your Key
- Paste your key in the modal when prompted
- Click "Save & Continue"
- Your key is saved in your browser

### 3. Start Practicing!
- Select a role
- Choose voice or chat mode
- Begin your mock interview

### FAQ

**Q: Is the API key really free?**  
A: Yes! Google provides 1,500 free requests per day.

**Q: Where is my key stored?**  
A: Only in your browser's localStorage. It's never sent to our servers.

**Q: Can I change my key later?**  
A: Yes! Click the "API Key Set" button in the header.

**Q: What if I run out of quota?**  
A: Wait 24 hours for reset, or create a new Google account.
```

---

## 🎉 You're Done!

Your app is now:
- ✅ Deployed and live
- ✅ Costs you only $5/month
- ✅ Scales infinitely
- ✅ Users get free access
- ✅ No API quota worries

Share your app URL and let users start practicing! 🚀

---

## 📞 Support

If users have issues:
1. Check they're using a valid key (starts with "AIza")
2. Check they haven't exceeded quota (1,500/day)
3. Ask them to clear localStorage and try again
4. Check your backend logs in Railway

---

## 🔄 Updates

To update your app:

```bash
# Backend
cd backend
git pull
railway up

# Frontend
cd frontend
git pull
vercel --prod
```

---

## 📈 Scaling

As your app grows:
- Railway auto-scales (pay for what you use)
- Vercel auto-scales (free tier handles a lot)
- Each user brings their own API quota
- No bottlenecks! 🎯
