<!-- Copilot / AI agent guidance for Cookbookapp -->
# Copilot instructions — Cookbookapp

Purpose: provide concise, actionable guidance so an AI coding agent can be productive immediately in this repository.

1) High-level architecture
- Frontend: Vite + React (TypeScript). Entry points: `index.tsx`, `App.tsx`. UI components live in `components/`.
- Backend: lightweight Express server at `server/server.js`. It proxies calls to Google Gemini (`/api/gemini/*`) and performs Firestore admin operations via `firebase-admin`.
- Data flow: frontend reads/writes user-scoped Firestore collections (`users/{uid}/recipes`) via Firebase client (`hooks/useRecipes.ts`, `context/AppContext.tsx`). The server uses `serviceAccountKey.json` and `firebase-admin` to access Firestore and to call Gemini.
- API surface: `services/api.ts` calls `http://localhost:3001/api` endpoints: `/gemini/tips`, `/gemini/image`, `/recipes/search`.

2) Key files to reference when making changes
- `server/server.js` — CORS rules, GEMINI usage, image prompt caching, and port. Update `allowedOrigins` here when testing from other hosts.
- `services/api.ts` — central client-to-backend adapter. Change `API_BASE_URL` here if the server runs on a different host/port.
- `hooks/useRecipes.ts` — the canonical data layer for recipes (listening with `onSnapshot`, seeding `INITIAL_RECIPES`, CRUD helpers). Use these functions instead of directly manipulating Firestore in components.
- `context/AppContext.tsx` — wraps `useRecipes` and exposes the app-level API via `useAppContext()`.
- `src/firebaseConfig.ts` and top-level `firebase.ts` — client Firebase initialization; replace placeholders with real project values or wire them to environment variables in local dev.
- `data.ts` — contains `INITIAL_RECIPES` used for seeding.

3) Developer workflows & commands (practical)
- Install dependencies: `npm install`.
- Run frontend dev server: `npm run dev` (Vite). Default URL printed by Vite (usually `http://localhost:5173`).
- Run backend server (separate terminal): `npm run start:server` (uses `nodemon` to restart on changes).
- Build production frontend: `npm run build` then `npm run preview` to locally preview the build.
- Tests: `npm test` (Jest configured via `jest.config.cjs`).

4) Environment and secrets
- Required local env: a `.env` containing `GEMINI_API_KEY` for the server. The server also expects `server/serviceAccountKey.json` for `firebase-admin`.
- Do NOT commit real `serviceAccountKey.json` or API keys. Use vaults/CI secrets when deploying.

5) Project-specific patterns & guidance
- Single source of truth for recipe data: prefer `useRecipes()` and `useAppContext()` over ad-hoc Firestore calls. `useRecipes` handles seeding (`INITIAL_RECIPES`) and real-time subscriptions (`onSnapshot`).
- Backend proxy: all Gemini/image generation requests go through `server/server.js`. Avoid calling Gemini directly from the browser; the server keeps API keys off the client.
- API client: `services/api.ts` centralizes fetch behavior and error handling. When adding new endpoints, add helper functions here and call from components or hooks.
- CORS and local debugging: if the frontend reports CORS errors, check `allowedOrigins` in `server/server.js` and `API_BASE_URL` in `services/api.ts`.

6) Quick examples
- To add a new server endpoint that returns user recipes summary: modify `server/server.js` and then add a corresponding helper in `services/api.ts` (follow pattern of `geminiService.getTips`).
- To seed or change initial data: update `INITIAL_RECIPES` in `data.ts` — `useRecipes` seeds on first user snapshot.

7) Safety and testing notes
- The repo uses ESM modules and modern React (React 19). Follow existing TS patterns and types in `types.ts`.
- When modifying Firestore access, mimic existing error handling in `useRecipes` (set `error` state and surface it via `useAppContext`).

If anything above is unclear or you want me to expand a section (e.g., precise test commands, CI/deploy notes, or example PR checklist), tell me which area and I'll iterate.
