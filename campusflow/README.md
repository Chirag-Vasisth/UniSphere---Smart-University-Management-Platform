# UniSphere — Smart University Management Platform

> **Design Concept**: *"UniSphere — Smart University Management Platform"*

UniSphere is an enterprise-grade academic lifecycle management platform designed for modern higher education institutions. It bridges the gap between students, educators, and campus administrators by providing real-time academic progression metrics, attendance monitoring, examination analytics, and streamlined administrative registry workflows.

UniSphere is engineered with cloud readiness in mind and is architected to evolve into a secure, highly available **3-tier cloud application on Amazon Web Services (AWS)**.

---

## Tech Stack (Step 6: Production Docker Containerization)

### Frontend Tier
- **Framework**: React.js (Vite, JavaScript)
- **Production Server**: Nginx Alpine (`nginx:alpine`)
- **Routing**: React Router v6 (SPA routing with Nginx `try_files` fallback)
- **Reverse Proxy**: Nginx `/api` reverse proxy direct to `http://backend:5000`
- **Styling**: Vanilla CSS with modern CSS Custom Properties, SaaS Design System, Glassmorphism, and Fluid Grid Layouts
- **Icons**: Lucide React
- **Theme**: Persistent Dark & Light mode powered by `localStorage` and `ThemeContext`
- **Visualization**: Interactive custom SVG Trajectory and GPA Analytics charts

### Backend Tier
- **Runtime**: Node.js 20 LTS (`node:20-alpine`)
- **Web Framework**: Express.js
- **Database Driver**: `pg` (Official PostgreSQL Client — No ORM, raw parameterized SQL)
- **Architecture**: Modular Layered Architecture (`config`, `controllers`, `routes`, `middleware`, `services`, `database`)
- **API Style**: RESTful JSON API
- **Middleware**: CORS, Request Logging (`logger.js`), Centralized Error Handler (`errorHandler.js`)

### Database Tier
- **Engine**: PostgreSQL 16 Alpine (`postgres:16-alpine`)
- **Database Name**: `campusflow`
- **Design**: Normalized 3-table relational schema (`users`, `students`, `marks`) with primary keys, foreign keys, and cascading integrity constraints.
- **Persistence**: Named Docker volume (`campusflow_postgres_data`)

### Container Orchestration
- **Docker Compose**: Multi-container specification (v3.8)
- **Networking**: Isolated bridge network (`campusflow_network`)
- **Health Checks**: Database (`pg_isready`) and Backend (`/api/health`) health probes with startup dependencies (`condition: service_healthy`)

---

## Project Structure

```
campusflow/
│
├── docker-compose.yml            # 3-Tier Multi-container Docker Compose definition
├── .env.example                  # Environment configuration template
│
├── frontend/                     # React.js SPA (Vite + Nginx Production Server)
│   ├── Dockerfile                # Multi-stage build (Node builder -> Nginx runtime)
│   ├── nginx.conf                # Nginx web server config (SPA routing + /api proxy)
│   ├── .dockerignore             # Docker build context exclusions (node_modules, etc.)
│   ├── public/                   # Static assets & SVG favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/            # Admin components (StudentModal, etc.)
│   │   │   ├── common/           # StatCard, AcademicChart, TranscriptModal, Toast
│   │   │   └── layout/           # Reusable Navbar & Responsive Sidebar
│   │   ├── context/              # ThemeContext, ToastContext
│   │   ├── pages/
│   │   │   ├── admin/            # AdminDashboard, AdminStudents
│   │   │   ├── public/           # LandingPage, LoginPage, RegisterPage
│   │   │   └── student/          # Dashboard, Profile, Academics, Subjects, Results, Settings
│   │   ├── services/             # Frontend API client layer (api.js)
│   │   ├── App.jsx               # Route definitions & Portal layout
│   │   ├── index.css             # Design system tokens & utility classes
│   │   └── main.jsx              # Application DOM mount
│   ├── package.json
│   └── vite.config.js
│
├── backend/                      # Node.js + Express.js REST API
│   ├── Dockerfile                # Lightweight Node.js 20 Alpine container image
│   ├── .dockerignore             # Docker context exclusions
│   ├── database/                 # PostgreSQL Schema, Seed Data & Tooling
│   │   ├── schema.sql            # Table definitions (users, students, marks)
│   │   ├── seed.sql              # Initial development dataset (bcrypt hashes)
│   │   ├── init-db.js            # Node CLI helper to run schema & seed via pg
│   │   └── README.md             # Detailed database documentation
│   ├── src/
│   │   ├── config/               # Environment & PostgreSQL connection pool (database.js)
│   │   ├── controllers/          # Health, db-test, auth, students, marks, profile
│   │   ├── middleware/           # Request logger & Centralized error handler
│   │   ├── routes/               # Modular REST routes (/api/health, /api/db-test, etc.)
│   │   ├── services/             # Business logic layer
│   │   ├── app.js                # Express application configuration & middleware
│   │   └── server.js             # HTTP server entrypoint
│   ├── .env.example              # Sample environment variables
│   ├── .env                      # Local environment configuration
│   └── package.json
│
├── docs/
│   └── architecture.md           # 3-Tier system design & AWS cloud roadmap
│
├── .gitignore                    # Git ignore file
└── README.md                     # Project documentation
```

