<div align="center">

# 🛒 CommerceHub

![GitHub stars](https://img.shields.io/github/stars/PRAHLAD09-dev/springboot-react-ecommerce-project?style=for-the-badge)

![GitHub forks](https://img.shields.io/github/forks/PRAHLAD09-dev/springboot-react-ecommerce-project?style=for-the-badge)

![GitHub last commit](https://img.shields.io/github/last-commit/PRAHLAD09-dev/springboot-react-ecommerce-project?style=for-the-badge)

![GitHub repo size](https://img.shields.io/github/repo-size/PRAHLAD09-dev/springboot-react-ecommerce-project?style=for-the-badge)

![GitHub issues](https://img.shields.io/github/issues/PRAHLAD09-dev/springboot-react-ecommerce-project?style=for-the-badge)

### AI Powered Multi-Role E-Commerce Platform

A modern full-stack e-commerce platform built using **Spring Boot**, **React**, and **Artificial Intelligence (Google Gemini)** that provides a complete online shopping experience for **Customers, Merchants, and Administrators**.

<img src="./screenshots/banner.png" width="100%" alt="CommerceHub Banner"/>

<br>

![Java](https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=springboot)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?style=for-the-badge&logo=vite)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=for-the-badge&logo=postgresql)
![Render](https://img.shields.io/badge/Render-Backend-46E3B7?style=for-the-badge&logo=render)
![Vercel](https://img.shields.io/badge/Vercel-Frontend-000000?style=for-the-badge&logo=vercel)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Images-3448C5?style=for-the-badge&logo=cloudinary)

</div>

---

# 📖 Overview

CommerceHub is a production-inspired AI-powered multi-role e-commerce platform that enables customers to browse and purchase products, merchants to manage their online stores, and administrators to control the overall marketplace from a centralized dashboard.

Unlike traditional CRUD-based e-commerce projects, CommerceHub integrates **Google Gemini AI** to automatically generate product descriptions, specifications, feature highlights, and SEO-friendly information directly from uploaded product images, significantly reducing manual effort for merchants.

The application follows a clean client-server architecture where the React frontend communicates with a secure Spring Boot REST API protected using JWT authentication and role-based authorization.

---

# ✨ Key Highlights

- 🤖 AI Powered Product Generation using Google Gemini
- 🔐 Secure JWT Authentication & Authorization
- 👥 Multi-Role System (User • Merchant • Admin)
- 📧 Email OTP Verification using Brevo
- ☁ Cloud Image Storage using Cloudinary
- 🛒 Complete Shopping Experience
- ⭐ Product Reviews & Ratings
- 📦 Merchant Product Management
- 🔍 Smart Search, Filtering & Pagination
- 📱 Fully Responsive User Interface
- 📄 Swagger API Documentation
- 🌐 Deployed using Vercel + Render + Neon PostgreSQL

---

# 🚀 Live Demo

| Service | Link |
|----------|------|
| 🌍 Frontend | https://springboot-react-ecommerce-project-alpha.vercel.app |
| ⚙ Backend API | https://ecommerce-backend-o9vh.onrender.com/|
| 📄 Swagger Documentation | https://ecommerce-backend-o9vh.onrender.com/swagger-ui/index.html#/ |
| Health Check | https://ecommerce-backend-o9vh.onrender.com/actuator/health | 



---

# 🏗 System Architecture

```text
                React + Vite
                      │
                      ▼
             Spring Boot REST API
                      │
      ┌───────────────┼────────────────┐
      ▼               ▼                ▼
 PostgreSQL      Cloudinary      Google Gemini
   (Neon)          Images            AI
      │
      ▼
  Brevo Email Service
```

---

# 👥 User Roles

## 👤 Customer

- User Registration & Login
- Google OAuth Login
- Browse Products
- Search Products
- Filter Products
- View Product Details
- Add to Cart
- Place Orders
- Review Purchased Products
- Manage Profile

---

## 🛍 Merchant

- Merchant Dashboard
- AI Product Generation
- Product CRUD Operations
- Multiple Image Upload
- Inventory Management
- Order Management
- Product Analytics

---

## 🛠 Administrator

- Admin Dashboard
- User Management
- Merchant Management
- Category Management
- Product Monitoring
- Order Monitoring
- Platform Administration

---

# 🤖 Artificial Intelligence Features

CommerceHub integrates **Google Gemini AI** to automate product creation and improve merchant productivity.

### AI Capabilities

- 🖼 Product Identification from Images
- 📝 AI Generated Product Description
- 📋 AI Generated Product Specifications
- ⭐ AI Generated Feature Highlights
- 🔍 AI Assisted Product Understanding
- 📈 SEO Friendly Product Information
- ⚡ Automatic Product Data Generation

### AI Workflow


Merchant Uploads Images
            │
            ▼
     Google Gemini AI
            │
            ▼
 Product Recognition
            │
            ▼
 Description Generation
            │
            ▼
 Specifications Generation
            │
            ▼
 Feature Highlights
            │
            ▼
 Product Saved to Database

---

# 🛠 Technology Stack

## Backend

| Technology | Purpose |
|------------|----------|
| Java 21 | Programming Language |
| Spring Boot | Backend Framework |
| Spring Security | Authentication & Authorization |
| Spring Data JPA | Database ORM |
| Hibernate | Persistence Layer |
| Maven | Dependency Management |
| JWT | Secure Authentication |
| Google OAuth2 | Social Login |
| Google Gemini API | AI Product Generation |
| Cloudinary | Image Storage |
| Brevo | Email OTP Service |
| Swagger / OpenAPI | API Documentation |

---

## Frontend

| Technology | Purpose |
|------------|----------|
| React | UI Library |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| React Router | Routing |
| Axios | API Communication |
| Lucide React | Icons |

---

## Database

| Technology | Purpose |
|------------|----------|
| PostgreSQL | Primary Database |
| Neon | Cloud Database |

---

## Deployment

| Service | Purpose |
|----------|----------|
| Vercel | Frontend Hosting |
| Render | Backend Hosting |
| Neon | Cloud Database |
| Cloudinary | Image Hosting |

---

# 📂 Project Structure

```
springboot-react-ecommerce-project
│
│
├── backend/
│   ├── README.md
│   └── assets/        ✅ Backend screenshots
│
├── frontend/
|   ├── README.md
|   └── assets/        ✅ Frontend screenshots
│   
└── README.md
```

---

# 📚 Project Documentation

For detailed implementation and architecture please refer to the module specific documentation.

### 📦 Backend Documentation

backend/README.md

Contains:

- Spring Boot Architecture
- REST APIs
- Security
- JWT
- OAuth2
- Database Design
- Entity Relationship
- AI Integration
- Cloudinary
- Swagger APIs
- Deployment

---

### 🎨 Frontend Documentation

frontend/README.md

Contains:

- React Architecture
- Routing
- Components
- State Management
- API Integration
- Responsive UI
- Dashboard Pages
- Folder Structure

---

# 🌟 Major Features

| Module | Status |
|---------|--------|
| User Authentication | ✅ |
| Google OAuth Login | ✅ |
| Email OTP Verification | ✅ |
| JWT Security | ✅ |
| Role Based Authorization | ✅ |
| AI Product Generation | ✅ |
| Merchant Dashboard | ✅ |
| Admin Dashboard | ✅ |
| Product Management | ✅ |
| Category Management | ✅ |
| Image Upload | ✅ |
| Cloudinary Integration | ✅ |
| Product Search | ✅ |
| Filtering | ✅ |
| Pagination | ✅ |
| Shopping Cart | ✅ |
| Orders | ✅ |
| Product Reviews | ✅ |
| Responsive Design | ✅ |
| Swagger Documentation | ✅ |

---

# 📊 Project Statistics

- 👨‍💻 Architecture: Full Stack
- 🏗 Backend: Spring Boot
- 🎨 Frontend: React
- 🤖 AI Powered: Yes
- 👥 Multi Role Platform
- 📦 REST APIs
- ☁ Cloud Deployment
- 🔐 Secure Authentication
- 📱 Responsive Design
- 🌍 Production Inspired Project

---

# ⚡ Quick Start

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/PRAHLAD09-dev/springboot-react-ecommerce-project.git

cd springboot-react-ecommerce-project
```

---

## 2️⃣ Backend Setup

```bash
cd backend
```

Follow the backend setup guide:

📄 **backend/README.md**

---

## 3️⃣ Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Runs on:

```
http://localhost:5173
```

Complete frontend documentation is available here:

📄 **frontend/README.md**

---

# 🌐 Deployment

| Platform | Service |
|----------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | Neon PostgreSQL |
| Image Storage | Cloudinary |
| Email Service | Brevo |
| AI Provider | Google Gemini |

---

# 🔒 Security Features

- JWT Authentication
- Role Based Authorization
- Password Encryption (BCrypt)
- Google OAuth2 Login
- Email OTP Verification
- Protected REST APIs
- CORS Configuration
- Secure Cloud Image Storage

---

# 🚀 Upcoming Features

- 💳 Stripe Payment Gateway
- ❤️ Wishlist
- 📱 Progressive Web App (PWA)
- 💬 Live Chat Support
- 📊 Sales Analytics Dashboard
- 📈 Merchant Reports
- 🎟 Coupon & Discount System
- 🌙 Dark Mode
- 🌎 Multi Language Support

---

# 🤝 Contributing

Contributions are welcome.

If you would like to improve this project:

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to GitHub

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# 📄 License

This project is developed for learning, portfolio, and educational purposes.

---

# 👨‍💻 Developer

## Prahlad Bhakat

Backend Developer | Java | Spring Boot | React

Passionate about building scalable backend systems, secure REST APIs, and AI-powered web applications.

---

# 📬 Connect With Me

GitHub

```
https://github.com/PRAHLAD09-dev
```

LinkedIn

```
https://www.linkedin.com/in/prahlad-bhakat/
```

Email

```
prahladbhakat05@gmail.com
```

---

# ⭐ Support

If you found this project useful, please consider giving it a ⭐ on GitHub.

It helps motivate further improvements and supports my open-source journey.

---

<div align="center">

## ⭐ Thank You for Visiting ⭐

Made with ❤️ using

**Java • Spring Boot • React • PostgreSQL • Gemini AI**

</div>