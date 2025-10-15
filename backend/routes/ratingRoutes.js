const express = require('express');

module.exports = function ratingRoutes(app, deps) {
  const { prisma, authenticateToken } = deps;
  const router = express.Router();

  router.post('/api/recipes/:id/rate', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const recipeId = parseInt(req.params.id);
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be a number between 1 and 5.' });
    }

    try {
      const newRating = await prisma.rating.upsert({
        where: { userId_recipeId: { userId: userId, recipeId: recipeId } },
        update: { value: rating },
        create: { userId: userId, recipeId: recipeId, value: rating },
      });

      res.status(201).json(newRating);
    } catch (error) {
      console.error(`Error rating recipe ${recipeId}:`, error);
      res.status(500).json({ error: 'Failed to submit rating.' });
    }
  });

  app.use(router);
};


