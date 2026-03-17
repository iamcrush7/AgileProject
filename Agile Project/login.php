<?php include 'config.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login | NE Connect</title>

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
                <li><a href="login.php" class="active">Login</a></li>
            </ul>
        </nav>
    </header>

    <!-- Login Section -->
    <section class="login-section">
        <div class="login-container">
            <h2>Welcome Back</h2>
            <p>Sign in to access your NE Connect account</p>
            <form class="login-form" id="login-form">
                <div id="error-message" style="display: none; color: red; margin-bottom: 15px; padding: 10px; background: #ffe6e6; border-radius: 4px;"></div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <button type="submit" class="btn">Login</button>
            </form>
            <p class="signup-link">Don't have an account? <a href="register.php">Sign up here</a></p>
            <p style="text-align: center; margin-top: 20px; font-size: 12px; color: #666;">
                Demo Admin Login: <strong>admin@neconnect.com</strong> / <strong>admin123</strong>
            </p>
        </div>
    </section>

    <!-- Success Popup -->
    <div id="success-popup" class="popup hidden">
        <div class="popup-content">
            <i class="fas fa-check-circle"></i>
            <h3>Login Successful!</h3>
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