# 🎟️ Smart Ticketing System

A full-stack, cloud-deployed ticket booking platform that allows users to select events, choose seats from a live seat map, and book or cancel tickets safely even under concurrent usage.

🔗 **Live Demo:** https://smart-ticketing-system-lyart.vercel.app  

---

## 🚀 Tech Stack

**Frontend**
- React (Vite)
- Axios
- Modern CSS (Responsive UI, Dark Mode)

**Backend**
- Java 25
- Spring Boot
- Spring Data JPA
- Hibernate

**Database & Deployment**
- MySQL (Railway)
- Backend: Render
- Frontend: Vercel
- Version Control: Git & GitHub

---

## ✨ Features

- 👤 Simulated Login (User ID based)
- 🎭 Multi-event selection (Movies / Concerts / Expos)
- 💺 Interactive seat map with color indicators:
  - ⬜ Available  
  - 🟩 Selected  
  - ⬛ Booked
- 🔒 Concurrency-safe booking (prevents double booking)
- 🧾 “My Bookings” panel for current user
- ❌ Cancel booking (only your own tickets)
- 🌙 Dark / Light mode toggle
- ⏳ Loading spinner during API calls
- 🔔 Toast notifications for success & errors
- 📱 Mobile responsive UI
- ☁️ Fully deployed (Vercel + Render + Railway)

---

## 🏗️ Architecture Overview

React (Vercel)
|
| REST API (Axios)
v
Spring Boot Backend (Render)
|
| JPA / Hibernate
v
MySQL Database (Railway)

- Frontend handles UI, seat selection, login simulation, and user actions.
- Backend exposes REST APIs for booking, cancellation, and fetching seats.
- Database enforces **unique constraint on (event_id, seat_number)** to prevent double booking.
- JPA **@Version (Optimistic Locking)** ensures concurrency safety.
- All components are deployed independently in the cloud.

---

## 🔐 Concurrency & Data Safety

This project solves the **double booking problem** using:

- ✅ Database UNIQUE constraint on `(event_id, seat_number)`
- ✅ JPA Optimistic Locking using `@Version`
- ✅ Transactional service layer in Spring Boot

This guarantees that **even if 1000 users click the same seat at the same time, only one booking succeeds**.

---

## 📡 API Endpoints

- `GET /api/tickets/event/{eventId}` → Get booked seats for an event  
- `POST /api/tickets/book-multiple` → Book multiple seats  
- `DELETE /api/tickets/cancel` → Cancel a seat (user-verified)  
- `GET /api/tickets/all` → Get all tickets (used for “My Bookings”)

---

## 🛠️ Run Locally

### Backend (Spring Boot)

```bash
cd Ticketing System/Ticketing-System
# Configure application.properties with your MySQL details
mvn spring-boot:run

Frontend (React)

cd Ticketing-System Project/ticketing-frontend
npm install
npm run dev
