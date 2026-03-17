# NE Connect System Architecture

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      NE CONNECT PLATFORM                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ index.   │  │ login.   │  │register. │  │services. │        │
│  │   php    │  │   php    │  │   php    │  │   php    │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│       ↓            ↓             ↓                              │
│  ┌────────────────────────────────────┐                        │
│  │  FRONTEND LAYER                    │                        │
│  │  - HTML Forms                      │                        │
│  │  - AJAX (script.js)                │                        │
│  │  - CSS Styling (style.css)         │                        │
│  └────────────────────────────────────┘                        │
│       ↓             ↓              ↓                            │
│  ┌────────────────────────────────────┐                        │
│  │  REQUEST HANDLERS (PHP)            │                        │
│  │  ├─ login_handler.php              │                        │
│  │  ├─ register_handler.php           │                        │
│  │  └─ logout.php                     │                        │
│  └────────────────────────────────────┘                        │
│       ↓                                                        │
│  ┌────────────────────────────────────┐                        │
│  │  SESSION MANAGEMENT (session.php)  │                        │
│  │  ├─ Authentication                 │                        │
│  │  ├─ Authorization (Role-checking)  │                        │
│  │  └─ Access Control                 │                        │
│  └────────────────────────────────────┘                        │
│       ↓                                                        │
│  ┌────────────────────────────────────┐                        │
│  │  DATABASE (MySQL)                  │                        │
│  │  ├─ users (core table)             │                        │
│  │  ├─ providers                      │                        │
│  │  ├─ services                       │                        │
│  │  ├─ bookings                       │                        │
│  │  └─ reviews                        │                        │
│  └────────────────────────────────────┘                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow Diagram

```
USER VISITS INDEX.PHP
        ↓
   ┌────────────────────┐
   │ Check Session      │
   │ isLoggedIn()?      │
   └────────────────────┘
    ↙               ↘
  YES               NO
   ↓                 ↓
Show User Info    Show Login Link
Display Role      (Regular Navbar)
Logout Button
```

---

## Registration Process