---

## 🐳 Docker Deployment (Recommended)

UniSphere is fully containerized into a production-grade 3-tier architecture.

### Services Overview

1. **`postgres` (Database Tier)**:
   - Image: `postgres:16-alpine`
   - Role: Relational persistence for accounts, student registry, and academic evaluations.
   - Persistence: Backed by named volume `campusflow_postgres_data` (`/var/lib/postgresql/data`).
   - Initialization: Automatically runs `01-schema.sql` and `02-seed.sql` on initial container launch.
   - Healthcheck: Probes via `pg_isready -U postgres -d campusflow`.

2. **`backend` (Application Tier)**:
   - Base Image: `node:20-alpine`
   - Role: Express.js REST API serving all endpoints on port `5000`.
   - Communication: Communicates directly with `postgres` over Docker network DNS (`DATABASE_HOST=postgres`).
   - Healthcheck: Probes via `wget http://localhost:5000/api/health`.
   - Dependency: Waits for `postgres` to be healthy before starting (`condition: service_healthy`).

3. **`frontend` (Web Presentation Tier)**:
   - Base Image: Multi-stage (`node:20-alpine` builder + `nginx:alpine` runtime).
   - Role: Serves the optimized React SPA bundle on port `5173` (mapped from container port `80`).
   - Reverse Proxy: Proxies all `/api/*` HTTP calls directly to `http://backend:5000/api/*` internally, eliminating CORS and hardcoded host issues.
   - Dependency: Waits for `backend` to be healthy before starting (`condition: service_healthy`).

### Docker Commands

#### 1. Start the entire application:
Build images and start all 3 containers in detached mode:
```bash
# Run from campusflow/ or repository root:
docker compose up --build -d
```
*(Or run in foreground to watch logs: `docker compose up --build`)*

#### 2. Verify running containers and health:
```bash
docker compose ps
```
You should see all 3 containers listed with status `healthy` or `running`:
- `campusflow-postgres` (Port 5432)
- `campusflow-backend` (Port 5000)
- `campusflow-frontend` (Port 5173 -> 80)

#### 3. View container logs:
```bash
# View logs from all services:
docker compose logs -f

# View logs from a specific service:
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
```

#### 4. Stop the application:
```bash
docker compose down
```

#### 5. Stop and wipe persistent database state (reset database):
```bash
docker compose down -v
```

#### 6. Rebuild containers after code modifications:
```bash
docker compose build --no-cache
docker compose up -d
```

### Accessing the Application

