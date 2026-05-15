# FitLife AI - Complete Render Deployment Guide

## Overview
This guide will walk you through deploying your full-stack FitLife AI application on Render with:
- **Backend:** Node.js Express API
- **Frontend:** React Vite application
- **Database:** MongoDB Atlas (already configured)

---

## 🔧 STEP 1: Update Configuration Files

### 1.1 Update Backend Package.json
Ensure your `backend/package.json` has:
- `"type": "module"` (for ES6 imports)
- `"engines"` field specifying Node version
- Correct start script

### 1.2 Update Frontend Package.json
Add `"homepage": "/"` for proper routing

### 1.3 Frontend Environment Setup
Create `.env.production` in frontend folder with:
```
VITE_API_URL=https://YOUR-BACKEND-SERVICE.onrender.com/api
```

---

## 📤 STEP 2: Push to GitHub

### 2.1 Initialize Git (if not done)
```bash
cd c:\Users\sanga\OneDrive\Desktop\fitlife-ai
git init
git add .
git commit -m "Initial commit: FitLife AI full-stack app"
```

### 2.2 Create GitHub Repository
1. Go to https://github.com/new
2. Create a new repo (e.g., "fitlife-ai")
3. Do NOT initialize with README

### 2.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR-USERNAME/fitlife-ai.git
git branch -M main
git push -u origin main
```

---

## 🚀 STEP 3: Deploy Backend on Render

### 3.1 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub account (recommended for auto-deploy)

### 3.2 Deploy Backend Service
1. Click "New +" → "Web Service"
2. Select your GitHub repository (fitlife-ai)
3. Configure:
   - **Name:** fitlife-ai-backend
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Root Directory:** `backend`

### 3.3 Add Environment Variables
In Render dashboard, go to Environment:
```
PORT=5000
FRONTEND_URL=https://YOUR-FRONTEND-DOMAIN.onrender.com
MONGO_URI=mongodb://fitlifeuser:fitlife6881@ac-5amiuid-shard-00-00.ogbusuz.mongodb.net:27017,ac-5amiuid-shard-00-01.ogbusuz.mongodb.net:27017,ac-5amiuid-shard-00-02.ogbusuz.mongodb.net:27017/?ssl=true&replicaSet=atlas-xc6eeo-shard-0&authSource=admin&appName=Cluster0
JWT_SECRET=fitlife_ai_super_secret_key_2024_make_this_very_long
JWT_EXPIRE=7d
```

### 3.4 Deploy
- Click "Create Web Service"
- Wait for build to complete (2-5 minutes)
- Copy your backend URL (e.g., `https://fitlife-ai-backend.onrender.com`)

---

## 🎨 STEP 4: Deploy Frontend on Render

### 4.1 Update Frontend .env.production
Replace the URL with your backend URL:
```
VITE_API_URL=https://fitlife-ai-backend.onrender.com/api
```

### 4.2 Commit Changes
```bash
git add frontend/.env.production
git commit -m "Update API URL for production"
git push
```

### 4.3 Create Frontend Static Site
1. Click "New +" → "Static Site"
2. Select your GitHub repository
3. Configure:
   - **Name:** fitlife-ai-frontend
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Publish Directory:** `frontend/dist`

### 4.4 Deploy
- Click "Create Static Site"
- Wait for build to complete
- Your frontend will be live at the provided URL

---

## 🔗 STEP 5: Connect Frontend & Backend

### 5.1 Update Backend CORS
Update `backend/server.js` CORS to accept your frontend URL:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
```

### 5.2 Redeploy Backend
In Render, click "Manual Deploy" or push a new commit:
```bash
git add backend/server.js
git commit -m "Update CORS for frontend domain"
git push
```

---

## ✅ STEP 6: Verify Deployment

### 6.1 Test Backend
- Visit: `https://your-backend.onrender.com/`
- Should see: `{ "message": "🏋️ FitLife AI Backend is Running!", "status": "success" }`

### 6.2 Test Frontend
- Visit: `https://your-frontend.onrender.com/`
- Should load the FitLife AI application

### 6.3 Test API Connection
- Click "Register" or "Login"
- Try creating an account
- Check Render logs if there are issues

---

## 🐛 Troubleshooting

### Issue: CORS Error
**Solution:** Ensure `FRONTEND_URL` in backend environment variables matches your frontend domain

### Issue: Build Fails
**Solution:** 
- Check Render logs
- Ensure all dependencies are in package.json
- Verify build commands are correct

### Issue: Cannot Connect to Database
**Solution:**
- Verify `MONGO_URI` is correct
- Check MongoDB Atlas IP whitelist includes Render's IP
- Go to MongoDB Atlas → Security → Network Access
- Add "0.0.0.0/0" to allow all IPs (for development)

### Issue: Blank Page / 404
**Solution:**
- Clear browser cache
- Check frontend build was successful
- Verify routes in App.jsx are correct

---

## 📝 Summary of Deployed URLs

After deployment, you'll have:
- **Backend API:** `https://fitlife-ai-backend.onrender.com/api`
- **Frontend App:** `https://fitlife-ai-frontend.onrender.com`

---

## 🔄 Future Updates

To deploy updates:
1. Make changes locally
2. Commit: `git add . && git commit -m "Your message"`
3. Push: `git push`
4. Render automatically redeploys (if connected to GitHub)

---

✨ **Your FitLife AI app is now live on the internet!**
