# 🍽️ Recipe Manager App

A full-stack web application that helps users **create, organize, and share recipes** with ease. Built with Angular 19 and Ruby on Rails, the app includes support for nested ingredients and instructions, personalized measurement units (metric/imperial), shopping lists, and favorites.

This app was developed as a my first project for a full-stack coding bootcamp, focusing on **clean UI design, modular architecture, and practical real-world features**.

---

## 🚀 Live Demo

🌐 Frontend: [https://recipe-manager-eight-indol.vercel.app](https://recipe-manager-eight-indol.vercel.app)  
🔗 Backend API: [https://recipe-manager-m2th.onrender.com](https://recipe-manager-m2th.onrender.com)

---

## ✨ Features

- **User Authentication** with JWT (signup/login/logout)
- **Recipe CRUD** with nested:
  - Ingredients (metric + imperial)
  - Step-by-step instructions
  - Labels (e.g. vegan, vegetarian)
- **Unit system toggle** (convert between metric/imperial)
- **Favorites** and **Shopping List** toggles
- **Dialog popups** for recipe detail view and sharing
- **Email simulation** for sharing favorite recipes
- **Print support** for shopping list and favorites
- **Responsive UI** with Angular Material and custom theming

---

## ✌🏻 Version 2 Updates

Version 2 introduces **demo mode, improved recipe management, advanced shopping list handling, and fully functional email sharing**.  
This update also enhances the backend for demo stability, improves UX/UI interactions, and adds more flexibility for users when creating and managing recipes.

---

### Backend & Deployment

- **API redeployed on SQLite (ephemeral data)** for demoing.
  - This avoids the 1-month free Postgres limit on Render by using an intentionally restructured setup.
- **Improved backend structure** for readability, maintainability, and separation of concerns.
  - Flattened data structure and extracted helper methods.

### Demo Mode

- Added a **Demo Mode** for testing the app without account creation.
  - Seeded demo data resets daily.
  - Data is ephemeral, designed purely for trying out features.

### Recipes

- **Filtering & Sorting**
  - Recipes can be filtered by label.
  - Sorting options: alphabetical, creation date, and cooking time.
- **Additional Data Input**
  - Recipes now support descriptions and image uploads.
- **Recipe Metadata**
  - Creation date and most recent update date are now visible in expanded recipe view.
- **Unit Conversion**
  - Full metric ↔ imperial conversion in both recipe view and shopping list.
- **Global Ingredients**
  - Ingredients are shared across users and available globally when creating new recipes.
  - Enables auto-fill during recipe submission.

### Shopping List

- Quantities are now **aggregated and combined** for identical ingredients.
- Converted units respect the user’s selected measurement system.

### User Accounts

- **Profile Management**
  - Edit user data, delete accounts, and upload profile pictures.

### Frontend & UX

- **Image compression** with `browser-image-compression` for recipe and profile uploads.
- **Improved visuals & user notifications**
  - Added better error handling, confirmations, and snackbars for feedback.

### Email Features

- **SMTP via Gmail** set up for:
  - Sharing recipes and shopping lists via email.
  - Contact form submissions.
- ✅ **Now fully functional!**

---

## 🛠️ Technologies

### Frontend

- **Angular 19** (Standalone Components + Signals API)
- **Angular Material** for UI components
- **Signal** for reactive state
- **CSS** for styling
- **Vercel** for frontend deployment

### Backend

- **Ruby on Rails 8**
- **PostgreSQL** database
- **JWT Authentication**
- **bcrypt** for password security
- **Blueprinter** for JSON serialization
- **RSpec + Postman** for testing

---

## 📦 Getting Started

### Backend (Rails)

```bash
# Clone the repo
git clone https://github.com/AlineTaylor/recipe-manager-api.git
cd recipe-manager-api

# Install dependencies
bundle install

# Set up the database
rails db:create
rails db:migrate
rails db:seed

# Start the Rails server
rails s
```

---

### Frontend (Angular)

```bash
# Clone the repo
git clone https://github.com/AlineTaylor/recipe-manager.git
cd recipe-manager

# Install dependencies
npm install

# Serve the app locally
ng serve

```
