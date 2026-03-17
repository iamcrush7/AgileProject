<?php 
/**
 * PROVIDER DASHBOARD
 * Accessible to: Service providers with active status (role = 'provider', status = 'active')
 * Shows: Services, bookings, earnings, and profile
 */

include 'config.php';
include 'session.php';

// Require provider role and active status
requireActiveProvider();

$user = getCurrentUser();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Provider Dashboard | NE Connect</title>

    <!-- CSS -->
    <link rel="stylesheet" href="css/style.css">

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

    <!-- Google Font -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
</head>
<body>

    <!-- Navbar -->
    <header>
        <nav class="navbar">
            <h1 class="logo">NE Connect</h1>
            <ul class="nav-links">
                <li><a href="index.php">Home</a></li>
                <li><a href="provider-dashboard.php" class="active">Dashboard</a></li>
                <li class="nav-user-info">
                    <span class="user-name"><?php echo htmlspecialchars($user['name']); ?></span>
                    <span class="role-badge provider">Provider</span>
                    <a href="index.php?logout=true" class="logout-btn">Logout</a>
                </li>
            </ul>
        </nav>
    </header>

    <!-- Provider Dashboard -->
    <section class="provider-dashboard">
        <div class="container">
            <h2>Provider Dashboard</h2>
            <p>Welcome, <?php echo htmlspecialchars($user['name']); ?>! Manage your services and bookings.</p>
            <p>Status: <span class="badge badge-success"><?php echo ucfirst($user['status']); ?></span></p>
            
            <div class="dashboard-grid">
            <div class="dashboard-card">
                <i class="fas fa-plus"></i>
                <h3>Add Service</h3>
                <p>List a new service.</p>
                <button class="btn">Add</button>
            </div>
            <div class="dashboard-card">
                <i class="fas fa-list"></i>
                <h3>My Services</h3>
                <p>View and edit your services.</p>
                <button class="btn">View</button>
            </div>
            <div class="dashboard-card">
                <i class="fas fa-calendar"></i>
                <h3>Bookings</h3>
                <p>Check upcoming bookings.</p>
                <button class="btn">View</button>
            </div>
            <div class="dashboard-card">
                <i class="fas fa-chart-line"></i>
                <h3>Analytics</h3>
                <p>View your performance stats.</p>
                <button class="btn">View</button>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <p>© 2026 NE Connect | Empowering North East Communities</p>
    </footer>

    <!-- JS -->
    <script src="js/script.js"></script>
</body>
</html>