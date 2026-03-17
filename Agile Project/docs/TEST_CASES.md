# Test Cases for Login System

## Pre-Setup Checklist

Before testing, ensure:
- [ ] XAMPP is running (Apache + MySQL)
- [ ] database_schema.sql has been executed in phpMyAdmin
- [ ] "agile" database exists with all tables

---

## Test Case 1: Admin Login

**Test ID**: TC-001
**Title**: Admin login with correct credentials
**Precondition**: Login page is accessible

**Steps**:
1. Navigate to http://localhost/Agile%20Project/login.php
2. Enter email: `admin@neconnect.com`
3. Enter password: `admin123`
4. Click "Login" button

**Expected Result**:
- Success popup appears with "Login Successful!"
- Page redirects to admin.php after 2 seconds
- Admin dashboard displays with "Manage Users", "Manage Services", etc.
- Navbar shows correct links

**Status**: ✓ Pass / ✗ Fail

---

## Test Case 2: Admin Login - Wrong Password

**Test ID**: TC-002
**Title**: Admin login with wrong password
**Precondition**: Login page is accessible

**Steps**:
1. Navigate to http://localhost/Agile%20Project/login.php
2. Enter email: `admin@neconnect.com`
3. Enter password: `wrongpassword`
4. Click "Login" button

**Expected Result**:
- Error message displays: "Invalid password"
- Page stays on login.php
- User is not redirected

**Status**: ✓ Pass / ✗ Fail

---

## Test Case 3: Login - User Not Found

**Test ID**: TC-003
**Title**: Login with non-existent user
**Precondition**: Login page is accessible

**Steps**:
1. Navigate to http://localhost/Agile%20Project/login.php
2. Enter email: `nonexistent@example.com`
3. Enter password: `anypassword`
4. Click "Login" button

**Expected Result**:
- Error message displays: "User not found"
- Page stays on login.php

**Status**: ✓ Pass / ✗ Fail

---

## Test Case 4: User Registration - New Customer

**Test ID**: TC-004
**Title**: Register new customer account
**Precondition**: Register page is accessible

**Steps**:
1. Navigate to http://localhost/Agile%20Project/register.php
2. Fill form:
   - Full Name: `John Doe`
   - Email: `john@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
   - User Type: Select "Customer"
3. Click "Register" button

**Expected Result**:
- Success message: "Registration successful! Please login."
- Page redirects to login.php after 2 seconds
- Can now login with john@example.com / password123

**Status**: ✓ Pass / ✗ Fail

---

## Test Case 5: User Registration - New Provider

**Test ID**: TC-005
**Title**: Register new provider account
**Precondition**: Register page is accessible

**Steps**:
1. Navigate to http://localhost/Agile%20Project/register.php
2. Fill form:
   - Full Name: `Jane Smith`
   - Email: `jane@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
   - User Type: Select "Provider"
3. Click "Register" button

**Expected Result**:
- Success message displays
- Page redirects to login.php
- Can login and access provider dashboard

**Status**: ✓ Pass / ✗ Fail

---

## Test Case 6: Registration - Password Mismatch

**Test ID**: TC-006
**Title**: Register with mismatched passwords
**Precondition**: Register page is accessible

**Steps**:
1. Navigate to http://localhost/Agile%20Project/register.php
2. Fill form:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm Password: `different123`
   - User Type: "Customer"
3. Click "Register" button

**Expected Result**:
- Error message: "Passwords do not match"
- Page stays on register.php
- User is not created

**Status**: ✓ Pass / ✗ Fail

---

## Test Case 7: Registration - Duplicate Email

**Test ID**: TC-007
**Title**: Register with already existing email
**Precondition**: User john@example.com already registered (from TC-004)

**Steps**:
1. Navigate to http://localhost/Agile%20Project/register.php
2. Fill form with:
   - Email: `john@example.com`
   - Other fields: valid data
3. Click "Register" button

**Expected Result**:
- Error message: "Email already exists"
- Page stays on register.php
- No duplicate user created

**Status**: ✓ Pass / ✗ Fail

---

## Test Case 8: Registration - Invalid Email

**Test ID**: TC-008
**Title**: Register with invalid email format
**Precondition**: Register page is accessible

**Steps**:
1. Navigate to http://localhost/Agile%20Project/register.php
2. Fill form:
   - Email: `notanemail`
   - Password: `password123`
3. Click "Register" button

**Expected Result**:
- Error message: "Invalid email format"
- Page stays on register.php

**Status**: ✓ Pass / ✗ Fail

---

## Test Case 9: Registration - Weak Password

**Test ID**: TC-009
**Title**: Register with password too short
**Precondition**: Register page is accessible

**Steps**:
1. Navigate to http://localhost/Agile%20Project/register.php
2. Fill form:
   - Email: `newuser@example.com`
   - Password: `pass` (4 characters)
   - Confirm Password: `pass`
3. Click "Register" button

**Expected Result**:
- Error message: "Password must be at least 6 characters long"
- User not created

**Status**: ✓ Pass / ✗ Fail

---

## Test Case 10: Login - Customer User

**Test ID**: TC-010
**Title**: Login as customer and access home page
**Precondition**: Customer account exists (from TC-004)

**Steps**:
1. Navigate to http://localhost/Agile%20Project/login.php
2. Login with:
   - Email: `john@example.com`
   - Password: `password123`
3. Wait for redirect

**Expected Result**:
- Success popup shows
- Redirected to index.php (home page)
- Home page displays

**Status**: ✓ Pass / ✗ Fail

---

## Test Case 11: Login - Provider User

**Test ID**: TC-011
**Title**: Login as provider and access provider dashboard
**Precondition**: Provider account exists (from TC-005)

