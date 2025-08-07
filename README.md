# 🍽️ Recipe Manager App

A full-stack web application that helps users **create, organize, and share recipes** with ease. Built with Angular 19 and Ruby on Rails, the app includes support for nested ingredients and instructions, personalized measurement units (metric/imperial), shopping lists, and favorites.

This app was developed as a my first project for a full-stack coding bootcamp, focusing on **clean UI design, modular architecture, and practical real-world features**.

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

## 🚀 Live Demo

🌐 Frontend: [URL pending](URL pending)  
🔗 Backend API: [URL pending](URL pending)

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
