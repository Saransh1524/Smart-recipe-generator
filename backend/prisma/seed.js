const { PrismaClient } = require('@prisma/client');
    const fs = require('fs');
    const path = require('path');

    const prisma = new PrismaClient();

    async function main() {
      console.log('Start seeding ...');

      const dbPath = path.join(__dirname, '..', 'database.json');
      const recipesData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

      // Clear existing recipes to avoid unique id conflicts
      await prisma.rating.deleteMany();
      await prisma.favorite.deleteMany();
      await prisma.recipe.deleteMany();

      // Normalize data and insert in bulk
      const data = recipesData.map(r => ({
        id: r.id,
        name: r.name,
        image: r.image,
        ingredients: r.ingredients || [],
        instructions: r.instructions || [],
        cookingTime: r.cookingTime,
        difficulty: r.difficulty,
        nutritionalInfo: r.nutritionalInfo || {},
        dietaryTags: r.dietaryTags || [],
      }));

      await prisma.recipe.createMany({ data });

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
    
