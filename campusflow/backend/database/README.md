# CampusFlow Database Documentation

## Overview
CampusFlow uses **PostgreSQL** as its relational database. The database is intentionally kept simple, clean, and beginner-friendly, with no ORMs or unnecessary abstractions.

Communication with the database is handled directly via parameterized SQL queries using the standard Node.js `pg` driver.

---

## Entity Relationship Diagram

```
+---------------------------------------------+
|                    users                    |
|---------------------------------------------|
| id (PK)            : SERIAL                 |
| name               : VARCHAR(255)           |
| email (UQ)         : VARCHAR(255)           |
| password_hash      : VARCHAR(255)           |
| role               : VARCHAR(20) (STUDENT / |
|                      ADMIN)                 |
| created_at         : TIMESTAMPTZ            |
+---------------------------------------------+
                       |
                       | 1 : 1 (One user to One student profile)
                       v
+---------------------------------------------+
|                  students                   |
|---------------------------------------------|
| id (PK)            : SERIAL                 |
| user_id (FK, UQ)   : INT (references users) |
| course             : VARCHAR(100)           |
| department         : VARCHAR(100)           |
| year               : INT                    |
| created_at         : TIMESTAMPTZ            |
+---------------------------------------------+
                       |
                       | 1 : Many (One student to Multiple marks)
                       v
+---------------------------------------------+
|                    marks                    |
|---------------------------------------------|
| id (PK)            : SERIAL                 |
| student_id (FK)    : INT (references        |
|                           students)         |
| subject            : VARCHAR(100)           |
| marks              : NUMERIC(5, 2) (0-100)  |
| created_at         : TIMESTAMPTZ            |
+---------------------------------------------+
```

---

## Detailed Table Descriptions

### 1. `users` Table
Stores basic account authentication credentials and system role.
- **`id`**: Unique primary key, auto-incremented via PostgreSQL `SERIAL`.
- **`name`**: Full name of the user (Required).
- **`email`**: Unique email address used for institutional login (Required, Unique).
- **`password_hash`**: Securely hashed password (e.g., bcrypt). Plaintext passwords are never stored.
- **`role`**: Access level, constrained to either `'STUDENT'` or `'ADMIN'`.
- **`created_at`**: Timestamp when the account was registered.

### 2. `students` Table
Stores academic information specific to enrolled students.
- **`id`**: Unique student record ID.
- **`user_id`**: Foreign key linking to `users.id` with a `UNIQUE` constraint to enforce a **1:1** relationship.
- **`course`**: The academic degree program (e.g., "Bachelor of Technology").
- **`department`**: Department or faculty (e.g., "Computer Science & Engineering").
- **`year`**: Current year of study (e.g., 1 to 4).
- **`created_at`**: Timestamp when the profile was generated.

> **Note on Roles**: Users with the `'ADMIN'` role do **not** need an associated record in the `students` table.

### 3. `marks` Table
Stores course assessment scores for enrolled students.
- **`id`**: Unique mark entry ID.
- **`student_id`**: Foreign key linking to `students.id`. Enforces a **1:many** relationship (one student has multiple marks records).
- **`subject`**: Title or code of the evaluated course (e.g., "CS-301 Database Systems").
- **`marks`**: Numerical score between 0.00 and 100.00 (enforced by a `CHECK` constraint).
- **`created_at`**: Timestamp when the evaluation was logged.

---

## How to Initialize & Seed the Database

### Option A: Using the Node CLI helper (Recommended)
From `campusflow/backend`:
```bash
# 1. Create tables:
npm run db:init

# 2. Seed development data:
npm run db:seed
```

### Option B: Using the `psql` Command Line
```bash
# 1. Create database:
psql -U postgres -c "CREATE DATABASE campusflow;"

# 2. Run schema:
psql -U postgres -d campusflow -f database/schema.sql

# 3. Run seed data:
psql -U postgres -d campusflow -f database/seed.sql
```
