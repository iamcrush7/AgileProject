<?php
/**
 * ============================================
 * SESSION & ACCESS CONTROL MANAGEMENT
 * ============================================
 * This file manages user sessions and role-based access control
 * Include this file on pages that require authentication
 * 
 * Usage:
 *   include 'session.php';
 *   requireLogin();              // Check if user is logged in
 *   requireRole('provider');     // Check if user is a provider
 *   requireRole(['admin', 'provider']); // Check if user has any of these roles
 */

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * Check if user is logged in
 * @return bool True if logged in, false otherwise
 */
function isLoggedIn() {
    return isset($_SESSION['user_id']) && isset($_SESSION['email']) && isset($_SESSION['role']);
}

/**
 * Get current logged-in user information
 * @return array|null User data array or null if not logged in
 */
function getCurrentUser() {
    if (isLoggedIn()) {
        return [
            'id' => $_SESSION['user_id'],
            'name' => $_SESSION['name'],
            'email' => $_SESSION['email'],
            'role' => $_SESSION['role'],
            'status' => $_SESSION['status'],
            'provider_id' => $_SESSION['provider_id'] ?? null
        ];
    }
    return null;
}

/**
 * Get user's role
 * @return string|null Role (user, provider, or admin) or null if not logged in
 */
function getUserRole() {
    return $_SESSION['role'] ?? null;
}

/**
 * Check if user has specific role(s)
 * @param string|array $roles Single role or array of roles to check
 * @return bool True if user has the role, false otherwise
 */
function hasRole($roles) {
    if (!isLoggedIn()) {
        return false;
    }
    
    if (is_string($roles)) {
        return $_SESSION['role'] === $roles;
    }
    
    if (is_array($roles)) {
        return in_array($_SESSION['role'], $roles);
    }
    
    return false;
}

/**
 * Check if user's account is active
 * @return bool True if active, false if pending/blocked
 */
function isAccountActive() {
    return isset($_SESSION['status']) && $_SESSION['status'] === 'active';
}

/**
 * Require user to be logged in
 * Redirects to login page if not logged in
 */
function requireLogin() {
    if (!isLoggedIn()) {
        header("Location: login.php");
        exit;
    }
}

/**
 * Require specific role(s)
 * Redirects to appropriate page if user doesn't have the role
 * 
 * @param string|array $roles Single role or array of allowed roles
 * @param string $redirectUrl URL to redirect if access denied
 */
function requireRole($roles, $redirectUrl = 'index.php') {
    requireLogin();
    
    if (!hasRole($roles)) {
        header("Location: " . $redirectUrl);
        exit;
    }
}

/**
 * Require active account status
 * Redirects if account is pending or blocked
 */
function requireActiveAccount() {
    requireLogin();
    
    if (!isAccountActive()) {
        session_destroy();
        header("Location: login.php?status=" . $_SESSION['status']);
        exit;
    }
}

/**
 * Check if user is a provider and account is active
 * Used for provider-specific pages
 */
function requireActiveProvider() {
    requireLogin();
    
    if (!hasRole('provider')) {
        header("Location: index.php");
        exit;
    }
    
    if (!isAccountActive()) {
        if ($_SESSION['status'] === 'pending') {
            header("Location: waiting-approval.php");
            exit;
        }
        session_destroy();
        header("Location: login.php?error=blocked");
        exit;
    }
}

/**
 * Check if user is admin
 * Used for admin pages
 */
function requireAdmin() {
    requireLogin();
    
    if (!hasRole('admin')) {
        header("Location: index.php");
        exit;
    }
}

/**
 * Logout current user
 * Destroys session and clears all data
 */
function logout() {
    $_SESSION = [];
    session_destroy();
    return true;
}

/**
 * Get user's provider ID if they are a provider
 * @return int|null Provider ID or null if not a provider
 */
function getProviderId() {
    if (hasRole('provider') && isset($_SESSION['provider_id'])) {
        return $_SESSION['provider_id'];
    }
    return null;
}

/**
 * Check if user is provider with specific verification status
 * @param string $status 'pending', 'approved', or 'rejected'
 * @return bool True if matches, false otherwise
 */
function hasProviderStatus($status) {
    if (!hasRole('provider')) {
        return false;
    }
    return isset($_SESSION['provider_status']) && $_SESSION['provider_status'] === $status;
}

/**
 * Redirect based on user role
 * Used after successful login to send users to appropriate dashboard
 */
function redirectByRole() {
    if (!isLoggedIn()) {
        header("Location: login.php");
        exit;
    }
    
    $role = getUserRole();
    
    // Check account status for non-admin users
    if ($role !== 'admin' && !isAccountActive()) {
        if ($_SESSION['status'] === 'pending' && $role === 'provider') {
            header("Location: waiting-approval.php");
            exit;
        }
        session_destroy();
        header("Location: login.php?error=blocked");
        exit;
    }
    
    // Redirect based on role
    switch ($role) {
        case 'admin':
            header("Location: admin.php");
            break;
        case 'provider':
            header("Location: provider-dashboard.php");
            break;
        case 'user':
        default:
            header("Location: user-dashboard.php");
            break;
    }
    exit;
}

/**
 * Display user greeting in navbar
 * Call this in navbar to show logged-in user info
 * 
 * @return string HTML for user display
 */
function getUserNavbar() {
    if (!isLoggedIn()) {
        return '<a href="login.php">Login</a> | <a href="register.php">Register</a>';
    }
    
    $user = getCurrentUser();
    $badge = '<span style="background: #007bff; color: white; padding: 2px 8px; border-radius: 3px; font-size: 12px; margin-left: 5px;">' . strtoupper($user['role']) . '</span>';
    
    return 'Hello, ' . htmlspecialchars($user['name']) . $badge . ' | <a href="logout.php">Logout</a>';
}
?>
