## Spring Boot E-Commerce Backend

A Spring Boot based E-Commerce backend system implementing authentication, product management, cart functionality and order flow.

This project is built to simulate a real world backend architecture used in modern e-commerce platforms.

---

## Tech Stack

### Backend

- Java
- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data JPA

### Database

- MySQL

### Tools

- Maven
- Postman
- Git

---

## Roles

### The system supports three roles:

- USER (Customer)
- MERCHANT (Seller)
- ADMIN

Each role has different permissions and API access.

---

## Core Modules

- Authentication & Security
- User Management
- Merchant Management
- Product Management
- Cart System
- Address Management
- Order Processing
- Payment (Mock)
- Order Tracking
- Admin Panel
- Global Exception Handling
- Swagger Documentation

---

## Implemented Features

### Authentication

- User signup/login
- Merchant signup/login
- Password encryption (BCrypt)
- JWT token authentication

### Product Management

- Add product
- Update product
- Delete product
- Product category support

### Product Search

- Pagination
- Filtering
- Sorting
- Search API

### Cart System

- Add product to cart
- Update quantity
- Remove item
- View cart

---

## Database Tables

- user
- merchant
- product
- category
- cart
- cart_item

---

## Project Architecture

Controller
→ Service
→ Repository
→ Database

---

## Running the Project

1. Clone the repository

git clone <repo-link>

2. Configure database in "application.properties"

spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db
spring.datasource.username=root
spring.datasource.password=yourpassword

3. Run the application

mvn spring-boot:run

Server will start at

http://localhost:8080

---

## Development Progress

Day 1 — Project setup
Day 2 — Entity modeling
Day 3 — Authentication APIs
Day 4 — JWT implementation
Day 5 — Spring Security configuration
Day 6 — Product module
Day 7 — Product search & pagination
Day 8 — Cart module
Day 9 — Address module (next)

---

## Author

Prahlad Bhakat
Java Backend Developer