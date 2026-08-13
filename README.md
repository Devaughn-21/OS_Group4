# DriveEasy: Car Rental Web App

A full-stack car rental app: a React + Vite frontend (`frontend/`) talking to an Express + TypeScript API (`Group Project/`), backed by MySQL (`mysql file.sql`).

## Prerequisites

- **Node.js** LTS (v20 or newer) and npm
- **MySQL Server** (8.0+), plus a way to run a `.sql` file against it: the `mysql` command-line client, MySQL Workbench, or a GUI like Adminer/TablePlus all work

## 1. Clone the repo

```
git clone https://github.com/Devaughn-21/OS_Group4.git
cd OS_Group4
```

## 2. Set up the database

Import the schema. This drops and recreates a `driveeasy` database with all tables and a few sample cars/rentals:

```
mysql -u root -p < "mysql file.sql"
```

(No `mysql` CLI? Open the file in MySQL Workbench or a GUI's SQL editor and run it there instead.)

## 3. Install dependencies

```
cd "Group Project"
npm install
cd ../frontend
npm install
```

## 4. Configure environment variables

**Backend**: copy `Group Project/.env.example` to `Group Project/.env` and fill it in:

```
PORT=3001
FRONTEND_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=          # your local MySQL password (often blank on local installs)
DB_NAME=driveeasy

JWT_SECRET=            # any random string; generate one below
```

Generate a `JWT_SECRET` value:

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Frontend**: copy `frontend/.env.example` to `frontend/.env`. The default already matches the backend above, so no edits are required:

```
VITE_API_URL=http://localhost:3001
```

## 5. Create a login-capable account

The sample users from `mysql file.sql` don't have passwords, and there's no public sign-up page. Accounts are created through the authenticated `/users` API, so the very first one has to be inserted directly.

From `Group Project`, generate a password hash:

```
node -e "require('bcrypt').hash('demo1234', 10).then(h => console.log(h))"
```

Then run this against the `driveeasy` database, pasting in the hash it printed:

```sql
INSERT INTO users (first_name, last_name, email, phone, license_number, password)
VALUES ('Demo', 'User', 'demo@driveeasy.com', '555-0100', 'D0000000', '<paste hash here>');
```

You'll log in with `demo@driveeasy.com` / `demo1234`.

## 6. Run the app

Two terminals, both left running:

```
# Terminal 1 (backend)
cd "Group Project"
npm run dev
# → http://localhost:3001

# Terminal 2 (frontend)
cd frontend
npm run dev
# → http://localhost:5173
```

Open **http://localhost:5173** and log in with the account from step 5.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `EADDRINUSE` / port already in use | Something else is using 3001 or 5173; stop it, or change `PORT` in the backend `.env`. |
| `ER_ACCESS_DENIED_ERROR` on backend startup | `DB_USER` / `DB_PASSWORD` in `Group Project/.env` don't match your local MySQL login. |
| Login returns "Server configuration error" | `JWT_SECRET` is missing from `Group Project/.env`. |
| CORS error in the browser console | `FRONTEND_URL` in `Group Project/.env` must exactly match `http://localhost:5173` (no trailing slash). |
| `Cannot find module 'bcrypt'` | Re-run `npm install` inside `Group Project`. |

## Project structure

- `frontend/`: React + Vite single-page app
- `Group Project/`: Express + TypeScript API (auth, cars, users, rentals, payments)
- `mysql file.sql`: database schema and sample data
