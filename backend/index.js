const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- Initialization ---
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) return res.sendStatus(401); // if there isn't any token

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // if token is no longer valid
    req.user = user;
    next();
  });
};


// --- API Endpoints ---

// --- Authentication Routes ---
app.post('/api/auth/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (error) {
    if (error.code === 'P2002') { // Unique constraint failed
      return res.status(409).json({ error: "A user with this email already exists." });
    }
    res.status(500).json({ error: "Failed to create user." });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});


// --- Recipe Routes ---
app.get('/api/recipes', async (req, res) => {
  const { ingredients } = req.query;

  try {
    let recipes = await prisma.recipe.findMany();

    if (ingredients) {
      const searchIngredients = ingredients.toLowerCase().split(',').map(item => item.trim());
      
      const matchedRecipes = recipes
        .map(recipe => {
          const matchCount = recipe.ingredients.filter(ing => 
            searchIngredients.some(searchIng => ing.toLowerCase().includes(searchIng))
          ).length;

          if (matchCount > 0) {
            return {
              ...recipe,
              matchScore: matchCount / recipe.ingredients.length,
            };
          }
          return null;
        })
        .filter(recipe => recipe !== null)
        .sort((a, b) => b.matchScore - a.matchScore);

      return res.json(matchedRecipes);
    }
    
    return res.json(recipes);
  } catch (error) {
    // Log the detailed error to the backend console for debugging
    console.error("Error fetching recipes:", error);
    res.status(500).json({ error: "Failed to fetch recipes." });
  }
});


// --- User Favorite Routes (Protected) ---
app.get('/api/users/me/favorites', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    try {
        const favorites = await prisma.favorite.findMany({
            where: { userId },
            include: { recipe: true }, // Include the full recipe details
        });
        res.json(favorites.map(fav => fav.recipe)); // Return just the recipe objects
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch favorite recipes." });
    }
});

app.post('/api/users/me/favorites', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const { recipeId } = req.body;

    try {
        await prisma.favorite.create({
            data: {
                userId: userId,
                recipeId: recipeId,
            },
        });
        res.status(201).send();
    } catch (error) {
       if (error.code === 'P2002') { // Already favorited
            return res.status(409).json({ error: "Recipe already in favorites." });
       }
       res.status(500).json({ error: "Failed to add to favorites." });
    }
});

// --- Server Activation ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

