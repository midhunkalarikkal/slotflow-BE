# 🧠 SlotFlow – Backend

SlotFlow is a full-featured appointment booking application designed to serve users, service providers, and admins. This repository contains the **monolithic backend server** for SlotFlow.

### Frontend Github Repo
https://github.com/midhunkalarikkal/Slotflow-FE

---

## 🚀 Tech Stack

- **Language**: TypeScript
- **Framework**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose)
- **Authentication**: JWT + Cookie-based sessions
- **Validation**: Zod
- **Cache**: Upstash Redis
- **File Storage**: AWS S3 Bucket
- **Architecture**: Clean Architecture (layered structure)
- **Scheduled Tasks**: Node Cron
- **Payment Gateway**: Integrated (Stripe or Razorpay, depending on implementation)

---

## 📂 Features in this Backend

### ✅ Core Functionalities
- **User & Provider Authentication**
  - Registration (with OTP)
  - Login (JWT + HttpOnly Cookies)
  - Logout
  - Password Update
- **Address Management**
- **Service & Availability Management**
- **Appointment Booking System**
  - Booking, Re-booking, Cancellation
  - Real-time status updates
- **Payment Integration**
  - Booking payments
  - Subscription plan payments
- **Admin Dashboard**
  - User/Provider management
  - Plan management
- **Subscriptions**
  - Plan selection & validation
- **Cron Jobs**
  - Auto-expire appointments
  - Periodic cleanup

---

## 🧱 Project Structure (Clean Architecture)

```
src
├── application
│ ├── admin-use.case
│ │ └── adminProvider
│ ├── auth-use.case
│ ├── cron-job.use-case
│ ├── provider-use.case
│ └── user-use.case
├── config
│ └── database
│ └── mongodb
├── domain
│ ├── entities
│ └── repositories
├── infrastructure
│ ├── cron-jobs
│ ├── database
│ │ ├── address
│ │ ├── appservice
│ │ ├── booking
│ │ ├── payment
│ │ ├── plan
│ │ ├── provider
│ │ ├── providerService
│ │ ├── serviceAvailability
│ │ ├── subscription
│ │ └── user
│ ├── dtos
│ ├── error
│ ├── helpers
│ ├── lib
│ ├── security
│ ├── services
│ ├── validator
│ └── zod
└── interface
├── admin
├── auth
├── middleware
├── provider
└── user
```

