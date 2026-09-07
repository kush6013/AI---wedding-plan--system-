# AI Wedding Album & Video Planning System

A full-stack MERN (MongoDB, Express, React, Node.js) application that uses OpenRouter (an OpenAI-compatible API) to generate:

1. **Function-wise video plans** - shot-by-shot video planning for each wedding function (Haldi, Mehendi, Sangeet, Wedding, Reception)
2. **Overall wedding highlight video structure** - complete highlight video plan with sections, timing, and music direction
3. **AI-assisted album design** - album themes, color palettes, page structures, and layout suggestions

---

## 1. Project Overview

This application helps wedding planning teams (clients, admins, and video editors) plan wedding visuals using AI. The user creates a wedding profile, adds wedding functions, and then uses AI to generate professional video and album plans.

The AI never runs in the browser. It runs securely on the backend (Express server), which keeps your OpenRouter API key safe.

---

## 2. Tech Stack

| Layer        | Technology                              |
|--------------|------------------------------------------|
| Frontend     | React 19, Vite, JavaScript (JSX), CSS    |
| Backend      | Node.js, Express.js, JavaScript          |
| Database     | MongoDB Atlas + Mongoose ODM             |
| AI           | OpenRouter API (model from `OPENROUTER_MODEL`, e.g. `openrouter/free`), called only via backend |
| Deployment   | Frontend - Vercel, Backend - Render, DB - MongoDB Atlas |

---

## 3. Folder Structure

```
ai-wedding-system/
├── AGENTS.md                 # Rules for AI agents working on this code
├── .gitignore                # Files never committed to git
├── README.md                 # This file
├── docs/
│   └── BEGINNER_GUIDE.md     # Beginner-friendly explanation of the whole system
│
├── server/                   # BACKEND (Express + Node.js)
│   ├── package.json          # Backend dependencies and scripts
│   ├── .env.example          # Copy this to .env and fill in values
│   ├── tests/
│   │   ├── promptBuilder.test.js    # Unit tests for AI prompts (offline)
│   │   └── api.integration.js       # API tests (need running server)
│   └── src/
│       ├── server.js         # Entry point: starts server + connects DB
│       ├── app.js            # Express app setup: middleware + routes
│       ├── config/
│       │   ├── env.js        # Loads .env variables
│       │   └── db.js         # MongoDB connection
│       ├── models/           # Mongoose schemas (database "tables")
│       │   ├── User.js
│       │   ├── Wedding.js
│       │   ├── Function.js
│       │   ├── VideoPlan.js
│       │   └── AlbumDesign.js
│       ├── controllers/      # Request handlers (logic goes here)
│       │   ├── weddingController.js
│       │   ├── functionController.js
│       │   ├── aiController.js
│       │   ├── albumController.js
│       │   └── userController.js
│       ├── routes/           # API endpoints (URLs)
│       │   ├── weddingRoutes.js
│       │   ├── functionRoutes.js
│       │   ├── aiRoutes.js
│       │   ├── albumRoutes.js
│       │   └── userRoutes.js
│       ├── services/
│       │   └── aiService.js  # THE ONLY place the AI provider is called
│       ├── middleware/
│       │   └── errorMiddleware.js   # Central error handling
│       └── utils/
│           └── promptBuilder.js     # Builds AI prompts
│
└── client/                   # FRONTEND (React + Vite)
    ├── package.json          # Frontend dependencies and scripts
    ├── vite.config.js        # Vite configuration
    ├── .env.example          # Copy to .env for VITE_API_BASE_URL
    ├── index.html            # Main HTML file
    └── src/
        ├── main.jsx          # React entry point
        ├── App.jsx           # Root component
        ├── index.css         # All application styles
        ├── context/
        │   └── AppContext.jsx    # Global state (loading, errors)
        ├── routes/
        │   └── AppRoutes.jsx     # All page routes
        ├── services/
        │   └── api.js            # THE ONLY place that calls the backend
        ├── components/           # Reusable UI parts
        │   ├── Navbar.jsx
        │   ├── Button.jsx
        │   ├── Loading.jsx
        │   ├── WeddingCard.jsx
        │   └── FunctionCard.jsx
        └── pages/                # One file per page
            ├── Home.jsx
            ├── Dashboard.jsx
            ├── CreateWedding.jsx
            ├── WeddingDetails.jsx
            ├── VideoPlan.jsx
            ├── HighlightVideo.jsx
            └── AlbumDesign.jsx
```

