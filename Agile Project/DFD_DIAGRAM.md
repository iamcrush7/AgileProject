# Data Flow Diagram - NE Connect Platform (Sprint 1 Focus)

## Context Level DFD (Level 0)

```
┌─────────────────────────────────────────────────────────────┐
│                    NE CONNECT PLATFORM                      │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   CUSTOMER  │    │  PROVIDER   │    │    ADMIN    │     │
│  │             │    │             │    │             │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│          │                   │                   │         │
│          ▼                   ▼                   ▼         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                SYSTEM PROCESSES                     │   │
│  │  ├─ User Registration & Authentication             │   │
│  │  ├─ Provider Approval Process                      │   │
│  │  └─ Admin Management                               │   │
│  └─────────────────────────────────────────────────────┘   │
│          │                   │                   │         │
│          ▼                   ▼                   ▼         │
└──────────┼───────────────────┼───────────────────┼─────────┘
           │                   │                   │
           ▼                   ▼                   ▼
    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
    │   DATABASE  │    │   DATABASE  │    │   DATABASE  │
    │  (Users)    │    │ (Providers) │    │  (System)  │
    └─────────────┘    └─────────────┘    └─────────────┘
```

## Level 1 DFD - User Registration Process

```
CUSTOMER/PROVIDER                    SYSTEM                          DATABASE
      │                               │                               │
      │  1. Submit Registration Data  │                               │
      │──────────────────────────────►│                               │
      │                               │  2. Validate Input           │
      │                               │                               │
      │                               │  3. Check Email Uniqueness   │
      │                               │◄──────────────────────────────┤
      │                               │                               │
      │                               │  4. Hash Password            │
      │                               │                               │
      │                               │  5. Create User Record       │
      │                               │──────────────────────────────►│
      │                               │                               │
      │  6. Registration Response     │                               │
      │◄──────────────────────────────┤                               │
      │                               │                               │
      │  7. Redirect Based on Role    │                               │
      │                               │                               │
```

## Level 1 DFD - Login Process

```
USER                              SYSTEM                          DATABASE
      │                               │                               │
      │  1. Submit Login Credentials  │                               │
      │──────────────────────────────►│                               │
      │                               │  2. Query User by Email      │
      │                               │◄──────────────────────────────┤
      │                               │                               │
      │                               │  3. Verify Password          │
      │                               │                               │
      │                               │  4. Check User Status         │
      │                               │                               │
      │                               │  5. Set Session Variables    │
      │                               │                               │
      │  6. Login Response            │                               │
      │◄──────────────────────────────┤                               │
      │                               │                               │
      │  7. Redirect to Dashboard     │                               │
      │                               │                               │
```

## Level 1 DFD - Provider Approval Process

```
ADMIN                             SYSTEM                          DATABASE
      │                               │                               │
      │  1. Request Pending Providers │                               │
      │──────────────────────────────►│                               │
      │                               │  2. Query Pending Providers  │
      │                               │◄──────────────────────────────┤
      │                               │                               │
      │                               │  3. Display Provider List    │
      │                               │                               │
      │  4. Admin Decision (Approve/Reject)                         │
      │──────────────────────────────►│                               │
      │                               │  5. Update Provider Status   │
      │                               │──────────────────────────────►│
      │                               │                               │
      │  6. Confirmation Response     │                               │
      │◄──────────────────────────────┤                               │
      │                               │                               │
```

## Data Stores Legend:
- **Users Table**: Stores user accounts, roles, status
- **Providers Table**: Stores provider profiles linked to users
- **System Sessions**: Temporary session data for authentication

## Data Flows Legend:
- Solid arrows: Data flow between processes
- Dashed arrows: Control flow (decisions, redirects)
