# 🚀 Backend Deployment Guide - Step by Step

## Prerequisites Checklist
- ✅ Firebase dependencies installed
- ✅ Backend code ready with Firebase Functions support
- ⏳ MongoDB Atlas account (we'll create this)
- ⏳ Firebase account (we'll set this up)

---

## PART 1: Setup MongoDB Atlas (Cloud Database) ☁️

### Step 1: Create MongoDB Atlas Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google/Email
3. Choose **FREE** tier (M0 Sandbox)
4. Click "Create" (no credit card needed)

### Step 2: Create a Cluster
1. After login, click **"Build a Database"**
2. Choose **"M0 FREE"** tier
3. Select **Cloud Provider**: AWS
4. Select **Region**: Choose one close to you (e.g., Mumbai for India)
5. **Cluster Name**: Leave as "Cluster0" or name it "parking-cluster"
6. Click **"Create Cluster"** (takes 3-5 minutes)

### Step 3: Create Database User
1. Click **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Username: `parkingadmin` (or your choice)
5. Password: Click **"Autogenerate Secure Password"** → **COPY AND SAVE IT!**
6. Database User Privileges: **"Atlas admin"** or **"Read and write to any database"**
7. Click **"Add User"**

### Step 4: Setup Network Access
1. Click **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (adds 0.0.0.0/0)
4. Click **"Confirm"**

### Step 5: Get Connection String
1. Click **"Database"** in left sidebar
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. **Driver**: Node.js, **Version**: 4.1 or later
5. Copy the connection string (looks like):
   ```
   mongodb+srv://parkingadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **IMPORTANT**: Replace `<password>` with the actual password you saved earlier
7. Add database name: `mongodb+srv://parkingadmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/parking-booking?retryWrites=true&w=majority`

**SAVE THIS CONNECTION STRING - YOU'LL NEED IT!**

---

## PART 2: Setup Firebase 🔥

### Step 1: Install Firebase CLI
Open PowerShell and run:
```powershell
npm install -g firebase-tools
```

### Step 2: Login to Firebase
```powershell
firebase login
```
- Browser will open
- Login with your Google account
- Grant permissions

### Step 3: Create Firebase Project
1. Go to: https://console.firebase.google.com/
2. Click **"Add project"**
3. Project name: `parking-booking-system` (or your choice)
4. Disable Google Analytics (not needed)
5. Click **"Create project"**
6. Wait for setup to complete → Click **"Continue"**

### Step 4: Initialize Firebase in Your Backend
```powershell
cd c:\Users\khema\OneDrive\Documents\MNM-mini-proj\backend
firebase init functions
```

**Answer these prompts:**
1. **"Please select an option:"** → Choose **"Use an existing project"**
2. **Select your project** → Choose the project you just created
3. **"What language would you like to use?"** → **JavaScript**
4. **"Do you want to use ESLint?"** → **No** (or Yes, your choice)
5. **"Do you want to install dependencies with npm?"** → **Yes**
6. **"File index.js already exists. Overwrite?"** → **No** (IMPORTANT!)
7. **"File package.json already exists. Overwrite?"** → **No** (IMPORTANT!)

### Step 5: Update .firebaserc File
After initialization, check if `.firebaserc` was created:
```powershell
Get-Content .firebaserc
```

It should look like:
```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

---

## PART 3: Configure Environment Variables in Firebase 🔐

### Set All Environment Variables:

```powershell
cd c:\Users\khema\OneDrive\Documents\MNM-mini-proj\backend

# Set MongoDB Connection String (replace with your actual connection string)
firebase functions:config:set mongodb.uri="mongodb+srv://parkingadmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/parking-booking?retryWrites=true&w=majority"

# Set JWT Secret (use a strong random string)
firebase functions:config:set jwt.secret="your-super-secret-jwt-key-min-32-chars-parking-2024"

# Set Razorpay Keys (optional, can add later)
firebase functions:config:set razorpay.key_id="your_razorpay_key_id_here"
firebase functions:config:set razorpay.key_secret="your_razorpay_key_secret_here"
```

**Verify your config:**
```powershell
firebase functions:config:get
```

---

## PART 4: Deploy to Firebase 🚀

### Step 1: Deploy Functions
```powershell
cd c:\Users\khema\OneDrive\Documents\MNM-mini-proj\backend
firebase deploy --only functions
```

This will:
- Upload your code
- Build the functions
- Deploy to Firebase

**Wait 2-5 minutes for deployment...**

### Step 2: Get Your Backend URL
After successful deployment, you'll see:
```
✔  functions[api(us-central1)]: Successful create operation.
Function URL (api): https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/api
```

**COPY THIS URL - YOU'LL NEED IT FOR FRONTEND!**

Example: `https://us-central1-parking-booking-system.cloudfunctions.net/api`

---

## PART 5: Update Frontend with Backend URL 🔗

### Step 1: Update Vercel Environment Variables
1. Go to: https://vercel.com/dashboard
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Add/Update:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/api` (your Firebase Function URL)
5. Click **Save**

### Step 2: Redeploy Frontend
Go to **Deployments** → Click **"Redeploy"** on the latest deployment

OR trigger via Git:
```powershell
cd c:\Users\khema\OneDrive\Documents\MNM-mini-proj
git add .
git commit -m "Update backend configuration for production"
git push origin main
```

---

## PART 6: Create Admin Account in Production 👨‍💼

After deployment, you need an admin user to manage parking slots.

### Method 1: Using MongoDB Atlas Web Interface
1. Go to MongoDB Atlas → **Database** → **Browse Collections**
2. Find database: `parking-booking`
3. Find collection: `users`
4. Click **"Insert Document"**
5. Add this document:
```json
{
  "name": "Admin",
  "email": "admin@parking.com",
  "password": "$2a$10$YourHashedPasswordHere",
  "phone": "1234567890",
  "role": "admin",
  "createdAt": {"$date": "2024-11-28T00:00:00.000Z"}
}
```

### Method 2: Register and Upgrade (Easier)
1. Go to your deployed frontend URL
2. **Register** a new account with your email
3. Go to MongoDB Atlas → **Browse Collections**
4. Find your user in `users` collection
5. Click **Edit** on your user document
6. Change `"role": "user"` to `"role": "admin"`
7. Click **Update**
8. Logout and login again - you're now admin!

---

## Testing Your Deployment ✅

### Test Backend Endpoints:
```powershell
# Test if backend is alive
Invoke-WebRequest -Uri "https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/api" -Method GET
```

Should return: `{"message":"Car Parking Booking API"}`

### Test Full Application:
1. **Visit Frontend URL** (your Vercel URL)
2. **Register** a new user
3. **Login** with registered user
4. **View Parking Slots** (sample data should load)
5. **Book a slot**
6. **Check My Bookings**
7. **Login as Admin** (after creating admin user)
8. **Add new parking slots** (admin only)

---

## Troubleshooting 🔧

### Backend Not Responding
```powershell
# Check Firebase Functions logs
firebase functions:log
```

### Database Connection Failed
- Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Check connection string has correct password
- Ensure database name is added to connection string

### Environment Variables Not Working
```powershell
# Check current config
firebase functions:config:get

# If empty, set them again
firebase functions:config:set mongodb.uri="YOUR_CONNECTION_STRING"
```

### CORS Errors
- Backend already has CORS enabled
- Ensure `REACT_APP_API_URL` in Vercel matches your Firebase Function URL exactly

---

## Quick Command Reference 📝

### Deploy Backend
```powershell
cd backend
firebase deploy --only functions
```

### View Backend Logs
```powershell
firebase functions:log
```

### Update Environment Variables
```powershell
firebase functions:config:set KEY="VALUE"
firebase deploy --only functions
```

### Redeploy After Changes
```powershell
# 1. Make code changes
# 2. Commit to Git
git add .
git commit -m "Update backend"
git push origin main

# 3. Deploy to Firebase
cd backend
firebase deploy --only functions
```

---

## Cost Breakdown 💰

### MongoDB Atlas M0 (FREE Tier)
- ✅ 512 MB storage
- ✅ Shared RAM
- ✅ No credit card required
- ✅ Perfect for small projects

### Firebase Functions (FREE Tier)
- ✅ 2M invocations/month
- ✅ 400,000 GB-seconds compute
- ✅ 200,000 CPU-seconds compute
- ✅ 5GB outbound data transfer

### Vercel (FREE Tier)
- ✅ Unlimited personal projects
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS

**Total Monthly Cost: ₹0** for moderate usage! 🎉

---

## Next Steps After Deployment 🎯

1. ✅ Test all features thoroughly
2. ✅ Add real parking slot data (as admin)
3. ✅ Setup Razorpay payment gateway (follow PAYMENT_SETUP_GUIDE.md)
4. ✅ Share your live URL!
5. ✅ Monitor usage in Firebase Console

---

**Your parking booking system is production-ready!** 🚀

Live URLs:
- Frontend: `https://your-project.vercel.app`
- Backend: `https://us-central1-YOUR-PROJECT.cloudfunctions.net/api`
- Database: MongoDB Atlas Cloud
