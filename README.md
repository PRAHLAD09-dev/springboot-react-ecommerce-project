# Spring Boot E-Commerce Backend

A production-level E-Commerce backend built using Spring Boot with authentication, role-based workflows, OTP verification, notifications, and complete order lifecycle.

---

## Live Demo

- Base URL: https://ecommerce-backend-o9vh.onrender.com  
- Swagger UI: https://ecommerce-backend-o9vh.onrender.com/swagger-ui/index.html  
- Health Check: https://ecommerce-backend-o9vh.onrender.com/actuator/health  

---

## Tech Stack

- Java  
- Spring Boot  
- Spring Security (JWT)  
- Spring Data JPA  
- MySQL  
- Maven  
- Render  

---

## Roles

### USER
- Register / Login  
- Manage profile  
- Add to cart  
- Place order  
- Track order  
- Delete account (OTP)  

### MERCHANT
- Register (needs admin approval)  
- Manage profile  
- View orders  
- Ship orders  

### ADMIN
- Approves merchants  
- Blocks / Unblocks merchants  
- Confirms orders  

---

## Authentication

- JWT-based authentication  
- Role-based authorization  
- BCrypt password encryption  
- Stateless session  

---

##  OTP System

OTP-based verification is implemented to secure sensitive user actions.

### Used in:

- User Registration (email verification ready structure)
- Account Deletion (User & Merchant)
- Password Reset (structure ready / extendable)

### Flow

- User requests action  
- OTP is generated and stored  
- OTP is sent via email  
- User submits OTP  
- OTP is verified  
- Action is executed  

### Features

- Expiry-based OTP validation  
- Type-based OTP (REGISTER, DELETE_ACCOUNT, etc.)  
- Prevents unauthorized critical actions

---

## Notification System

### Notifications triggered on:

- User registration  
- Merchant registration  
- Account deletion  
- Order placed  
- Order confirmed  
- Order shipped  
- Out for delivery  
- Order delivered  
- Payment successful  
- Merchant approval  

- All notifications are stored in database  

---

## Product Module

- Add product  
- Update product  
- Delete product  
- Category support  

⚠️ Note: Image upload not implemented  

---

## Cart Module

- Add to cart  
- Update quantity  
- Remove item  
- View cart  

---

## Order Module

### Flow

- User places order  
- Cart is cleared  
- Admin confirms order  
- Merchant ships order  
- Order delivered  

### Order Status Lifecycle

CREATED  
↓  
CONFIRMED  
↓  
SHIPPED  
↓  
OUT_FOR_DELIVERY  
↓  
DELIVERED  

---

## Payment Module (Mock)

- Payment processing simulation  

### Status

- PENDING  
- SUCCESS  
- FAILED  

---

## Role-Based Workflow

### USER FLOW
- Register → Login → Add to Cart → Place Order → Track Order → Delete Account  

### MERCHANT FLOW
- Register → Wait for Approval → Login → View Orders → Ship Orders  

### ADMIN FLOW
- Approve Merchant → Manage Orders → Confirm Orders  

---

## Important APIs

### Auth
- POST /api/auth/user/register  
- POST /api/auth/login  

### User
- GET /api/user/profile  
- PUT /api/user/profile  
- POST /api/user/delete/request  
- DELETE /api/user/delete  

### Merchant
- GET /api/merchant/profile  
- PUT /api/merchant/profile  

### Orders
- POST /api/orders  
- GET /api/orders/track/{orderId}  

### Payment
- POST /api/payments/pay  

---

## How to Test

- Open Swagger UI  
- Register user  
- Login and get JWT token  
- Use token in header  

Authorization: Bearer <token>  

- Test APIs  

---

## Deployment

- Hosted on Render  
- Cold start may occur  
- MySQL database used  

---

## Learnings

- Implemented JWT authentication  
- Designed role-based system  
- Built OTP verification  
- Integrated notification system  
- Handled deployment debugging  

---

## Author

Prahlad Bhakat  
Java Backend Developer 