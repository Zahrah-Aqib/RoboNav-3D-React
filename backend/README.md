# RoboNav-3D Independent Python Backend

This folder is a **standalone FastAPI service** using the same proven Python A* and Greedy search implementation as the original RoboNav project. It does not replace or call the older production backend.

## Included API endpoints

- `GET /api/health`: service readiness
- `POST /api/run`: one search, real explored/frontier snapshots
- `POST /api/compare`: A* and Greedy on the same map
- `POST /api/experiments`: matched-seed performance experiments
- `POST /api/visualize`: actual Matplotlib PNG of a run or comparison
- `POST /api/visualize/experiments`: actual experiment charts

All results are calculated by this Python service, not fabricated in React.

## Local development on Windows

Open TWO VS Code terminal tabs, one for React and one for Python.

**Python terminal:**

```powershell
cd backend
py -3.12 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements-dev.txt
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
```

Check `http://127.0.0.1:8000/api/health` and `http://127.0.0.1:8000/docs`.

**Frontend terminal** (repository root, not backend):

```powershell
# First set a local environment variable in .env.local:
# VITE_API_URL=http://127.0.0.1:8000
npm.cmd ci
npm.cmd run dev
```

The frontend opens at `http://localhost:5173`. Localhost origins are allowed by default.

## Deploy as NEW Vercel project

Vercel supports multiple independent projects connected to the same GitHub repository, each with its own Root Directory.

1. Vercel → New Project → import `Zahrah-Aqib/RoboNav-3D-React`
2. **Root Directory: `backend`**, not `./`.
3. Framework: **FastAPI** (or let Vercel auto-detect Python/FastAPI).
4. Branch `main`; Python 3.12 (provided by `.python-version`).
5. Leave **Install Command, Build Command, and Output Directory at framework defaults**. No `npm` commands!
6. Deploy under an available backend name (e.g., `robonav-3d-python-api`).
7. Visit `https://YOUR-BACKEND.vercel.app/api/health` and ensure it returns status `ok`.

The standard `main.py` exports the FastAPI variable `app`, which Vercel auto-detects. No `vercel.json` rewrite is needed in this folder.

## Connect the live React frontend

In the **frontend Vercel project** (repo root `./`; framework Vite), add:

```text
VITE_API_URL=https://YOUR-BACKEND.vercel.app
```

This value is incorporated into the frontend at build time: **redeploy the frontend after changing it**.

In the **backend Vercel project**, add:

```text
ROBONAV_ALLOWED_ORIGINS=https://YOUR-FRONTEND.vercel.app
```

No trailing slash. Multiple allowed origins can be comma-separated. **Redeploy the backend after setting this**.

Both Vercel projects remain independent. Share only the frontend URL with group members.

## Verify before presentation

```powershell
# From backend folder, after installing requirements-dev.txt:
.\.venv\Scripts\python.exe -m unittest discover -s tests -v
```

Then on the live website try Simulator → U-shaped map → A*: cost 15, Greedy: cost 39. Check Python Visualizations and Experiment Lab. If browser requests fail, inspect the browser Network tab for CORS or 500 errors.

## Existing sites remain independent

Do not change the Python API for the previous React website. That service stays at `https://robonav-python-api.vercel.app`.
