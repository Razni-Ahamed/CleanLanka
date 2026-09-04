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
- Admin dashboard for council staff to update report status
  (pending / in progress / collected)
- Live impact stats on the landing page (totals by status, most-affected
  areas)
- Responsive UI that works down to mobile widths

## Technologies used

- React + Vite
- React Router
- Axios
- Node.js + Express
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

Seed the database with sample data (optional but recommended):

```bash
npm run seed
```

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

## Deployed application

> TODO: add the deployed app link once available.

## Demonstration video

> TODO: add the demo video link once available.
