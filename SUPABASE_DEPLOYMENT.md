# 🚀 FREE Deployment Guide - Fitness App with Supabase
## Backend: Supabase (PostgreSQL) | Frontend: Vercel

**100% FREE Forever - No Credit Card Required!**

---

## 🎯 What You'll Get

- ✅ **PostgreSQL Database** on Supabase (Free forever - 500MB storage, 2GB bandwidth)
- ✅ **Backend API** deployed on Vercel or Render (Free tier)
- ✅ **Frontend** on Vercel (Free forever)
- ✅ **SSL/HTTPS** automatically configured
- ✅ **Continuous deployment** from GitHub
- ✅ **Real-time database** capabilities (optional)
- ✅ **Row Level Security** for advanced security

**Supabase Free Tier:**
- 500 MB database space
- 2 GB bandwidth per month
- 50,000 monthly active users
- No time limit - FREE FOREVER!

---

## Prerequisites

1. ✅ **GitHub Account** - [Sign up](https://github.com/join)
2. ✅ **Supabase Account** - [Sign up](https://supabase.com/dashboard/sign-up)
3. ✅ **Vercel Account** - [Sign up](https://vercel.com/signup)

**No credit card needed!**

---

## Part 1: Set Up Supabase Database

### Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Configure:
   - **Name:** `fitness-app`
   - **Database Password:** Choose a strong password (save this!)
   - **Region:** Choose closest to your users
   - **Pricing Plan:** Free
4. Click **"Create new project"**
5. ⏳ Wait 2-3 minutes for project to provision

### Step 2: Get Database Connection String

1. In your Supabase project, go to **Settings** (gear icon)
2. Click **"Database"** in the left sidebar
3. Scroll down to **"Connection string"**
4. Select **"URI"** tab
5. Copy the connection string - it looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
   ```
6. Replace `[YOUR-PASSWORD]` with the password you set in Step 1

✅ **Important:** Save this connection string - you'll need it for deployment

### Step 3: Configure Database for Prisma

Supabase PostgreSQL works perfectly with Prisma. You can use it directly with the connection string from Step 2.

**Optional - Enable Connection Pooling (Recommended):**

For better performance with serverless deployments:

1. In Supabase Dashboard → **Settings** → **Database**
2. Scroll to **"Connection pooling"**
3. Copy the **"Transaction mode"** connection string
4. Use this for your `DATABASE_URL` (recommended for Vercel/Render)

---

## Part 2: Push Code to GitHub

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Repository name: `fitness-app`
3. Make it **Public** (required for free tier deployments)
4. **Do NOT** initialize with README
5. Click **"Create repository"**

### Step 2: Push Your Code

```bash
cd fitness-app

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Fitness app with Supabase"

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/fitness-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

✅ **Verify:** Check your GitHub repository - you should see all your code

---

## Part 3: Deploy Backend

You have two options for deploying the backend:

### Option A: Deploy Backend to Vercel (Recommended - Easier)

**Advantages:**
- Same platform as frontend
- Automatic deployments
- Generous free tier
- Built-in serverless functions

**Steps:**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..." → "Project"**
3. Import your `fitness-app` repository
4. Configure **Backend**:
   - **Framework Preset:** Other
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

5. Add **Environment Variables**:

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | *Your Supabase connection string from Part 1* |
   | `JWT_SECRET` | *Generate: https://randomkeygen.com/* |
   | `FRONTEND_URL` | `http://localhost:3000` *(update later)* |
   | `NODE_ENV` | `production` |

6. Click **"Deploy"**
7. ⏳ Wait 3-5 minutes for deployment

**Your backend URL will be:** `https://fitness-app-backend.vercel.app`

### Option B: Deploy Backend to Render (Alternative)

**Advantages:**
- Always-on server (not serverless)
- Better for long-running processes
- Free tier available

**Steps:**

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +" → "Web Service"**
3. Connect your GitHub repository: `fitness-app`
4. Configure:
   - **Name:** `fitness-app-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Branch:** `main`
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npm run start:prod`
   - **Plan:** Free

5. Click **"Advanced"** and add Environment Variables:

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | *Your Supabase connection string* |
   | `JWT_SECRET` | *Generate random string* |
   | `FRONTEND_URL` | `http://localhost:3000` *(update later)* |
   | `PORT` | `10000` |
   | `NODE_ENV` | `production` |

6. Click **"Create Web Service"**
7. ⏳ Wait 5-10 minutes

**Your backend URL will be:** `https://fitness-app-backend.onrender.com`

---

## Part 4: Deploy Frontend to Vercel

### Step 1: Deploy Frontend

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..." → "Project"**
3. Import your `fitness-app` repository (if deploying backend on Render)
   - Or click **"Add New..." → "Project"** again if you already deployed backend on Vercel
4. Configure **Frontend**:
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `build` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)

5. Add **Environment Variable**:
   - **Name:** `REACT_APP_API_URL`
   - **Value:** `https://fitness-app-backend.vercel.app` *(or your Render URL)*
   - Select all environments (Production, Preview, Development)

6. Click **"Deploy"**
7. ⏳ Wait 3-5 minutes

**Your frontend URL will be:** `https://fitness-app-frontend.vercel.app`

✅ **Frontend is now live!**

---

## Part 5: Update Backend CORS

Update your backend to allow requests from your frontend:

### If deployed on Vercel:
1. Go to Vercel Dashboard → Your Backend Project
2. Click **"Settings"** → **"Environment Variables"**
3. Update `FRONTEND_URL`:
   - **Value:** `https://fitness-app-frontend.vercel.app`
4. Go to **"Deployments"** tab
5. Click **"..."** on latest deployment → **"Redeploy"**

### If deployed on Render:
1. Go to Render Dashboard → Your Backend Service
2. Click **"Environment"** tab
3. Update `FRONTEND_URL`:
   - **Value:** `https://fitness-app-frontend.vercel.app`
4. Click **"Save Changes"**
5. Service will automatically redeploy

⏳ Wait 2-3 minutes for redeploy

---

## Part 6: Initialize Database Schema

Run Prisma migrations to set up your database schema on Supabase:

### Option A: Using Vercel CLI (if backend on Vercel)

```bash
# Install Vercel CLI if not installed
npm install -g vercel

# Login to Vercel
vercel login

# Navigate to backend directory
cd backend

# Pull environment variables
vercel env pull .env.production

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
npm run db:seed
```

### Option B: Using Render Shell (if backend on Render)

1. Go to Render Dashboard → Your Backend Service
2. Click **"Shell"** tab
3. Run:
   ```bash
   npx prisma migrate deploy
   npm run db:seed
   ```

### Option C: Using Local Machine

```bash
# Navigate to backend directory
cd backend

# Create .env file with your Supabase connection string
echo "DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres" > .env

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
npm run db:seed
```

✅ **Database schema is now set up!**

---

## Part 7: Test Your Deployment

### Test Frontend
1. Open your Vercel URL: `https://fitness-app-frontend.vercel.app`
2. Try to register a new trainer account
3. Login with the account you created
4. Create an exercise or program
5. Add a client and track their progress

### Test Backend API
```bash
# Replace with your backend URL
BACKEND_URL="https://fitness-app-backend.vercel.app"

# Test registration
curl -X POST $BACKEND_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"trainer@test.com","password":"Test123456","role":"TRAINER","firstName":"Test","lastName":"Trainer"}'
```

### Verify Supabase Database
1. Go to Supabase Dashboard
2. Click **"Table Editor"** in the left sidebar
3. You should see your tables: User, Exercise, Program, WorkoutLog, WeightEntry, etc.
4. Click on tables to view data

---

## 🎉 You're Done!

Your app is now live on the internet, completely FREE!

- **Frontend:** https://fitness-app-frontend.vercel.app
- **Backend:** https://fitness-app-backend.vercel.app (or Render URL)
- **Database:** Supabase PostgreSQL

---

## 📊 What's Next?

### Automatic Deployments

Both Vercel and Render watch your GitHub repository:

- **Push to `main` branch** → Automatic deployment to production
- **Create Pull Request** → Automatic preview deployment (Vercel)

```bash
# Make changes to your code
git add .
git commit -m "Add new feature"
git push origin main

# Your app will automatically redeploy! 🎉
```

### Supabase Features You Can Add

**1. Row Level Security (RLS)**
- Secure your data with PostgreSQL policies
- Control who can read/write specific rows
- Example: Trainers can only see their own clients

**2. Real-time Subscriptions**
- Get live updates when data changes
- Perfect for workout tracking in real-time

**3. Storage**
- Store profile pictures, exercise videos
- 1GB free storage included

**4. Authentication (Optional)**
- Can replace your custom JWT auth
- Built-in support for email, social logins
- Magic links, phone auth

**5. Edge Functions**
- Serverless functions close to your users
- Can complement or replace your NestJS backend

---

## 💰 Cost Breakdown

### FREE FOREVER
- **Frontend (Vercel):** FREE
- **Backend (Vercel):** FREE (100GB bandwidth, 100 hours serverless)
- **Database (Supabase):** FREE (500MB storage, 2GB bandwidth)

**Total: $0/month** ✅

### If You Exceed Free Limits

**Vercel Pro ($20/month):**
- 1TB bandwidth
- Unlimited serverless execution
- Team features

**Supabase Pro ($25/month):**
- 8GB database storage
- 50GB bandwidth
- Daily backups
- No connection limits

---

## 🔒 Security Features

Supabase provides excellent security out of the box:

- ✅ SSL/TLS encryption
- ✅ Connection pooling with PgBouncer
- ✅ Automatic backups (Pro plan)
- ✅ Row Level Security policies
- ✅ API rate limiting
- ✅ Database roles and permissions

**Security Checklist:**

- ✅ `.env` file in `.gitignore`
- ✅ Strong `JWT_SECRET` (random 32+ characters)
- ✅ Strong Supabase database password
- ✅ CORS configured with specific frontend URL
- ✅ HTTPS enabled (automatic)
- ✅ No API keys in frontend code
- ⚠️ Enable Row Level Security in Supabase (recommended)
- ⚠️ Set up database backups (Pro plan or pg_dump)

---

## 🔧 Troubleshooting

### Backend Can't Connect to Database

**Check:**
1. Connection string is correct
2. Password doesn't have special characters that need URL encoding
3. Supabase project is active (check dashboard)

**Fix:**
```bash
# Test connection locally
cd backend
npx prisma db push
```

### "Prisma Client not generated" Error

**Fix:**
```bash
cd backend
npx prisma generate
```

### CORS Errors

```
Access to fetch at 'https://...' has been blocked by CORS policy
```

**Fix:**
1. Ensure `FRONTEND_URL` matches your Vercel frontend URL exactly
2. Include `https://` protocol
3. No trailing slash
4. Redeploy backend after updating

### Database Migration Errors

**Fix:**
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or create new migration
npx prisma migrate dev --name init
```

---

## 📚 Useful Commands

### Supabase CLI (Optional)

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Pull remote database schema
supabase db pull

# Create migration from schema
supabase db diff -f migration_name
```

### Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# View database in browser
npx prisma studio

# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Seed database
npm run db:seed
```

### Vercel Commands

```bash
# View deployments
vercel ls

# View logs
vercel logs

# Pull environment variables
vercel env pull
```

---

## 🆘 Need Help?

### Documentation
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Prisma with Supabase](https://www.prisma.io/docs/guides/database/supabase)

### Community Support
- [Supabase Discord](https://discord.supabase.com/)
- [Vercel Discussions](https://github.com/vercel/vercel/discussions)

### Common Questions

**Q: Can I use a custom domain?**
A: Yes! Both Vercel and Supabase support custom domains on free tier.

**Q: How do I backup my database?**
A: Use `pg_dump` or upgrade to Supabase Pro for automated daily backups.

**Q: Can I migrate from another database?**
A: Yes! Use Supabase's migration tools or Prisma migrations.

**Q: Is this production-ready?**
A: Absolutely! Supabase is used by thousands of production apps.

**Q: What happens if I exceed free tier limits?**
A: Supabase will notify you. You can upgrade or optimize your usage.

---

## 🎓 Advanced: Enable Row Level Security

Supabase's Row Level Security (RLS) adds an extra layer of security:

```sql
-- Example: Trainers can only see their own clients
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

CREATE POLICY trainer_clients ON "User"
  FOR SELECT
  USING (
    "trainerId" = auth.uid()
    OR id = auth.uid()
  );
```

To implement:
1. Go to Supabase Dashboard → **SQL Editor**
2. Write your RLS policies
3. Test them in the **Table Editor**

---

## 🚀 Migration from Other Databases

Already have data in another PostgreSQL database?

```bash
# Export from old database
pg_dump old_database_url > backup.sql

# Import to Supabase
psql supabase_connection_string < backup.sql
```

Or use Supabase's built-in migration tools.

---

**Congratulations! Your fitness app is now deployed with Supabase and accessible to the world! 🎉**

**Total Cost: $0/month** ✅
**Time to Deploy: ~30 minutes** ⏱️
**Scalability: Up to 50K monthly active users** 📈
