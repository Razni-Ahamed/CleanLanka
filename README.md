# CleanLK

## The problem

Garbage collection in many Sri Lankan neighbourhoods is inconsistent and
unpredictable. A truck might skip a street for weeks, or a bin might sit
overflowing on a main road with no one responsible for noticing. When
residents do complain, it usually means a phone call that nobody logs and
nobody can follow up on. Local councils end up working blind — with no
shared, central view of where the problems actually are or which areas need
attention most.

This hurts two groups directly: **residents** who live beside uncollected
waste and have no reliable way to flag it, and **council staff** who want to
respond but have no data to work from.

## The proposed solution

CleanLK gives both sides a shared system. A citizen files a report in under a
minute — location, waste type, a short description, and an optional photo.
Every report lands in one shared list instead of a phone call that goes
nowhere. Council staff then move each report through `pending` →
`in-progress` → `collected`, and anyone can see the current status at any
time.

## Main features

- Citizen report submission (location, waste type, description, optional
  photo)
- Shared, browsable list of all reports
- Accounts with email + password sign-in, separating residents from council
  staff
- Admin dashboard for council staff to update report status
  (pending / in progress / collected), reachable only by staff accounts
- Live impact stats on the landing page (totals by status, most-affected
  areas)
- Responsive UI that works down to mobile widths

## Technologies used

- React + Vite
- React Router
- Axios
- Node.js + Express
- JSON Web Tokens + bcrypt (authentication)
- MongoDB Atlas + Mongoose
- Cloudinary (image uploads)
- Vercel (deployment)

## AI tools used

> TODO (team): add one line per AI tool used — what it was used for, and how
> the team verified/checked its output. This declaration is mandatory for
> the assignment and must also appear in the submission PDF.

## Team members & contributions

> TODO (team): add each member's name and their contribution, written in
> their own words.

- **Amalki** — project setup, landing page, impact stats API, navigation &
  responsive shell, documentation
- _(add remaining members here)_

## Authentication

Two roles exist: `citizen` and `admin`. Signing up always creates a `citizen`
— the role is never read from the request body — so admin accounts can only be
made by the seed script, directly in the database, or by promoting a user there.

Passwords are hashed with bcrypt and never stored or returned in plain text.
Signing in returns a JSON Web Token that the client keeps in `localStorage` and
sends as an `Authorization: Bearer <token>` header. On every protected request
the server re-reads the account from the database rather than trusting the role
inside the token, so revoking or demoting an account takes effect immediately.

| Endpoint | Access |
| --- | --- |
| `POST /api/auth/register` | Public |
| `POST /api/auth/login` | Public |
| `GET /api/auth/me` | Signed in |
| `POST /api/reports` | Public — reporting deliberately needs no account |
| `GET /api/reports`, `/stats`, `/:id` | Public |
| `PATCH /api/reports/:id` | Admin only |
| `DELETE /api/reports/:id` | Admin only |

### Creating admins

`npm run seed` creates the first admin, but it clears both collections first, so
it is only safe on an empty database. To add or promote an admin without losing
data — which is what you want in production — use:

```bash
cd server
npm run make-admin -- someone@council.lk                      # promote an existing account
npm run make-admin -- someone@council.lk "a password" "Name"  # create a new admin
```

Do not create a user by hand in the Atlas UI. The password would be stored as
plain text and could never match on login, since only the model's save hook
hashes it.

Reporting stays open to everyone: residents should be able to flag a problem
without signing up first. A signed-in reporter simply gets their name as the
default byline and is linked to the report, and can still clear the name field
to post anonymously.

## Installation and execution

### Prerequisites

- Node.js (v18+ recommended)
- A MongoDB Atlas connection string

### 1. Clone the repo

```bash
git clone <repo-url>
cd CleanLanka
```

### 2. Backend setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env` and set:

- `MONGO_URI` — your MongoDB Atlas connection string
- `PORT` — defaults to `5000`
- `JWT_SECRET` — a long random string used to sign login tokens. Generate one
  with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
- `JWT_EXPIRES_IN` — how long a session lasts, defaults to `7d`
- `CLIENT_ORIGIN` — comma-separated list of sites allowed to call the API.
  Leave unset to allow any origin (fine locally; set it in production)
- `SEED_ADMIN_NAME`, `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` — the staff
  account created by `npm run seed`

Seed the database with sample reports and accounts. This is the only way an
admin account gets created, so it is required rather than optional:

```bash
npm run seed
```

That creates the admin account from your `SEED_ADMIN_*` values, plus a demo
citizen account (`citizen@cleanlk.lk` / `citizen12345`).

Start the backend:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

### 3. Frontend setup

In a new terminal:

```bash
cd client
npm install
cp .env.example .env
```

Edit `client/.env` and set:

- `VITE_API_URL` — `http://localhost:5000` for local development
- `VITE_CLOUDINARY_CLOUD_NAME` — your Cloudinary cloud name
- `VITE_CLOUDINARY_PRESET` — your Cloudinary unsigned upload preset

Start the frontend:

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

## Deployment (Vercel)

The client and the server deploy as **two separate Vercel projects** from this
one repository. Each has its own `vercel.json` already committed.

### 1. Allow Vercel to reach MongoDB Atlas

In Atlas → **Network Access**, allow `0.0.0.0/0`. Vercel's functions get
dynamic IPs, so an allowlist limited to your own machine will make every
deployed request fail at the database.

### 2. Deploy the server

Create a new Vercel project from this repo and set **Root Directory** to
`server`. Leave the build and output settings empty — there is no build step;
`server/vercel.json` routes every request into `api/index.js`.

Add these environment variables:

| Variable | Value |
| --- | --- |
| `MONGO_URI` | your Atlas connection string |
| `JWT_SECRET` | a long random string — do not reuse the local one |
| `JWT_EXPIRES_IN` | `7d` (optional) |
| `CLIENT_ORIGIN` | filled in at step 4 |

Deploy, then check `https://<your-server>.vercel.app/api/health` returns
`{"ok":true}`.

### 3. Deploy the client

Create a second project from the same repo with **Root Directory** set to
`client`. Vercel detects Vite automatically.

| Variable | Value |
| --- | --- |
| `VITE_API_URL` | the server URL from step 2, no trailing slash |
| `VITE_CLOUDINARY_CLOUD_NAME` | your Cloudinary cloud name |
| `VITE_CLOUDINARY_PRESET` | your unsigned upload preset |

`VITE_*` values are read at **build time**, not runtime. Setting one after a
deploy has no effect until you redeploy.

### 4. Point the server back at the client

Set `CLIENT_ORIGIN` on the server project to the client's URL, then redeploy the
server so CORS is limited to your own site instead of allowing any origin.

### 5. Create the production admin

Run this locally with `MONGO_URI` temporarily pointed at your production
database — it cannot run on Vercel:

```bash
cd server
npm run make-admin -- admin@yourcouncil.lk "a strong password" "Municipal Admin"
```

Use `npm run seed` instead only if the database is empty and you also want the
sample reports, since seeding deletes all existing reports and users.

### 6. Check it end to end

Sign in on the deployed client, confirm the **Admin** link appears, and change a
report's status. Then sign out and open `/admin` directly — you should be sent
to the login page rather than seeing a 404, which confirms the SPA rewrite is
live.

## Deployed application

> TODO: add the deployed app link once available.

## Demonstration video

> TODO: add the demo video link once available.
