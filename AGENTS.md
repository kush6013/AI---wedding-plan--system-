// AGENTS.md - Project rules for AI agents working on this codebase
// =====================================================
// PROJECT: AI Wedding Album & Video Planning System
// =====================================================

# Project Overview
This is a MERN stack application (MongoDB, Express.js, React.js, Node.js) that:
1. Lets clients create wedding profiles with details and functions
2. Uses OpenRouter (an OpenAI-compatible API) to generate function-wise video plans
3. Generates overall wedding highlight video structures
4. Generates AI-assisted album design layouts
5. Provides dashboards for admin and editing teams

# Tech Stack
- Frontend: React 19, Vite, JavaScript (JSX), CSS
- Backend: Node.js, Express.js, JavaScript
- Database: MongoDB Atlas + Mongoose ODM
- AI: OpenRouter API (model from OPENROUTER_MODEL env, e.g. openrouter/free), called only from backend
- Deployment: Frontend -> Vercel, Backend -> Render, DB -> MongoDB Atlas

# Project Structure
```
ai-wedding-system/
├── server/                 # Express backend
│   └── src/
│       ├── config/         # DB connection, env config
│       ├── controllers/    # Request handlers
│       ├── models/         # Mongoose schemas
│       ├── routes/         # API routes
│       ├── services/       # OpenRouter/AI integration
│       ├── middleware/     # Error handling, auth (future)
│       ├── utils/          # Prompt builders
│       ├── app.js          # Express app setup
│       └── server.js       # Entry point
└── client/                 # React frontend
    └── src/
        ├── components/     # Reusable UI components
        ├── pages/          # Page components
        ├── services/       # API service layer
        ├── context/        # Global state
        └── routes/         # React Router setup
```

# Code Conventions
1. **Beginner-friendly code**: Use clear, descriptive names. Add explanatory comments.
2. **No advanced patterns**: No TypeScript, no Redux, no complex abstractions.
3. **REST API format**: All responses use `{ success, message, data }` shape.
4. **AI calls ONLY in backend**: Never call the AI provider (OpenRouter) from React components.
5. **Environment variables**: API keys and URLs go in .env files, never hardcoded.

# Commands

## Backend (server/)
- Install: `npm install`
- Run dev: `npm run dev` (starts on port 5000)
- Required env vars: MONGODB_URI, OPENROUTER_API_KEY, OPENROUTER_MODEL, PORT, CLIENT_URL

## Frontend (client/)
- Install: `npm install`
- Run dev: `npm run dev` (starts on port 5173)
- Required env var: VITE_API_BASE_URL=http://localhost:5000/api
- Lint: `npm run lint`
- Build: `npm run build`

# Important Rules
- NEVER commit .env files or API keys
- NEVER expose OPENROUTER_API_KEY in frontend code
- Keep code readable and commented for beginners
- All Mongoose models use proper MongoDB references (ObjectId)
- Use `populate()` to fetch referenced documents