```
┌─────────────────────────────────────────────────────────┐
│              REGISTRATION PAGE (register.php)           │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Fill Form:                                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Name:     [____________]                        │   │
│  │ Email:    [____________]                        │   │
│  │ Password: [____________]                        │   │
│  │ Confirm:  [____________]                        │   │
│  │                                                 │   │
│  │ Account Type:  ○ Customer  ○ Provider          │   │
│  │                                                 │   │
│  │ [Submit Button]                                │   │
│  └─────────────────────────────────────────────────┘   │
│                      ↓ AJAX                             │
│           (register_handler.php)                        │
│                      ↓                                  │
│          Validate Input (client-side)                  │
│          ├─ Email format                               │
│          ├─ Password strength (6+ chars)               │
│          ├─ Passwords match                            │
│          └─ Name length (3+ chars)                     │
│                      ↓                                  │
│          Server Validation & Processing                │
│          ├─ Check duplicate email                      │
│          ├─ Hash password                              │
│          ├─ Assign role & status:                      │
│          │  • Customer → status='active'               │
│          │  • Provider → status='pending'              │
│          └─ Create database records                    │
│                      ↓                                  │
│              SUCCESS RESPONSE                          │
│                      ↓                                  │
│    ┌─────────────────┴──────────────────┐             │
│    ↓                                    ↓              │
│  CUSTOMER                           PROVIDER           │
│  ├─ Active                          ├─ Pending        │
│  ├─ Redirect to:                    ├─ Redirect to:   │
│  │  user-dashboard.php              │  waiting-appro- │
│  │                                  │  val.php        │
│  └─ Can use platform                │                 │
│     immediately                     └─ Wait for admin │
│                                       approval        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Login Process

```
┌─────────────────────────────────────────────────────────┐
│              LOGIN PAGE (login.php)                     │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────────────────────────┐                  │
│  │ Email:    [________________]      │                  │
│  │ Password: [________________]      │                  │
│  │                                  │                  │
│  │  [Login Button]                  │                  │
│  └──────────────────────────────────┘                  │
│            ↓ AJAX                                       │
│     (login_handler.php)                                │
│            ↓                                            │
│     Query User by Email                               │
│            ↓                                            │
│     ┌──────────────────────────┐                      │
│     │ User Found?              │                      │
│     └──────────────────────────┘                      │
│      ↙              ↖                                  │
│    NO              YES                                │
│     ↓               ↓                                  │
│   ERROR      Verify Password                         │
│   "Invalid   └──────────────┐                        │
│    email or    │Match?                               │
│    password"   ├─ YES → Check Status                │
│                ├─ NO  → ERROR "Invalid email..."    │
│                │                                     │
│                └─────────────────────┐               │
│                         ↓             │               │
│                    ┌─────────────┬────┴────┐          │
│                    ↓             ↓         ↓          │
│                 ACTIVE       PENDING   BLOCKED      │
│                    ↓             ↓         ↓          │
│               Check Role  Provider    ERROR          │
│               Route by:   Waiting     "Account       │
│               ├─ admin→   approval    blocked"      │
│               │  admin.php page       Logout        │
│               ├─ provider→           (exit)         │
│               │  provider-            │             │
│               │  dashboard.php        ↓             │
│               └─ user→               Home Page      │
│                  user-dashboard.php                 │
│                                                      │
└─────────────────────────────────────────────────────────┘
```

---

## Role-Based Access Control

```
┌──────────────────────────────────────────────────────────┐
│         ROLE-BASED ACCESS CONTROL HIERARCHY              │
├──────────────────────────────────────────────────────────┤
│                                                            │
│  ┌────────────────┐   ┌────────────────┐                │
│  │     ADMIN      │   │    PROVIDER    │                │
│  │    (role:     │   │    (role:      │                │
│  │     admin)    │   │     provider)  │                │
│  └────────────────┘   └────────────────┘                │
│         ↓                      ↓                         │
│  ├─ Full Access        ├─ Dashboard Access             │
│  ├─ admin.php          ├─ Services Management          │
│  ├─ User Management    ├─ Booking Management           │
│  ├─ Provider Approval  ├─ Analytics (future)           │
│  └─ System Settings    └─ provider-dashboard.php       │
│                                                            │
│  ┌────────────────┐                                     │
│  │   CUSTOMER     │                                     │
│  │   (role:      │                                     │
│  │    user)      │                                     │
│  └────────────────┘                                     │
│         ↓                                               │
│  ├─ Browse Services                                     │
│  ├─ Make Bookings                                       │
│  ├─ View Profile                                        │
│  ├─ Write Reviews                                       │
│  └─ user-dashboard.php                                 │
│                                                            │
│  ┌────────────────┐                                     │
│  │  UNAUTHENTICATED   │                                 │
│  └────────────────┘                                     │
│         ↓                                               │
│  ├─ View Home Page (index.php)                         │
│  ├─ View Services Catalog (services.php)              │
│  ├─ Cannot Access Dashboards                           │
│  └─ Cannot Make Bookings                              │
│                                                            │
└──────────────────────────────────────────────────────────┘
```

---

## Database Schema Diagram

```
users
├─ id (PK)
├─ name
├─ email (UNIQUE)
├─ password (hashed)
├─ role (ENUM: user, provider, admin)
├─ status (ENUM: active, pending, blocked)
├─ created_at
└─ updated_at
      │
      ├─────────────────┐
      │                 │
      ↓                 ↓
providers           bookings
├─ id (PK)         ├─ id (PK)
├─ user_id (FK)    ├─ user_id (FK)
├─ company_name    ├─ provider_id (FK)
├─ verification    ├─ service_id (FK)
│  _status         ├─ booking_date
├─ created_at      ├─ status
└─ updated_at      └─ created_at
      │
      ├──────────────────┐
      │                  │
      ↓                  ↓
provider_services    reviews
├─ id (PK)          ├─ id (PK)
├─ provider_id      ├─ booking_id (FK)
├─ service_id       ├─ rating
└─ price            ├─ comment
                    └─ created_at