---

## 4. How React Communicates with Express

Everything goes through one file: `client/src/services/api.js`.

React never calls the backend directly from components. Instead, components import functions like `getAllWeddings()` or `generateFunctionVideoPlan()` from `api.js`. That file uses the browser's built-in `fetch()` function to make HTTP requests to your Express server.

The API base URL is stored in an environment variable:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

> React components CANNOT read server `.env` files. Vite only exposes variables that start with `VITE_`.

Example flow when a user clicks "Generate Video Plan":

```
React button click
      ↓  (component calls api.js function)
api.js uses fetch()
      ↓  (POST request with JSON body)
http://localhost:5000/api/ai/function-video-plan
      ↓
Express route finds the handler
      ↓
Controller processes the request
      ↓
AI Service calls OpenRouter
      ↓
MongoDB stores the result
      ↓
Express returns JSON response
      ↓
React displays the result
```

---

## 5. How Express Communicates with MongoDB

- Express uses the **Mongoose** library to talk to MongoDB.
- The connection is set up in `server/src/config/db.js` using the `MONGODB_URI` from your `.env` file.
- Mongoose **models** (in `server/src/models/`) define the structure of the data - like creating a "table" in a traditional database.
- Controllers use models to create, read, update, and delete documents.
- Models connect to each other with ObjectId references (for example, a `Function` has a `wedding` field pointing to its parent `Wedding`).

---

## 6. How Express Communicates with OpenRouter

OpenRouter is a single gateway that gives you access to hundreds of AI models through **one** API. It is **OpenAI-compatible**, which means we can reuse the same `openai` npm package and only change the server address (`baseURL`) to OpenRouter's URL: `https://openrouter.ai/api/v1`.

- The API key `OPENROUTER_API_KEY` is stored ONLY in the server's `.env` file.
- It is NEVER sent to the frontend.
- `server/src/services/aiService.js` is the only file that talks to OpenRouter.
- It creates the SDK client with `apiKey: process.env.OPENROUTER_API_KEY` and `baseURL: 'https://openrouter.ai/api/v1'`.
- The model is selected with `process.env.OPENROUTER_MODEL || 'openrouter/free'`. `openrouter/free` is OpenRouter's **free** model router — free of cost, but rate-limited and with variable availability. You can set any model ID there (e.g. `openai/gpt-4o`) if you have credits.
- `server/src/utils/promptBuilder.js` builds structured prompts that ask the AI to return valid JSON.
- The workflow:
  1. Frontend sends wedding + function data to `/api/ai/function-video-plan`
  2. Controller fetches the wedding + function from MongoDB
  3. Controller calls `buildFunctionVideoPlanPrompt()` to create the prompt
  4. Controller calls `generateAIResponse(prompt)` in aiService
  5. aiService calls OpenRouter and parses the JSON response
  6. Controller stores the plan in MongoDB via the `VideoPlan` model
  7. Controller returns the plan to the frontend

---

## 7. Environment Variables

### Backend (`server/.env`)

Copy `server/.env.example` to `server/.env`:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-wedding?retryWrites=true&w=majority
OPENROUTER_API_KEY=sk-or-v1-your-openrouter-api-key
OPENROUTER_MODEL=openrouter/free
PORT=5000
CLIENT_URL=http://localhost:5173
```

| Variable        | What it does                                   |
|-----------------|------------------------------------------------|
| `MONGODB_URI`   | MongoDB Atlas connection string                |
| `OPENROUTER_API_KEY`| Your OpenRouter API key (from https://openrouter.ai/keys) |
| `OPENROUTER_MODEL`  | The OpenRouter model to use, e.g. `openrouter/free` (free router) |
| `PORT`          | Port for the backend (default 5000)            |
| `CLIENT_URL`    | Frontend URL allowed by CORS                   |

### Frontend (`client/.env`)

Copy `client/.env.example` to `client/.env`:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 8. Local Development Commands

### Prerequisites

- Node.js (v18 or newer)
- npm
- A MongoDB database (Atlas cloud is fine)
- An OpenRouter API key (free: https://openrouter.ai/keys)

### Step 1: Backend

```bash
cd server
npm install
cp .env.example .env        # then edit .env with your Mongo URI + OpenRouter key
npm run dev                 # starts on http://localhost:5000
```

### Step 2: Frontend

```bash
cd client
npm install
cp .env.example .env        # set VITE_API_BASE_URL=http://localhost:5000/api
npm run dev                 # starts on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

