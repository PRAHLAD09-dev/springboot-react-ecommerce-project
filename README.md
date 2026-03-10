## Spring Boot E-Commerce Backend

A Spring Boot based E-Commerce backend system implementing authentication, product management, cart functionality and complete order flow.

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

The system supports three roles:

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
- Payment System (Mock)
- Order Tracking
- Admin Order Management
- Global Exception Handling
- Swagger Documentation

---

## Implemented Features

### Authentication

- User signup/login
- Merchant signup/login
- Password encryption using BCrypt
- JWT token authentication
- Role based authorization

---

### Product Management

- Add product
- Update product
- Delete product
- Product category support

---

### Product Search

- Pagination
- Filtering
- Sorting
- Search API

---

### Cart System

- Add product to cart
- Update quantity
- Remove item from cart
- View user cart

---

### Address Management

- Add delivery address
- Fetch saved addresses
- Multiple addresses per user

---

### Order Processing

- Place order from cart
- Order item generation
- Automatic cart cleanup after order placement
- Order history for users

---

### Order Tracking

The system provides a complete order tracking workflow similar to real-world e-commerce platforms.

Each order moves through multiple stages until delivery.

Order Status Lifecycle

CREATED
↓
CONFIRMED
↓
SHIPPED
↓
OUT_FOR_DELIVERY
↓
DELIVERED

Cancellation Flow

CREATED
↓
CANCELLED

---

### Role Based Order Workflow

USER
- Place order
- Track order status
- View order history

ADMIN
- Confirm orders
- Cancel orders

MERCHANT
- View orders related to their products
- Ship confirmed orders

SYSTEM
- Update delivery status automatically

---

### Order Tracking API

Users can track the status of their order using the following endpoint

GET /api/orders/track/{orderId}

This endpoint returns the current order status along with order details.


Example Response

{
  "id": 5,
  "status": "SHIPPED",
  "totalPrice": 480000
}

---

### Merchant Order Dashboard

Merchants can view orders that contain their products using

GET /api/orders/merchant

This allows merchants to manage and ship orders related to their products.


---

### Payment System (Mock)

A mock payment module is implemented to simulate real payment processing.

Payment Flow

User places order
↓
Payment initiated
↓
Payment status stored
↓
Order marked as paid

Payment Status Types

PENDING
SUCCESS
FAILED


Example Payment Endpoint

POST /api/payments/pay


Example Payment Response

{
  "paymentId": 10,
  "orderId": 5,
  "status": "SUCCESS"
}


### Database Tables

users
products
categories
cart
cart_items
orders
order_items
addresses
payments

---

### Project Architecture

Controller
↓
Service
↓
Repository
↓
Database

This layered architecture ensures separation of concerns and maintainable backend design.

---

### Running the Project

1 Clone the repository

git clone <repo-link>

2 Configure database in application.properties

spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db
spring.datasource.username=root
spring.datasource.password=yourpassword

3 Run the application

mvn spring-boot:run

Server will start at

http://localhost:8080

---

### Development Progress

Day 1  — Project setup
Day 2  — Entity modeling
Day 3  — Authentication APIs
Day 4  — JWT implementation
Day 5  — Spring Security configuration
Day 6  — Product module
Day 7  — Product search & pagination
Day 8  — Cart module
Day 9  — Address module
Day 10 — Order placement system
Day 11 — Order status workflow & merchant order management
Day 12 — Payment system (mock)

---

### Author

Prahlad Bhakat  
Java Backend Developer