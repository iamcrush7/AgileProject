<?php
/**
 * USER DASHBOARD
 * Accessible to: Logged-in users (role = 'user')
 * Shows: User account info, bookings, and service browsing
 */

include 'config.php';
include 'session.php';

// Require login and user role
requireLogin();
requireRole('user');

$user = getCurrentUser();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Dashboard | NE Connect</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>
<body>

    <!-- Navbar -->
    <header>
        <nav class="navbar">
            <h1 class="logo">NE Connect</h1>
            <ul class="nav-links">
                <li><a href="index.php">Home</a></li>
                <li><a href="services.php">Browse Services</a></li>
                <li><a href="user-dashboard.php" class="active">My Dashboard</a></li>
                <li class="nav-user-info">
                    <span class="user-name"><?php echo htmlspecialchars($user['name']); ?></span>
                    <span class="role-badge user">User</span>
                    <a href="index.php?logout=true" class="logout-btn">Logout</a>
                </li>
            </ul>
        </nav>
    </header>

    <!-- User Dashboard -->
    <section class="dashboard">
        <div class="container">
            <h2>Welcome, <?php echo htmlspecialchars($user['name']); ?>!</h2>
            <p>User Role: <strong><?php echo strtoupper($user['role']); ?></strong></p>

            <div class="dashboard-grid">
                <!-- Account Info Card -->
                <div class="dashboard-card">
                    <i class="fas fa-user"></i>
                    <h3>Account Information</h3>
                    <p><strong>Email:</strong> <?php echo htmlspecialchars($user['email']); ?></p>
                    <p><strong>Status:</strong> <span class="badge badge-active"><?php echo ucfirst($user['status']); ?></span></p>
                    <a href="edit-profile.php" class="btn">Edit Profile</a>
                </div>

                <!-- My Bookings Card -->
                <div class="dashboard-card">
                    <i class="fas fa-calendar"></i>
                    <h3>My Bookings</h3>
                    <p>Track your service bookings and history</p>
                    <a href="my-bookings.php" class="btn">View Bookings</a>
                </div>

                <!-- Browse Services Card -->
                <div class="dashboard-card">
                    <i class="fas fa-tools"></i>
                    <h3>Browse Services</h3>
                    <p>Find and book local service providers</p>
                    <a href="services.php" class="btn">Browse Services</a>
                </div>

                <!-- Support Card -->
                <div class="dashboard-card">
                    <i class="fas fa-question-circle"></i>
                    <h3>Need Help?</h3>
                    <p>Contact our support team</p>
                    <a href="contact.php" class="btn">Contact Support</a>
                </div>
            </div>

            <div class="logout-section">
                <a href="logout.php" style="color: red;">Logout</a>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <p>© 2026 NE Connect | Empowering North East Communities</p>
    </footer>

    <script src="js/script.js"></script>
</body>
</html>
