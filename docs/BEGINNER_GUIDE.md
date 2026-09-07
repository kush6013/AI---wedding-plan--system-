# BEGINNER GUIDE - AI Wedding Album & Video Planning System

This guide explains the entire project in very simple language. If you are new to web development (MERN stack), start here.

---

## Part 1: What Each Technology Means

### 1. What is JavaScript?
JavaScript is the programming language of the web browser. It is what makes web pages **interactive** — buttons that do things, forms that submit, and pages that update without reloading.

In this project we use JavaScript in **two places**:
- **In the browser** (React) — to build the user interface
- **On the server** (Node.js) — to run the backend logic

### 2. What is Node.js?
Normally JavaScript only runs inside a browser. Node.js lets you run JavaScript **on a computer/server**, outside the browser.

For us, Node.js runs the **backend server** — the program that receives requests from the frontend, talks to the database and OpenRouter, and sends back responses.

### 3. What is Express.js?
Express is a small framework that runs **on top of Node.js**. It makes it very easy to define "routes" — URLs the user can visit or send requests to.

Example: when the browser hits `POST /api/weddings`, Express knows which function to run. Express is like a traffic police officer directing requests to the right code.

### 4. What is React.js?
React is a JavaScript library for building **user interfaces**. You break your page into small pieces called **components**.

For us, each component is a small piece of UI:
- `Navbar` — the top menu
- `WeddingCard` — one wedding on the dashboard
- `Button` — a reusable button

React automatically re-renders the page when data changes (e.g., when AI results come back).

### 5. What is MongoDB?
MongoDB is a **database** — a place to store data permanently. MongoDB stores data in **documents** (like JSON objects) inside **collections** (like folders).

Example of one wedding document:

```json
{
  "coupleName": "Rahul & Priya",
  "weddingDate": "2026-12-10",
  "weddingLocation": "The Grand Palace",
  "functions": []
}
```

### 6. What is Mongoose?
Mongoose is a library that connects Node.js to MongoDB. It lets us define a **Schema** — a blueprint for what a document looks like.

With Mongoose we can say: "A Wedding must have a coupleName (string), a weddingDate (date), and a list of function references." Mongoose also validates data before saving and makes queries easy.

### 7. What is an API?
API stands for **Application Programming Interface**. It is simply a set of rules that lets one piece of software talk to another.

In this project, the **frontend** sends HTTP requests to the **backend's API**. The backend then talks to MongoDB and OpenRouter, and returns an answer.

### 8. What does REST API mean?
REST is a style of designing APIs. The idea: use standard HTTP methods on **resource URLs**.

- `GET /api/weddings` — fetch all weddings
- `POST /api/weddings` — create a wedding
- `PUT /api/weddings/123` — update wedding with id 123
- `DELETE /api/weddings/123` — delete wedding with id 123

### 9. What is JSON?
JSON (JavaScript Object Notation) is a text format for data. It looks like a JavaScript object:

```json
{ "success": true, "message": "Wedding created successfully", "data": {} }
```

JSON is how the frontend and backend pass data to each other.

### 10. What do HTTP GET/POST/PUT/DELETE mean?

| Method | Meaning | Used for |
|--------|---------|----------|
| **GET**   | Fetch/read data | Get all weddings, get one wedding |
| **POST**  | Create new data | Create wedding, generate AI plan |
| **PUT**   | Update existing data | Edit a wedding |
| **DELETE**| Remove data | Delete a wedding |

### 11. What is CORS?
Browsers have a security rule: one website should not easily talk to a different website. When the React app (on port 5173) talks to the Express server (on port 5000), the browser blocks it by default.

**CORS** (Cross-Origin Resource Sharing) is a set of headers the server sends to say "this frontend is allowed to talk to me." We set `CLIENT_URL` in the backend's `.env` so only our frontend is allowed.

### 12. What are environment variables?
Environment variables are **secret settings** stored outside the code. You keep them in a `.env` file which you never commit to git.

Examples:

- `OPENROUTER_API_KEY` — a secret key for OpenRouter (the AI provider)
- `MONGODB_URI` — the database address (includes username + password)
- `VITE_API_BASE_URL` — the backend address for the frontend

Putting secrets in `.env` (and ignoring them in `.gitignore`) means you never accidentally share secrets on GitHub.

---

## Part 2: How The Pieces Connect

### 13. How the frontend calls the backend

Everything flows through `client/src/services/api.js`:

```js
export const getAllWeddings = () => {
  return apiRequest('/weddings');   // <-- makes GET http://localhost:5000/api/weddings
};
```

