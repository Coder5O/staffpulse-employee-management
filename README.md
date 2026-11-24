# 👥 StaffPulse — Employee Management System

A full-stack **Laravel + React** employee/people management application with a REST API, MySQL database, full CRUD operations, and form validation.

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite 6, Axios, Lucide React |
| **Backend** | Laravel 13 (PHP 8.3), REST API |
| **Database** | MySQL 8.4 |
| **Dev / Deploy** | Docker Compose |

---

## ✨ Features

- 📋 **Employee list** with real-time search, department & status filters
- ➕ **Create / Edit** employees via a validated modal form
- 🗑️ **Delete** employees with a confirmation dialog
- 👁️ **View** full employee profile in a details modal
- 📊 **Dashboard stats** — total, active, on-leave counts + average salary
- ✅ **Form validation** — both client-side (React) and server-side (Laravel)
- 🔄 **Sortable columns** — click any column header to sort
- 📄 **Pagination** — 8 records per page
- 🔔 **Toast notifications** — success and error alerts
- 🌙 **Dark-mode UI** — polished, responsive design

---

## 🗂️ Project Structure

```
Fullstack/
├── backend/              # Laravel 13 API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/EmployeeController.php
│   │   │   ├── Requests/StoreEmployeeRequest.php
│   │   │   ├── Requests/UpdateEmployeeRequest.php
│   │   │   └── Resources/EmployeeResource.php
│   │   └── Models/Employee.php
│   ├── database/
│   │   ├── migrations/
│   │   ├── seeders/
│   │   └── factories/
│   └── routes/api.php
│
├── frontend/             # React + Vite SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── StatsCards.jsx
│   │   │   ├── EmployeeModal.jsx
│   │   │   ├── EmployeeDetailsModal.jsx
│   │   │   ├── DeleteConfirmModal.jsx
│   │   │   └── Toast.jsx
│   │   ├── services/api.js
│   │   ├── App.jsx
│   │   └── index.css
│   └── vite.config.js
│
├── docker/               # Docker configs
│   ├── backend/Dockerfile
│   ├── frontend/Dockerfile
│   └── mysql/init.sql
│
└── docker-compose.yml
```

---

## 🚀 Quick Start (Docker — Recommended)

**Prerequisites:** Docker Desktop running.

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/staffpulse.git
cd staffpulse

# 2. Copy env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Start all services
docker compose up -d --build

# 4. Run migrations & seed sample data
docker compose exec backend php artisan key:generate
docker compose exec backend php artisan migrate --seed

# 5. Open the app
#    Frontend  → http://localhost:5173
#    Backend   → http://localhost:8000/api
```

---

## 💻 Local Development (Without Docker)

### Prerequisites

- **PHP 8.3+** with extensions: `pdo_mysql`, `mbstring`, `openssl`, `zip`, `curl`, `fileinfo`
- **Composer 2**
- **Node.js 20+** and npm
- **MySQL 8** running locally

### Backend Setup

```bash
cd backend

# Copy and configure env
cp .env.example .env

# Edit .env — set DB_* to your local MySQL credentials
# Then:
composer install
php artisan key:generate
php artisan migrate --seed

# Start the dev server
php artisan serve
# → http://127.0.0.1:8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy env
cp .env.example .env
# VITE_API_URL=http://localhost:8000/api (default)

# Start the dev server
npm run dev
# → http://localhost:5173
```

---

## 🔌 REST API Reference

**Base URL:** `http://localhost:8000/api`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/employees` | List employees (search, filter, sort, paginate) |
| `GET` | `/employees/{id}` | Get single employee |
| `POST` | `/employees` | Create a new employee |
| `PUT` | `/employees/{id}` | Update employee fields |
| `DELETE` | `/employees/{id}` | Delete employee |
| `GET` | `/stats` | Aggregate dashboard statistics |
| `GET` | `/health` | Health check |

### Query Parameters for `GET /employees`

| Param | Type | Default | Description |
|---|---|---|---|
| `search` | `string` | — | Search name, email, position, department |
| `department` | `string` | — | Filter by department |
| `status` | `string` | — | Filter by `active`, `on_leave`, `terminated` |
| `sort_by` | `string` | `id` | Column to sort by |
| `sort_direction` | `string` | `desc` | `asc` or `desc` |
| `page` | `int` | `1` | Page number |
| `per_page` | `int` | `10` | Items per page (max 100) |

### Employee Object

```json
{
  "id": 1,
  "first_name": "Alexander",
  "last_name": "Wright",
  "full_name": "Alexander Wright",
  "email": "alexander.wright@company.com",
  "phone": "+1 (555) 234-5678",
  "department": "Engineering",
  "position": "Principal Software Architect",
  "salary": 145000.00,
  "salary_formatted": "$145,000.00",
  "hire_date": "2021-03-15",
  "status": "active",
  "created_at": "2026-11-24T10:33:34+00:00",
  "updated_at": "2026-11-24T10:33:34+00:00"
}
```

### Validation Rules (`POST /employees`)

| Field | Rules |
|---|---|
| `first_name` | required, string, min:2, max:100 |
| `last_name` | required, string, min:2, max:100 |
| `email` | required, valid email, unique |
| `phone` | optional, valid format |
| `department` | required, string, min:2, max:100 |
| `position` | required, string, min:2, max:100 |
| `salary` | required, numeric, min:0 |
| `hire_date` | required, valid date |
| `status` | required, one of: `active`, `on_leave`, `terminated` |

---

## 🧪 Running Tests

```bash
cd backend
php artisan test --filter=EmployeeApiTest
```

**7 tests covering:** list, stats, create (valid), validation failure, duplicate email, update, and delete.

---

## 🗄️ Database Schema

```sql
CREATE TABLE employees (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  first_name    VARCHAR(100) NOT NULL,
  last_name     VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  phone         VARCHAR(50)  NULL,
  department    VARCHAR(100) NOT NULL,
  position      VARCHAR(100) NOT NULL,
  salary        DECIMAL(12,2) NOT NULL,
  hire_date     DATE NOT NULL,
  status        ENUM('active','on_leave','terminated') NOT NULL DEFAULT 'active',
  created_at    TIMESTAMP NULL,
  updated_at    TIMESTAMP NULL
);
```

---

## 📸 Sample Data

The seeder creates **10 employees** across Engineering, Product, Marketing, Sales, HR, Finance, Design, Operations, and Customer Success.

---

## 📄 License

MIT — feel free to use, modify, and share.
