# RoboNav-3D React

A standalone **React + Vite** website for the RoboNav robot-navigation project.

## Website

- Full-screen, scroll-controlled robot homepage.
- Robot moves from the right to the left, then to the center, where it performs a scroll-controlled 360° turn.
- Mobile layout and interactive next-section cards.
- Real Grid Simulator, A* vs Greedy comparison, Experiment Lab, and Python visualizations.
- The search algorithms run on the separately hosted RoboNav Python FastAPI backend.

## Run locally

```bash
npm ci
npm run dev
```

## Vercel settings

| Setting | Value |
| --- | --- |
| Framework Preset | Vite |
| Root Directory | `./` |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Production Branch | `main` |

Add an environment variable **`VITE_API_URL`** with value
`https://robonav-python-api.vercel.app`.

After deployment, add the frontend's final Vercel URL to the backend's
`ROBONAV_ALLOWED_ORIGINS` so the real simulator API requests are allowed.

The robot homepage uses SVG/CSS perspective and scroll animation. It is a
3D-styled visual character, not a native 3D-modelled robot; the real
algorithmic simulator operates on a 2D grid.

Source: migrated from the `robonav-3d-react/` frontend folder in
`Zahrah-Aqib/Final-RoboNav-Website`.
