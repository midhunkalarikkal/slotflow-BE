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
    |   app.ts
    |   express.d.ts
    |   server.ts
    |   
    +---application
    |   +---admin-use.case
    |   |   |   adminPayment.use-case.ts
    |   |   |   adminPlan.use-case.ts
    |   |   |   adminService.use-case.ts
    |   |   |   adminSubscription.use-case.ts
    |   |   |   adminUser.use-case.ts
    |   |   |   
    |   |   \---adminProvider
    |   |           adminProvider.use-case.ts
    |   |           adminProviderProfile.use-case.ts
    |   |           
    |   +---auth-use.case
    |   |       checkUserStatus.use-case.ts
    |   |       login.use-case.ts
    |   |       register.use-case.ts
    |   |       resend-otp.use-case.ts
    |   |       updatePassword.use-case.ts
    |   |       verify-otp.use-case.ts
    |   |       
    |   +---cron-job.use-case
    |   |       updateBookingStatusCron.use-case.ts
    |   |       
    |   +---provider-use.case
    |   |       providerAddress.use-case.ts
    |   |       providerAppServices.use-case.ts
    |   |       providerBooking.use-case.ts
    |   |       providerPayment.use-case.ts
    |   |       providerPlan.use-case.ts
    |   |       providerProfile.use-case.ts
    |   |       providerService.use-case.ts
    |   |       providerServiceAvailability.use-case.ts
    |   |       providerStripeSubscription.use-case.ts
    |   |       providerSubscription.use-case.ts
    |   |       providerTrailSubscription.use-case.ts
    |   |       
    |   \---user-use.case
    |           usePayment.use-case.ts
    |           userAddress.use-case.ts
    |           userAppService.use-case.ts
    |           userBooking.use-case.ts
    |           userProfile.use-Case.ts
    |           userProvider.use-case.ts
    |           userStripeBooking.use-case.ts
    |           
    +---config
    |   |   aws_s3.ts
    |   |   env.ts
    |   |   
    |   \---database
    |       \---mongodb
    |               mongodb.config.ts
    |               
    +---domain
    |   +---entities
    |   |       address.entity.ts
    |   |       booking.entity.ts
    |   |       payment.entity.ts
    |   |       plan.entity.ts
    |   |       provider.entity.ts
    |   |       providerService.entity.ts
    |   |       service.entity.ts
    |   |       serviceAvailability.entity.ts
    |   |       subscription.entity.ts
    |   |       user.entity.ts
    |   |       
    |   \---repositories
    |           IAddress.repository.ts
    |           IBooking.repository.ts
    |           IPayment.repository.ts
    |           IPlan.repository.ts
    |           IProvider.repository.ts
    |           IProviderService.repository.ts
    |           IService.repository.ts
    |           IServiceAvailability.repository.ts
    |           ISubscription.repository.ts
    |           IUser.repository.ts
    |           
    +---infrastructure
    |   +---cron-jobs
    |   |       updateBookingsCron.ts
    |   |       
    |   +---database
    |   |   +---address
    |   |   |       address.model.ts
    |   |   |       address.repository.impl.ts
    |   |   |       
    |   |   +---appservice
    |   |   |       service.model.ts
    |   |   |       service.repository.impl.ts
    |   |   |       
    |   |   +---booking
    |   |   |       booking.model.ts
    |   |   |       booking.repository.impl.ts
    |   |   |       
    |   |   +---payment
    |   |   |       payment.model.ts
    |   |   |       payment.repository.impl.ts
    |   |   |       
    |   |   +---plan
    |   |   |       plan.model.ts
    |   |   |       plan.repository.impl.ts
    |   |   |       
    |   |   +---provider
    |   |   |       provider.model.ts
    |   |   |       provider.repository.impl.ts
    |   |   |       
    |   |   +---providerService
    |   |   |       providerService.model.ts
    |   |   |       providerService.repository.impl.ts
    |   |   |       
    |   |   +---serviceAvailability
    |   |   |       serviceAvailability.model.ts
    |   |   |       serviceAvailability.repository.impl.ts
    |   |   |       
    |   |   +---subscription
    |   |   |       subscription.model.ts
    |   |   |       subscription.repository.impl.ts
    |   |   |       
    |   |   \---user
    |   |           user.model.ts
    |   |           user.repository.impl.ts
    |   |           
    |   +---dtos
    |   |       admin.dto.ts
    |   |       auth.dto.ts
    |   |       common.dto.ts
    |   |       provider.dto.ts
    |   |       user.dto.ts
    |   |       
    |   +---error
    |   |       error.ts
    |   |       
    |   +---helpers
    |   |       constants.ts
    |   |       helper.ts
    |   |       
    |   +---lib
    |   |       redis.ts
    |   |       
    |   +---security
    |   |       jwt.ts
    |   |       password-hashing.ts
    |   |       
    |   +---services
    |   |       otp.service.ts
    |   |       
    |   +---validator
    |   |       validator.ts
    |   |       
    |   \---zod
    |           admin.zod.ts
    |           auth.zod.ts
    |           common.zod.ts
    |           provider.zod.ts
    |           user.zod.ts
    |           
    \---interface
        +---admin
        |       admin.routes.ts
        |       adminPayment.Controller.ts
        |       adminPlan.Controller.ts
        |       adminProvider.controller.ts
        |       adminService.Controller.ts
        |       adminSubscription.Controller.ts
        |       adminUser.Controller.ts
        |       
        +---auth
        |       auth.controller.ts
        |       auth.routes.ts
        |       
        +---middleware
        |       auth.middleware.ts
        |       
        +---provider
        |       provider.router.ts
        |       providerAddress.controller.ts
        |       providerAppService.controller.ts
        |       providerBooking.controller.ts
        |       providerPayment.controller.ts
        |       providerPlan.controller.ts
        |       providerProfile.controller.ts
        |       providerService.controller.ts
        |       providerServiceAvailability.controller.ts
        |       providerSubscription.controller.ts
        |       
        \---user
                user.routes.ts
                userAddress.controller.ts
                userAppService.controller.ts
                userBooking.controller.ts
                userPayment.controller.ts
                userProfile.controller.ts
                userProvider.controller.ts

```

