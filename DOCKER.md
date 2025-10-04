# Docker Setup for Fitness App

This document explains how to run the fitness application using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose installed

## Quick Start

1. Navigate to the project root directory:
   ```bash
   cd fitness-app
   ```

2. Build and start both services:
   ```bash
   docker-compose up --build
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Services

### Backend (NestJS)
- **Port**: 3001
- **Technology**: NestJS with Prisma ORM
- **Database**: SQLite (stored in Docker volume)

### Frontend (React)
- **Port**: 3000 (mapped from internal port 80)
- **Technology**: React with TypeScript and Material-UI
- **Web Server**: Nginx

## Useful Commands

### Start services
```bash
docker-compose up
```

### Start services in background
```bash
docker-compose up -d
```

### Rebuild containers
```bash
docker-compose up --build
```

### Stop services
```bash
docker-compose down
```

### View logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
```

### Access backend container shell
```bash
docker-compose exec backend sh
```

## Environment Variables

You can customize the following environment variables in `docker-compose.yml`:

- `JWT_SECRET`: Secret key for JWT token signing
- `DATABASE_URL`: Database connection string
- `REACT_APP_API_URL`: Backend API URL for frontend

## Data Persistence

The SQLite database is stored in a Docker volume called `backend-data` to ensure data persistence across container restarts.

## Network

Both services are connected via a custom Docker network called `fitness-network` for secure inter-service communication.