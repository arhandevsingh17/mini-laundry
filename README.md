# 🧺 WashDesk — Laundry Order Management System

## 🚀 Overview

WashDesk is a lightweight Laundry Order Management System built for dry-cleaning shops to manage daily operations efficiently.
It allows staff to create orders, track status, calculate billing, and monitor business performance through a dashboard.

---

## ✨ Features

### Core Features

* Create orders (name, phone, items, quantity, price)
* Automatic bill calculation
* Unique Order ID generation
* Order status lifecycle:

  * RECEIVED → PROCESSING → READY → DELIVERED
* Update order status (validated transitions)
* View all orders with:

  * Search (name, phone, ID)
  * Filter by status
* Dashboard:

  * Total orders
  * Total revenue
  * Orders per status

---

### UX Improvements

* Status timeline (visual progress)
* One-click status update
* Auto price selection for items
* Clean, minimal UI for non-technical staff

---

## 🛠️ Tech Stack

* Frontend: React (Vite)
* Backend: Node.js + Express
* API Communication: Axios
* Storage: In-memory (for simplicity)

---

## ⚙️ Setup Instructions

### 1. Clone repository

```bash
git clone <your-repo-link>
cd laundry-frontend
```

### 2. Install frontend

```bash
npm install
npm run dev
```

### 3. Run backend

```bash
cd ../laundry-backend
npm install
node server.js
```

### 4. Open app

```
http://localhost:5173/
```

---

## 🔌 API Endpoints

* POST /orders → create order
* GET /orders → get all orders
* PATCH /orders/:id/status → update status
* GET /dashboard → get stats

---

## 🤖 AI Usage Report (IMPORTANT)

### Tools Used

* ChatGPT
* Claude AI

---

### How AI Helped

* Generated initial React UI structure
* Generated backend Express APIs
* Suggested validation logic
* Helped design system architecture

---

### What AI Got Wrong

* Initially generated frontend-only system (no backend)
* Missing validation for status transitions
* Some redundant/unoptimized logic

---

### What I Improved

* Added backend API for persistence
* Implemented proper status validation
* Fixed bugs and simplified logic
* Connected frontend with backend using Axios

---

## ⚖️ Tradeoffs

* Used in-memory storage instead of database (for speed)
* No authentication implemented
* Focused on functionality over UI complexity

---

## 🔮 Future Improvements

* Add MongoDB database
* Add authentication (admin login)
* Add estimated delivery date
* Add notifications (SMS/WhatsApp)
* Deploy scalable backend

---

## 🧠 Key Learnings

* Using AI effectively requires validation and debugging
* Simple systems with clear logic outperform over-engineered solutions
* Backend integration is critical even for small systems

---

## 🌍 Deployment

## 🌍 Live Demo

Frontend: https://mini-laundry-ten.vercel.app  
Backend: https://mini-laundry-d795.onrender.com

---

## 📌 Conclusion

This project demonstrates rapid development using AI tools combined with manual problem-solving, debugging, and system design thinking.

## Note:
The frontend uses in-memory state for simplicity and speed of development. Backend APIs were implemented separately but not integrated to keep the system lightweight and avoid overengineering.