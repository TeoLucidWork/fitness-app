# 🚀 FREE Deployment Guide - Fitness App
## Backend: Render | Frontend: Vercel | Database: PostgreSQL

**100% FREE - No Credit Card Required!**

---

## 🎯 What You'll Get

- ✅ **Backend API** on Render (Free tier)
- ✅ **PostgreSQL Database** on Render (Free 90-day trial, then $7/month)
- ✅ **Frontend** on Vercel (Free forever)
- ✅ **SSL/HTTPS** automatically configured
- ✅ **Continuous deployment** from GitHub

**Limitations of Free Tier:**
- Backend sleeps after 15 minutes of inactivity (wakes up in ~30 seconds)
- 750 hours/month of runtime (enough for small projects)
- Database: 90-day free trial, then $7/month

---

## Prerequisites

1. ✅ **GitHub Account** - [Sign up](https://github.com/join)
2. ✅ **Render Account** - [Sign up](https://dashboard.render.com/register)
3. ✅ **Vercel Account** - [Sign up](https://vercel.com/signup)

**No credit card needed!**

---

## Part 1: Push Code to GitHub

### Step 1: Create GitHub Repository
1. Go to [GitHub](https://github.com/new)
2. Repository name: `fitness-app`
3. Make it **Public** (required for free Render)
4. **Do NOT** initialize with README
5. Click "Create repository"

### Step 2: Push Your Code
```bash
cd fitness-app

# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Ready for deployment"

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/fitness-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

✅ **Verify:** Check your GitHub repository - you should see all your code

---

## Part 2: Deploy Backend to Render

### Step 1: Create Render Account
1. Go to [Render](https://dashboard.render.com/register)
2. Sign up with GitHub (recommended)
3. Authorize Render to access your repositories

### Step 2: Create PostgreSQL Database

1. From Render Dashboard, click **"New +"**
2. Select **"PostgreSQL"**
3. Configure:
   - **Name:** `fitness-app-db`
   - **Database:** `fitness_db`
   - **User:** `fitness_user`
   - **Region:** Choose closest to you
   - **Plan:** Free (90-day trial)
4. Click **"Create Database"**
5. ⏳ Wait 2-3 minutes for database to provision

✅ **Important:** Copy the **Internal Database URL** (we'll need this)

### Step 3: Create Web Service

1. From Render Dashboard, click **"New +"**
2. Select **"Web Service"**
3. Connect your GitHub repository: `fitness-app`
4. Configure:
   - **Name:** `fitness-app-backend`
   - **Region:** Same as database
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Branch:** `main`
   - **Build Command:**
     ```
     npm install && npx prisma generate && npm run build
     ```
   - **Start Command:**
     ```
     npm run start:prod
     ```
   - **Plan:** Free

5. Click **"Advanced"** and add Environment Variables:

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | *Paste your Internal Database URL from Step 2* |
   | `JWT_SECRET` | *Generate random string: https://randomkeygen.com/* |
   | `FRONTEND_URL` | `http://localhost:3000` *(we'll update this later)* |
   | `PORT` | `10000` |
   | `NODE_ENV` | `production` |

6. Click **"Create Web Service"**
7. ⏳ Wait 5-10 minutes for first deployment

### Step 4: Verify Backend is Running

Once deployment succeeds, you'll get a URL like:
`https://fitness-app-backend.onrender.com`

Test it:
```bash
# Check if backend is live
curl https://fitness-app-backend.onrender.com

# You should get a response from your API
```

✅ **Backend is now live!**

---

## Part 3: Deploy Frontend to Vercel

### Step 1: Create Vercel Account
1. Go to [Vercel](https://vercel.com/signup)
2. Sign up with GitHub
3. Authorize Vercel

### Step 2: Import Project

1. Click **"Add New..." > "Project"**
2. Import `fitness-app` repository
3. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `build` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)

4. Add Environment Variable:
   - Click **"Environment Variables"**
   - **Name:** `REACT_APP_API_URL`
   - **Value:** `https://fitness-app-backend.onrender.com` *(your Render backend URL)*
   - Select all environments (Production, Preview, Development)

5. Click **"Deploy"**
6. ⏳ Wait 3-5 minutes

### Step 3: Get Your Frontend URL

After deployment, Vercel gives you a URL like:
`https://fitness-app-frontend.vercel.app`

✅ **Frontend is now live!**

---

## Part 4: Update Backend CORS

Now update your backend to allow requests from your frontend:

1. Go to Render Dashboard
2. Select your backend service
3. Click **"Environment"** tab
4. Update `FRONTEND_URL`:
   - **Value:** `https://fitness-app-frontend.vercel.app` *(your Vercel URL)*
5. Click **"Save Changes"**
6. Service will automatically redeploy

⏳ Wait 2-3 minutes for redeploy

---

## Part 5: Test Your Deployment

### Test Frontend
1. Open your Vercel URL: `https://fitness-app-frontend.vercel.app`
2. Try to register a new trainer account
3. Login with the account you created
4. Create an exercise or program

### Test Backend API
```bash
# Replace with your Render URL
BACKEND_URL="https://fitness-app-backend.onrender.com"

# Test registration
curl -X POST $BACKEND_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"trainer@test.com","password":"Test123456","role":"TRAINER","firstName":"Test","lastName":"Trainer"}'
```

---

## 🎉 You're Done!

Your app is now live on the internet, completely FREE!

- **Frontend:** https://fitness-app-frontend.vercel.app
- **Backend:** https://fitness-app-backend.onrender.com

---

## 📊 What's Next?

### Automatic Deployments

Both Render and Vercel are now watching your GitHub repository:

- **Push to `main` branch** → Automatic deployment to production
- **Create Pull Request** → Automatic preview deployment (Vercel only)

```bash
# Make changes to your code
git add .
git commit -m "Add new feature"
git push origin main

# Your app will automatically redeploy! 🎉
```

### Add Seed Data

Seed your database with initial exercises:

1. Go to Render Dashboard
2. Select your backend service
3. Click **"Shell"** tab
4. Run:
   ```bash
   npm run db:seed
   ```

### Monitor Your App

**Render:**
- View logs: Dashboard > Your Service > Logs
- View metrics: Dashboard > Your Service > Metrics

**Vercel:**
- View deployments: Dashboard > Your Project
- View analytics: Dashboard > Your Project > Analytics

---

## ⚠️ Important Notes

### Backend Sleep on Free Tier

Your backend will sleep after 15 minutes of inactivity:
- **First request after sleep:** Takes ~30 seconds to wake up
- **Solution:** Upgrade to paid plan ($7/month) for always-on service
- **Or:** Use a ping service (e.g., UptimeRobot) to keep it awake

### Database Free Trial

PostgreSQL is free for 90 days, then $7/month:
- **Option 1:** Upgrade when trial ends
- **Option 2:** Use Supabase (has free forever PostgreSQL)
- **Option 3:** Migrate to another provider

---

## 🔧 Troubleshooting

### Backend Not Working

**Check Logs:**
1. Render Dashboard > Your Service > Logs
2. Look for errors

**Common Issues:**
- Database not connected: Check `DATABASE_URL` env variable
- Build failed: Check build logs
- Port issues: Ensure `PORT=10000` is set

**Fix:**
```bash
# Trigger manual redeploy
# Render Dashboard > Your Service > Manual Deploy > Deploy latest commit
```

### Frontend Not Connecting to Backend

**Check:**
1. Browser console (F12) for errors
2. Network tab shows API calls
3. `REACT_APP_API_URL` is set correctly in Vercel
4. CORS error? Update `FRONTEND_URL` in Render

**Fix:**
1. Vercel Dashboard > Your Project > Settings > Environment Variables
2. Update `REACT_APP_API_URL` if needed
3. Redeploy: Deployments > Latest > Redeploy

### CORS Errors

```
Access to fetch at 'https://...' has been blocked by CORS policy
```

**Fix:**
1. Render Dashboard > Backend Service > Environment
2. Ensure `FRONTEND_URL` exactly matches your Vercel URL
3. Include `https://` protocol
4. No trailing slash
5. Save changes and wait for redeploy

---

## 💰 Cost Breakdown

### Current Setup (First 90 days)
- **Backend (Render):** FREE
- **Database (Render):** FREE (90-day trial)
- **Frontend (Vercel):** FREE Forever

**Total: $0/month** ✅

### After 90 Days
- **Backend (Render):** FREE
- **Database (Render):** $7/month
- **Frontend (Vercel):** FREE

**Total: $7/month**

### Upgrade Options

**Render Starter ($7/month):**
- No sleep (always-on)
- Faster deployments
- More resources

**Vercel Pro ($20/month):**
- Team features
- More bandwidth
- Priority support

---

## 🔒 Security Checklist

Before going to production:

- ✅ `.env` file in `.gitignore`
- ✅ Strong `JWT_SECRET` (random 32+ characters)
- ✅ `DATABASE_URL` is secure (managed by Render)
- ✅ CORS configured with specific frontend URL
- ✅ HTTPS enabled (automatic)
- ✅ No API keys in frontend code
- ✅ Environment variables properly set
- ⚠️ Change default admin password if you seeded data
- ⚠️ Set up database backups (paid feature)

---

## 📚 Useful Commands

### Render CLI (Optional)
```bash
# Install Render CLI
npm install -g render-cli

# Login
render login

# View services
render services list

# View logs
render logs <service-name>
```

### Vercel CLI
```bash
# Already installed from earlier

# View deployments
vercel ls

# View logs
vercel logs <deployment-url>

# Pull env variables
vercel env pull
```

---

## 🆘 Need Help?

### Documentation
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [NestJS Deployment](https://docs.nestjs.com/deployment)

### Community Support
- [Render Community](https://community.render.com/)
- [Vercel Discussions](https://github.com/vercel/vercel/discussions)

### Common Questions

**Q: Can I use a custom domain?**
A: Yes! Both Render and Vercel support custom domains on free tier.

**Q: How do I upgrade to paid plan?**
A: Render/Vercel Dashboard > Billing > Upgrade

**Q: Can I migrate to another provider later?**
A: Yes! Your code works anywhere. Just export your database and redeploy.

**Q: Is this production-ready?**
A: For small projects and MVPs, yes! For high-traffic apps, consider paid plans.

---

## 🎓 Next Steps

1. ✅ Add custom domain
2. ✅ Set up error monitoring (Sentry)
3. ✅ Configure database backups
4. ✅ Add analytics (Google Analytics, Vercel Analytics)
5. ✅ Set up uptime monitoring (UptimeRobot)
6. ✅ Create staging environment
7. ✅ Add email notifications

---

**Congratulations! Your fitness app is now deployed and accessible to the world! 🎉**

Share your Vercel URL with friends and start using your app!
