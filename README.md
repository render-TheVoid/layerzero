# Layerzero

An AI-powered content summarization platform for PDFs, DOCX documents, and web links—built around hybrid LLM routing (cloud & local), deterministic content deduplication, sliding-window rate limiting, and real-time response streaming.

---

<table align="center">
  <tr>
    <td align="center">
      <strong>Homepage</strong><br>
      <img src="https://raw.githubusercontent.com/rishhbh/layerzero/dev/assets/homepage.png" width="400">
    </td>
    <td align="center">
      <strong>About</strong><br>
      <img src="https://raw.githubusercontent.com/rishhbh/layerzero/dev/assets/about.png" width="400">
    </td>
  </tr>
  <tr>
    <td align="center">
      <strong>Login</strong><br>
      <img src="https://raw.githubusercontent.com/rishhbh/layerzero/dev/assets/login.png" width="400">
    </td>
    <td align="center">
      <strong>Register</strong><br>
      <img src="https://raw.githubusercontent.com/rishhbh/layerzero/dev/assets/register.png" width="400">
    </td>
  </tr>
  <tr>
    <td align="center">
      <strong>Doc Summarizer</strong><br>
      <img src="https://raw.githubusercontent.com/rishhbh/layerzero/dev/assets/doc.png" width="400">
    </td>
    <td align="center">
      <strong>Response</strong><br>
      <img src="https://raw.githubusercontent.com/rishhbh/layerzero/dev/assets/response.png" width="400">
    </td>
  </tr>
</table>

---

## Technical Design Rationale (Why & How)

### Why Upstash Redis Caching?
* **Why:** LLM API inference is expensive (~$0.01–$0.05 per long prompt) and slow (5–10 seconds per request). Re-summarizing identical documents wastes API quota and degrades user experience.
* **Solution:** Intercepts prompts using an in-memory Upstash Redis cache layer (`@upstash/redis`). Before dispatching any prompt, the backend checks Redis for a pre-existing summary.
* **Impact:** Reduces latency for previously processed content from **~8.5s down to ~150ms (~98% speedup)** at **0 LLM token cost** (24h TTL).

### Why SHA-256 Content Fingerprinting?
* **Why:** Matching cache entries by raw filename or URL is flawed—users rename files, re-upload duplicate documents, or submit identical text under different query strings.
* **Solution:** Content is extracted first (`pdfjs-dist`, `mammoth`, `Mozilla Readability`), normalized, and hashed using SHA-256 (`crypto.createHash('sha256')`). The hex digest forms the Redis cache key (`summary:<SHA256_HASH>`).
* **Impact:** Guarantees cache hits based on *actual document content* regardless of filename, upload timestamp, or client metadata.

### Why Rate Limiting & Sliding Window Algorithm?
* **Why Rate Limiting:** Unprotected LLM routes expose the application to runaway API billing, while auth routes invite credential-stuffing and email resend spamming.
* **Why Sliding Window:** Fixed-window limiters reset counters at hard time boundaries, allowing double-burst traffic spikes. `@upstash/ratelimit` computes a moving weighted average across sliding sub-windows to enforce continuous traffic smoothing.
* **Limits:** `authLimiter` (20 req / 10m), `resendLimiter` (3 req / 24h), `aiLimiter` (30 req / 15m).

### Why Docker & Docker Compose?
* **Why:** Running client, backend server, and Redis across operating systems introduces runtime drift, missing dependencies, and local networking friction.
* **Solution:** Docker Compose orchestrates client, server, and Redis in isolated containers. Server containers connect to host-running local LLMs (Ollama) via `host.docker.internal:11434`.

### Why Hybrid Multi-LLM Architecture?
* **Why:** Cloud models offer large context scale but incur cost and privacy concerns. Local models run offline with zero API fees but depend on client hardware. Indic language contexts require tailored prompt tokenization.
* **Solution:** Dynamic per-request selection between cloud models (**Gemini 3.5 Flash**, **Groq GPT-OSS 120B**), offline local models (**Gemma 4 via Ollama**), and Indic multilingual models (**Sarvam 30B**).

