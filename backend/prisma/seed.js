const { PrismaClient } = require('@prisma/client');
    const fs = require('fs');
    const path = require('path');

    const prisma = new PrismaClient();

    async function main() {
      console.log('Start seeding ...');

      const dbPath = path.join(__dirname, '..', 'database.json');
      const recipesData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

      for (const recipe of recipesData) {
        await prisma.recipe.create({
          data: {
            id: recipe.id,
            name: recipe.name,
            image: recipe.image,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            cookingTime: recipe.cookingTime,
            difficulty: recipe.difficulty,
            nutritionalInfo: recipe.nutritionalInfo,
            dietaryTags: recipe.dietaryTags || [],
          },
        });
      }
      console.log('Seeding finished.');
    }

    main()
      .catch((e) => {
        console.error(e);
        process.exit(1);
      })
      .finally(async () => {
        await prisma.$disconnect();
      });
    
