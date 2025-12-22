require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');

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

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://familycookbook-725b5.firebaseio.com'
});

const db = admin.firestore();

app.use(cors(corsOptions));
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get('/api/recipes/search', async (req, res) => {
  try {
    const { term, userId } = req.query;
    if (!userId) {
      return res.status(400).send('User ID is required.');
    }

    const recipesRef = db.collection('users').doc(userId).collection('recipes');
    const snapshot = await recipesRef.get();
    const recipes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const filteredRecipes = recipes.filter(r => {
      const matchesSearch = r.title.toLowerCase().includes(term.toLowerCase()) ||
        r.ingredients.some(i => i.toLowerCase().includes(term.toLowerCase()));
      return matchesSearch;
    });

    res.json(filteredRecipes);
  } catch (error) {
    console.error('Error searching recipes:', error);
    res.status(500).json({ message: 'Error searching recipes', error: error.message });
  }
});

app.post('/api/gemini/tips', async (req, res) => {
  try {
    const { prompt } = req.body;
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    res.send({ text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating tips', error: error.message });
  }
});

const imageCache = new Map();

app.post('/api/gemini/image', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (imageCache.has(prompt)) {
      return res.send({ imageUrl: imageCache.get(prompt) });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const imagePromptResult = await model.generateContent(
      `Generate a short, descriptive prompt for an image generation service (like Midjourney or DALL-E) to create a beautiful, appetizing photo of the following dish: ${prompt}. The prompt should be a single sentence and focus on visual details like lighting, plating, and garnishes.`
    );
    const imagePromptResponse = await imagePromptResult.response;
    const imagePrompt = await imagePromptResponse.text();

    const unsplashUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(
      imagePrompt
    )}`;

    imageCache.set(prompt, unsplashUrl);

    res.send({ imageUrl: unsplashUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating image', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});