### Why Server-Sent Events (SSE) for Streaming?
* **Why:** Waiting 8+ seconds for full LLM text generation creates poor perceived latency. WebSockets introduce unnecessary bidirectional state overhead for simple server-to-client token delivery.
* **Solution:** Uses HTTP Server-Sent Events (`text/event-stream`). Tokens stream chunk-by-chunk directly to the UI, providing real-time feedback with native browser reconnection handling.

### Why httpOnly JWT Cookies?
* **Why:** Storing access tokens in browser `localStorage` exposes them to XSS (Cross-Site Scripting) token theft.
* **Solution:** Issued inside `httpOnly` cookies with `SameSite=Lax` (`Secure` in prod), preventing client-side JavaScript access and neutralizing XSS token theft vectors.

### Why Mozilla Readability + JSDOM for Scraping?
* **Why:** Web pages contain heavy markup noise—navbars, footers, cookie banners, scripts, ads, and sidebars—which inflates LLM token costs and dilutes summary quality.
* **Solution:** `axios` fetches raw HTML, `JSDOM` constructs a Virtual DOM, and `@mozilla/readability` strips non-article elements to extract pure content text.

### Why In-Memory Document Parsing (`pdfjs-dist` & `mammoth`)?
* **Why:** Relying on OS CLI tools (`pdftotext`, `libreoffice`) inflates Docker image size, slows container builds, and introduces system vulnerability vectors.
* **Solution:** Parses PDFs (`pdfjs-dist`) and DOCX (`mammoth`) directly from `multer` memory buffers (`req.file.buffer`) in pure JavaScript memory.

---

## Detailed Technology Stack & Rationale

| Layer | Technology | Operational Function | Why Used (Engineering Rationale) |
|---|---|---|---|
| **Frontend Framework** | React 18 + Vite | Declarative UI & HMR build server | Component reactivity, rich library ecosystem, fast dev HMR, and seamless SSE stream handling |
| **Frontend Language** | TypeScript | Static type safety | Prevents runtime bugs in API payload shapes, state hooks, and stream chunks |
| **Styling & UI** | Tailwind CSS + shadcn/ui | Utility-first CSS & accessible components | Rapid, consistent UI design without CSS bundle bloat or runtime style overhead |
| **Document Export** | `jsPDF` | Client-side PDF file generation | Converts Markdown summaries to PDF directly in browser without backend rendering burden |
| **Markdown Rendering** | `remark-gfm` + `rehype-raw` | Markdown parser & HTML sanitizer | Safely renders structured LLM markdown output (tables, lists, code blocks) in UI |
| **Backend Runtime** | Node.js / Bun | Server-side JavaScript execution | Asynchronous event loop optimized for high-concurrency I/O and streaming |
| **Web Framework** | Express.js v5 | HTTP routing & middleware pipeline | Native promise-rejection error handling and lightweight route middleware stack |
| **Database** | MongoDB via Mongoose | NoSQL persistent storage & ODM | Flexible JSON document schemas for user profiles, auth status, and summary metadata |
| **Caching Engine** | Upstash Redis (`@upstash/redis`) | Serverless HTTP Redis client | Eliminates TCP connection pool overhead in serverless and containerized environments |
| **Rate Limiter** | Upstash Ratelimit (`@upstash/ratelimit`) | Traffic control middleware | Implements sliding-window algorithm to smooth request bursts and protect API quotas |
| **Authentication** | `jsonwebtoken` + `bcrypt` | Signed JWTs & salted password hashing | Stateless session verification with secure password hash storage (`bcrypt` 10 rounds) |
| **Input Validation** | Zod | Runtime schema validation | Enforces strict payload types before requests touch controllers or database drivers |
| **Email Transport** | Nodemailer | Gmail SMTP client | Dispatches HTML email verification links with hex expiration tokens |
| **Web Scraping** | Axios + JSDOM + Readability | Web content fetcher & DOM parser | Isolates primary article text while discarding ads, navigation, and boilerplate HTML |
| **Document Parsers** | `pdfjs-dist` + `mammoth` | In-memory text extraction | Extracts clean raw text from PDF & DOCX binary buffers without OS binary dependencies |
| **Streaming Protocol** | Server-Sent Events (`text/event-stream`) | Unidirectional HTTP streaming | Low-overhead real-time token streaming from server to client |
| **Containerization** | Docker & Docker Compose | Container orchestration | Ensures 1:1 local and production environment parity across client, server, and Redis |
| **Testing Suite** | Bun Test + Supertest + `mongodb-memory-server` | Integration & unit testing | Runs fast, isolated test suites against in-memory MongoDB without database side-effects |

