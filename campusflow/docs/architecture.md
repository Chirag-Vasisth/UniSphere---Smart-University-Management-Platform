# UniSphere System Architecture & AWS Roadmap

## Overview
UniSphere is a smart university management platform designed for security, scalability, and high usability.

---

## Current Architecture (Phase 1: Local Foundation)

```
+-------------------------------------------------------------+
|                     Client Tier (Browser)                   |
|  - React.js SPA (Vite + React Router)                       |
|  - SaaS UI Design System (CSS Variables, Dark/Light Mode)   |
|  - State-Driven Mock Data Layer                             |
+-------------------------------------------------------------+
                              |
                              | HTTP / JSON (REST)
                              v
+-------------------------------------------------------------+
|                     Backend API Tier                        |
|  - Node.js + Express.js                                     |
|  - Middleware (CORS, Request Logger, Central Error Handler) |
|  - Health Probe: GET /api/health                            |
|  - Modular Domain Routes (auth, students, marks, profile)   |
+-------------------------------------------------------------+
```

---

## Future 3-Tier Production Architecture on AWS

In subsequent phases, UniSphere will evolve into an enterprise-grade, highly available 3-tier cloud deployment on Amazon Web Services (AWS):

```
                        [ Internet Users ]
                                |
                                v
               [ AWS Route 53 (DNS Management) ]
                                |
                                v
             [ AWS CloudFront (CDN & Edge Caching) ]
                                |
                                v
           [ AWS S3 Bucket (Static Frontend Hosting) ]
                                |
                                v (API Calls)
      [ AWS Application Load Balancer (ALB) - Public Subnet ]
                                |
                                v
  +-----------------------------------------------------------+
  |              AWS VPC (Virtual Private Cloud)              |
  |                                                           |
  |  [ Private App Subnet (Multi-AZ Auto-Scaling Group) ]    |
  |   - Dockerized Node.js / Express Backend Services         |
  |   - AWS EC2 Instances (Containerized via ECS/Fargate)    |
  |   - AWS Systems Manager Parameter Store / Secrets Manager |
  |                                                           |
  |  [ Private Database Subnet (Multi-AZ) ]                  |
  |   - Amazon RDS (PostgreSQL Database Engine)               |
  |   - Automated Snapshots, Backups, and Failover            |
  +-----------------------------------------------------------+
                                |
                                v
             [ Observability & CI/CD Pipeline ]
   - Amazon CloudWatch (Logs, Metrics, Alarms)
   - GitHub Actions CI/CD (Lint, Test, Docker Build & Deploy)
```

---

## Future Milestones

1. **Phase 2: Data Persistence & Authentication**
   - Relational schema modeling with PostgreSQL.
   - Secure authentication (JWT tokens, bcrypt password hashing).
   - Real database CRUD APIs for students, courses, grades, and enrollments.

2. **Phase 3: Containerization & Cloud Readiness**
   - Multi-stage `Dockerfile` for frontend and backend.
   - `docker-compose.yml` for unified local stack orchestration.

3. **Phase 4: AWS Infrastructure & CI/CD**
   - Provisioning VPC with public and private subnets, NAT Gateway, and Internet Gateway.
   - Deploying Node.js backend to AWS EC2 / ECS.
   - Setting up Amazon RDS PostgreSQL in private subnets with strict security groups.
   - Hosting frontend on Amazon S3 + CloudFront with custom domain & SSL via AWS Certificate Manager.
   - Automated GitHub Actions deployment pipeline and CloudWatch monitoring.
