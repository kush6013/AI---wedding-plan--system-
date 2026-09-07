# AI Wedding Frontend (React + Vite)

This is the frontend for the AI Wedding Album & Video Planning System.
See the root [README](../README.md) for the full project documentation.

## Setup

```bash
npm install
cp .env.example .env    # set VITE_API_BASE_URL=http://localhost:5000/api
npm run dev             # http://localhost:5173
```

## Commands

- `npm run dev` — start development server
- `npm run build` — build for production
- `npm run lint` — lint check
- `npm run preview` — preview the production build

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API URL (e.g. `http://localhost:5000/api`) |

## Deployment (Vercel)

1. Import this repo on vercel.com
2. Set **Root Directory** to `client`
3. Add `VITE_API_BASE_URL=https://your-backend.onrender.com/api` as an environment variable
4. Deploy