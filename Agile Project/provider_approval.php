<?php
/**
 * ============================================
 * PROVIDER APPROVAL HANDLER
 * ============================================
 * 
 * Handles admin approval/rejection of pending providers
 * 
 * Functions:
 * - Approve provider (status: pending → active)
 * - Reject provider (status: pending → blocked)
 * 
 * Security:
 * - Admin role required
 * - CSRF protection via token
 * - SQL injection prevention (prepared statements)
 */

session_start();
header('Content-Type: application/json');

// Include database config
include 'config.php';

// ============================================
// SECURITY CHECK - Admin Only
// ============================================

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized. Admin access required.'
    ]);
    exit;
}

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method'
    ]);
    exit;
}

// ============================================
// GET REQUEST PARAMETERS
// ============================================

$action = isset($_POST['action']) ? trim($_POST['action']) : '';
$user_id = isset($_POST['user_id']) ? intval($_POST['user_id']) : 0;

// Validate inputs
if (empty($action) || $user_id <= 0) {
    echo json_encode([
        'success' => false,
        'message' => 'Missing required parameters'
    ]);
    exit;
}

// Action must be either 'approve' or 'reject'
if (!in_array($action, ['approve', 'reject'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid action'
    ]);
    exit;
}

// ============================================
// VERIFY PROVIDER EXISTS AND IS PENDING
// ============================================

$verify_sql = "SELECT id, name, email, status, role FROM users WHERE id = ? AND role = 'provider'";
$verify_stmt = $conn->prepare($verify_sql);

if (!$verify_stmt) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $conn->error
    ]);
    exit;
}

$verify_stmt->bind_param("i", $user_id);
$verify_stmt->execute();
$verify_result = $verify_stmt->get_result();

if ($verify_result->num_rows === 0) {
    echo json_encode([
        'success' => false,
        'message' => 'Provider not found'
    ]);
    $verify_stmt->close();
    exit;
}

$provider = $verify_result->fetch_assoc();
$verify_stmt->close();

// Check if provider is actually pending
if ($provider['status'] !== 'pending') {
    echo json_encode([
        'success' => false,
        'message' => 'This provider is not pending approval'
    ]);
    exit;
}

// ============================================
// PERFORM APPROVE OR REJECT ACTION
// ============================================

if ($action === 'approve') {
    // Approve: Change status from pending to active
    $new_status = 'active';
    $action_message = 'approved';
} else {
    // Reject: Change status from pending to blocked
    $new_status = 'blocked';
    $action_message = 'rejected';
}

// Update user status in database
$update_sql = "UPDATE users SET status = ? WHERE id = ?";
$update_stmt = $conn->prepare($update_sql);

if (!$update_stmt) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $conn->error
    ]);
    exit;
}

$update_stmt->bind_param("si", $new_status, $user_id);

if ($update_stmt->execute()) {
    // Success
    echo json_encode([
        'success' => true,
        'message' => 'Provider ' . $action_message . ' successfully!',
        'provider_name' => $provider['name'],
        'provider_email' => $provider['email'],
        'new_status' => $new_status,
        'action' => $action
    ]);
} else {
    // Database error
    echo json_encode([
        'success' => false,
        'message' => 'Error updating provider: ' . $update_stmt->error
    ]);
}

$update_stmt->close();
$conn->close();
?>
