# RoboNav-3D React + Independent Python API

This project contains the **new RoboNav website** and its own backend in one GitHub repository. They are deployed as **two separate Vercel projects**.

## What is included?

- **React + Vite frontend (repo root):** Full-screen scrolling robot, right → left → center → 360-degree scroll-controlled turn, plus mobile-responsive cards and the actual Grid Simulator, Algorithm Comparison, Experiment Lab and Matplotlib Visualizations
- **Python FastAPI backend (`backend/`):** From-scratch A* and Greedy search, Manhattan and Euclidean heuristics, grid validation, frontier traces, seeded experiments, statistical comparisons and Matplotlib PNG generation

The backend uses the original RoboNav Python algorithm code copied into this repository. The old websites/backend remain unchanged.

The intro robot is a 3D-styled SVG/CSS character; actual pathfinding is on a 2D grid.

## Run BOTH locally (Windows / VS Code)

**Terminal 1: Python backend**

```powershell
cd backend
py -3.12 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements-dev.txt
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
```

Verify: http://127.0.0.1:8000/api/health

**Terminal 2: React frontend, in repository root**

Create a file named `.env.local` beside `package.json`:

```dotenv
VITE_API_URL=http://127.0.0.1:8000
```

```powershell
npm.cmd ci
npm.cmd run dev
```

Visit http://localhost:5173. You can now test Simulator, Comparison, Experiment Lab and Python Visualizations against your own local backend.

## Deploy as TWO Vercel projects

Both use GitHub repo `Zahrah-Aqib/RoboNav-3D-React`, branch `main`, but **different root directories**.

### Project A: New Python API

| Setting | Value |
| --- | --- |
| Vercel project name | `robonav-3d-python-api` (or available name) |
| Framework Preset | FastAPI |
| Root Directory | **`backend`** |
| Python | 3.12 |
| Build, Install, Output | Framework defaults, no npm commands |
| Environment | `ROBONAV_ALLOWED_ORIGINS=https://YOUR-NEW-FRONTEND.vercel.app` |

Confirm `https://YOUR-NEW-BACKEND.vercel.app/api/health` returns JSON with `status: ok`. See [backend/README.md](backend/README.md).

### Project B: New 3D React website

| Setting | Value |
| --- | --- |
| Vercel project name | `robonav-3d-react` (or available name) |
| Framework Preset | Vite |
| Root Directory | **`./`** |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Environment | `VITE_API_URL=https://YOUR-NEW-BACKEND.vercel.app` |

**Order matters:** Deploy backend first → get its real URL → set `VITE_API_URL` on frontend → deploy frontend → set backend's `ROBONAV_ALLOWED_ORIGINS` to the final frontend URL → redeploy backend. Do not include a trailing slash in either URL.

The Vite `VITE_API_URL` value is embedded at build time, so if you change it, redeploy the frontend.

## Four links to share with your group

1. **Original Streamlit:** https://robonav-navigation.streamlit.app
2. **Original React:** https://final-robonav-website.vercel.app
3. **New RoboNav-3D Streamlit:** Add its actual deployed Streamlit URL when live; GitHub source: https://github.com/Zahrah-Aqib/RoboNav-3D
4. **New RoboNav-3D React:** Add the new frontend Vercel production URL when live; GitHub source: https://github.com/Zahrah-Aqib/RoboNav-3D-React

The **new Python backend is not a fifth website for classmates**: it is an API used by the new React frontend.

## Verification

The automated GitHub Action runs Python unit/HTTP tests and React build checks. The U-shaped trap experiment should show A* path cost **15** and Greedy cost **39** with the matching seeded map and Manhattan heuristic.

This repository was separated from the previous projects specifically to make demo sharing and Vercel deployments simpler.