**Steps**:
1. Navigate to http://localhost/Agile%20Project/login.php
2. Login with:
   - Email: `jane@example.com`
   - Password: `password123`
3. Wait for redirect

**Expected Result**:
- Success popup shows
- Redirected to provider-dashboard.php
- Provider dashboard displays

**Status**: ✓ Pass / ✗ Fail

---

## Test Case 12: Admin Page Protection

**Test ID**: TC-012
**Title**: Non-admin cannot access admin page
**Precondition**: Logged in as customer (not admin)

**Steps**:
1. Login as customer (john@example.com / password123)
2. Try to navigate directly to: http://localhost/Agile%20Project/admin.php
3. Observe what happens

**Expected Result**:
- Redirected to index.php
- Admin page is not accessible
- Cannot bypass authentication

**Status**: ✓ Pass / ✗ Fail

---

## Test Case 13: Logout Functionality

**Test ID**: TC-013
**Title**: User can logout and session is destroyed
**Precondition**: User is logged in as customer

**Steps**:
1. Login as customer
2. Look for logout link (should be in navbar)
3. Click "Logout" link

**Expected Result**:
- Session is destroyed
- Redirected to home page (index.php)
- Cannot access admin page anymore
- Must login again to access protected pages

**Status**: ✓ Pass / ✗ Fail

---

## Test Case 14: Protected Pages Without Login

**Test ID**: TC-014
**Title**: Cannot access admin page without login
**Precondition**: No user is logged in

**Steps**:
1. Open new browser window/incognito
2. Navigate to: http://localhost/Agile%20Project/admin.php
3. Observe redirect

**Expected Result**:
- Automatically redirected to login.php
- Cannot access admin page
- Must login first

**Status**: ✓ Pass / ✗ Fail

---

## Test Case 15: Database Storage Verification

**Test ID**: TC-015
**Title**: User data is properly stored in database
**Precondition**: Register a new user

**Steps**:
1. Register user with email: `verify@example.com`
2. Open phpMyAdmin
3. Go to agile database → users table
4. Look for the new user

**Expected Result**:
- User exists in database
- Password is hashed (not plain text)
- All fields are populated correctly
- Email is unique

**Status**: ✓ Pass / ✗ Fail

---

## Test Case 16: Password Hashing Verification

**Test ID**: TC-016
**Title**: Passwords are properly hashed
**Precondition**: User is registered

**Steps**:
1. View user in phpMyAdmin
2. Check the password field
3. Compare with original password

**Expected Result**:
- Password in database is hashed
- Does NOT match original password
- Format: $2y$10$... (bcrypt hash)
- Password length: 60 characters

**Status**: ✓ Pass / ✗ Fail

---

## Test Case 17: Empty Fields Validation

**Test ID**: TC-017
**Title**: Cannot submit form with empty fields
**Precondition**: Register page is open

**Steps**:
1. Navigate to register page
2. Leave all fields empty
3. Click Register button

**Expected Result**:
- Form validation prevents submission
- HTML5 required attribute message shows
- OR server returns error message
- Form not submitted

**Status**: ✓ Pass / ✗ Fail

---

## Test Case 18: Session Persistence

**Test ID**: TC-018
**Title**: User session persists across pages
**Precondition**: User is logged in

**Steps**:
1. Login as customer
2. Navigate to different pages (index.php, services.php, etc.)
3. Check if user is still logged in

**Expected Result**:
- User remains logged in across pages
- Session data is maintained
- User info is accessible

**Status**: ✓ Pass / ✗ Fail

---

## Test Case 19: AJAX Form Submission

**Test ID**: TC-019
**Title**: Forms submit via AJAX without page reload
**Precondition**: Login page is open

**Steps**:
1. Open login page
2. Fill form
3. Click Login
4. Observe the page

**Expected Result**:
- No page reload occurs
- Popup message appears
- Redirect happens smoothly
- Network tab shows XHR request

**Status**: ✓ Pass / ✗ Fail

---

## Test Case 20: Error Message Display

**Test ID**: TC-020
**Title**: Error messages display properly
**Precondition**: Login page is open

**Steps**:
1. Enter invalid credentials
2. Submit form
3. Observe error message

**Expected Result**:
- Error message appears on page
- Message is clearly visible
- Message is specific (not generic)
- Form data is preserved for correction

**Status**: ✓ Pass / ✗ Fail

---

## Summary Table

| Test ID | Description | Status | Notes |
|---------|-------------|--------|-------|
| TC-001 | Admin login (correct) | - | |
| TC-002 | Admin login (wrong password) | - | |
| TC-003 | Login (user not found) | - | |
| TC-004 | Register customer | - | |
| TC-005 | Register provider | - | |
| TC-006 | Register (password mismatch) | - | |
| TC-007 | Register (duplicate email) | - | |
| TC-008 | Register (invalid email) | - | |
| TC-009 | Register (weak password) | - | |
| TC-010 | Login customer | - | |
| TC-011 | Login provider | - | |
| TC-012 | Admin page protection | - | |
| TC-013 | Logout | - | |
| TC-014 | Protected pages | - | |
| TC-015 | Database storage | - | |
| TC-016 | Password hashing | - | |
| TC-017 | Empty fields | - | |
| TC-018 | Session persistence | - | |
| TC-019 | AJAX submission | - | |
| TC-020 | Error messages | - | |

**Total Test Cases**: 20
**Pass**: ____ / 20
**Fail**: ____ / 20
**Status**: [ ] All Pass [ ] Some Pass [ ] Not Tested

---

**Tester Name**: ___________________
**Test Date**: ___________________
**Notes**: ___________________________________________________________________________
____________________________________________________________________________
____________________________________________________________________________
