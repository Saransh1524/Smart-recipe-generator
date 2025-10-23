
---

# 🍳 Smart Recipe Generator

A full-stack web application that suggests recipes based on ingredients you have on hand, either through text input or by analyzing an uploaded image. This project demonstrates a complete development lifecycle, from database design and API creation to a dynamic, responsive frontend with user personalization features.

🔗 **Live Application:** [https://smart-recipe-generator-gilt.vercel.app](https://smart-recipe-generator-gilt.vercel.app/)


---

## ✨ Features

This application is built with a focus on **user experience** and a **smart, personalized backend**.

### 🧠 Core Functionality

* **Image-Based Ingredient Recognition:** Upload a photo of your ingredients, and the **Clarifai API** will identify them and populate the search.
* **Text-Based Ingredient Search:** Find recipes by typing in a comma-separated list of ingredients.
* **Advanced Recipe Filtering:** Filter recipes by difficulty (Easy, Medium, Hard), max cooking time, and dietary restrictions (Vegetarian, Gluten-Free, etc.).
* **Detailed Recipe View:** Each recipe displays full instructions, ingredients with quantities, nutrition info, and substitution suggestions.

### 👤 User Personalization

* **Secure User Authentication:** JWT-based registration and login system.
* **Personal Cookbook:** Logged-in users can save favorite recipes to a protected "My Cookbook" page.
* **Recipe Rating System:** Users can rate recipes (1–5 stars).
* **Personalized Suggestions:** "Recommended for You" section leverages ratings and preferences.

---

## 🧩 Technology Stack

| Category       | Technology                             |
| -------------- | -------------------------------------- |
| **Frontend**   | Next.js, Tailwind CSS, Zustand |
| **Backend**    | Node.js, Express.js                    |
| **Database**   | PostgreSQL (Supabase), Prisma ORM      |
| **Services**   | Clarifai API, JWT, bcrypt.js           |
| **Deployment** | Vercel (Frontend), Render (Backend)    |

---

## 🏗️ Architecture & Deployment

This project is structured as a **monorepo** with two distinct applications:

* **Frontend (`/frontend`)** → Next.js app deployed on **Vercel**
* **Backend (`/backend`)** → Express.js REST API deployed on **Render**
* **Database (PostgreSQL)** → Hosted on **Supabase** using the connection pooler for Render compatibility

---

## 📡 API Endpoints

| Method | Endpoint                           | Description                         
| ------ | ---------------------------------- | ----------------------------------- 
| POST   | `/api/auth/signup`                 | Register a new user                 |
| POST   | `/api/auth/login`                  | Authenticate and return a JWT       |
| GET    | `/api/recipes`                     | Get all recipes (with filters)      | 
| GET    | `/api/recipes/:id`                 | Get a single recipe by ID           |
| POST   | `/api/ingredients/recognize-image` | Analyze image & return ingredients  |
| GET    | `/api/users/me/favorites`          | Get user’s favorite recipes         |
| POST   | `/api/users/me/favorites`          | Add a recipe to favorites           | 
| POST   | `/api/recipes/:id/rate`            | Rate a recipe                       | 
| GET    | `/api/suggestions`                 | Get personalized recipe suggestions |

---

## 🗃️ Database Schema (Prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DATABASE_URL")
}

model User {
  id        String     @id @default(cuid())
  email     String     @unique
  password  String
  createdAt DateTime   @default(now())
  favorites Favorite[]
  ratings   Rating[]
}

model Recipe {
  id              Int        @id @default(autoincrement())
  name            String
  image           String
  ingredients     String[]
  instructions    String[]
  cookingTime     Int
  difficulty      String
  nutritionalInfo Json
  dietaryTags     String[]
  substitutions   Json?
  favoritedBy     Favorite[]
  ratings         Rating[]
}

model Favorite {
  user       User     @relation(fields: [userId], references: [id])
  userId     String
  recipe     Recipe   @relation(fields: [recipeId], references: [id])
  recipeId   Int
  assignedAt DateTime @default(now())

  @@id([userId, recipeId])
}

model Rating {
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  recipe    Recipe   @relation(fields: [recipeId], references: [id])
  recipeId  Int
  value     Int
  createdAt DateTime @default(now())

  @@id([userId, recipeId])
}
```

---

## ⚙️ Local Development Setup

### Backend (`/backend`)

1. Navigate to backend directory

   ```bash
   cd backend
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create `.env` file and add variables (see [Environment Variables](#🌍-environment-variables)).

4. Run database migrations

   ```bash
   npx prisma migrate dev
   ```

5. Seed initial recipe data

   ```bash
   npx prisma db seed
   ```

6. Start the server

   ```bash
   npm start
   ```

➡️ Runs at **[http://localhost:3001](http://localhost:3001)**

---

### Frontend (`/frontend`)

1. Navigate to frontend directory

   ```bash
   cd frontend
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create `.env.local` file with:

   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. Start the server

   ```bash
   npm run dev
   ```

➡️ Runs at **[http://localhost:3000](http://localhost:3000)**

---

## 🌍 Environment Variables

### Backend (`backend/.env`)

```env
# Supabase "Session Pooler" connection string (port 6543)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# JWT Secret Key
JWT_SECRET="YOUR_SUPER_SECRET_KEY"

# Clarifai API Credentials
CLARIFAI_API_KEY="YOUR_CLARIFAI_API_KEY"
CLARIFAI_USER_ID="YOUR_CLARIFAI_USER_ID"
CLARIFAI_APP_ID="YOUR_CLARIFAI_APP_ID"
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

