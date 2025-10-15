const express = require('express');

module.exports = function favoriteRoutes(app, deps) {
  const { prisma, authenticateToken } = deps;
  const router = express.Router();

  router.get('/api/users/me/favorites', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    try {
      const favorites = await prisma.favorite.findMany({
        where: { userId },
        include: { recipe: true },
      });
      res.json(favorites.map(fav => fav.recipe));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch favorite recipes." });
    }
  });

  router.post('/api/users/me/favorites', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const { recipeId } = req.body;
    try {
      await prisma.favorite.create({ data: { userId: userId, recipeId: recipeId } });
      res.status(201).send();
    } catch (error) {
      if (error.code === 'P2002') {
        return res.status(409).json({ error: "Recipe already in favorites." });
      }
      res.status(500).json({ error: "Failed to add to favorites." });
    }
  });

  app.use(router);
};


