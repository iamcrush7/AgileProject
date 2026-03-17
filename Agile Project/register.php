<?php include 'config.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register | NE Connect</title>

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
                <li><a href="services.php">Services</a></li>
                <li><a href="index.php">Providers</a></li>
                <li><a href="index.php">About</a></li>
                <li><a href="login.php">Login</a></li>
            </ul>
        </nav>
    </header>

    <!-- Register Section -->
    <section class="register-section">
        <div class="register-container">
            <h2>Join NE Connect</h2>
            <p>Create your account to access local services</p>
            <form class="register-form" id="register-form">
                <div id="error-message" style="display: none; color: red; margin-bottom: 15px; padding: 10px; background: #ffe6e6; border-radius: 4px;"></div>

                <div class="form-group">
                    <label for="name">Full Name</label>
                    <input type="text" id="name" name="name" required>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <div class="form-group">
                    <label for="confirm-password">Confirm Password</label>
                    <input type="password" id="confirm-password" name="confirm_password" required>
                </div>
                <div class="form-group">
                    <label>Account Type</label>
                    <div class="radio-group">
                        <label>
                            <input type="radio" name="role" value="user" required checked>
                            <strong>Customer</strong> - Looking for services
                        </label>
                        <label>
                            <input type="radio" name="role" value="provider" required>
                            <strong>Service Provider</strong> - Offering services
                        </label>
                    </div>
                    <p style="font-size: 12px; color: #666; margin-top: 10px;">
                        Providers need admin approval before going live. Customers can start browsing immediately.
                    </p>
                </div>
                <button type="submit" class="btn">Register</button>
            </form>
            <p class="login-link">Already have an account? <a href="login.php">Login here</a></p>
        </div>
    </section>

    <!-- Success Popup -->
    <div id="success-popup" class="popup hidden">
        <div class="popup-content">
            <i class="fas fa-check-circle"></i>
            <h3>Registration Successful!</h3>
            <p id="popup-message">Welcome to NE Connect. Redirecting...</p>
        </div>
    </div>

    <!-- Footer -->
    <footer>
        <p>© 2026 NE Connect | Empowering North East Communities</p>
    </footer>

    <!-- JS -->
    <script src="js/script.js"></script>
</body>
</html>