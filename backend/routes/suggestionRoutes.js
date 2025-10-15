const express = require('express');

module.exports = function suggestionRoutes(app, deps) {
  const { prisma, authenticateToken } = deps;
  const router = express.Router();

  router.get('/api/suggestions', authenticateToken, async (req, res) => {
    const userId = req.user.userId;

    try {
      const highRated = await prisma.rating.findMany({
        where: { userId: userId, value: { gte: 4 } },
        include: { recipe: true },
      });

      if (highRated.length === 0) {
        const randomRecipes = await prisma.recipe.findMany({ take: 5 });
        return res.json(randomRecipes);
      }

      const tasteProfile = {};
      const ratedRecipeIds = new Set();
      highRated.forEach(({ recipe }) => {
        ratedRecipeIds.add(recipe.id);
        tasteProfile[recipe.difficulty] = (tasteProfile[recipe.difficulty] || 0) + 1;
        recipe.dietaryTags.forEach(tag => {
          tasteProfile[tag] = (tasteProfile[tag] || 0) + 1;
        });
      });

      const candidateRecipes = await prisma.recipe.findMany({
        where: { id: { notIn: Array.from(ratedRecipeIds) } },
      });

      const suggestions = candidateRecipes
        .map(recipe => {
          let score = 0;
          if (tasteProfile[recipe.difficulty]) score += tasteProfile[recipe.difficulty];
          recipe.dietaryTags.forEach(tag => { if (tasteProfile[tag]) score += tasteProfile[tag]; });
          return { ...recipe, suggestionScore: score };
        })
        .filter(recipe => recipe.suggestionScore > 0)
        .sort((a, b) => b.suggestionScore - a.suggestionScore)
        .slice(0, 5);

      res.json(suggestions);
    } catch (error) {
      console.error("Error generating suggestions:", error);
      res.status(500).json({ error: "Failed to generate suggestions." });
    }
  });

  app.use(router);
};


