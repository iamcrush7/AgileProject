<?php
/**
 * ============================================
 * REGISTRATION HANDLER - Role-Based Registration
 * ============================================
 * 
 * Handles registration for:
 * - Users (customers) - status = active
 * - Providers - status = pending (awaiting admin approval)
 * 
 * Features:
 * - Input validation
 * - Password hashing using password_hash()
 * - Duplicate email prevention
 * - Role-based account creation
 * - Provider table creation for providers
 */

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
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim(strtolower($_POST['email'])) : '';
$password = isset($_POST['password']) ? trim($_POST['password']) : '';
$confirm_password = isset($_POST['confirm_password']) ? trim($_POST['confirm_password']) : '';
$role = isset($_POST['role']) ? trim($_POST['role']) : '';

// Validation: Check all required fields
if (empty($name) || empty($email) || empty($password) || empty($confirm_password) || empty($role)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

// Validation: Name length
if (strlen($name) < 3) {
    echo json_encode(['success' => false, 'message' => 'Name must be at least 3 characters long']);
    exit;
}

// Validation: Email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}

// Validation: Role
if (!in_array($role, ['user', 'provider'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid role selected']);
    exit;
}

// Validation: Passwords match
if ($password !== $confirm_password) {
    echo json_encode(['success' => false, 'message' => 'Passwords do not match']);
    exit;
}

// Validation: Password strength
if (strlen($password) < 6) {
    echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters long']);
    exit;
}

// Check if email already exists
$check_sql = "SELECT id FROM users WHERE email = ?";
$check_stmt = $conn->prepare($check_sql);

if (!$check_stmt) {
    echo json_encode(['success' => false, 'message' => 'Database error. Please try again.']);
    exit;
}

$check_stmt->bind_param("s", $email);
$check_stmt->execute();
$check_result = $check_stmt->get_result();

if ($check_result->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'This email is already registered']);
    $check_stmt->close();
    exit;
}

$check_stmt->close();

// Hash password
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Determine status based on role
$status = ($role === 'provider') ? 'pending' : 'active';

// Insert user into database
$insert_sql = "INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)";
$insert_stmt = $conn->prepare($insert_sql);

if (!$insert_stmt) {
    echo json_encode(['success' => false, 'message' => 'Database error. Please try again.']);
    exit;
}

$insert_stmt->bind_param("sssss", $name, $email, $hashed_password, $role, $status);

if (!$insert_stmt->execute()) {
    echo json_encode(['success' => false, 'message' => 'Registration failed. Please try again.']);
    $insert_stmt->close();
    exit;
}

$user_id = $insert_stmt->insert_id;
$insert_stmt->close();

// If provider, create provider record
if ($role === 'provider') {
    $provider_sql = "INSERT INTO providers (user_id, verification_status) VALUES (?, 'pending')";
    $provider_stmt = $conn->prepare($provider_sql);
    
    if ($provider_stmt) {
        $provider_stmt->bind_param("i", $user_id);
        $provider_stmt->execute();
        $provider_stmt->close();
    }
}

// Success message depends on role
if ($role === 'provider') {
    $success_message = 'Registration successful! Your account is pending admin approval.';
    $redirect = './waiting-approval.php';
} else {
    $success_message = 'Registration successful! Please log in to continue.';
    $redirect = './login.php';
}

echo json_encode([
    'success' => true,
    'message' => $success_message,
    'redirect' => $redirect,
    'role' => $role
]);

$conn->close();
?>