---

## Detailed API Endpoints (Under the Hood)

### Health Check

#### `GET /api/health`
* **Access:** Public | **Rate Limit:** Unrestricted
* **Execution:** Checks backend service uptime via `process.uptime()` and returns `{ "status": "OK", "message": "API is working properly", "uptime": 184 }`.

---

### Authentication Routes (`/api/auth/user`)

#### `POST /api/auth/user/register`
* **Access:** Public | **Rate Limit:** `authLimiter` (20 req / 10m)
* **Execution:**
  1. Validates body via Zod (`auth.validator.js`).
  2. Queries MongoDB `User` model for duplicate email.
  3. Hashes password using `bcrypt` (10 salt rounds).
  4. Generates a 32-byte hex verification token (`crypto.randomBytes(32)`) expiring in 15 minutes.
  5. Saves user to MongoDB with `isVerified: false`.
  6. Sends HTML verification email via Nodemailer (Gmail SMTP).

#### `GET /api/auth/user/verify/:token`
* **Access:** Public | **Rate Limit:** `authLimiter` (20 req / 10m)
* **Execution:** Queries MongoDB for matching active verification token. Sets `isVerified: true`, removes token fields, and redirects browser (`302 Found`) to `${CLIENT_URL}/email-verified`.

#### `POST /api/auth/user/resend`
* **Access:** Public | **Rate Limit:** `resendLimiter` (3 req / 24h)
* **Execution:** Validates email via Zod. Checks if user is already verified (returns `400` if true). Generates new 15-minute token and dispatches email link via Nodemailer.

#### `POST /api/auth/user/login`
* **Access:** Public | **Rate Limit:** `authLimiter` (20 req / 10m)
* **Execution:** Validates credentials via Zod → Compares password hash via `bcrypt.compare()` → Checks `isVerified === true` → Signs 7-day JWT containing `{ userId }` → Sets `jwt` cookie (`httpOnly: true`, `SameSite=Lax`). Returns user JSON.

#### `POST /api/auth/user/logout`
* **Access:** Public | **Rate Limit:** Unrestricted
* **Execution:** Clears `jwt` cookie (`maxAge: 0`) and returns `200 OK`.

#### `GET /api/auth/user/check`
* **Access:** Protected (`protectRoute`) | **Rate Limit:** `authLimiter` (20 req / 10m)
* **Execution:** `protectRoute` middleware verifies JWT cookie signature, populates `req.user` via `User.findById()`, and returns user profile.

---

### Content Ingestion & Summarization Routes (`/api/scrape`)

#### `POST /api/scrape/web`
* **Access:** Protected (`protectRoute`) | **Rate Limit:** `aiLimiter` (30 req / 15m)
* **Request Body:** `{ "url": "https://...", "client": "gemini", "stream": true }`
* **Execution:**
  1. Validates URL and AI client (`gemini`, `groq`, `gemma`, `sarvam`) via Zod (`summary.validator.js`).
  2. Fetches raw HTML via `axios.get(url)` with browser User-Agent headers.
  3. Loads HTML into `JSDOM` and extracts clean `article.textContent` via `@mozilla/readability`.
  4. Hashes text using SHA-256 (`crypto.createHash('sha256')`) to form key `summary:<HASH>`.
  5. Queries Upstash Redis cache. On hit, returns cached summary (~150ms). On miss, routes text to selected AI provider SDK.
  6. **Streaming (`stream: true`):** Sends `Content-Type: text/event-stream`. Streams chunks (`event: chunk`) as generated and caches final summary in Redis (24h TTL) on completion (`event: done`).

