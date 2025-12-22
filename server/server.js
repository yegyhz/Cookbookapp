import dotenv from 'dotenv';
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

const allowedOrigins = [
  'http://localhost:5173',
  'https://familycookbook-725b5.web.app',
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

// Load service account JSON from path provided in env or fallback to ./server/serviceAccountKey.json
const serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH || path.join(process.cwd(), 'server', 'serviceAccountKey.json');
let db;
try {
  if (!fs.existsSync(serviceAccountPath)) {
    console.warn(`Firebase service account not found at ${serviceAccountPath}. server will fail to initialize Firestore admin features until this is provided.`);
  } else {
    const serviceAccountRaw = fs.readFileSync(serviceAccountPath, 'utf8');
    const serviceAccount = JSON.parse(serviceAccountRaw);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://familycookbook-725b5.firebaseio.com',
    });
    db = admin.firestore();
  }
} catch (err) {
  console.error('Failed to initialize Firebase Admin:', err);
}

// security headers
app.use(helmet());
app.use(cors(corsOptions));

// If running behind a proxy (e.g. in production), enable trust proxy for correct rate-limit behavior
app.set('trust proxy', 1);

// rate limiter for Gemini endpoints to prevent abuse of the generative API
const geminiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests per `window` per minute
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: { message: 'Too many requests, please slow down.' },
});

// Apply limiter only to gemini routes
app.use('/api/gemini', geminiLimiter);
app.use(express.json());

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

function requireBodyFields(...fields) {
  return (req, res, next) => {
    for (const f of fields) {
      if (!req.body || req.body[f] === undefined || req.body[f] === null || req.body[f] === '') {
        return res.status(400).json({ message: `Missing required field: ${f}` });
      }
    }
    next();
  };
}

// centralized error handler
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error('Unhandled error:', err);
  const status = err && err.status ? err.status : 500;
  res.status(status).json({ message: err && err.message ? err.message : 'Internal server error' });
}

app.get('/api/recipes/search', async (req, res) => {
  try {
    if (!db) return res.status(500).json({ message: 'Server not configured: Firebase service account is missing' });
    const term = String(req.query.term || '');
    const userId = String(req.query.userId || '');
    if (!userId) {
      return res.status(400).send('User ID is required.');
    }

    const recipesRef = db.collection('users').doc(userId).collection('recipes');
    const snapshot = await recipesRef.get();
    const recipes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const lowerTerm = term.toLowerCase();
    const filteredRecipes = recipes.filter((r) => {
      const title = (r.title || '').toString().toLowerCase();
      const ingredients = (r.ingredients || []).map((i) => i.toString().toLowerCase());
      const matchesSearch = title.includes(lowerTerm) || ingredients.some((i) => i.includes(lowerTerm));
      return matchesSearch;
    });

    res.json(filteredRecipes);
  } catch (error) {
    console.error('Error searching recipes:', error);
    res.status(500).json({ message: 'Error searching recipes', error: (error && error.message) || String(error) });
  }
});

app.post('/api/gemini/tips', requireBodyFields('prompt'), async (req, res, next) => {
  try {
    if (!genAI) return res.status(500).json({ message: 'Server not configured: GEMINI_API_KEY missing' });
    const { prompt } = req.body;
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    res.send({ text });
  } catch (error) {
    next(error);
  }
});

const imageCache = new Map();

app.post('/api/gemini/image', requireBodyFields('prompt'), async (req, res, next) => {
  try {
    const { prompt } = req.body;

    if (!genAI) return res.status(500).json({ message: 'Server not configured: GEMINI_API_KEY missing' });

    if (imageCache.has(prompt)) {
      const cached = imageCache.get(prompt);
      // simple TTL: evict entries older than 24 hours
      if (cached && cached.ts && Date.now() - cached.ts < 24 * 60 * 60 * 1000) {
        return res.send({ imageUrl: cached.url });
      }
      imageCache.delete(prompt);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const imagePromptResult = await model.generateContent(
      `Generate a short, descriptive prompt for an image generation service (like Midjourney or DALL-E) to create a beautiful, appetizing photo of the following dish: ${prompt}. The prompt should be a single sentence and focus on visual details like lighting, plating, and garnishes.`
    );
    const imagePromptResponse = await imagePromptResult.response;
    const imagePrompt = await imagePromptResponse.text();

    const unsplashUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(imagePrompt)}`;

    imageCache.set(prompt, { url: unsplashUrl, ts: Date.now() });

    res.send({ imageUrl: unsplashUrl });
  } catch (error) {
    next(error);
  }
});

// error handler should be the last middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});