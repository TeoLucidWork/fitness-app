# Complete Deployment Guide - Fitness App
## Backend: Heroku | Frontend: Vercel

This guide covers deploying your fitness app with the backend on Heroku and frontend on Vercel.

---

## Prerequisites

1. **GitHub Account** - [Sign up](https://github.com/join)
2. **Heroku Account** - [Sign up](https://signup.heroku.com/)
3. **Vercel Account** - [Sign up](https://vercel.com/signup)
4. **Heroku CLI** - [Install](https://devcenter.heroku.com/articles/heroku-cli)

---

## Part 1: Push Code to GitHub

### 1. Create a GitHub Repository
1. Go to [GitHub](https://github.com/new)
2. Create a new repository named `fitness-app`
3. **Do NOT** initialize with README (you already have one)

### 2. Push Your Code to GitHub
```bash
cd fitness-app

# Initialize git if not already done
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Fitness App"

# Add your GitHub repository as remote (replace with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/fitness-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Important:** Make sure `.env` file is NOT pushed (it should be in `.gitignore`)

---

## Part 2: Deploy Backend to Heroku

### 1. Login to Heroku
```bash
heroku login
```

### 2. Create Heroku App for Backend
```bash
cd backend
heroku create your-fitness-app-backend
```
*Note: Replace `your-fitness-app-backend` with your preferred name (must be unique)*

### 3. Add PostgreSQL Database
```bash
heroku addons:create heroku-postgresql:mini
```

### 4. Set Environment Variables
```bash
# Generate and set a secure JWT secret
heroku config:set JWT_SECRET=$(openssl rand -base64 32)

# Set frontend URL (we'll update this after deploying frontend)
heroku config:set FRONTEND_URL=https://localhost:3000
```

### 5. Deploy Backend to Heroku

**Option A: If backend is in a subdirectory** (recommended for monorepo)
```bash
# From the root fitness-app directory
git subtree push --prefix backend heroku main
```

**Option B: Create separate git repo for backend**
```bash
cd backend
git init
git add .
git commit -m "Backend deployment"
heroku git:remote -a your-fitness-app-backend
git push heroku main
```

### 6. Run Database Migrations
```bash
heroku run npx prisma migrate deploy
```

### 7. (Optional) Seed the Database
```bash
heroku run npm run db:seed
```

### 8. Verify Backend is Running
```bash
# View logs
heroku logs --tail

# Open the app
heroku open

# Check if API is accessible
curl https://your-fitness-app-backend.herokuapp.com
```

Your backend should now be at: `https://your-fitness-app-backend.herokuapp.com`

---

## Part 3: Deploy Frontend to Vercel

### 1. Push Frontend to GitHub
Your frontend is already in the repository from Part 1.

### 2. Import Project to Vercel

#### Option A: Via Vercel Dashboard (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Select "Import Git Repository"
4. Choose your `fitness-app` repository
5. Configure project:
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Install Command:** `npm install`

6. Add Environment Variable:
   - Key: `REACT_APP_API_URL`
   - Value: `https://your-fitness-app-backend.herokuapp.com`

7. Click "Deploy"

#### Option B: Via Vercel CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to frontend directory
cd frontend

# Deploy to Vercel
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - What's your project's name? fitness-app-frontend
# - In which directory is your code located? ./
# - Want to override the settings? Yes
#   - Build Command: npm run build
#   - Output Directory: build
#   - Development Command: npm start

# Set environment variable
vercel env add REACT_APP_API_URL

# When prompted, enter: https://your-fitness-app-backend.herokuapp.com
# Select all environments (Production, Preview, Development)

# Deploy to production
vercel --prod
```

### 3. Get Your Frontend URL
After deployment, Vercel will give you a URL like:
`https://fitness-app-frontend.vercel.app`

---

## Part 4: Update Backend CORS Settings

Now that you have your frontend URL, update the backend:

```bash
cd backend
heroku config:set FRONTEND_URL=https://fitness-app-frontend.vercel.app
```

---

## Part 5: Testing the Deployment

### 1. Test Backend
```bash
# Health check
curl https://your-fitness-app-backend.herokuapp.com

# Test registration endpoint
curl -X POST https://your-fitness-app-backend.herokuapp.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456","role":"TRAINER"}'
```

### 2. Test Frontend
1. Open your Vercel URL: `https://fitness-app-frontend.vercel.app`
2. Try to register a trainer account
3. Login and test the features

---

## Part 6: Custom Domain (Optional)

### For Vercel (Frontend)
1. Go to your project in Vercel Dashboard
2. Click "Settings" > "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### For Heroku (Backend)
1. Go to your app in Heroku Dashboard
2. Click "Settings" > "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Don't forget to update `FRONTEND_URL` if you change the frontend domain

---

## Maintenance & Monitoring

### View Backend Logs
```bash
heroku logs --tail -a your-fitness-app-backend
```

### View Frontend Logs
1. Go to Vercel Dashboard
2. Select your project
3. Click on a deployment
4. View "Logs" tab

### Database Management
```bash
# Access database
heroku pg:psql -a your-fitness-app-backend

# View database info
heroku pg:info -a your-fitness-app-backend

# Create backup
heroku pg:backups:capture -a your-fitness-app-backend

# Download backup
heroku pg:backups:download -a your-fitness-app-backend
```

### Update Environment Variables

**Heroku:**
```bash
heroku config:set KEY=VALUE -a your-fitness-app-backend
```

**Vercel:**
1. Go to Project Settings > Environment Variables
2. Or use CLI: `vercel env add KEY`

---

## Continuous Deployment

### Automatic Deployments
Both Heroku and Vercel support automatic deployments from GitHub:

**Vercel:**
- Already set up by default when you connect to GitHub
- Pushes to `main` branch auto-deploy to production
- Pull requests create preview deployments

**Heroku:**
1. Go to Heroku Dashboard > Your App
2. Click "Deploy" tab
3. Choose "GitHub" as deployment method
4. Connect your repository
5. Enable "Automatic deploys" from main branch

---

## Troubleshooting

### Backend Issues

**Database Connection Error:**
```bash
# Check if database is attached
heroku addons -a your-fitness-app-backend

# View database connection string
heroku config:get DATABASE_URL -a your-fitness-app-backend
```

**Build Failures:**
```bash
# View build logs
heroku logs --tail -a your-fitness-app-backend

# Restart app
heroku restart -a your-fitness-app-backend
```

### Frontend Issues

**API Not Connecting:**
1. Check browser console for errors
2. Verify `REACT_APP_API_URL` is set correctly in Vercel
3. Check CORS settings in backend
4. View Network tab in browser DevTools

**Build Failures:**
1. Check Vercel deployment logs
2. Ensure all dependencies are in `package.json`
3. Test build locally: `npm run build`

### Common Issues

**CORS Errors:**
- Ensure `FRONTEND_URL` in Heroku matches your Vercel URL exactly
- Include protocol (https://)
- No trailing slash

**Environment Variables Not Working:**
- For React, variables MUST start with `REACT_APP_`
- Redeploy after changing environment variables in Vercel
- Restart Heroku app after changing config vars

---

## Cost Breakdown

### Free Tier (Good for testing)
- **Heroku:** Free dynos (sleeps after 30 min of inactivity)
- **PostgreSQL:** Mini plan (10,000 rows limit)
- **Vercel:** Free (Hobby plan, 100GB bandwidth/month)

### Paid Tier (For production)
- **Heroku:** Hobby ($7/month) or Standard ($25/month)
- **PostgreSQL:** Mini ($5/month) to Standard ($50/month)
- **Vercel:** Pro ($20/month) for team features

---

## Security Checklist

- ✅ `.env` file is in `.gitignore`
- ✅ Strong `JWT_SECRET` is set
- ✅ `DATABASE_URL` is managed by Heroku (secure)
- ✅ CORS configured with specific frontend URL
- ✅ HTTPS enabled (automatic on Heroku and Vercel)
- ✅ No API keys or secrets in frontend code
- ✅ Database has regular backups enabled

---

## Quick Reference Commands

### Heroku
```bash
# View app info
heroku info -a your-fitness-app-backend

# View config
heroku config -a your-fitness-app-backend

# Run commands
heroku run bash -a your-fitness-app-backend

# Scale dynos
heroku ps:scale web=1 -a your-fitness-app-backend
```

### Vercel
```bash
# View deployments
vercel ls

# View project info
vercel inspect

# Remove deployment
vercel remove [deployment-url]

# View logs
vercel logs [deployment-url]
```

---

## Next Steps

1. ✅ Set up custom domain
2. ✅ Configure SSL certificates (auto on Heroku/Vercel)
3. ✅ Set up monitoring and alerts
4. ✅ Create staging environment
5. ✅ Set up automated backups
6. ✅ Add error tracking (Sentry)
7. ✅ Implement analytics

---

## Support Resources

- [Heroku Documentation](https://devcenter.heroku.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [NestJS Deployment Guide](https://docs.nestjs.com/deployment)
- [Prisma on Heroku](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-heroku)

---

## Need Help?

If you encounter issues:
1. Check the logs first (Heroku/Vercel dashboards)
2. Verify all environment variables are set correctly
3. Test API endpoints using curl or Postman
4. Check browser console for frontend errors
