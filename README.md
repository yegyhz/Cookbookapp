<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1Rk-NLmQ5e6rr8P0NwavHeSgtRjYzOmHV

## Run Locally

**Prerequisites:**

- Node.js (LTS recommended)
- npm

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env` file in the project root (if it doesn’t already exist) and set at least:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

If you are using Firebase, ensure your `firebase.ts` is configured with your project credentials.

### Connecting Firebase (client + server)

- Client: provide the Firebase web app config via Vite env vars prefixed with `VITE_`. See `.env.example` for keys. Example values in your `.env` (client-side values will be baked into the bundle):

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

- Server (admin): create a Firebase service account key JSON from the Firebase Console (Project Settings → Service accounts → Create new private key) and save it locally at `server/serviceAccountKey.json` (or set `SERVICE_ACCOUNT_PATH` to its location). **Do not commit this file.**

You can deploy Firestore security rules using the Firebase CLI with `firebase deploy --only firestore:rules` after logging in and selecting your project.

### 3. Run the dev server

```bash
npm run dev
```

The app will start with Vite; follow the URL shown in the terminal (typically `http://localhost:5173`).

## Build

To create a production build:

```bash
npm run build
```

This uses Vite’s build pipeline and outputs static assets to the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

## Scripts

Key npm scripts defined in `package.json`:

- `npm run dev` – Start Vite dev server
- `npm run build` – Build for production
- `npm run preview` – Preview the production build
- `npm run start:server` – Run the Node/Express server (`server/server.js`), used for backend/Gemini proxying

## Styling (Tailwind CSS / PostCSS)

- Tailwind CSS is configured via `tailwind.config.js`.
- PostCSS is configured in `postcss.config.cjs` using the `@tailwindcss/postcss` plugin and `autoprefixer`.
- Global styles live in `index.css`.

## Firebase

- Firebase client configuration is in `firebase.ts`.
- Recipes and user data are stored per-user in Firestore collections.
- Authentication is handled with Firebase Auth and wrapped by the `useAuth` hook and `Auth` component.

## Testing

- Jest is configured via `jest.config.cjs`.
- Example tests live in `src/utils.test.ts`.

Run tests with:

```bash
npm test
```

## Deployment

- The app is Vite-based and can be deployed to platforms like Vercel, Netlify, or any static host.
- Ensure your environment variables (e.g., `GEMINI_API_KEY`, Firebase config) are configured in your deployment environment.
