# 🚀 Deployment Guide - Vercel + Firebase

## Overview
- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Firebase Functions
- **Database**: MongoDB Atlas (Cloud)

---

## Prerequisites

1. **Accounts Needed**:
   - [Vercel Account](https://vercel.com/signup)
   - [Firebase Account](https://console.firebase.google.com/)
   - [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas/register)
   - [GitHub Account](https://github.com/) (recommended for easy deployment)

2. **Tools to Install**:
   ```powershell
   # Install Vercel CLI
   npm install -g vercel
   
   # Install Firebase CLI
   npm install -g firebase-tools
   ```

---

## Part 1: Setup MongoDB Atlas (Database)

### Step 1: Create Cluster
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a **FREE** cluster (M0 Sandbox)
3. Choose a region close to you
4. Wait 3-5 minutes for cluster creation

### Step 2: Setup Database Access
1. Go to **Database Access** → Click **Add New Database User**
2. Create username and strong password
3. **SAVE THESE CREDENTIALS** - you'll need them!
4. Set privileges to **"Read and write to any database"**

### Step 3: Setup Network Access
1. Go to **Network Access** → Click **Add IP Address**
2. Click **"Allow Access from Anywhere"** (for development)
3. This adds `0.0.0.0/0` to whitelist

### Step 4: Get Connection String
1. Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<username>` and `<password>` with your database user credentials
5. Add database name after `.net/`: `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/parking-booking?retryWrites=true&w=majority`

---

## Part 2: Deploy Backend to Firebase

### Step 1: Login to Firebase
```powershell
cd backend
firebase login
```
- Browser will open for authentication
- Login with your Google account

### Step 2: Initialize Firebase Project
```powershell
firebase init functions
```
- Use an **existing project** or create a new one
- Select **JavaScript** (not TypeScript)
- Do **NOT** overwrite existing files when prompted
- Install dependencies: **Yes**

### Step 3: Install Dependencies
```powershell
npm install firebase-functions firebase-admin
```

### Step 4: Configure Environment Variables in Firebase
```powershell
# Set each environment variable
firebase functions:config:set mongodb.uri="YOUR_MONGODB_ATLAS_CONNECTION_STRING"
firebase functions:config:set jwt.secret="your-super-secret-jwt-key-min-32-characters"
firebase functions:config:set razorpay.key_id="your_razorpay_key_id"
firebase functions:config:set razorpay.key_secret="your_razorpay_key_secret"
```

**Example**:
```powershell
firebase functions:config:set mongodb.uri="mongodb+srv://admin:pass123@cluster0.xxxxx.mongodb.net/parking-booking?retryWrites=true&w=majority"
firebase functions:config:set jwt.secret="my-super-secret-jwt-key-for-parking-app-2024"
firebase functions:config:set razorpay.key_id="rzp_test_YOUR_KEY_HERE"
firebase functions:config:set razorpay.key_secret="YOUR_SECRET_HERE"
```

### Step 5: Update Backend Code for Firebase Config
Create `backend/config/firebase-env.js`:
```javascript
const functions = require('firebase-functions');

module.exports = {
  MONGODB_URI: functions.config().mongodb?.uri || process.env.MONGODB_URI,
  JWT_SECRET: functions.config().jwt?.secret || process.env.JWT_SECRET,
  RAZORPAY_KEY_ID: functions.config().razorpay?.key_id || process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: functions.config().razorpay?.key_secret || process.env.RAZORPAY_KEY_SECRET
};
```

### Step 6: Deploy to Firebase
```powershell
firebase deploy --only functions
```

### Step 7: Get Your Backend URL
After deployment completes, you'll see:
```
Function URL (api): https://us-central1-YOUR-PROJECT.cloudfunctions.net/api
```
**SAVE THIS URL** - you'll need it for frontend!

---

## Part 3: Deploy Frontend to Vercel

### Step 1: Push Code to GitHub (Recommended Method)

#### Option A: Using GitHub Desktop
1. Download [GitHub Desktop](https://desktop.github.com/)
2. Create new repository
3. Add your frontend folder
4. Commit and push

#### Option B: Using Git Command Line
```powershell
cd frontend

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Parking booking frontend"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/parking-booking-frontend.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy via Vercel Website
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `./` (or leave default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### Step 3: Add Environment Variables in Vercel
In project settings, add:
```
REACT_APP_API_URL=https://us-central1-YOUR-PROJECT.cloudfunctions.net/api
REACT_APP_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_HERE
```

### Step 4: Deploy
- Click **"Deploy"**
- Wait 2-3 minutes
- Your site will be live at: `https://your-project.vercel.app`

---

## Part 4: Create Admin Account in Production

After deployment, you need to create an admin user:

### Option 1: Using MongoDB Atlas Interface
1. Go to MongoDB Atlas → **Browse Collections**
2. Find `parking-booking` database → `users` collection
3. Click **"Insert Document"**
4. Add admin user manually

### Option 2: Run Script Temporarily
1. Update `backend/createAdmin.js` to use Firebase config
2. Run locally with production connection string:
   ```powershell
   cd backend
   node createAdmin.js
   ```

### Option 3: Create via API (Easiest)
1. Go to your deployed frontend
2. Register a normal account
3. Go to MongoDB Atlas → Find that user
4. Edit the user → Change `role` from `"user"` to `"admin"`

---

## Environment Variables Summary

### Backend (Firebase Functions Config)
```
mongodb.uri = "mongodb+srv://..."
jwt.secret = "your-jwt-secret-key"
razorpay.key_id = "rzp_test_..."
razorpay.key_secret = "your_secret"
```

### Frontend (Vercel Environment Variables)
```
REACT_APP_API_URL = "https://us-central1-YOUR-PROJECT.cloudfunctions.net/api"
REACT_APP_RAZORPAY_KEY_ID = "rzp_test_..."
```

---

## Testing Your Deployed Application

1. **Visit Frontend URL**: `https://your-project.vercel.app`
2. **Test Registration**: Create a new user account
3. **Test Login**: Login with created account
4. **Browse Slots**: View parking slots (sample data should load)
5. **Admin Login**: Login with admin credentials
6. **Add Slots**: Admin can add new parking slots
7. **Book Slot**: User can book a parking slot
8. **View Bookings**: Check My Bookings page
9. **Payment**: Test payment flow (use test mode credentials)

---

## Quick Deploy Commands

### Backend Deploy
```powershell
cd backend
firebase deploy --only functions
```

### Frontend Deploy (if using Vercel CLI)
```powershell
cd frontend
vercel --prod
```

---

## Common Issues & Solutions

### Issue: "Module not found" in Firebase
**Solution**: Make sure all dependencies are installed
```powershell
cd backend
npm install
firebase deploy --only functions
```

### Issue: Frontend can't reach backend
**Solution**: Check CORS settings and API URL
- Verify `REACT_APP_API_URL` in Vercel is correct
- Ensure backend CORS allows your Vercel domain

### Issue: Database connection failed
**Solution**: 
- Check MongoDB Atlas connection string
- Verify IP whitelist includes `0.0.0.0/0`
- Ensure database user has correct permissions

### Issue: Payment not working
**Solution**:
- Verify Razorpay keys are correct
- Check both test and live mode keys
- Ensure environment variables are set in both Vercel and Firebase

---

## Updating Your Application

### Update Frontend
1. Make changes in your code
2. Commit and push to GitHub
3. Vercel auto-deploys on push (if GitHub integration enabled)

OR manually:
```powershell
cd frontend
vercel --prod
```

### Update Backend
```powershell
cd backend
firebase deploy --only functions
```

---

## Cost Breakdown (FREE Tier)

✅ **Vercel**: Free for personal projects
✅ **Firebase Functions**: 2M invocations/month free
✅ **MongoDB Atlas**: 512MB storage free
✅ **Razorpay**: No setup fees, only pay on transactions

**Total Monthly Cost**: ₹0 for small-scale usage!

---

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Firebase Docs**: https://firebase.google.com/docs/functions
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com/
- **Razorpay Docs**: https://razorpay.com/docs/

---

**Your parking booking system is now live! 🎉**
