# StudyMate AI: Smart Notes & Quiz Generator

A full-stack Generative AI web app that helps students study faster. Paste your notes, get a short
bullet-point summary, generate a multiple-choice quiz from the same notes, and save everything for
later revision.

**Stack:** React (Vite) · Tailwind CSS · Node.js · Express · MongoDB Atlas (Mongoose) · Google Gemini API

---

## Features

| Area | What it does |
|---|---|
| Home page | Responsive landing page with hero, feature cards and navigation |
| Notes summarizer | Sends notes to Gemini and returns simple bullet-point revision notes; copy button, loading and error states |
| Quiz generator | 5, 10 or 15 multiple-choice questions (4 options each) generated **only from your notes**, with answers and explanations; interactive quiz with final score |
| Saved notes | Save original notes + summary to MongoDB, list, view and delete them |
| Safety | Input validation, request-size limit, rate limiting, CORS allow-list, secrets only in `.env`, AI output validated before it reaches the UI |

Authentication is intentionally left out of version 1 (see *Future improvements*).

## How it works

```
Browser (React + Vite + Tailwind)
      │  fetch("/api/...")
      ▼
Express server ── routes → controllers → services
      │                                   │
      ▼                                   ▼
MongoDB Atlas (notes)            Gemini API (summary, quiz JSON)
```

- The React app never talks to Gemini or MongoDB. It only calls your Express API.
- The Gemini API key lives only in `backend/.env`, so it can never leak through browser code.
- Quiz generation asks Gemini for JSON that matches a schema, then the backend **validates every
  question** (4 distinct options, a valid correct index, an explanation) and retries once if the
  response is unusable.

## Folder structure

```
studymate-ai/
├── backend/
│   ├── config/db.js               MongoDB connection
│   ├── controllers/               request handling (aiController, notesController)
│   ├── middleware/                error handler, database guard
│   ├── models/Note.js             Mongoose schema
│   ├── routes/                    aiRoutes, notesRoutes
│   ├── services/geminiService.js  ALL Gemini logic (prompts, schema, validation)
│   ├── utils/                     AppError, asyncHandler, validators
│   ├── server.js                  app entry point
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/            Navbar, Footer, Alert, Spinner, SummaryView...
│   │   ├── context/               NotesContext (shares notes between pages)
│   │   ├── pages/                 Home, Summarizer, Quiz, SavedNotes
│   │   ├── services/api.js        every call to the backend
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── .env.example
├── docs/                          testing checklist, resume text, future ideas
├── sample-notes/                  notes to test with
├── .gitignore
└── README.md
```

---

## Prerequisites

1. **Node.js 20 or newer** (22 LTS recommended): check with `node -v`
2. **Git** and **VS Code**
3. A free **MongoDB Atlas** account
4. A free **Gemini API key** from Google AI Studio

### Get a MongoDB Atlas connection string

1. Create an account at https://www.mongodb.com/atlas and create a free **M0** cluster.
2. **Database Access** → *Add New Database User* → choose a username and password (avoid `@ : / ?` in the password, or URL-encode it).
3. **Network Access** → *Add IP Address* → add your current IP (for quick testing you can use `0.0.0.0/0`, but remove it later).
4. **Database** → *Connect* → *Drivers* → copy the `mongodb+srv://...` string.
5. Replace `<username>` and `<password>`, and add a database name before the `?`, e.g. `.../studymate?retryWrites=true&w=majority`.

### Get a Gemini API key

1. Open https://aistudio.google.com/apikey and sign in.
2. Click **Create API key** and copy it. Never paste it into code or commit it.

---

## Run locally (VS Code)

Open the `studymate-ai` folder in VS Code and open **two terminals** (Terminal → New Terminal, then the `+` / split icon).

### Terminal 1: backend

```bash
cd backend
npm install
```

Create your environment file:

```bash
# macOS / Linux / Git Bash
cp .env.example .env

# Windows PowerShell
copy .env.example .env
```

Open `backend/.env` and fill in `MONGODB_URI` and `GEMINI_API_KEY`. Then start the server:

```bash
npm run dev
```

You should see:

```
[db] Connected to MongoDB
[server] StudyMate API running on http://localhost:5000
```

Check http://localhost:5000/api/health: it should show `"database":"connected"` and `"aiConfigured":true`.

### Terminal 2: frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. In development, Vite forwards every `/api` request to the backend on port 5000, so you do not need any CORS or URL configuration.

> Tip: paste the text from `sample-notes/operating-systems.txt` to try it out, then follow
> `docs/TESTING_CHECKLIST.md`.

---

## Environment variables

### `backend/.env`

