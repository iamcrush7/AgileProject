<?php
/**
 * WAITING FOR APPROVAL PAGE
 * Shown to: Providers with status = 'pending'
 * Purpose: Inform provider that their account is awaiting admin approval
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

// Check for success or error messages
$uploaded = isset($_GET['uploaded']) && $_GET['uploaded'] === '1';
$errors = [];
if (isset($_GET['errors'])) {
    $errors = explode('|', urldecode($_GET['errors']));
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Waiting for Approval | NE Connect</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <style>
        .approval-container {
            max-width: 600px;
            margin: 100px auto;
            padding: 40px;
            text-align: center;
            background: #f8f9fa;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .approval-icon {
            font-size: 60px;
            color: #ffc107;
            margin-bottom: 20px;
        }
        .approval-container h2 {
            color: #333;
            margin-bottom: 20px;
        }
        .approval-container p {
            color: #666;
            line-height: 1.8;
            margin-bottom: 30px;
        }
        .check-list {
            text-align: left;
            background: white;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .check-list li {
            margin: 10px 0;
            color: #555;
        }
        .check-list li:before {
            content: "✓ ";
            color: #28a745;
            font-weight: bold;
            margin-right: 10px;
        }
    </style>
</head>
<body>

    <header>
        <nav class="navbar">
            <h1 class="logo">NE Connect</h1>
            <ul class="nav-links">
                <li><a href="index.php">Home</a></li>
                <li class="nav-user-info">
                    <span class="user-name"><?php echo htmlspecialchars($user['name']); ?></span>
                    <span class="role-badge provider">Pending Approval</span>
                    <a href="index.php?logout=true" class="logout-btn">Logout</a>
                </li>
            </ul>
        </nav>
    </header>

    <div class="approval-container">
        <div class="approval-icon">
            <i class="fas fa-hourglass-half"></i>
        </div>

        <h2>Account Pending Approval</h2>

        <p>
            Hello <?php echo htmlspecialchars($user['name']); ?>,
        </p>

        <p>
            Thank you for registering as a service provider with NE Connect! 
            Your account is currently pending approval from our admin team.
        </p>

        <ul class="check-list">
            <li>Your profile is under review</li>
            <li>Admin team will verify your details</li>
            <li>You'll receive an email once approved</li>
            <li>Approval usually takes 1-2 business days</li>
        </ul>

        <p>
            <strong>What happens next?</strong><br>
            Our admin team will review your information and verify your credentials. 
            You can log in to check your status anytime. Once approved, you'll be able to 
            list your services and accept bookings.
        </p>

        <p>
            If you have any questions, please contact us at <strong>support@neconnect.com</strong>
        </p>

        <button id="upload-details-btn" class="btn" style="background: #28a745; color: white; padding: 10px 30px; border: none; border-radius: 5px; cursor: pointer; margin: 20px 0;">Upload Details</button>

        <div id="upload-form" style="display: none; background: white; padding: 20px; border-radius: 5px; margin-top: 20px;">
            <h3>Upload Your Details</h3>
            <form action="upload_details_handler.php" method="POST" enctype="multipart/form-data">
                <div style="margin-bottom: 15px;">
                    <label for="bio">Bio:</label>
                    <textarea id="bio" name="bio" rows="4" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" placeholder="Tell us about yourself and your services..."></textarea>
                </div>
                <div style="margin-bottom: 15px;">
                    <label for="phone">Phone:</label>
                    <input type="text" id="phone" name="phone" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" placeholder="Your phone number">
                </div>
                <div style="margin-bottom: 15px;">
                    <label for="address">Address:</label>
                    <input type="text" id="address" name="address" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" placeholder="Your address">
                </div>
                <div style="margin-bottom: 15px;">
                    <label for="city">City:</label>
                    <input type="text" id="city" name="city" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" placeholder="Your city">
                </div>
                <div style="margin-bottom: 15px;">
                    <label for="state">State:</label>
                    <input type="text" id="state" name="state" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" placeholder="Your state">
                </div>
                <div style="margin-bottom: 15px;">
                    <label for="profile_image">Profile Image:</label>
                    <input type="file" id="profile_image" name="profile_image" accept="image/*" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label for="aadhaar_card">Aadhaar Card:</label>
                    <input type="file" id="aadhaar_card" name="aadhaar_card" accept="image/*,.pdf" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                </div>
                <button type="submit" class="btn" style="background: #007bff; color: white; padding: 10px 30px; border: none; border-radius: 5px; cursor: pointer;">Submit Details</button>
            </form>
        </div>

        <a href="logout.php" class="btn" style="background: #007bff; color: white; padding: 10px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Go to Home</a>
    </div>

    <!-- Success Popup -->
    <div id="success-popup" class="popup" style="display: <?php echo $uploaded ? 'flex' : 'none'; ?>;">
        <div class="popup-content">
            <i class="fas fa-check-circle"></i>
            <h3>Details Uploaded Successfully!</h3>
            <p>Your details have been uploaded and are now under review by our admin team.</p>
        </div>
    </div>

    <!-- Error Popup -->
    <?php if (!empty($errors)): ?>
    <div id="error-popup" class="popup" style="display: flex;">
        <div class="popup-content">
            <i class="fas fa-exclamation-triangle" style="color: #dc3545;"></i>
            <h3>Upload Failed</h3>
            <ul style="text-align: left; color: #dc3545;">
                <?php foreach ($errors as $error): ?>
                    <li><?php echo htmlspecialchars($error); ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
    </div>
    <?php endif; ?>

    <footer style="margin-top: 50px;">
        <p>© 2026 NE Connect | Empowering North East Communities</p>
    </footer>

    <script>
        document.getElementById('upload-details-btn').addEventListener('click', function() {
            var form = document.getElementById('upload-form');
            form.style.display = form.style.display === 'none' ? 'block' : 'none';
        });

        // Close popups when clicked
        document.querySelectorAll('.popup').forEach(function(popup) {
            popup.addEventListener('click', function() {
                this.style.display = 'none';
            });
        });
    </script>

</body>
</html>
