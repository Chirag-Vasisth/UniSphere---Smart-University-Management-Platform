# UniSphere — Smart University Management Platform

> **UniSphere — Smart University Management Platform**
> Modern 3-tier enterprise academic management platform built with React, Node.js/Express, PostgreSQL, and Docker.

Complete documentation available in [campusflow/README.md](./campusflow/README.md).

---

## 🚀 Quick Start with Docker Compose (Recommended)

Start the entire 3-tier system with a single command:

```bash
docker compose up --build
```

Access the services:
- **Frontend SPA**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **Database Test**: [http://localhost:5000/api/db-test](http://localhost:5000/api/db-test)

### Demo Credentials:
- **Admin**: `admin@campusflow.edu` / `Admin@123`
- **Student**: `student@campusflow.edu` / `Student@123`

### Stop Application:
```bash
docker compose down
```

### Stop and Reset Database:
```bash
docker compose down -v
```

---

## 💻 Manual Local Development (Without Docker)

### 1. Database Setup (PostgreSQL)
```bash
cd campusflow/backend
npm run db:init
npm run db:seed
```

### 2. Start Backend (Port 5000)
```bash
cd campusflow/backend
npm install
npm run dev
```

### 3. Start Frontend (Port 5173)
```bash
cd campusflow/frontend
npm install
npm run dev
```