| Variable | Required | Description |
|---|---|---|
| `PORT` | no | API port (default `5000`) |
| `MONGODB_URI` | yes | MongoDB Atlas connection string |
| `GEMINI_API_KEY` | yes | Key from Google AI Studio |
| `GEMINI_MODEL` | no | Model name, default `gemini-3.8-flash`. Check the [current model list](https://ai.google.dev/gemini-api/docs/models); Google retires models regularly, so if you see a "model not found" error, update this value |
| `GEMINI_THINKING_LEVEL` | no | `low` (default, faster/cheaper). Leave empty to use the model default |
| `CLIENT_URL` | yes in production | Allowed frontend origin(s), comma-separated, e.g. `https://studymate.vercel.app` |
| `AI_RATE_LIMIT` | no | Max AI requests per IP per 15 minutes (default `40`) |

### `frontend/.env` (production only)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Your deployed backend URL without trailing slash, e.g. `https://studymate-api.onrender.com`. Leave empty locally |

---

## API reference

All responses are JSON. Errors look like `{ "error": "message" }`.

| Method | Endpoint | Body | Success |
|---|---|---|---|
| `GET` | `/api/health` | none | `200 { status, database, aiConfigured }` |
| `POST` | `/api/ai/summarize` | `{ "notes": "..." }` (30 to 20,000 chars) | `200 { summary }` |
| `POST` | `/api/ai/quiz` | `{ "notes": "...", "numQuestions": 5 \| 10 \| 15 }` | `200 { questions: [...], warning? }` |
| `POST` | `/api/notes` | `{ "title"?, "originalNotes", "summary"? }` | `201 { note }` |
| `GET` | `/api/notes` | none | `200 { notes: [...] }` (newest first, max 100) |
| `DELETE` | `/api/notes/:id` | none | `200 { message, id }` |

A quiz question looks like:

```json
{
  "question": "What do threads of the same process share?",
  "options": ["Their stacks", "Code and data sections", "Program counters", "CPU registers"],
  "correctIndex": 1,
  "explanation": "Threads share the code, data and open files of their process."
}
```

| Status | Meaning |
|---|---|
| 400 | Invalid input (missing or too-short notes, bad id, bad `numQuestions`, invalid JSON) |
| 404 | Unknown route or note not found |
| 413 | Notes or request body too large |
| 429 | Too many requests, or the Gemini quota is used up |
| 502 | Gemini failed or returned unusable output |
| 503 | Database not connected |

---

## Deployment

You will deploy three things: the **database** (already on Atlas), the **backend** (Render) and the **frontend** (Vercel).

### 1. Push to GitHub

```bash
git init
git add .
git status        # make sure backend/.env is NOT listed
git commit -m "Initial commit: StudyMate AI"
git branch -M main
git remote add origin https://github.com/<your-username>/studymate-ai.git
git push -u origin main
```

### 2. Backend on Render

1. Create an account at https://render.com → **New** → **Web Service** → connect your GitHub repo.
2. Settings: **Root Directory** `backend` · **Build Command** `npm install` · **Start Command** `npm start`.
3. Under **Environment**, add `MONGODB_URI`, `GEMINI_API_KEY`, `GEMINI_MODEL`, and `CLIENT_URL` (you can fill the real frontend URL after step 3 and redeploy).
4. In Atlas → **Network Access**, allow Render to connect. The simplest option is `0.0.0.0/0` (protected by your database username and password).
5. Deploy, then open `https://<your-service>.onrender.com/api/health` to confirm.

> Render's free tier sleeps after inactivity, so the first request can take about 30 to 60 seconds.

### 3. Frontend on Vercel

1. At https://vercel.com → **Add New Project** → import the same repo.
2. Settings: **Root Directory** `frontend` · Framework **Vite** (auto-detected) · Build `npm run build` · Output `dist`.
3. Add the environment variable `VITE_API_URL` = your Render URL (no trailing slash).
4. Deploy. Copy the Vercel URL, set it as `CLIENT_URL` on Render, and redeploy the backend.

`frontend/vercel.json` (and `public/_redirects` for Netlify) make page refreshes on routes like `/quiz` work.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `[db] Could not connect to MongoDB` | Check username/password in `MONGODB_URI`, URL-encode special characters, and add your IP in Atlas → Network Access |
| "The AI service is not configured" | `GEMINI_API_KEY` is missing in `backend/.env`; restart the backend after editing |
| "The AI model was not found" | Update `GEMINI_MODEL` to a name from the current model list |
| "busy or the free quota is used up" (429) | Wait a minute, or check your limits in Google AI Studio |
| Frontend shows "Cannot reach the server" | The backend is not running, or (in production) `VITE_API_URL` / `CLIENT_URL` is wrong |
| CORS error in the browser console (production) | `CLIENT_URL` on the backend must exactly match the frontend origin, with no trailing slash or path |
| Changes to `.env` have no effect | Stop and restart `npm run dev` |

---

## Security notes

- `backend/.env` is listed in `.gitignore`. Only `.env.example` (no real values) is committed.
- If you ever commit a key by accident, **revoke it immediately** in Google AI Studio / Atlas and create a new one; deleting the file later does not remove it from Git history.
- User notes are wrapped in `<notes>` tags and the model is told to treat them as data, which reduces prompt-injection risk. No filter is perfect, so the app never executes or renders AI output as HTML.
- With no login in v1, anyone who can open your deployed site can read and delete saved notes. Add authentication before sharing it widely.

## Documentation

- [`docs/TESTING_CHECKLIST.md`](docs/TESTING_CHECKLIST.md): feature-by-feature verification list
- [`docs/RESUME_AND_FUTURE.md`](docs/RESUME_AND_FUTURE.md): resume description and improvement ideas
- [`sample-notes/`](sample-notes): notes for testing, including edge cases

## License

MIT