### Running tests

```bash
# Backend unit tests (no database needed)
cd server && npm test

# Backend API integration tests (needs running server + database)
cd server && npm run test:api
```

### Lint and build

```bash
cd client && npm run lint && npm run build
```

---

## 9. API Endpoints

All responses use this shape:

```json
{ "success": true, "message": "...", "data": {} }
```

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/weddings` | Create a wedding |
| GET | `/api/weddings` | Get all weddings |
| GET | `/api/weddings/:id` | Get one wedding |
| PUT | `/api/weddings/:id` | Update a wedding |
| DELETE | `/api/weddings/:id` | Delete a wedding |
| POST | `/api/functions` | Create a function |
| GET | `/api/functions/:id` | Get one function |
| PUT | `/api/functions/:id` | Update a function |
| DELETE | `/api/functions/:id` | Delete a function |
| GET | `/api/weddings/:weddingId/functions` | List functions for a wedding |
| POST | `/api/ai/function-video-plan` | Generate function video plan |
| POST | `/api/ai/highlight-video-plan` | Generate highlight video plan |
| POST | `/api/ai/album-design` | Generate album design |
| GET | `/api/weddings/:weddingId/video-plans` | List video plans for a wedding |
| GET | `/api/weddings/:weddingId/album-designs` | List album designs for a wedding |
| GET | `/api/albums/:id` | Get one album design |
| DELETE | `/api/albums/:id` | Delete an album design |
| POST | `/api/users` | Create a user |
| GET | `/api/users` | Get all users |

### curl examples

```bash
# Health check
curl http://localhost:5000/api/health

# Create a wedding
curl -X POST http://localhost:5000/api/weddings \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Rahul Sharma",
    "email": "rahul@example.com",
    "phone": "9876543210",
    "coupleName": "Rahul & Priya",
    "weddingDate": "2026-12-10",
    "weddingLocation": "The Grand Palace",
    "weddingCity": "Jaipur",
    "weddingTheme": "Royal Rajasthani",
    "guestCount": 500
  }'

# Add a function
curl -X POST http://localhost:5000/api/functions \
  -H "Content-Type: application/json" \
  -d '{
    "wedding": "<weddingId>",
    "functionName": "Haldi",
    "date": "2026-12-08",
    "venue": "Resort Lawn",
    "importance": "high"
  }'

# Generate a function video plan (needs a real OpenRouter API key)
curl -X POST http://localhost:5000/api/ai/function-video-plan \
  -H "Content-Type: application/json" \
  -d '{"weddingId": "<weddingId>", "functionId": "<functionId>"}'

# Generate a highlight video plan
curl -X POST http://localhost:5000/api/ai/highlight-video-plan \
  -H "Content-Type: application/json" \
  -d '{"weddingId": "<weddingId>"}'

# Generate an album design
curl -X POST http://localhost:5000/api/ai/album-design \
  -H "Content-Type: application/json" \
  -d '{"weddingId": "<weddingId>"}'
```

---

## 10. Database Model Explanation

```
User  ── (created by) ──►  Wedding  ──< (has many) ──►  Function
                                    │
                                    ├──< VideoPlan  (wedding + optional function)
                                    └──< AlbumDesign (wedding)
