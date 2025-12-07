# 🚗 Vehicle Rental System – Backend API

**Live URL:** https://vehicle-rental-system-one.vercel.app/

A scalable, secure, and modular backend API for managing a complete vehicle rental system. This project provides robust functionality for vehicle inventory management, customer handling, booking workflows, and role-based authentication.

---

## 📌 Features

- **Vehicle Management**

  - Add, update, view, and delete vehicles
  - Real-time availability tracking

- **User Management**

  - Admin and customer role handling
  - Secure profile updates

- **Booking System**

  - Create, cancel, and return bookings
  - Automatic cost calculation
  - Vehicle availability auto-updates

- **Authentication & Authorization**

  - JWT-based authentication
  - Secure role-based access control (RBAC)

- **Business Logic Enforcement**
  - Prevent deletion of users or vehicles with active bookings
  - Automatic auto-return of expired bookings

---

## 🛠️ Technology Stack

**Backend:**

- Node.js
- TypeScript
- Express.js

**Database:**

- PostgreSQL

**Security & Auth:**

- bcrypt (password hashing)
- jsonwebtoken (JWT authentication)

---

### Role Permissions

| Role     | Permissions                                         |
| -------- | --------------------------------------------------- |
| Admin    | Full system access to users, vehicles, and bookings |
| Customer | Can manage own profile and bookings                 |

---

## 🌐 API Overview

### Authentication

- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/signin`

### Vehicles

- `POST /api/v1/vehicles` (Admin only)
- `GET /api/v1/vehicles`
- `GET /api/v1/vehicles/:vehicleId`
- `PUT /api/v1/vehicles/:vehicleId` (Admin only)
- `DELETE /api/v1/vehicles/:vehicleId` (Admin only)

### Users

- `GET /api/v1/users` (Admin only)
- `PUT /api/v1/users/:userId`
- `DELETE /api/v1/users/:userId` (Admin only)

### Bookings

- `POST /api/v1/bookings`
- `GET /api/v1/bookings`
- `PUT /api/v1/bookings/:bookingId`

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/mdtanbirhossen/Vehicle-Rental-System.git
cd vehicle-rental-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a .env file in the root directory:

```bash
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/vehicle_rental
JWT_SECRET=your_jwt_secret_key
BCRYPT_SALT_ROUNDS=10

```

### 4. Run Database Migrations If Needed

```bash
# If using a migration tool
npm run migrate
```

### 5. Start the Development Server
```bash
npm run dev
```

## ✅ Business Rules

- Users cannot be deleted if they have active bookings.
- Vehicles cannot be deleted if they have active bookings.
- Booking status automatically changes to returned when rental period ends.
- Vehicle availability status updates automatically based on booking status.

### 👨‍💻 Author

#### **Project Name**: Vehicle Rental System

#### **Live URL**: https://vehicle-rental-system-one.vercel.app/