#### `POST /api/scrape/doc`
* **Access:** Protected (`protectRoute`) | **Rate Limit:** `aiLimiter` (30 req / 15m)
* **Request Format:** `multipart/form-data` (`document` file, `client`, `stream`)
* **Execution:**
  1. `multer` loads file buffer into memory (`req.file.buffer`, max 5MB).
  2. Mimetype router (`document.js`) parses PDF via `pdfjs-dist` or DOCX via `mammoth`.
  3. Hashes raw text string using SHA-256 (`hashContent`) and queries Redis cache key `summary:<HASH>`.
  4. On cache miss, routes text to selected model wrapper (`gemini`, `groq`, `gemma`, `sarvam`).
  5. Streams tokens via SSE (`stream: true`) or returns JSON summary, caching output in Redis (24h TTL).

---

## End-to-End System Architecture

```text
┌─────────────────┐
│  React Client   │
└────────┬────────┘
         │ HTTP / SSE (with httpOnly JWT cookie)
         ▼
┌─────────────────┐
│  Express Server │
└────────┬────────┘
         │
         ├──► authLimiter / aiLimiter (Upstash Sliding Window Rate Limit)
         ├──► protectRoute Middleware (JWT Cookie Validation)
         │
         ▼
┌─────────────────┐
│ Content Parsing │ (Web: Axios + JSDOM + Readability | Doc: pdfjs-dist / mammoth)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ SHA-256 Hashing │ (crypto.createHash('sha256') on extracted raw text)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Redis Cache   │
└────┬─────────┬──┘
     │Hit      │Miss
     ▼         ▼
   Summary   Model Routing
                   │
           ┌───────┼───────┬───────┐
           ▼       ▼       ▼       ▼
        Gemini   Groq    Gemma   Sarvam
           │       │       │       │
           └───────┴───┬───┴───────┘
                       ▼
                    Summary
                       │
                       ▼
                 Store in Redis (24h TTL)
```

---

## Quick Startup & Local Development

### Quickstart (Docker)
```bash
./start.sh   # Or: docker compose up --build -d
```
> **Local LLM:** Ensure Ollama is running (`ollama serve`). Server connects via `OLLAMA_BASE_URL=http://host.docker.internal:11434`.

### Running Backend Tests
```bash
cd server
bun test
```
Runs integration tests against an isolated `mongodb-memory-server` database instance.

### Local Development (Without Docker)
1. **Backend:**
   ```bash
   cd server
   bun install
   cp .env.example .env
   bun dev
   ```
2. **Frontend:**
   ```bash
   cd client
   npm install
   npm run dev
   ```

---

## Environment Variables

```env
PORT=5000
HTTPS_PORT=5001
SSL_KEY_PATH=
SSL_CERT_PATH=
MONGODB_URI=mongodb://localhost:27017/layerzero
OLLAMA_MODEL=gemma:4b
OLLAMA_BASE_URL=http://localhost:11434
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
SARVAM_API_KEY=your_sarvam_api_key
JWT_SECRET=your_jwt_secret
NODE_ENV=development
CLIENT_URL=http://localhost:5173
API_URL=http://localhost:5000
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
```

---

## Current Limitations & Roadmap

* **Single Document Focus:** Processes one document or URL per request. Multi-document batch processing planned.
* **Persistent History:** Summaries persist in Redis cache (24h TTL) but are not yet saved to user accounts permanently.
* **Background Queues:** Future updates will integrate worker queues (BullMQ) for asynchronous long-document parsing.

---

## License

MIT License