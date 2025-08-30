# 🚀 MedMaster Landing Page Deployment Guide

## Quick Fix for Production Issues

### Option 1: Manual Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your MedMaster Landing Page project
   - Go to **Settings** → **Environment Variables**

2. **Set these environment variables for PRODUCTION:**

```
VITE_API_URL = https://medmaster-production.up.railway.app
VITE_APP_DOMAIN = https://app.medmaster.com
VITE_APP_ENV = production
VITE_FIREBASE_API_KEY = AIzaSyCsy00m3pl76bitsNcffnGpm9DObgKELcM
VITE_FIREBASE_APP_ID = 1:1073454322288:web:2dd42bd0d731d6c2bb5ab5
VITE_FIREBASE_AUTH_DOMAIN = medmaster-auth.firebaseapp.com
VITE_FIREBASE_MESSAGING_SENDER_ID = 1073454322288
VITE_FIREBASE_PROJECT_ID = medmaster-auth
VITE_FIREBASE_STORAGE_BUCKET = medmaster-auth.firebasestorage.app
VITE_FIREBASE_MEASUREMENT_ID = G-6V494YYG8Z
VITE_LANDING_DOMAIN = https://medmaster.site
```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Option 2: Command Line (if you have bash)

```bash
# Make script executable
chmod +x set-vercel-env.sh

# Run the script
./set-vercel-env.sh
```

### Option 3: Individual Commands

Run these commands one by one:

```bash
# Remove old variables (ignore errors)
vercel env rm VITE_FIREBASE_API_KEY production --yes
vercel env rm VITE_API_URL production --yes

# Add new variables (you'll be prompted to enter the value)
vercel env add VITE_FIREBASE_API_KEY production
# When prompted, enter: AIzaSyCsy00m3pl76bitsNcffnGpm9DObgKELcM

vercel env add VITE_API_URL production
# When prompted, enter: https://medmaster-production.up.railway.app

# Continue for other variables...

# Deploy
vercel --prod
```

## Testing After Deployment

1. **Visit your site with debug mode:**
   ```
   https://medmaster.site?debug=true
   ```

2. **Check the debug panel** in the top-right corner to verify:
   - ✅ Firebase API Key is set (shows "***SET***")
   - ✅ API URL points to Railway
   - ✅ All configuration values are correct

3. **Test registration:**
   - Try email registration
   - Try Google Sign-In
   - Check browser console for errors

4. **Use the test page:**
   - Upload `test-production.html` to your domain
   - Visit `https://medmaster.site/test-production.html`
   - Run all connectivity tests

## Common Issues & Solutions

### Issue 1: "Firebase not configured" error
**Solution:** Make sure `VITE_FIREBASE_API_KEY` is set correctly in Vercel

### Issue 2: Network errors to backend
**Solution:** Verify `VITE_API_URL` points to `https://medmaster-production.up.railway.app`

### Issue 3: CORS errors
**Solution:** Check that your domain is in the backend's allowed origins list

## Verification Checklist

- [ ] All environment variables set in Vercel Dashboard
- [ ] Deployed with `vercel --prod`
- [ ] Debug panel shows correct configuration
- [ ] Registration works on production domain
- [ ] No console errors during registration
- [ ] Backend logs show successful requests

## Need Help?

If you're still having issues:

1. Check the debug panel at `https://medmaster.site?debug=true`
2. Check browser console for errors
3. Check Railway backend logs
4. Use the test page to verify connectivity

The most common issue is missing or incorrect environment variables in Vercel.