The base URL comes from `VITE_API_BASE_URL`. React lasts the `fetch()` function:

```js
const response = await fetch(url, config);
const data = await response.json();
```

### 14. How the backend talks to MongoDB

In `server/src/config/db.js`:

```js
const conn = await mongoose.connect(process.env.MONGODB_URI);
```

Now controllers can use models:

```js
const weddings = await Wedding.find({});
```

`Wedding.find()` reads from MongoDB. `Wedding.create(data)` writes to MongoDB.

### 15. How the backend talks to OpenRouter

In `server/src/services/aiService.js`:

```js
const completion = await client.chat.completions.create({
  model: process.env.OPENROUTER_MODEL || 'openrouter/free',
  messages: [{ role: 'user', content: prompt }],
});
```

OpenRouter is **OpenAI-compatible**: it accepts the same request format as OpenAI, so we reuse the `openai` npm package. The only change is the `baseURL` — we point the SDK at `https://openrouter.ai/api/v1` instead of OpenAI.

The `prompt` is built by `server/src/utils/promptBuilder.js`. We tell OpenRouter exactly what JSON to return, then we parse it and save it to MongoDB.

---

## Part 3: One Full Request, Step by Step

Imagine the user is on the **WeddingDetails** page and clicks **"Generate Function Video Plan"**.

```
User clicks "Generate Video Plan"
```

**Step 1 — React button handler (client/src/pages/VideoPlan.jsx)**

```js
const response = await generateFunctionVideoPlan(id, selectedFunction);
```

**Step 2 — api.js (client/src/services/api.js)**

```js
export const generateFunctionVideoPlan = (weddingId, functionId) => {
  return apiRequest('/ai/function-video-plan', {
    method: 'POST',
    body: { weddingId, functionId },
  });
};
```

**Step 3 — POST request to `/api/ai/function-video-plan`**

The browser sends a JSON body to `http://localhost:5000/api/ai/function-video-plan`.

**Step 4 — Express route (server/src/routes/aiRoutes.js)**

```js
router.post('/function-video-plan', generateFunctionVideoPlan);
```

Express sees the URL and calls `generateFunctionVideoPlan` from the controller.

**Step 5 — Controller (server/src/controllers/aiController.js)**

The controller:
1. Validates the IDs
2. Loads the wedding and function from MongoDB
3. Builds a prompt: `buildFunctionVideoPlanPrompt(wedding, func)`
4. Calls the AI service

**Step 6 — AI Service (server/src/services/aiService.js)**

Sends the prompt to OpenRouter. OpenRouter returns JSON. The service cleans and parses it into a JavaScript object.

**Step 7 — OpenRouter returns JSON**

The AI returns something like:

```json
{
  "functionName": "Haldi",
  "recommendedDuration": "45-60 seconds",
  "mood": "Bright, joyful and energetic",
  "mustCaptureShots": ["...", "..."],
  "editingNotes": ["..."]
}
```

**Step 8 — MongoDB stores the plan**

```js
const videoPlan = await VideoPlan.create({
  wedding: weddingId,
  function: functionId,
  planType: 'function-video',
  aiOutput,           // the JSON from OpenRouter
});
```

**Step 9 — Express returns JSON**

```js
res.status(201).json({
  success: true,
  message: 'Function video plan generated successfully',
  data: videoPlan,
});
```

**Step 10 — React displays the result**

The page receives the JSON, stores it in React state, and renders it as cards, lists, and badges.

---

## Part 4: Project Diagram

```
+---------------------------+
|  BROWSER (React, port 5173) |
|  - Pages + components       |
|  - api.js (all fetch calls) |
+-------------+--------------+
              |  HTTP request (JSON)
              v
+---------------------------+
|  EXPRESS SERVER (port 5000)|
|  - routes → controllers     |
|  - aiService (OpenRouter)    |
|  - Mongoose models          |
+-------------+--------------+
              |
      +-------+-------+
      |               |
      v               v
+-------------+  +-------------------+
| MongoDB     |  | OpenRouter API   |
| (Atlas)     |  | (free models)    |
+-------------+  +-------------------+
```

---

## Part 5: Project Rules to Remember

1. **AI calls only in the backend.** Never put `OPENROUTER_API_KEY` in React code.
2. **Frontend only talks through `api.js`.** Keep backend calls in one file.
3. **All API responses look the same:** `{ success, message, data }`.
4. **Secrets go in `.env`**, never commit them.
5. **Beginner-friendly code:** descriptive names + comments.

That's the whole system! If you understand these 15 concepts and one full request flow, you understand how this entire project works.