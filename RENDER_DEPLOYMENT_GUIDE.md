# 🚀 Backend Deployment Guide - Render (Free, No Credit Card!)

## Why Render?
- ✅ **Completely FREE** for small projects
- ✅ **No credit card required**
- ✅ Automatic deployments from GitHub
- ✅ Built-in SSL/HTTPS
- ✅ Easy to use
- ✅ 750 hours/month free (enough for 24/7 operation)

---

## PART 1: Push Updated Code to GitHub

### Step 1: Commit Backend Changes
```powershell
cd c:\Users\khema\OneDrive\Documents\MNM-mini-proj
git add .
git commit -m "Prepare backend for Render deployment"
git push origin main
```

---

## PART 2: Setup Render Account

### Step 1: Create Render Account
1. Go to: **https://render.com/**
2. Click **"Get Started for Free"**
3. Sign up with **GitHub** (recommended for easy integration)
4. Authorize Render to access your repositories

### Step 2: Connect Your Repository
1. After login, you'll be on the Render Dashboard
2. Click **"New +"** button (top right)
3. Select **"Web Service"**
4. Click **"Connect account"** if GitHub not connected
5. Find your repository: **"car-parking-slot-booking-system"**
6. Click **"Connect"**

---

## PART 3: Configure Your Web Service

### Fill in the following details:

**Name**: `parking-booking-backend` (or any name you like)

**Region**: Choose closest to you (e.g., Singapore for Asia)

**Branch**: `main`

**Root Directory**: `backend`

**Runtime**: `Node`

**Build Command**: `npm install`

**Start Command**: `node server.js`

**Instance Type**: **Free**

---

## PART 4: Add Environment Variables

Scroll down to **"Environment Variables"** section and add these:

### Required Variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | `mongodb+srv://zoronandha_db_user:eM4ya5hMhYd7F74d@cluster0.uuzxvbm.mongodb.net/parking-booking?retryWrites=true&w=majority&appName=Cluster0` |
| `JWT_SECRET` | `parking-booking-jwt-secret-key-2024-super-secure-random-string` |
| `PORT` | `5000` |

### Optional (for Payment Gateway - can add later):

| Key | Value |
|-----|-------|
| `RAZORPAY_KEY_ID` | `your_razorpay_key_id` |
| `RAZORPAY_KEY_SECRET` | `your_razorpay_secret` |

---

## PART 5: Deploy!

1. Click **"Create Web Service"** button at the bottom
2. Render will start building and deploying (takes 2-5 minutes)
3. Wait for "Live" status with green indicator

### You'll get a URL like:
```
https://parking-booking-backend.onrender.com
```

**SAVE THIS URL - YOU'LL NEED IT!**

---

## PART 6: Update Frontend with Backend URL

### Step 1: Update Vercel Environment Variable

1. Go to: https://vercel.com/dashboard
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Find `REACT_APP_API_URL` and click **Edit**
5. Update value to: `https://parking-booking-backend.onrender.com/api`
   (Replace with your actual Render URL + `/api`)
6. Click **Save**

### Step 2: Redeploy Frontend
1. Go to **Deployments** tab
2. Click three dots on latest deployment
3. Click **"Redeploy"**

---

## PART 7: Test Your Deployment

### Test Backend:
Open your browser and visit:
```
https://parking-booking-backend.onrender.com
```

You should see:
```json
{"message":"Car Parking Booking API"}
```

### Test Full Application:
1. Go to your Vercel frontend URL
2. Try registering a new user
3. Login
4. View parking slots
5. Book a slot
6. Check "My Bookings"

---

## PART 8: Create Admin Account

### Method 1: Register and Upgrade
1. Register a new account on your frontend
2. Go to MongoDB Atlas: https://cloud.mongodb.com/
3. Click **Database** → **Browse Collections**
4. Select database: `parking-booking`
5. Select collection: `users`
6. Find your user document
7. Click **Edit** (pencil icon)
8. Change `"role": "user"` to `"role": "admin"`
9. Click **Update**
10. Logout and login again - you're now admin!

### Method 2: Direct Insert in MongoDB
1. Go to MongoDB Atlas → **Browse Collections**
2. Database: `parking-booking` → Collection: `users`
3. Click **Insert Document**
4. Switch to **JSON** view
5. Paste this (update email/password):
```json
{
  "name": "Admin User",
  "email": "admin@parking.com",
  "password": "$2a$10$YourHashedPasswordHere",
  "phone": "1234567890",
  "role": "admin",
  "createdAt": {"$date": "2024-11-28T00:00:00.000Z"}
}
```
6. For password, you need to hash it first. Easier to use Method 1!

---

## Important Notes ⚠️

### Render Free Tier Limitations:
- ✅ **750 hours/month** free (enough for 24/7)
- ⚠️ **Spins down after 15 minutes of inactivity**
- ⚠️ **Cold start**: First request after inactivity takes ~30 seconds
- ✅ Automatically wakes up on incoming requests

### Keep Your Service Active:
If you want to avoid cold starts, you can use a **cron job** or **uptime monitor**:
- **UptimeRobot**: https://uptimerobot.com/ (free, pings your backend every 5 min)
- Set monitor URL: `https://parking-booking-backend.onrender.com`

---

## Automatic Deployments 🔄

Render automatically redeploys when you push to GitHub!

```powershell
# Make changes to your code
cd c:\Users\khema\OneDrive\Documents\MNM-mini-proj
git add .
git commit -m "Update backend feature"
git push origin main
```

Render will automatically:
1. Detect the push
2. Build your code
3. Deploy new version
4. Your app will be live in 2-3 minutes!

---

## View Logs and Debug 🔍

### In Render Dashboard:
1. Click on your service
2. Go to **"Logs"** tab
3. See real-time logs
4. Debug any issues

### Common Issues:

**Error: Database connection failed**
- Check MongoDB Atlas IP whitelist (should be 0.0.0.0/0)
- Verify MONGODB_URI environment variable

**Error: Port already in use**
- Render automatically assigns PORT, don't worry about this

**Cold Start Delay**
- Normal for free tier
- Use UptimeRobot to keep it active

---

## Cost Comparison 💰

| Service | Cost | Features |
|---------|------|----------|
| **Render Free** | ₹0/month | 750 hrs, auto-deploy, SSL |
| **MongoDB Atlas M0** | ₹0/month | 512MB, shared |
| **Vercel** | ₹0/month | Unlimited deploys |
| **Total** | **₹0/month** | Full production app! |

---

## Next Steps After Deployment ✅

1. ✅ Test all features
2. ✅ Add admin account
3. ✅ Add real parking slot data
4. ✅ Setup Razorpay payment (optional)
5. ✅ Share your live URLs!

---

## Your Live URLs 🌐

After deployment, you'll have:

- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://parking-booking-backend.onrender.com`
- **Database**: MongoDB Atlas (cloud)
- **GitHub**: `https://github.com/zoronandha-ctrl/car-parking-slot-booking-system`

---

## Support & Monitoring

### Render Dashboard:
- **Logs**: Real-time application logs
- **Metrics**: CPU, Memory usage
- **Events**: Deployment history

### MongoDB Atlas:
- **Metrics**: Database performance
- **Charts**: Data visualization
- **Alerts**: Set up monitoring alerts

---

**Your parking booking system is now live! 🎉**

No credit card needed, completely FREE! 🚀
