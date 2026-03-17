<?php
/**
 * UPLOAD DETAILS HANDLER
 * Processes provider details upload form
 */

include 'config.php';
include 'session.php';

requireLogin();
requireRole('provider');

$user = getCurrentUser();

// Redirect if not pending
if ($user['status'] !== 'pending') {
    header("Location: provider-dashboard.php");
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $errors = [];

    // Validate inputs
    $bio = trim($_POST['bio'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $address = trim($_POST['address'] ?? '');
    $city = trim($_POST['city'] ?? '');
    $state = trim($_POST['state'] ?? '');

    if (empty($bio)) {
        $errors[] = "Bio is required.";
    }
    if (empty($phone)) {
        $errors[] = "Phone is required.";
    }
    if (empty($address)) {
        $errors[] = "Address is required.";
    }
    if (empty($city)) {
        $errors[] = "City is required.";
    }
    if (empty($state)) {
        $errors[] = "State is required.";
    }

    // Handle profile image upload
    $profile_image_path = null;
    if (isset($_FILES['profile_image']) && $_FILES['profile_image']['error'] === UPLOAD_ERR_OK) {
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
        if (in_array($_FILES['profile_image']['type'], $allowed_types)) {
            $upload_dir = 'uploads/profile_images/';
            if (!is_dir($upload_dir)) {
                mkdir($upload_dir, 0755, true);
            }
            $file_name = uniqid() . '_' . basename($_FILES['profile_image']['name']);
            $profile_image_path = $upload_dir . $file_name;
            if (!move_uploaded_file($_FILES['profile_image']['tmp_name'], $profile_image_path)) {
                $errors[] = "Failed to upload profile image.";
            }
        } else {
            $errors[] = "Invalid profile image type. Only JPEG, PNG, and GIF are allowed.";
        }
    }

    // Handle Aadhaar card upload
    $aadhaar_card_path = null;
    if (isset($_FILES['aadhaar_card']) && $_FILES['aadhaar_card']['error'] === UPLOAD_ERR_OK) {
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
        if (in_array($_FILES['aadhaar_card']['type'], $allowed_types)) {
            $upload_dir = 'uploads/aadhaar_cards/';
            if (!is_dir($upload_dir)) {
                mkdir($upload_dir, 0755, true);
            }
            $file_name = uniqid() . '_' . basename($_FILES['aadhaar_card']['name']);
            $aadhaar_card_path = $upload_dir . $file_name;
            if (!move_uploaded_file($_FILES['aadhaar_card']['tmp_name'], $aadhaar_card_path)) {
                $errors[] = "Failed to upload Aadhaar card.";
            }
        } else {
            $errors[] = "Invalid Aadhaar card type. Only JPEG, PNG, GIF, and PDF are allowed.";
        }
    } else {
        $errors[] = "Aadhaar card is required.";
    }

    if (empty($errors)) {
        // Insert into provider_details table
        $stmt = $conn->prepare("INSERT INTO provider_details (provider_id, bio, phone, address, city, state, aadhaar_card_path) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE bio = VALUES(bio), phone = VALUES(phone), address = VALUES(address), city = VALUES(city), state = VALUES(state), aadhaar_card_path = VALUES(aadhaar_card_path)");

        if (!$stmt) {
            $errors[] = "Database error: " . $conn->error;
        } else {
            $stmt->bind_param("issssss", $user['id'], $bio, $phone, $address, $city, $state, $aadhaar_card_path);

            if ($stmt->execute()) {
                // Update profile image in users table if uploaded
                if ($profile_image_path) {
                    $stmt2 = $conn->prepare("UPDATE users SET profile_image = ? WHERE id = ?");
                    if ($stmt2) {
                        $stmt2->bind_param("si", $profile_image_path, $user['id']);
                        $stmt2->execute();
                        $stmt2->close();
                    }
                }

                // Redirect with success message
                header("Location: waiting-approval.php?uploaded=1");
                exit;
            } else {
                $errors[] = "Failed to save details: " . $stmt->error;
            }
            $stmt->close();
        }
    }

    // If there are errors, redirect back with errors
    $error_string = implode('|', $errors);
    header("Location: waiting-approval.php?errors=" . urlencode($error_string));
    exit;
} else {
    // Invalid request method
    header("Location: waiting-approval.php");
    exit;
}
?>
