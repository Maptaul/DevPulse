# DevPulse

A RESTful issue tracking API built with Node.js, TypeScript, Express, and PostgreSQL.

**Live URL:** _https://your-deployed-url.com_

---

## Features

- User signup and login with bcrypt password hashing (salt rounds: 10)
- JWT-based authentication with access and refresh tokens
- Role-based access control — `contributor` and `maintainer`
- Issue creation, retrieval, update, and deletion
- Filtering issues by `type` and `status`, sorting by `newest` or `oldest`
- Input validation — title max 150 chars, description min 20 chars, type and status enums
- Centralized error handling with proper HTTP status codes (400, 401, 403, 404, 409, 500)
- Request logging middleware

---

## Tech Stack

| Layer        | Technology                    |
| ------------ | ----------------------------- |
| Runtime      | Node.js 24.x                  |
| Language     | TypeScript                    |
| Framework    | Express 5                     |
| Database     | PostgreSQL (via `pg`)         |
| Auth         | jsonwebtoken                  |
| Password     | bcryptjs (salt rounds: 10)    |
| Dev Tools    | tsx                           |

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/devpulse.git
cd devpulse
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=5000
CONNECTION_STRING=postgresql://user:password@localhost:5432/devpulse
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CORS_ORIGIN=http://localhost:3000
```

### 4. Create database tables

Run the following SQL in your PostgreSQL database:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'contributor' CHECK (role IN ('contributor', 'maintainer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE issues (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(30) NOT NULL CHECK (type IN ('bug', 'feature_request')),
  status VARCHAR(30) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
  reporter_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 5. Start the development server

```bash
npm run dev
```

---

## API Endpoints

### Auth

| Method | Endpoint           | Description          | Access |
| ------ | ------------------ | -------------------- | ------ |
| POST   | `/api/auth/signup` | Register a new user  | Public |
| POST   | `/api/auth/login`  | Login and get token  | Public |

### Issues

| Method | Endpoint          | Description                  | Access                             |
| ------ | ----------------- | ---------------------------- | ---------------------------------- |
| POST   | `/api/issues`     | Create a new issue           | contributor, maintainer            |
| GET    | `/api/issues`     | Get all issues (filter/sort) | Public                             |
| GET    | `/api/issues/:id` | Get a single issue           | Public                             |
| PATCH  | `/api/issues/:id` | Update an issue              | contributor (own+open), maintainer |
| DELETE | `/api/issues/:id` | Delete an issue              | maintainer only                    |

**Query params for `GET /api/issues`:**

| Param    | Values                              | Default   |
| -------- | ----------------------------------- | --------- |
| `sort`   | `newest`, `oldest`                  | `newest`  |
| `type`   | `bug`, `feature_request`            | —         |
| `status` | `open`, `in_progress`, `resolved`   | —         |

---

## Database Schema

### `users`

| Column     | Type        | Notes                                                |
| ---------- | ----------- | ---------------------------------------------------- |
| id         | SERIAL PK   | Auto-increment                                       |
| name       | VARCHAR     | Required                                             |
| email      | VARCHAR     | Unique, required                                     |
| password   | TEXT        | Hashed with bcrypt, never returned                   |
| role       | VARCHAR     | `contributor` or `maintainer`, default `contributor` |
| created_at | TIMESTAMPTZ | Auto-generated                                       |
| updated_at | TIMESTAMPTZ | Auto-updated                                         |

### `issues`

| Column      | Type         | Notes                                               |
| ----------- | ------------ | --------------------------------------------------- |
| id          | SERIAL PK    | Auto-increment                                      |
| title       | VARCHAR(150) | Required, max 150 characters                        |
| description | TEXT         | Required, min 20 characters                         |
| type        | VARCHAR      | `bug` or `feature_request`                          |
| status      | VARCHAR      | `open`, `in_progress`, `resolved`; default `open`   |
| reporter_id | INTEGER      | References user id (validated in app logic)         |
| created_at  | TIMESTAMPTZ  | Auto-generated                                      |
| updated_at  | TIMESTAMPTZ  | Auto-updated                                        |

---

## Roles & Permissions

| Action                              | contributor | maintainer |
| ----------------------------------- | :---------: | :--------: |
| Signup / Login                      | ✅          | ✅         |
| Create issue                        | ✅          | ✅         |
| View all issues / single issue      | ✅          | ✅         |
| Update own open issues              | ✅          | ✅         |
| Update any issue                    | ❌          | ✅         |
| Delete any issue                    | ❌          | ✅         |
| Change issue status                 | ❌          | ✅         |

---

## Error Responses

| Status | Meaning                              |
| ------ | ------------------------------------ |
| 400    | Validation error / duplicate email   |
| 401    | Missing, expired, or invalid token   |
| 403    | Insufficient role / permission       |
| 404    | Resource not found                   |
| 409    | Business logic conflict              |
| 500    | Unexpected server error              |

---

## Submission

- ✅ **GitHub Repo (Public):** <https://github.com/yourusername/devpulse>
- ✅ **Live Deployment (Public):** <https://devpulse-api.vercel.app>
- ✅ **Interview Video (Public):** <https://drive.google.com/...> or <https://youtu.be/...>
