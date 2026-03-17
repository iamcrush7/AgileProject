# User Stories for NE Connect Platform - Sprint 1

## User Story 1: Customer Registration and Login
**As a** potential customer  
**I want to** register an account and log in to the platform  
**So that** I can access the service booking features  

**Acceptance Criteria:**
- User can fill registration form with name, email, password
- Account is created with 'user' role and 'active' status
- User can log in with email/password
- Upon login, redirected to user dashboard
- Invalid credentials show error message

## User Story 2: Service Provider Registration and Approval
**As a** service provider  
**I want to** register my business and wait for admin approval  
**So that** I can offer services on the platform  

**Acceptance Criteria:**
- Provider can register with company details
- Account created with 'provider' role and 'pending' status
- Provider redirected to waiting approval page
- Admin can approve/reject provider applications
- Approved providers get 'active' status and access to provider dashboard

## User Story 3: Admin Provider Management
**As an** admin  
**I want to** view and manage provider approval requests  
**So that** I can control who can offer services on the platform  

**Acceptance Criteria:**
- Admin can log in with admin credentials
- Admin dashboard shows list of pending providers
- Admin can approve or reject each provider
- Approved providers status changes to 'active'
- Rejected providers status remains 'pending' or gets blocked
