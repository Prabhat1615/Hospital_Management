# Grovyn Portal — Credentials & System Guide

This document contains the system credentials, git repository timeline, system prerequisites, and step-by-step instructions required to run and manage the **Grovyn** workspace.

---

## 🔑 Active Credentials
Use these credentials to sign in to the local console at [http://localhost:3000/](http://localhost:3000/):

* **Email Address:** `admin@grovyn.com`
* **Password:** `grovyn@123`

---

## 📅 Git Repository Metrics
The timeline of commits inside this codebase:
* **First Commit Date:** `2021-03-14`
* **Last Commit Date:** `2026-07-16`

---

## 🛠️ System Requirements
Before launching the services, ensure you have the following prerequisites installed on your host system:

1. **Node.js:** version `^22.18.0` or newer (runs the backend api and compiler).
2. **Docker & Docker Compose:** Runs the database and caching middleware services.
3. **PostgreSQL Client (psql):** For running commands inside the container database.

---

## 🚀 Step-by-Step Running Guide

Follow these steps in order to start the services:

### Step 1: Launch Backend Containers
Start PostgreSQL and Redis database containers in the background using Docker Compose:
```bash
docker compose up -d
```

### Step 2: Install Dependencies
Install all package dependencies in the workspace root:
```bash
npm install
```

### Step 3: Run the API Server (Backend)
Navigate to the server package and start the developer environment:
```bash
cd packages/server
npm run dev:no-otel
```
* The server will boot up and start listening on [http://localhost:8103/](http://localhost:8103/).

### Step 4: Run the Web App Console (Frontend)
Open a new terminal session, navigate to the app package, and start the hot-reloading client bundle:
```bash
cd packages/app
npm run dev -- --force
```
* The frontend server will start and be available at [http://localhost:3000/](http://localhost:3000/).

---

## ⚙️ Maintenance & Operations Commands

### 🔄 Clear Redis Session Cache
If you update database tables directly and need to drop cached sessions:
```bash
docker exec -t medplum-redis-1 redis-cli -a medplum flushall
```

### 🗄️ Connect to PostgreSQL database CLI
To connect to the database command line tool:
```bash
docker exec -it medplum-postgres-1 psql -U medplum -d medplum
```

### 🔎 Run Database Diagnostics
To check practitioner/user profile sync status:
```bash
cd packages/server
node check-profile-name.js
```