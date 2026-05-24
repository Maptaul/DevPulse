# DevPulse

A RESTful issue tracking API built with Node.js, TypeScript, Express, and PostgreSQL.

**Live URL:** _https://your-deployed-url.com_

---

## Features

- User signup and login with bcrypt password hashing
- JWT-based authentication with access and refresh tokens
- Role-based access control — `contributor` and `maintainer`
- Issue creation, retrieval, update, and deletion
- Filtering and sorting issues by `type`, `status`, and `sort`
- Centralized error handling and request logging middleware

---

## Tech Stack

| Layer        | Technology                  |
| ------------ | --------------------------- |
| Runtime      | Node.js                     |
| Language     | TypeScript                  |
| Framework    | Express 5                   |
| Database     | PostgreSQL (via `pg`)       |
| Auth         | JSON Web Token (jsonwebtoken) |
| Password     | bcryptjs (salt rounds: 10)  |
| Dev Tools    | tsx, ts-node-dev            |

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
```

### 4. Create database tables

Run the following SQL in your PostgreSQL database:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'contributor',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE issues (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(30) NOT NULL,
  status VARCHAR(30) DEFAULT 'open',
  reporter_id INTEGER REFERENCES users(id),
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

| Method | Endpoint            | Description        | Auth |
| ------ | ------------------- | ------------------ | ---- |
| POST   | `/api/auth/signup`  | Register a user    | No   |
| POST   | `/api/auth/login`   | Login and get token | No  |

### Issues

| Method | Endpoint           | Description                        | Auth         |
| ------ | ------------------ | ---------------------------------- | ------------ |
| POST   | `/api/issues`      | Create a new issue                 | contributor+ |
| GET    | `/api/issues`      | Get all issues (filter/sort)       | contributor+ |
| GET    | `/api/issues/:id`  | Get a single issue                 | contributor+ |
| PATCH  | `/api/issues/:id`  | Update an issue                    | contributor+ |
| DELETE | `/api/issues/:id`  | Delete an issue                    | maintainer   |

**Query params for `GET /api/issues`:** `type`, `status`, `sort`

### Users

| Method | Endpoint          | Description        | Auth       |
| ------ | ----------------- | ------------------ | ---------- |
| GET    | `/api/users`      | Get all users      | maintainer |
| GET    | `/api/users/:id`  | Get a single user  | Any        |

---

## Database Schema

### `users`

| Column       | Type        | Notes                          |
| ------------ | ----------- | ------------------------------ |
| id           | SERIAL PK   |                                |
| name         | VARCHAR     |                                |
| email        | VARCHAR     | Unique                         |
| password     | TEXT        | Hashed with bcrypt             |
| role         | VARCHAR     | `contributor` or `maintainer`  |
| created_at   | TIMESTAMPTZ |                                |
| updated_at   | TIMESTAMPTZ |                                |

### `issues`

| Column       | Type        | Notes                                      |
| ------------ | ----------- | ------------------------------------------ |
| id           | SERIAL PK   |                                            |
| title        | VARCHAR(150)| Required                                   |
| description  | TEXT        | Minimum 20 characters                      |
| type         | VARCHAR     | `bug` or `feature_request`                 |
| status       | VARCHAR     | `open`, `in_progress`, or `resolved`       |
| reporter_id  | INTEGER FK  | References `users(id)`                     |
| created_at   | TIMESTAMPTZ |                                            |
| updated_at   | TIMESTAMPTZ |                                            |

---

## Roles & Permissions

| Action                        | contributor | maintainer |
| ----------------------------- | :---------: | :--------: |
| Signup / Login                | ✅          | ✅         |
| Create issue                  | ✅          | ✅         |
| View all / single issue       | ✅          | ✅         |
| Update own open issues        | ✅          | ✅         |
| Update any issue              | ❌          | ✅         |
| Delete any issue              | ❌          | ✅         |
| Change issue status           | ❌          | ✅         |
| Access metrics                | ❌          | ✅         |

---

## Submission

- ✅ **GitHub Repo (Public):** <https://github.com/yourusername/devpulse>
- ✅ **Live Deployment (Public):** <https://devpulse-api.vercel.app>
- ✅ **Interview Video (Public):** <https://drive.google.com/...> or <https://youtu.be/...>
