# 🚀 Deploy ChemGenius to Netlify - Step by Step Guide

## ✅ Build Complete!

Your production build is ready in the `dist/` folder.

---

## 🌐 Method 1: Drag & Drop (Easiest - 2 minutes)

### **Step 1: Go to Netlify**
Open: https://app.netlify.com/drop

### **Step 2: Drag the `dist` folder**
1. Open File Explorer
2. Go to: `C:\Users\rashm\Downloads\chemi\chemimind_extracted`
3. Find the `dist` folder
4. **Drag and drop** the `dist` folder onto the Netlify page

### **Step 3: Wait for deployment**
- Netlify will upload and deploy automatically
- Takes about 30 seconds
- You'll get a URL like: `https://random-name-123.netlify.app`

### **Step 4: Set Environment Variable**
⚠️ **CRITICAL:** Your API key is NOT in the build!

1. Click "Site settings"
2. Go to "Environment variables"
3. Click "Add a variable"
4. Set:
   ```
   Key: VITE_API_KEY
   Value: AIzaSyYOUR_GEMINI_API_KEY
   ```
5. Click "Save"
6. Go to "Deploys" → Click "Trigger deploy" → "Deploy site"

---

## 🌐 Method 2: Netlify CLI (Advanced)

### **Step 1: Install Netlify CLI**
```powershell
npm install -g netlify-cli
```

### **Step 2: Login to Netlify**
```powershell
netlify login
```
This opens browser - sign in with GitHub/Email

### **Step 3: Deploy**
```powershell
cd C:\Users\rashm\Downloads\chemi\chemimind_extracted
netlify deploy --prod
```

When prompted:
- **Create & configure a new site:** Yes
- **Team:** Choose your team
- **Site name:** chemgenius (or your choice)
- **Publish directory:** dist

### **Step 4: Set Environment Variable**
```powershell
netlify env:set VITE_API_KEY AIzaSyYOUR_GEMINI_API_KEY
```

### **Step 5: Redeploy with env variable**
```powershell
netlify deploy --prod
```

---

## 🌐 Method 3: GitHub + Netlify (Continuous Deployment)

### **Step 1: Create GitHub Repository**
1. Go to https://github.com/new
2. Name: `chemgenius`
3. Click "Create repository"

### **Step 2: Push Code to GitHub**
```powershell
cd C:\Users\rashm\Downloads\chemi\chemimind_extracted

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - ChemGenius"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/chemgenius.git

# Push
git push -u origin main
```

### **Step 3: Connect to Netlify**
1. Go to https://app.netlify.com/
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub"
4. Select your `chemgenius` repository
5. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Click "Deploy site"

### **Step 4: Add Environment Variable**
1. Go to "Site settings" → "Environment variables"
2. Add:
   ```
   VITE_API_KEY = AIzaSyYOUR_GEMINI_API_KEY
   ```
3. Trigger new deploy

---

## ⚠️ IMPORTANT: Environment Variables

### **Why API Key is Not in Build:**
Your `.env.local` file is in `.gitignore` for security!

### **You MUST set it in Netlify:**
```
Key: VITE_API_KEY
Value: AIzaSyYOUR_GEMINI_API_KEY
```

### **Where to Set:**
Netlify Dashboard → Site Settings → Environment Variables → Add Variable

---

## 🎯 After Deployment

### **Your Site Will Be Live At:**
```
https://your-site-name.netlify.app
```

### **Test These Features:**
1. ✅ Quiz generation works
2. ✅ Roast mode delivers feedback
3. ✅ Diagrams generate
4. ✅ Question organizer works
5. ✅ All features functional

### **If Features Don't Work:**
- Check environment variable is set
- Redeploy after adding env variable
- Check browser console for errors

---

## 🎨 Custom Domain (Optional)

### **Free Netlify Subdomain:**
```
https://chemgenius.netlify.app
```

### **Custom Domain:**
1. Buy domain (e.g., chemgenius.com)
2. In Netlify: Site settings → Domain management
3. Add custom domain
4. Update DNS records as instructed

---

## 📊 Deployment Checklist

- [ ] Build completed (`npm run build`)
- [ ] `netlify.toml` created
- [ ] Deployed to Netlify (drag & drop or CLI)
- [ ] Environment variable `VITE_API_KEY` set
- [ ] Redeployed after adding env variable
- [ ] Tested quiz generation
- [ ] Tested roast mode
- [ ] All features working

---

## 🔒 Security Notes

### **API Key Security:**
✅ **Good:** Set in Netlify environment variables  
✅ **Good:** Not in source code  
✅ **Good:** `.env.local` in `.gitignore`  

❌ **Bad:** Hardcoding in source files  
❌ **Bad:** Committing to GitHub  
❌ **Bad:** Sharing publicly  

### **Note:**
Even with env variables, your API key will be visible in browser (client-side app). For production, consider:
- API key restrictions in Google Cloud Console
- Backend proxy for API calls
- Rate limiting

---

## 💰 Netlify Pricing

### **Free Tier Includes:**
✅ 100 GB bandwidth/month  
✅ 300 build minutes/month  
✅ Automatic HTTPS  
✅ Continuous deployment  
✅ Custom domain support  

**Perfect for ChemGenius!** Your app is small and won't exceed limits.

---

## 🆘 Troubleshooting

### **Issue: "Page not found" on refresh**
**Solution:** `netlify.toml` already created ✅

### **Issue: API calls failing**
**Solution:** 
1. Check `VITE_API_KEY` is set in Netlify
2. Redeploy after adding variable
3. Clear browser cache

### **Issue: Build fails**
**Solution:**
```powershell
# Test build locally first
npm run build

# Check for errors
# Fix any issues
# Then redeploy
```

### **Issue: Old version showing**
**Solution:**
1. Clear browser cache (Ctrl+Shift+R)
2. Check deploy status in Netlify
3. Trigger new deploy if needed

---

## 🎉 Quick Deploy Commands

### **One-Command Deploy (CLI):**
```powershell
# Install CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd C:\Users\rashm\Downloads\chemi\chemimind_extracted
netlify deploy --prod --dir=dist

# Set env variable
netlify env:set VITE_API_KEY AIzaSyYOUR_GEMINI_API_KEY

# Redeploy
netlify deploy --prod --dir=dist
```

---

## 📱 Mobile Testing

After deployment, test on mobile:
```
https://your-site.netlify.app
```

Should work perfectly:
- ✅ Responsive design
- ✅ Touch-friendly
- ✅ Bottom navigation
- ✅ All features

---

## 🚀 You're Ready to Deploy!

**Recommended: Method 1 (Drag & Drop)**
1. Go to https://app.netlify.com/drop
2. Drag `dist` folder
3. Add environment variable
4. Done! 🎉

**Total time: 2 minutes**

---

*Last Updated: December 5, 2025*  
*ChemGenius - Netlify Deployment Guide*
