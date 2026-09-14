# UniSphere

Smart University Management Platform

> **UniSphere** is an enterprise-grade academic lifecycle and institutional operations platform designed for modern higher education environments. Built upon a scalable 3-tier architecture, UniSphere empowers students to monitor their academic trajectory and empowers university administrators with comprehensive directory management, course evaluation tracking, and institutional analytics.

---

## 📋 Table of Contents
1. [Project Overview](#-project-overview)
2. [Problem Statement](#-problem-statement)
3. [Main Features](#-main-features)
   - [Authentication & Role-Based Authorization](#authentication--role-based-authorization)
   - [Student Functionality](#student-functionality)
   - [Admin Functionality](#admin-functionality)
4. [Technology Stack](#-technology-stack)
5. [Project Architecture](#-project-architecture)
6. [Database Overview](#-database-overview)
7. [Local Setup Instructions](#-local-setup-instructions)
   - [Docker Setup (Recommended)](#docker-setup-recommended)
   - [Manual Local Development](#manual-local-development)
8. [Environment Variable Setup](#-environment-variable-setup)
9. [Project Folder Structure](#-project-folder-structure)
10. [Planned Cloud Architecture](#-planned-cloud-architecture)

---

## 📖 Project Overview

Higher education institutions face significant challenges coordinating academic progress, evaluation records, and administrative workflows across decentralized systems. **UniSphere** provides a unified platform connecting students and campus administrators in real time.

With responsive web interfaces, strict role-based access control, parameterized database access, and isolated Docker container orchestration, UniSphere delivers modern, resilient, and audit-compliant academic infrastructure.

---

## 🎯 Problem Statement

Traditional university management tools often suffer from:
- **Fragmented Data**: Disparate portals for grades, personal records, and administrative tasks.
- **Limited Transparency**: Students struggle to calculate, monitor, and visualize cumulative GPAs and semester performances.
- **Administrative Overhead**: Campus registry officers face cumbersome tools for enrolling students, managing records, and tracking metrics.
- **Deployment & Scaling Vulnerabilities**: Monolithic applications deployed without containerization or cloud readiness create operational friction.

UniSphere solves these challenges with a unified 3-tier web application, decoupled services, automated grading logic, and a containerized footprint ready for cloud scalability.

---

## 🌟 Main Features

### Authentication & Role-Based Authorization
- **JWT-Based Authentication**: Secure stateless token issuance and verification with expiration controls.
- **Role-Based Access Control (RBAC)**: Enforces role isolation between `STUDENT` and `ADMIN` roles across client routes and API endpoints.
- **Password Security**: Passwords are securely hashed using `bcryptjs` with salt rounds before database persistence.
- **Immutable Attributes**: Critical student identification fields (`user_id`, `student_id`, `role`) are protected against unauthorized modification.

### Student Functionality
- **Personalized Academic Dashboard**: Real-time display of student GPA, completed subjects, average marks, and performance trajectory.
- **Profile Self-Service**: Ability to view and update verified contact details, phone number, and academic enrollment parameters.
- **Academic Performance & Grade Tracking**: Real-time calculation of subject grades using institutional criteria:
  - `Marks >= 90` &rarr; **A+** (Distinction)
  - `Marks >= 80` &rarr; **A** (Excellent)
  - `Marks >= 70` &rarr; **B** (Good)
  - `Marks >= 60` &rarr; **C** (Satisfactory)
  - `Marks >= 50` &rarr; **D** (Pass)
  - `Marks < 50` &rarr; **F** (Fail)
- **Academic Transcript Generation**: Digital transcript view and printable summary of marks and semester credits.

### Admin Functionality
- **Institutional Overview Dashboard**: Real-time aggregated statistics including total student enrollments, departmental distribution, overall academic average, and latest onboarded students.
- **Student Directory Management (Full CRUD)**:
  - Add new students with transactional user creation and profile assignment.
  - Search and filter students by name, email, department, or enrollment number.
  - Edit student profile details and update institutional classifications.
  - Delete student records with automatic cascade safeguards.
  - Administrative self-deletion prevention.
- **Course Evaluation & Marks Entry**: Add, view, edit, and delete evaluation marks for any enrolled student across semesters.

---

## 💻 Technology Stack

### Frontend Tier
- **React.js (Vite)**: Modern component-driven Single Page Application (SPA).
- **JavaScript (ES6+)**: Clean, asynchronous client logic.
- **Vanilla CSS**: Curated design system, CSS variables, glassmorphism, responsive fluid layout, dark/light theme switching.
- **React Router v6**: Client-side routing with protected route guards.
- **Lucide React**: Vector icons and visual indicators.
- **Nginx Alpine**: High-performance production web server with SPA routing and `/api` reverse proxying.

### Backend Tier
- **Node.js 20 LTS**: Fast, asynchronous JavaScript runtime.
- **Express.js**: RESTful API framework with modular layering (`routes`, `controllers`, `services`, `middleware`, `config`).
- **pg (PostgreSQL Client)**: Direct parameterized SQL queries with zero ORM overhead to avoid abstraction leaks.
- **JSON Web Tokens (jsonwebtoken)**: Secure token generation and signature verification.
- **bcryptjs**: Cryptographic password hashing.
- **CORS & Custom Middleware**: Request logging, centralized error handling, and strict role validation.

### Database Tier
- **PostgreSQL 16 Alpine**: Relational database management system with ACID guarantees.
- **Relational Integrity**: Foreign keys, check constraints, unique indexes, and cascade deletion rules.

### Containerization & Orchestration
- **Docker**: Container images for reproducible environments.
- **Docker Compose**: Multi-container orchestration (PostgreSQL + Express API + React/Nginx).

### Cloud Services *(Planned / Upcoming)*
- **Amazon Web Services (AWS)**: Architecture designed for cloud-native deployment.

---

## 🏗️ Project Architecture

UniSphere is organized as a decoupled 3-tier architecture:

```
┌────────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION TIER                             │
│       React.js SPA / Nginx Alpine Reverse Proxy (Port 5173:80)         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Reverse Proxy (/api)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          APPLICATION TIER                              │
│       Node.js 20 Express REST API Service (Port 5000:5000)             │
│   [Auth Middleware] ── [RBAC Guard] ── [Services] ── [pg Driver]       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Parameterized SQL
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                            DATA TIER                                   │
│            PostgreSQL 16 Relational Database (Port 5432)               │
│               [users] <── [students] <── [marks]                       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Overview

The relational database uses a normalized schema with three primary tables:

1. **`users`**:
   - `id SERIAL PRIMARY KEY`
   - `name VARCHAR(255) NOT NULL`
   - `email VARCHAR(255) UNIQUE NOT NULL`
   - `password_hash VARCHAR(255) NOT NULL`
   - `role VARCHAR(20) NOT NULL CHECK (role IN ('STUDENT', 'ADMIN'))`
   - `created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`

2. **`students`**:
   - `id SERIAL PRIMARY KEY`
   - `user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE`
   - `enrollment_number VARCHAR(50) UNIQUE NOT NULL`
   - `course VARCHAR(100) NOT NULL`
   - `department VARCHAR(100) NOT NULL`
   - `year INT NOT NULL CHECK (year >= 1 AND year <= 8)`
   - `phone VARCHAR(30)`
   - `created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`

3. **`marks`**:
   - `id SERIAL PRIMARY KEY`
   - `student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE`
   - `subject VARCHAR(100) NOT NULL`
   - `marks_obtained NUMERIC(5, 2) NOT NULL CHECK (marks_obtained >= 0 AND marks_obtained <= 100)`
   - `maximum_marks NUMERIC(5, 2) DEFAULT 100.00`
   - `semester INT DEFAULT 1 CHECK (semester >= 1 AND semester <= 8)`
   - `marks NUMERIC(5, 2) DEFAULT 0.00`
   - `created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`

---

## 🚀 Local Setup Instructions

### Docker Setup (Recommended)

To run the complete 3-tier system using Docker Compose:

1. **Prerequisites**: Ensure Docker Desktop is installed and running.
2. **Start the containers**:
   ```bash
   docker compose up --build
   ```
3. **Access the application**:
   - **Frontend Application**: [http://localhost:5173](http://localhost:5173)
   - **Backend Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
   - **Database Connection Check**: [http://localhost:5000/api/db-test](http://localhost:5000/api/db-test)

4. **Default Demo Credentials**:
   - **Administrator**: `admin@campusflow.edu` / `Admin@123`
   - **Student**: `student@campusflow.edu` / `Student@123`

5. **Stop the containers**:
   ```bash
   docker compose down
   ```
   *(To stop and reset database data: `docker compose down -v`)*

---

### Manual Local Development

If running outside Docker:

#### 1. Database Setup
- Ensure PostgreSQL is running locally on port 5432.
- Execute SQL scripts:
  ```bash
  psql -U postgres -d postgres -f campusflow/backend/database/schema.sql
  psql -U postgres -d postgres -f campusflow/backend/database/seed.sql
  ```

#### 2. Backend Setup
```bash
cd campusflow/backend
cp .env.example .env
# Edit .env with your local PostgreSQL credentials
npm install
npm run dev
```
The backend starts on [http://localhost:5000](http://localhost:5000).

#### 3. Frontend Setup
```bash
cd campusflow/frontend
npm install
npm run dev
```
The frontend starts on [http://localhost:5173](http://localhost:5173).

---

## ⚙️ Environment Variable Setup

Copy `.env.example` to `.env` to configure your environment variables:

| Variable | Description | Default / Example |
|---|---|---|
| `PORT` | Backend server port | `5000` |
| `NODE_ENV` | Environment mode (`development` or `production`) | `production` |
| `DATABASE_HOST` | Hostname of PostgreSQL server | `postgres` (Docker) or `localhost` |
| `DATABASE_PORT` | Port of PostgreSQL server | `5432` |
| `DATABASE_NAME` | Name of the PostgreSQL database | `campusflow` |
| `DATABASE_USER` | Database user account | `postgres` |
| `DATABASE_PASSWORD` | Database password | *(Set your secure password)* |
| `JWT_SECRET` | Cryptographic secret for signing JWTs | *(Set a strong random key)* |
| `JWT_EXPIRES_IN` | JWT token validity lifespan | `24h` |
| `CORS_ORIGIN` | Allowed origin for CORS | `*` or `http://localhost:5173` |
| `VITE_API_URL` | Frontend API base route | `/api` |

---

## 📁 Project Folder Structure

```
unisphere/
├── docker-compose.yml            # Multi-container orchestration definition
├── .env.example                  # Environment template with safe placeholders
├── .gitignore                    # Git exclusions (dependencies, secrets, logs)
├── README.md                     # Project documentation
│
└── campusflow/                   # Core application codebase
    ├── docker-compose.yml        # Subfolder compose configuration
    ├── .env.example              # Subfolder environment template
    ├── .gitignore                # Subfolder Git exclusions
    ├── README.md                 # Technical notes & step walk-throughs
    │
    ├── backend/                  # Node.js 20 & Express.js REST API
    │   ├── Dockerfile            # Lightweight Node 20 Alpine container definition
    │   ├── .dockerignore         # Docker context exclusions
    │   ├── package.json          # Backend dependencies and scripts
    │   ├── src/
    │   │   ├── app.js            # Express application entry & middleware
    │   │   ├── server.js         # HTTP server listener
    │   │   ├── config/           # Database pool & environment configurations
    │   │   ├── controllers/      # API request handlers (auth, students, marks)
    │   │   ├── middleware/       # JWT verification, RBAC authorization, error handling
    │   │   ├── routes/           # RESTful API route declarations
    │   │   └── services/         # Business logic & SQL queries
    │   └── database/
    │       ├── schema.sql        # Relational schema (DDL)
    │       └── seed.sql          # Initial seed dataset (DML)
    │
    ├── frontend/                 # React.js SPA (Vite + Nginx Alpine)
    │   ├── Dockerfile            # Multi-stage build (Vite build -> Nginx runtime)
    │   ├── nginx.conf            # Nginx config with SPA fallback & /api proxy
    │   ├── .dockerignore         # Frontend Docker context exclusions
    │   ├── package.json          # Frontend dependencies and scripts
    │   ├── index.html            # HTML entry point
    │   └── src/
    │       ├── App.jsx           # Application routing & layout
    │       ├── main.jsx          # React DOM initialization
    │       ├── components/       # Reusable UI components & modals
    │       ├── pages/            # Student & Admin dashboard views
    │       ├── services/         # API client & HTTP communication
    │       └── utils/            # Grade calculator & helper routines
    │
    └── docs/                     # Architectural diagrams & specifications
```

---

## ☁️ Planned Cloud Architecture

> [!NOTE]
> The cloud services below describe the **planned and upcoming production deployment** on Amazon Web Services (AWS). These services are designed for upcoming milestones and are not yet provisioned.

The upcoming production infrastructure will leverage AWS best practices for high availability, security, and scalability:

```
                          ┌────────────────────────────────────────────────────────┐
                          │                   AWS CLOUD (VPC)                      │
                          │                                                        │
                          │   ┌──────────────────────────────────────────────┐     │
                          │   │       Public Subnets (Multi-AZ)              │     │
                          │   │   - Application Load Balancer (ALB)          │     │
                          │   │   - Internet Gateway                         │     │
                          │   └──────────────────────┬───────────────────────┘     │
                          │                          │                             │
                          │   ┌──────────────────────▼───────────────────────┐     │
                          │   │      Private App Subnets (Multi-AZ)          │     │
                          │   │   - EC2 Instances running UniSphere Docker   │     │
                          │   │   - Auto Scaling Group                       │     │
                          │   └──────────────────────┬───────────────────────┘     │
                          │                          │                             │
                          │   ┌──────────────────────▼───────────────────────┐     │
                          │   │      Private Data Subnets (Multi-AZ)         │     │
                          │   │   - Amazon RDS PostgreSQL (Multi-AZ)         │     │
                          │   └──────────────────────────────────────────────┘     │
                          │                                                        │
                          │   Supporting Services:                                 │
                          │   - Amazon S3: Static assets & backups                 │
                          │   - AWS IAM: Least-privilege roles & policies          │
                          │   - Security Groups: Restrictive ingress/egress rules  │
                          │   - Amazon CloudWatch: Centralized logs & alarms       │
                          │   - GitHub Actions: Automated CI/CD deployment         │
                          └────────────────────────────────────────────────────────┘
```

### Upcoming Cloud Components:
- **AWS Virtual Private Cloud (VPC)**: Custom network topology with public and private subnets across multiple Availability Zones (AZs).
- **Public Subnets**: Host Internet Gateways and Application Load Balancers (ALB) to handle incoming HTTPS client traffic.
- **Private Subnets**: Compute resources (EC2 instances running Docker containers) and database instances isolated from public Internet access.
- **Amazon EC2**: Container runtime compute nodes orchestrated with Docker.
- **Amazon RDS for PostgreSQL**: Managed, Multi-AZ relational database service with automated backups, encryption at rest, and automated minor version upgrades.
- **Amazon S3**: Object storage for document uploads, student transcripts, and database backup archives.
- **AWS IAM**: Strict least-privilege roles and instance profiles for compute resources without embedded static keys.
- **Security Groups & Network ACLs**: Defense-in-depth firewall rules permitting only required ports (`443` external, `5000` internal, `5432` restricted to app subnet).
- **GitHub Actions (CI/CD)**: Automated pipelines to run linting, unit testing, Docker image building, and automated deployment.
- **Amazon CloudWatch**: Centralized log streaming, container performance metrics, and operational health alarms.
