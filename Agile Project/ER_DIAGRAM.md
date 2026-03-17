# Entity Relationship Diagram - NE Connect Platform

```
┌─────────────────┐       ┌─────────────────┐
│     users       │       │   providers     │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │◄──────┤ id (PK)         │
│ name            │       │ user_id (FK)    │
│ email (UNIQUE)  │       │ company_name    │
│ password        │       │ verification    │
│ role            │       │   _status       │
│ status          │       │ created_at      │
│ created_at      │       │ updated_at      │
│ updated_at      │       └─────────────────┘
└─────────────────┘               │
          │                       │
          │                       │
          ▼                       ▼
┌─────────────────┐       ┌─────────────────┐
│   bookings      │       │provider_services│
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ user_id (FK)    │       │ provider_id (FK)│
│ provider_id (FK)│       │ service_id (FK) │
│ service_id (FK) │       │ price           │
│ booking_date    │       └─────────────────┘
│ status          │
│ created_at      │       ┌─────────────────┐
└─────────────────┘       │   services      │
          │               ├─────────────────┤
          │               │ id (PK)         │
          ▼               │ name            │
┌─────────────────┐       │ description     │
│    reviews      │       │ category        │
├─────────────────┤       │ created_at      │
│ id (PK)         │       └─────────────────┘
│ booking_id (FK) │
│ rating          │
│ comment         │
│ created_at      │
└─────────────────┘
```

## Relationships:
- **users** 1:N **providers** (One user can have one provider profile)
- **users** 1:N **bookings** (One user can make many bookings)
- **providers** 1:N **provider_services** (One provider can offer many services)
- **services** 1:N **provider_services** (One service can be offered by many providers)
- **services** 1:N **bookings** (One service can have many bookings)
- **bookings** 1:N **reviews** (One booking can have many reviews)

## Key Constraints:
- Users must have unique email addresses
- Providers are linked to users via user_id
- Bookings link users, providers, and services
- Reviews are tied to specific bookings
