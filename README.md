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



| Variable        | What it does                                   |
|-----------------|------------------------------------------------|
| `MONGODB_URI`   | MongoDB Atlas connection string                |
| `OPENROUTER_API_KEY`| Your OpenRouter API key (from https://openrouter.ai/keys) |
| `OPENROUTER_MODEL`  | The OpenRouter model to use, e.g. `openrouter/free` (free router) |
| `PORT`          | Port for the backend (default 5000)            |
| `CLIENT_URL`    | Frontend URL allowed by CORS                   |





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

