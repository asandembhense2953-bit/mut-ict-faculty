# MUT ICT Faculty Website
## Smart & Interactive Web Application

---

## 📌 Project Overview

A **full-stack web application** for the ICT Department at Mangosuthu University of Technology.

---

## 👥 Team Members

| Student Number | Name | Role |
|----------------|------|------|
| 22440270 | A.N. Mbhense | Lead Developer |
| 22432331 | A.L. Ntuli | Frontend Designer |
| 22435165 | S.N.T. Masuku | QA & Documentation |

---

## 🎥 Video Presentation

[Click here to watch the presentation](https://www.loom.com/share/YOUR_LINK_HERE)



---

## ✨ Features

### Frontend

- 📱 Responsive design (mobile, tablet, desktop)
- 🌙 Dark/Light mode toggle
- 🤖 AI-powered chatbot
- 🔍 Smart search with deep linking
- 👤 User profile with image upload
- 📝 Student registration & login
- 📧 Contact form with validation
- 📅 Campus tour booking system

### Backend

- 🚀 RESTful API with Node.js/Express
- 🗄️ MySQL database integration
- 📚 CRUD operations
- 🔒 Password hashing with bcrypt
- ✅ Input validation middleware
- 📝 Logging middleware
- ⚠️ Error handling middleware

### AI Features

- 💬 AI-powered chatbot (OpenRouter API)
- 🎯 Smart search with relevance scoring

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Node.js, Express.js |
| Database | MySQL |
| AI | OpenRouter API |

---

## 💻 Installation & Setup

### Prerequisites

- Node.js (v14+)
- XAMPP (MySQL)
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/asandembhense2953-bit/mut-ict-faculty.git
cd mut-ict-faculty
```

### Step 2: Set Up Database

1. Start XAMPP MySQL
2. Create database: `mut_ict_db`
3. Import `database/mut_ict_db.sql`

### Step 3: Install Backend Dependencies

```bash
cd mut-ict-backend
npm install
```

### Step 4: Configure Environment Variables

Copy `.env.example` to `.env` and add your OpenRouter API key.

### Step 5: Start the Server

```bash
node server.js
```

### Step 6: Access the Website

Open: [http://localhost:3001](http://localhost:3001)

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hello` | Test server |
| POST | `/api/chat` | AI chatbot |
| POST | `/api/register` | Student registration |
| POST | `/api/login` | Student login |
| PUT | `/api/student/:id` | Update student |
| DELETE | `/api/booking/:id` | Cancel booking |

---

## 🧑‍🏫 Lecturer Access

- **Lecturer:** Mr X Piyose
- **Email:** xpiyose@gmail.com
