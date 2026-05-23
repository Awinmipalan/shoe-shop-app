# 👟 3D Shoe E-Commerce Platform

A modern, interactive **shoe e-commerce website** featuring 3D product visualization, video-based hero display, and WhatsApp-based checkout ordering.

---

## 🌐 Live Demo
👉 https://toonhub-character-carousel-853646050489.europe-west2.run.app

---

## 🧭 Project Overview

This is a premium-style **interactive shoe store web application** where users can:

- Watch a **rotating shoe video on the homepage**
- Explore a **3D shoe collection with full interaction**
- Rotate, zoom, lift, and inspect shoes (inside & outside view)
- Add shoes to cart
- Place orders via **WhatsApp checkout**
- Navigate through Home, Collection, Contact, and Cart pages

---

## ✨ Key Features

### 🎥 Hero Section
- Rotating shoe video animation
- High-quality product presentation
- Smooth entry transitions

### 👟 3D Shoe Collection
- Fully interactive 3D shoe models
- Rotate in all directions
- Zoom in/out
- Lift and inspect details
- Interior + exterior viewing

### 🛒 Cart System
- Add products to cart
- View selected items
- Proceed to checkout

### 📲 WhatsApp Checkout
- Orders sent directly to WhatsApp
- Simple payment workflow
- Fast customer conversion system

### 📞 Contact Page
- Customer inquiry section
- Direct communication support

---

## 🛠 Tech Stack

- HTML5
- CSS3
- JavaScript (ES6+)
- Three.js (3D rendering engine)
- GLTF/GLB 3D models
- WhatsApp Click-to-Chat API
- Cloud Deployment (Google Cloud Run)

---

## 📁 Project Structure

```text
toonhub-shoe-store/
│
├── assets/
│   ├── images/
│   ├── videos/
│   └── models/        # 3D shoe models (GLB/GLTF)
│
├── pages/
│   ├── index.html     # Home (video hero)
│   ├── collection.html # 3D shoe viewer
│   ├── contact.html
│   └── cart.html
│
├── scripts/
│   ├── main.js        # UI interactions
│   └── threeD.js      # 3D model controls
│
├── styles/
│   └── main.css
│
└── README.md
# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/60f9b862-9965-4d04-85c7-dc2f39706d9d

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