services
├─ id (PK)
├─ name
├─ description
├─ category
└─ created_at
```

---

## Session Management

```
┌─────────────────────────────────────────────────────┐
│         SESSION VARIABLES ($_SESSION)               │
├─────────────────────────────────────────────────────┤
│                                                       │
│  When User Logs In Successfully:                    │
│                                                       │
│  $_SESSION['user_id']     = <user_id>              │
│  $_SESSION['name']        = <user_name>            │
│  $_SESSION['email']       = <user_email>           │
│  $_SESSION['role']        = <user_role>            │
│  $_SESSION['status']      = <user_status>          │
│  $_SESSION['provider_id'] = <provider_id>          │
│       (if provider)                                │
│                                                       │
│  When User Logs Out:                               │
│                                                       │
│  session_destroy()  ← Clears all variables        │
│                                                       │
│  Protected Pages Check:                            │
│                                                       │
│  if (!isLoggedIn()) {                              │
│      header('Location: index.php');                │
│      exit;                                          │
│  }                                                  │
│                                                       │
└─────────────────────────────────────────────────────┘
```

---

## File Organization

```
Agile Project/
│
├── 📄 Core Configuration
│   ├─ config.php          (Database connection)
│   └─ session.php         (Authentication functions)
│
├── 📄 Authentication
│   ├─ login.php           (Login form)
│   ├─ login_handler.php   (Login processing)
│   ├─ register.php        (Registration form)
│   ├─ register_handler.php (Registration processing)
│   └─ logout.php          (Logout handler)
│
├── 📄 Dashboard Pages
│   ├─ user-dashboard.php  (Customer dashboard)
│   ├─ provider-dashboard.php (Provider dashboard)
│   ├─ admin.php           (Admin dashboard)
│   └─ waiting-approval.php (Pending approval page)
│
├── 📄 Public Pages
│   ├─ index.php           (Home page)
│   └─ services.php        (Services catalog)
│
├── 📁 CSS
│   └─ style.css           (All styling including navbar)
│
├── 📁 JS
│   └─ script.js           (AJAX handlers)
│
├── 📁 Database
│   └─ schema.sql          (Database schema)
│
└── 📄 Documentation
    ├─ TESTING_GUIDE.md    (How to test)
    └─ IMPLEMENTATION_SUMMARY.md (What was built)
```

---

## Security Layers

```
┌─────────────────────────────────────────────────────┐
│          SECURITY IMPLEMENTATION LAYERS             │
├─────────────────────────────────────────────────────┤
│                                                       │
│  Layer 1: INPUT VALIDATION                         │
│  ├─ Email format check                             │
│  ├─ Password length validation (6+ chars)          │
│  ├─ Name length validation (3+ chars)              │
│  └─ Duplicate email detection                      │
│                                                       │
│  Layer 2: PASSWORD HASHING                         │
│  ├─ password_hash() for storage                    │
│  ├─ password_verify() for comparison               │
│  └─ Never stored as plaintext                      │
│                                                       │
│  Layer 3: SQL INJECTION PREVENTION                 │
│  ├─ Prepared statements for all queries            │
│  ├─ Parameter binding (?  placeholders)            │
│  └─ No direct string concatenation                 │
│                                                       │
│  Layer 4: SESSION SECURITY                         │
│  ├─ Session variables store user context           │
│  ├─ Session ID verified on protected pages         │
│  └─ Session destroyed on logout                    │
│                                                       │
│  Layer 5: ROLE-BASED ACCESS CONTROL                │
│  ├─ Role verification on each request              │
│  ├─ Unauthorized access redirected                 │
│  └─ Admin pages require admin role                 │
│                                                       │
│  Layer 6: ERROR HANDLING                           │
│  ├─ Generic error messages (no DB details)         │
│  ├─ Try-catch blocks for operations                │
│  └─ Graceful redirects for errors                  │
│                                                       │
└─────────────────────────────────────────────────────┘
```

---

## User Journey by Role

```
CUSTOMER JOURNEY
────────────────
┌─ Not Logged In ──→ Home Page ──→ Click Register
│
├─ Fill Form (select "Customer" role)
│
├─ Register → Instant Status: Active
│
├─ Redirect to user-dashboard.php
│
├─ Can:
│  • View profile
│  • Browse services
│  • Make bookings
│  • Write reviews
│
└─ Click Logout → Return to Home Page


PROVIDER JOURNEY
────────────────
┌─ Not Logged In ──→ Home Page ──→ Click Register
│
├─ Fill Form (select "Provider" role)
│
├─ Register → Initial Status: Pending
│
├─ Redirect to waiting-approval.php
│
├─ Waiting for Admin Approval...
│
├─ Admin approves in database (status → active)
│
├─ Provider logs in again
│
├─ Redirect to provider-dashboard.php
│
├─ Can:
│  • Manage services
│  • View bookings
│  • Update profile
│  • View reviews
│
└─ Click Logout → Return to Home Page


ADMIN JOURNEY
─────────────
├─ Login with admin@neconnect.com
│
├─ Redirect to admin.php
│
├─ Can:
│  • Approve/reject providers
│  • Manage users
│  • View all bookings
│  • System analytics
│  • Settings
│
└─ Click Logout → Return to Home Page
```

---

This architecture provides a **professional, secure, and scalable foundation** for the NE Connect platform with clear role separation and comprehensive authentication/authorization.
