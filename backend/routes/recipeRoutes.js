const express = require('express');

module.exports = function recipeRoutes(app, deps) {
  const { prisma } = deps;
  const router = express.Router();

  router.get('/api/recipes', async (req, res) => {
    const { ingredients, difficulty, maxCookingTime, dietary } = req.query;

    try {
      const whereClause = {};
      if (difficulty) whereClause.difficulty = difficulty;
      if (maxCookingTime) whereClause.cookingTime = { lte: parseInt(maxCookingTime) };
      if (dietary) whereClause.dietaryTags = { has: dietary };

      let recipes = await prisma.recipe.findMany({ where: whereClause });

      if (ingredients) {
        const searchIngredients = ingredients.toLowerCase().split(',').map(item => item.trim());
        const matchedRecipes = recipes
          .map(recipe => {
            const matchCount = recipe.ingredients.filter(ing =>
              searchIngredients.some(searchIng => ing.toLowerCase().includes(searchIng))
            ).length;
            if (matchCount > 0) {
              return { ...recipe, matchScore: matchCount / recipe.ingredients.length };
            }
            return null;
          })
          .filter(Boolean)
          .sort((a, b) => b.matchScore - a.matchScore);

        return res.json(matchedRecipes);
      }

      return res.json(recipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      res.status(500).json({ error: "Failed to fetch recipes." });
    }
  });

  router.get('/api/recipes/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const recipe = await prisma.recipe.findUnique({ where: { id: parseInt(id) } });
      if (!recipe) return res.status(404).json({ error: 'Recipe not found.' });
      res.json(recipe);
    } catch (error) {
      console.error(`Error fetching recipe ${id}:`, error);
      res.status(500).json({ error: 'Failed to fetch recipe.' });
    }
  });

  app.use(router);
};