Once started, access UniSphere in your browser:
- **Frontend Portal**: [http://localhost:5173](http://localhost:5173)
- **Backend Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **Database Connection Check**: [http://localhost:5000/api/db-test](http://localhost:5000/api/db-test)

### Seed Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@campusflow.edu` | `Admin@123` |
| **Student** | `student@campusflow.edu` | `Student@123` |

### Environment Variables Configuration

Docker Compose reads defaults automatically, or you can create a `.env` file from the provided `.env.example`:
```bash
cp .env.example .env
```

| Variable | Description | Default in Compose |
|---|---|---|
| `DATABASE_NAME` | Name of PostgreSQL database | `campusflow` |
| `DATABASE_USER` | PostgreSQL user | `postgres` |
| `DATABASE_PASSWORD` | PostgreSQL password | `postgres` |
| `DATABASE_PORT` | Host port exposed for PostgreSQL | `5432` |
| `PORT` | Backend container port | `5000` |
| `NODE_ENV` | Backend environment | `production` |
| `DATABASE_HOST` | Backend DB connection hostname | `postgres` (internal DNS) |
| `JWT_SECRET` | Secret key for signing JWT tokens | `campusflow_jwt_secret_key_2026_docker` |
| `JWT_EXPIRES_IN` | Token expiration time | `24h` |
| `VITE_API_URL` | Frontend API base route | `/api` (proxied by Nginx) |

### Network Communication & Architecture

```
[ Browser / Client ]
         │
         ▼ Port 5173
┌─────────────────────────────────────────────────────────────┐
│ Docker Network: campusflow_network                          │
│                                                             │
│   ┌──────────────────────────────────────────────────────┐  │
│   │ campusflow-frontend (nginx:alpine)                   │  │
│   │ - Serves static React assets (/)                     │  │
│   │ - Proxies (/api/*) ────────────────┐                 │  │
│   └────────────────────────────────────│─────────────────┘  │
│                                        ▼                    │
│   ┌──────────────────────────────────────────────────────┐  │
│   │ campusflow-backend (node:20-alpine)                  │  │
│   │ - Express.js REST API (:5000)                        │  │
│   │ - Parameterized queries (pg) ──────┐                 │  │
│   └────────────────────────────────────│─────────────────┘  │
│                                        ▼                    │
│   ┌──────────────────────────────────────────────────────┐  │
│   │ campusflow-postgres (postgres:16-alpine)             │  │
│   │ - Relational Storage (:5432)                         │  │
│   │ - Mounted Volume: campusflow_postgres_data           │  │
│   └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## PostgreSQL Database Setup

UniSphere requires **PostgreSQL** (version 12 or newer).

### 1. Create the Database
Ensure your PostgreSQL service is running, then create the `campusflow` database:
```sql
CREATE DATABASE campusflow;
```
*(Or via terminal: `createdb -U postgres campusflow`)*

### 2. Configure Environment Variables
Inside `campusflow/backend/.env`, configure your PostgreSQL credentials:
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# PostgreSQL Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=campusflow
DATABASE_USER=postgres
DATABASE_PASSWORD=your_postgres_password
```

### 3. Run Schema Migrations
Execute the SQL schema to create the `users`, `students`, and `marks` tables:
```bash
cd campusflow/backend

# Option A: Using the built-in Node helper (Recommended)
npm run db:init

# Option B: Using psql CLI
psql -U postgres -d campusflow -f database/schema.sql
```

### 4. Seed Development Data
Populate the database with the initial dataset (1 admin, 2 students, and marks):
```bash
# Option A: Using the built-in Node helper (Recommended)
npm run db:seed

# Option B: Using psql CLI
psql -U postgres -d campusflow -f database/seed.sql
```

---

## How to Run the Backend

1. Navigate to the backend directory:
   ```bash
   cd campusflow/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Express server:
   ```bash
   npm run dev
   # or
   npm start
   ```
   The backend will start at: `http://localhost:5000`

---

## How to Run the Frontend

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd campusflow/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## API Endpoints

### 1. Health Probe
- **Endpoint**: `GET /api/health`
- **Full URL**: `http://localhost:5000/api/health`
- **Response**:
  ```json
  {
    "status": "ok",
    "message": "CampusFlow API is running"
  }
  ```

### 2. Database Connection Test
- **Endpoint**: `GET /api/db-test`
- **Full URL**: `http://localhost:5000/api/db-test`
- **Success Response (HTTP 200)**:
  ```json
  {
    "status": "ok",
    "message": "Database connection successful"
  }
  ```
- **Error Response (HTTP 503)** (when database is offline/unreachable):
  ```json
  {
    "status": "error",
    "message": "Database connection failed"
  }
  ```

### 3. Authentication Endpoints
- **Student Registration**: `POST /api/auth/register`
  - **Body**: `{ name, email, password, confirmPassword, course, department, year }`
  - **Validation**: Name required, valid email format, password >= 6 characters, password & confirm password match, unique email check.
  - **Security**: Role is automatically set to `STUDENT` (ADMIN self-registration is rejected). Passwords hashed using `bcryptjs`.
  - **Response (HTTP 201)**: Returns user and student profile records with signed JWT token.

- **User Authentication (Login)**: `POST /api/auth/login`
  - **Body**: `{ email, password }`
  - **Verification**: Verifies email existence, validates password hash with `bcryptjs.compare`.
  - **Response (HTTP 200)**: Returns user profile with signed JWT token (`Authorization: Bearer <token>`).

- **Authenticated Session Profile**: `GET /api/auth/me`
  - **Header**: `Authorization: Bearer <token>`
  - **Response (HTTP 200)**: Returns authenticated user profile and student record.

### 4. Student Endpoints (Protected: Student Role)
- **View Profile**: `GET /api/profile`
  - Returns student profile details (`name`, `email`, `enrollment_number`, `course`, `department`, `year`, `phone`).
  - Student can ONLY access their own profile (uses `req.user.id`).
- **Update Profile**: `PUT /api/profile`
  - Allows editing: `name`, `phone`, `course`, `department`, `year`.
  - Role, Student ID, and User ID are strictly immutable.
- **View Academic Marks**: `GET /api/marks`
  - Returns evaluation marks for the authenticated student only.
  - Automated grade calculation: A+ (>=90), A (>=80), B (>=70), C (>=60), D (>=50), F (<50).
  - Students cannot edit marks or view other students' records (read-only).

### 5. Admin Endpoints (Protected: Admin Role)
- **System Overview Statistics**: `GET /api/admin/stats`
  - Returns total student count, unique departments count, average marks across all students, and recent students feed.
- **List All Students & Search**: `GET /api/students`
  - Optional search query: `GET /api/students?search=...` (searches name, email, enrollment number, department, course).
- **Single Student Detail**: `GET /api/students/:id`
  - Retrieves student details and their marks records.
- **Add New Student**: `POST /api/students`
  - Body: `{ name, email, password, enrollment_number, department, course, year, phone }`
  - Transactionally inserts into `users` table with bcrypt hash and `students` table.
- **Edit Student Details**: `PUT /api/students/:id`
  - Updates name, email, department, course, year, and phone in users and students tables.
- **Delete Student**: `DELETE /api/students/:id`
  - Cascades deletion to remove student, user account, and all associated marks.
  - Admin self-deletion is prevented (HTTP 400).
- **View Student Marks**: `GET /api/students/:id/marks`
- **Add Student Mark**: `POST /api/students/:id/marks`
  - Body: `{ subject, marks_obtained, maximum_marks, semester }`
- **Edit Mark Record**: `PUT /api/marks/:id`
- **Delete Mark Record**: `DELETE /api/marks/:id`

---

## Public & Portal Routes

| Route | Page Description |
|---|---|
| `/` | Public Landing Page ("Student Management, Simplified") |
| `/login` | Authentication Portal with 1-click Demo toggles for Student & Admin |
| `/register` | Student Onboarding & Registry Enrollment form |
| `/student/dashboard` | Student Command Center (CGPA, Attendance, Trajectory Chart, Deadlines) |
| `/student/profile` | Student Identity Card, Emergency Contacts & Local Profile Editor |
| `/student/academics` | Degree Progress Audit (84/120 Cr), Prerequisite Tracker & Semester Log |
| `/student/subjects` | Active Course Grid, Instructor Info, Syllabus Status & Room Directory |
| `/student/results` | Semester-wise Marks Table, SGPA Calculator & Official Transcript Modal |
| `/student/settings` | Dark/Light Mode Theme Selector, Notification Alerts & Password Form |
| `/admin/dashboard` | Institutional Metrics, Dept Distribution & Registration Stream |
| `/admin/students` | Interactive Student Registry with live Search, Filters, Add, Edit, Delete |

---

## Future Project Roadmap

Future phases will transition UniSphere into a high-availability, 3-tier enterprise cloud deployment on **Amazon Web Services (AWS)**:

1. **Relational Database Tier**:
   - Migration from sample data to **PostgreSQL**.
   - Deployment of **AWS RDS (Relational Database Service)** with Multi-AZ redundancy and automated backups.
2. **Compute & Containerization**:
   - Containerizing frontend and backend with **Docker** and multi-stage builds.
   - Deploying Node.js backend to scalable **AWS EC2** instances within an Auto-Scaling Group behind an **Application Load Balancer (ALB)**.
3. **Static Frontend Delivery**:
   - Hosting the optimized React build in **AWS S3** with low-latency global distribution via **AWS CloudFront (CDN)**.
4. **Cloud Networking & Security**:
   - Isolating backend and database tiers inside private subnets within an **AWS VPC (Virtual Private Cloud)**.
   - Configuring strict Security Groups and NAT Gateways.
5. **DevOps & Monitoring**:
   - Automated CI/CD pipelines via **GitHub Actions** for testing, Docker building, and zero-downtime deployment.
   - End-to-end telemetry, application logs, and metric alarms using **Amazon CloudWatch**.
