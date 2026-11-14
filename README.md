# RoboNav-3D React

Interactive robot-navigation website with a scroll-controlled robot introduction and real Python pathfinding.

## What's in this repository?

- **React frontend (repository root):** Full-screen five-scene scroll story, right-to-left movement, centered 360° turn, responsive laptop/mobile layout, Grid Simulator, A* vs Greedy comparison, Experiment Lab, Python-generated Matplotlib visualizations, project information and documentation.
- **Independent Python backend (`backend/`):** FastAPI, from-scratch A* and Greedy search, frontier states, heuristics, experiment metrics, and Matplotlib plots.
- **Tests:** `.github/workflows/check.yml` tests the React build; `.github/workflows/backend-check.yml` tests the Python API.

The introductory robot is a 3D-*styled* SVG/CSS model. The underlying pathfinding environment is an obstacle-filled **2D grid**.

## Run locally (two terminals)

### Python API

```powershell
cd backend
py -3.12 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements-dev.txt
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
```

Check `http://127.0.0.1:8000/api/health`.

### React website

In the repository root, create `.env.local`:

```dotenv
VITE_API_URL=http://127.0.0.1:8000
```

Then run:

```powershell
npm.cmd ci
npm.cmd run dev
```

Open `http://localhost:5173`.

## Live deployment

- React website: https://robonav-3d-website.vercel.app
- Its Python backend: https://robo-nav-3-d-react.vercel.app/api/health

Two independent **Vercel projects** use this repository and its `main` branch:

| Project | Root | Preset | Variable |
| --- | --- | --- | --- |
| React | `./` | Vite, `npm ci`, `npm run build`, `dist` | `VITE_API_URL=https://robo-nav-3-d-react.vercel.app` |
| Python API | `backend` | FastAPI, framework defaults | `ROBONAV_ALLOWED_ORIGINS=https://robonav-3d-website.vercel.app` |

When changing the frontend's `VITE_API_URL`, publish a **new frontend deployment**. When changing the API's CORS variable, publish a **new backend deployment**. Do not add trailing slashes to origins.

## Related RoboNav versions

- Original Streamlit: https://robonav-navigation.streamlit.app
- Original React: https://final-robonav-website.vercel.app
- 3D Streamlit: https://robonav-3d.streamlit.app
- 3D React (this repository): https://robonav-3d-website.vercel.app

Each version is maintained in its own GitHub repository. The original 3D React prototype and old Three.js hero have been removed from **this** repository because the previous React version already preserves its own robot design.

## Testing

- React: `npm.cmd ci`, `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build`.
- Python: from `backend/`, `python -m unittest discover -s tests -v`.
- Live: run the U-shaped map, compare A* cost 15 vs Greedy cost 39, and generate the Python Matplotlib diagrams.

This repository uses no pathfinding/ML library, accounts, or database.
