const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const { ImageAnnotatorClient } = require('@google-cloud/vision');


const { grpc, ClarifaiStub, service } = require("clarifai-nodejs-grpc");
const stub = ClarifaiStub.json();

// --- Initialization ---
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Setup for Google Cloud Vision
const visionClient = new ImageAnnotatorClient({
  keyFilename: 'google-credentials.json'
});

// Setup for Multer (to handle file uploads in memory)
const upload = multer({ storage: multer.memoryStorage() });


// --- Middleware ---
app.use(cors());
app.use(express.json());
// Auth middleware (shared)
const jwt = require('jsonwebtoken');
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- Route modules ---
const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const suggestionRoutes = require('./routes/suggestionRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const imageRoutes = require('./routes/imageRoutes');

const deps = { prisma, authenticateToken, upload, stub, grpc };
authRoutes(app, deps);
recipeRoutes(app, deps);
suggestionRoutes(app, deps);
ratingRoutes(app, deps);
favoriteRoutes(app, deps);
imageRoutes(app, deps);

// --- Server Activation ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