```

### User
- `name`, `email`, `password`, `role` (admin / client / editor)
- Passwords are stored as plain text in v1. **JWT authentication can be added later** on top of this model.

### Wedding
- Client info: `clientName`, `email`, `phone`
- Wedding info: `coupleName`, `weddingDate`, `weddingLocation`, `weddingCity`, `weddingTheme`, `description`, `guestCount`
- References: `functions` (array of Function ObjectIds)

### Function
- `functionName` (Haldi, Mehendi, Sangeet, Wedding, Reception...), `date`, `startTime`, `endTime`, `venue`, `description`, `importance`
- Reference: `wedding` (ObjectId)

### VideoPlan
- `planType` (`function-video` or `highlight-video`), `aiOutput` (Mixed = any JSON)
- References: `wedding`, optional `function`

### AlbumDesign
- `theme`, `aiOutput` (Mixed = any JSON)
- Reference: `wedding`

---

## 11. Frontend-Backend Connectivity

| File | Responsibility |
|------|----------------|
| `client/src/services/api.js` | All HTTP calls to backend |
| `client/src/routes/AppRoutes.jsx` | Page routing (`/`, `/dashboard`, `/wedding/:id`, etc.) |
| `client/src/context/AppContext.jsx` | Global state (loading, error messages) |
| `client/src/pages/*` | One page per feature |
| `client/src/components/*` | Reusable UI (buttons, cards, loading) |

The frontend and backend are **separate apps** that talk over HTTP. In development, Vite runs on port 5173 and Express on port 5000. The browser sends CORS-enabled requests through `VITE_API_BASE_URL`.

---

## 12. Render Deployment Steps (Backend)

1. Create a **Render** account at render.com
2. Push your project to GitHub
3. In Render, click **New → Web Service**
4. Connect your repo (select the `server` folder or root with a `render.yaml`)
5. Settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Go to **Environment** and add the variables from `server/.env`:
   - `MONGODB_URI`
   - `OPENROUTER_API_KEY`
   - `OPENROUTER_MODEL` (e.g. `openrouter/free`)
   - `PORT` (Render sets this automatically; you can ignore it)
   - `CLIENT_URL` = your Vercel frontend URL, e.g. `https://your-app.vercel.app`
7. Click **Deploy**
8. Note your backend URL: `https://your-backend.onrender.com`

---

## 13. Vercel Deployment Steps (Frontend)

1. Push your project to GitHub
2. Go to vercel.com and **Add New Project**
3. Import your repo
4. **Root Directory**: select `client`
5. **Framework Preset**: Vite (should be detected automatically)
6. Environment Variables:
   - `VITE_API_BASE_URL=https://your-backend.onrender.com/api`
7. Click **Deploy**

---

## 14. MongoDB Atlas Setup

1. Create a free account at mongodb.com/cloud/atlas
2. Create a **Cluster** (the free M0 tier is fine)
3. Click **Connect → Drivers**
4. Copy the connection string. It looks like:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxx.mongodb.net/ai-wedding
   ```
5. Replace `<user>` and `<password>` with your database user credentials
6. Add this to `server/.env` as `MONGODB_URI`
7. Allow network access from everywhere (0.0.0.0/0) for Render

---

## 15. Common Errors and Fixes

### "MongooseServerSelectionError" / can't connect to MongoDB
- Check that `MONGODB_URI` is correct in `server/.env`
- In Atlas, allow network access from anywhere (0.0.0.0/0)
- Make sure the database user has read/write permissions

### "OPENROUTER_API_KEY environment variable is missing"
- Add your real OpenRouter key to `server/.env`
- Restart the backend (`npm run dev`)
- Note: the server still starts without the key; only AI endpoints will error

### CORS error in the browser console
- Check that `CLIENT_URL` in `server/.env` matches your frontend URL
- In development it should be `http://localhost:5173`

### Frontend can't reach backend (Failed to fetch)
- Make sure the backend is running on port 5000
- Make sure `VITE_API_BASE_URL=http://localhost:5000/api` in `client/.env`
- Restart the frontend dev server after changing `.env`

### "AI returned invalid JSON"
- This can happen if the AI provider returns malformed JSON. Click Generate again.

### Port already in use
- Change `PORT` in `server/.env` or stop the process using the port

### AI plan never loads / spinner forever
- Check the OpenRouter API key has credits, or use the free router (`openrouter/free`)
- Look at the backend terminal for the actual error

---

## 16. Security Notes

- OpenRouter API key lives **only** in the backend `.env` — never in React code
- `.gitignore` prevents `.env` files from being committed
- CORS restricts requests to your frontend domain only
- MongoDB IDs are validated before queries run
- Central error handling returns clean, consistent error messages
- **Upcoming (v2)**: JWT authentication, password hashing, role-based route protection

---

## 17. Beginner Guide

Want a super-simple explanation of JavaScript, Node.js, React, MongoDB, APIs, and how this entire project works end-to-end?

Read **[docs/BEGINNER_GUIDE.md](docs/BEGINNER_GUIDE.md)**.