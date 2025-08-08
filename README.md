# Event-on-Fire

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend (Laravel) Setup](#backend-laravel-setup)
3. [Frontend (Next.js) Setup](#frontend-nextjs-setup)
4. [Open API Url](#open-api-url)
5. [Admin Login & Home Page](#admin-login--home-page)
6. [Docker Usage](#docker-usage)
7. [Project Structure](#project-structure)
---

## Prerequisites

* **PHP** >= 8.3
* **Composer** 
* **Node.js** >= 22
* **npm** or **yarn**
* **Docker** & **Docker Compose** (optional, but recommended)
* **MySQL** (if running outside Docker)

---

## Backend (Laravel) Setup

1. **Navigate to the backend directory**

   ```bash
   cd backend
   ```

2. **Install PHP dependencies**

   ```bash
   composer install
   ```


3. **Database migrations & seeds**

   ```bash
   php artisan migrate --force --seed
   ```

4. **Start the development server**

   ```bash
   php artisan serve
   ```

Your API will be available at `http://localhost:8000`.

---

## Frontend (Next.js) Setup

1. **Navigate to the frontend directory**

   ```bash
   cd frontend
   ```

2. **Install JS dependencies**

   ```bash
   npm install
   ```

4. **Run in development**

   ```bash
   npm run dev
   ```

Your frontend will be available at `http://localhost:3000`.

---

## Open API Url

    Local development 
    http://localhost:8000/docs/api

    Docker
    http://localhost:5080/docs/api
    

## Admin/User Login & Home Page

1. **Seed an admin user** (if not already):

   ```bash
   php artisan db:seed --class=AdminUserSeeder
   ```

* Admin credentials:

     ```
     email: admin@example.com
     password: test123
     ```

* User credentials:

     ```
     email: user@example.com
     password: test123
     ```

2. **Routes**

   * Home: `/`
   * Admin login: `/admin/login`
   * User login: `/login`
---

## Docker Usage

> All commands assume you’re in the repository root.

1. **Build & start**

   ```bash
   docker-compose up --build -d
   ```
2. **Stop & remove**

   ```bash
   docker-compose down
   ```

3. **Frontend URL**

   ```bash
   http://localhost:5001
   ```

3. **Backend URL**

   ```bash
   http://localhost:5080
   ```

---

