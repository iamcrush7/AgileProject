<?php
/**
 * ============================================
 * LOGIN HANDLER - Role-Based Authentication
 * ============================================
 * 
 * Handles login for all roles:
 * - Users (customers)
 * - Providers (service providers)
 * - Admins
 * 
 * Features:
 * - Password verification using password_verify()
 * - Session creation with user info
 * - Status checking (active, pending, blocked)
 * - Role-based redirection
 * - Clear error messages
 */

session_start();
header('Content-Type: application/json');

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ne_connect";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check database connection
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Database connection error. Please contact support.']));
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die(json_encode(['success' => false, 'message' => 'Invalid request']));
}

// Get and sanitize input
$email = isset($_POST['email']) ? trim(strtolower($_POST['email'])) : '';
$password = isset($_POST['password']) ? trim($_POST['password']) : '';

// Validation
if (empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Please enter email and password']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}

// Query user from database
$sql = "SELECT id, name, email, password, role, status FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Database error. Please try again.']);
    exit;
}

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    // User not found
    echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
    $stmt->close();
    exit;
}

$user = $result->fetch_assoc();
$stmt->close();

// Verify password
if (!password_verify($password, $user['password'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
    exit;
}

// Check account status
if ($user['status'] === 'blocked') {
    echo json_encode([
        'success' => false,
        'message' => 'Your account has been blocked. Please contact support.',
        'error_type' => 'blocked'
    ]);
    exit;
}

// For providers, check if pending approval
if ($user['role'] === 'provider' && $user['status'] === 'pending') {
    // Still create session but redirect to waiting page
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['name'] = $user['name'];
    $_SESSION['email'] = $user['email'];
    $_SESSION['role'] = $user['role'];
    $_SESSION['status'] = $user['status'];
    
    echo json_encode([
        'success' => true,
        'message' => 'Logged in - Awaiting approval',
        'redirect' => './waiting-approval.php',
        'status' => 'pending'
    ]);
    exit;
}

// Get provider ID if user is a provider
$provider_id = null;
if ($user['role'] === 'provider') {
    $provider_sql = "SELECT id, verification_status FROM providers WHERE user_id = ?";
    $provider_stmt = $conn->prepare($provider_sql);
    $provider_stmt->bind_param("i", $user['id']);
    $provider_stmt->execute();
    $provider_result = $provider_stmt->get_result();
    
    if ($provider_result->num_rows > 0) {
        $provider = $provider_result->fetch_assoc();
        $provider_id = $provider['id'];
    }
    $provider_stmt->close();
}

// Create session - User is active
$_SESSION['user_id'] = $user['id'];
$_SESSION['name'] = $user['name'];
$_SESSION['email'] = $user['email'];
$_SESSION['role'] = $user['role'];
$_SESSION['status'] = $user['status'];

if ($provider_id) {
    $_SESSION['provider_id'] = $provider_id;
}

// Determine redirect URL based on role
$redirect_url = '';
switch ($user['role']) {
    case 'admin':
        $redirect_url = './admin.php';
        break;
    case 'provider':
        $redirect_url = './provider-dashboard.php';
        break;
    case 'user':
    default:
        $redirect_url = './user-dashboard.php';
        break;
}

// Success response
echo json_encode([
    'success' => true,
    'message' => 'Login successful! Redirecting...',
    'redirect' => $redirect_url,
    'role' => $user['role']
]);

$conn->close();
?>


