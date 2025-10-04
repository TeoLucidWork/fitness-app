# Heroku Deployment Guide

This guide will help you deploy both the backend and frontend of the Fitness App to Heroku.

## Prerequisites

1. Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Create a [Heroku account](https://signup.heroku.com/)
3. Login to Heroku CLI:
   ```bash
   heroku login
   ```

## Backend Deployment

### 1. Navigate to the Backend Directory
```bash
cd fitness-app/backend
```

### 2. Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial backend commit"
```

### 3. Create Heroku App
```bash
heroku create your-fitness-app-backend
```

### 4. Add PostgreSQL Database
```bash
heroku addons:create heroku-postgresql:mini
```

### 5. Set Environment Variables
```bash
# Set JWT Secret (generate a strong random string)
heroku config:set JWT_SECRET=$(openssl rand -base64 32)

# Set Frontend URL (replace with your actual frontend URL after deploying)
heroku config:set FRONTEND_URL=https://your-fitness-app-frontend.herokuapp.com
```

### 6. Deploy Backend
```bash
git push heroku main
```

If your main branch is named `master`:
```bash
git push heroku master
```

### 7. Run Database Migrations
The migrations will run automatically via the Procfile's release command, but you can also run them manually:
```bash
heroku run npx prisma migrate deploy
```

### 8. (Optional) Seed the Database
```bash
heroku run npm run db:seed
```

### 9. Check Backend Status
```bash
heroku logs --tail
heroku open
```

Your backend API should now be running at `https://your-fitness-app-backend.herokuapp.com`

## Frontend Deployment

### Option 1: Deploy Frontend to Heroku

#### 1. Navigate to Frontend Directory
```bash
cd ../frontend
```

#### 2. Create a Static Buildpack Configuration
Create a `static.json` file in the frontend directory:
```json
{
  "root": "build/",
  "routes": {
    "/**": "index.html"
  },
  "headers": {
    "/**": {
      "Cache-Control": "no-store, must-revalidate"
    },
    "/static/**": {
      "Cache-Control": "public, max-age=31536000"
    }
  }
}
```

#### 3. Update API URL
Update `frontend/src/services/userService.ts` and other service files to use environment variable:
```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
```

Create `.env.production` in frontend:
```
REACT_APP_API_URL=https://your-fitness-app-backend.herokuapp.com
```

#### 4. Initialize Git and Create Heroku App
```bash
git init
git add .
git commit -m "Initial frontend commit"
heroku create your-fitness-app-frontend
```

#### 5. Set Buildpacks
```bash
heroku buildpacks:set heroku/nodejs
heroku buildpacks:add https://github.com/heroku/heroku-buildpack-static
```

#### 6. Add Build Script to package.json
Ensure your `package.json` has:
```json
{
  "scripts": {
    "heroku-postbuild": "npm run build"
  }
}
```

#### 7. Deploy Frontend
```bash
git push heroku main
```

### Option 2: Deploy Frontend to Netlify or Vercel (Recommended)

Frontend static apps are often better suited for platforms like Netlify or Vercel.

#### Netlify Deployment
1. Build your frontend: `npm run build`
2. Go to [Netlify](https://www.netlify.com/)
3. Drag and drop the `build` folder
4. Set environment variable: `REACT_APP_API_URL=https://your-fitness-app-backend.herokuapp.com`

#### Vercel Deployment
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in frontend directory
3. Set environment variable: `REACT_APP_API_URL=https://your-fitness-app-backend.herokuapp.com`

## Post-Deployment

### Update Backend CORS Settings
After deploying frontend, update the backend's FRONTEND_URL:
```bash
cd backend
heroku config:set FRONTEND_URL=https://your-actual-frontend-url.com
```

### Create First Trainer Account
You can create a trainer account via API or seed script:
```bash
# Via Heroku console
heroku run npm run db:seed

# Or make a POST request to /auth/register with role: TRAINER
```

## Monitoring and Maintenance

### View Logs
```bash
# Backend logs
cd backend
heroku logs --tail

# Frontend logs (if deployed to Heroku)
cd frontend
heroku logs --tail
```

### Database Management
```bash
# Access database console
heroku pg:psql

# View database info
heroku pg:info

# Create backup
heroku pg:backups:capture
heroku pg:backups:download
```

### Scaling
```bash
# View current dynos
heroku ps

# Scale web dyno
heroku ps:scale web=1
```

## Troubleshooting

### Backend Issues
1. Check environment variables: `heroku config`
2. Check logs: `heroku logs --tail`
3. Restart app: `heroku restart`
4. Check database connection: `heroku pg:info`

### Frontend Issues
1. Verify API_URL is correctly set
2. Check CORS settings in backend
3. Verify build completed successfully

### Database Migration Issues
```bash
# Reset database (CAUTION: deletes all data)
heroku pg:reset DATABASE_URL
heroku run npx prisma migrate deploy
heroku run npm run db:seed
```

## Cost Optimization

- **Heroku Free Tier**: Use `mini` or `hobby-dev` plans for testing
- **Database**: Start with `heroku-postgresql:mini` (free)
- **Dynos**: 1 web dyno is sufficient for development

## Security Checklist

- ✅ Strong JWT_SECRET set
- ✅ DATABASE_URL is secure (managed by Heroku)
- ✅ CORS configured with specific frontend URL
- ✅ .env file is in .gitignore
- ✅ No hardcoded secrets in code

## Useful Commands

```bash
# Open app in browser
heroku open

# Run one-off commands
heroku run bash

# View config
heroku config

# Add collaborators
heroku access:add email@example.com

# View app info
heroku info
```

## Next Steps

1. Set up continuous deployment with GitHub
2. Configure custom domain
3. Set up monitoring and alerts
4. Implement backup strategy
5. Set up staging environment

## Support

- [Heroku Documentation](https://devcenter.heroku.com/)
- [NestJS Deployment](https://docs.nestjs.com/deployment)
- [Prisma on Heroku](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-heroku)
