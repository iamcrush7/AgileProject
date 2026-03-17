<?php
include 'config.php';
include 'session.php';

// Handle logout
if (isset($_GET['logout']) && $_GET['logout'] === 'true') {
    logout();
    session_destroy();
    header('Location: index.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NE Connect | Local Services for North East</title>

    <!-- CSS -->
    <link rel="stylesheet" href="css/style.css">

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

    <!-- Google Font (Inter & Poppins fallback) -->
    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600&display=swap"
        rel="stylesheet">
</head>

<body>

    <!-- Navbar -->
    <header>
        <nav class="navbar">
            <div class="navbar-left">
                <select id="region-select" class="region-select">
                    <option value="">Select Region</option>
                    <option value="arunachal-pradesh">Arunachal Pradesh</option>
                    <option value="assam">Assam</option>
                    <option value="manipur">Manipur</option>
                    <option value="meghalaya">Meghalaya</option>
                    <option value="mizoram">Mizoram</option>
                    <option value="nagaland">Nagaland</option>
                    <option value="sikkim">Sikkim</option>
                    <option value="tripura">Tripura</option>
                </select>
                <h1 class="logo">NE Connect</h1>
            </div>
            <ul class="nav-links">
                <li><a href="index.php" class="active">Home</a></li>
                <li><a href="services.php">Services</a></li>
                <li><a href="index.php">Providers</a></li>
                <li><a href="index.php">About</a></li>
                <?php if (isLoggedIn()):
                    $user = getCurrentUser();
                    ?>
                    <li class="nav-user-info">
                        <span class="user-name"><?php echo htmlspecialchars($user['name']); ?></span>
                        <span class="role-badge <?php echo htmlspecialchars($user['role']); ?>">
                            <?php
                            switch ($user['role']) {
                                case 'admin':
                                    echo 'Admin';
                                    break;
                                case 'provider':
                                    echo 'Provider';
                                    break;
                                case 'user':
                                    echo 'User';
                                    break;
                                default:
                                    echo ucfirst($user['role']);
                            }
                            ?>
                        </span>
                        <a href="index.php?logout=true" class="logout-btn">Logout</a>
                    </li>
                <?php else: ?>
                    <li><a href="login.php">Login</a></li>
                <?php endif; ?>
            </ul>
        </nav>
    </header>

    <!-- Hero Section -->
    <section class="hero">
        <div class="hero-content">
            <h2>Connecting North East Communities</h2>
            <p>Find trusted local services near you — by NE people, for NE people.</p>
            <a href="services.html" class="btn">Explore Services</a>
        </div>
    </section>

    <!-- Services Preview -->
    <section class="services reveal">
        <h2>Popular Services</h2>
        <div class="service-grid">

            <div class="service-card">
                <i class="fas fa-tools"></i>
                <h3>Electrician</h3>
                <p>Reliable electrical services at your doorstep.</p>
            </div>

            <div class="service-card">
                <i class="fas fa-wrench"></i>
                <h3>Plumber</h3>
                <p>Quick plumbing solutions by local experts.</p>
            </div>

            <div class="service-card">
                <i class="fas fa-broom"></i>
                <h3>Home Cleaning</h3>
                <p>Affordable and professional cleaning services.</p>
            </div>

            <div class="service-card">
                <i class="fas fa-store"></i>
                <h3>Local Shops</h3>
                <p>Support small NE-owned businesses.</p>
            </div>

        </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials reveal">
        <h2>What Our Users Say</h2>
        <div class="testimonial-grid">
            <div class="testimonial-card">
                <p>"NE Connect helped me find a reliable electrician in minutes!"</p>
                <cite>- John D., Newcastle</cite>
            </div>
            <div class="testimonial-card">
                <p>"Great platform for local services. Highly recommend!"</p>
                <cite>- Sarah L., Sunderland</cite>
            </div>
        </div>
    </section>

    <!-- About Us Snippet -->
    <section class="about reveal">
        <div class="about-content">
            <h2>About NE Connect</h2>
            <p>NE Connect is an innovative platform born from the vision of two dedicated MCA students from Kristu
                Jayanti University, batch 2025-27. As part of their academic project, these students recognized the
                challenges faced by communities in the North East region in accessing reliable local services. With a
                deep commitment to empowering local economies and fostering community connections, NE Connect was
                developed to bridge the gap between service seekers and trusted providers. Our platform features a
                user-friendly interface where residents can easily find and book services ranging from electrical
                repairs and plumbing to home cleaning and auto maintenance. We prioritize quality, reliability, and
                community support, ensuring that all listed providers are vetted and committed to serving the North
                East. Join us in building stronger, more connected communities—one service at a time.</p>
            <a href="about.html" class="btn">Learn More</a>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <p>© 2026 NE Connect | Empowering North East Communities</p>
    </footer>

    <!-- JS -->
    <script src="js/script.js"></script>

    <!-- Chatbot HTML -->
    <div id="chatbot-container">
        <div id="chatbot-button">💬</div>
        <div id="chatbot-panel" class="hidden">
            <div class="chatbot-header">
                <h3>NE Connect Assistant</h3>
                <select id="language-select">
                    <option value="en">English</option>
                    <option value="as">Assamese</option>
                    <option value="bn">Bengali</option>
                    <option value="ne">Nepali</option>
                    <option value="ma">Manipuri</option>
                    <option value="mz">Mizo</option>
                    <option value="hi">Hindi</option>
                    <option value="kh">Khasi</option>
                    <option value="gr">Garo</option>
                    <option value="kb">Kokborok</option>
                    <option value="ku">Kuki</option>
                    <option value="ng">Naga</option>
                    <option value="ar">Arunachali</option>
                </select>
                <button id="close-chatbot">❌</button>
            </div>
            <div id="chat-messages"></div>
            <div class="chatbot-input">
                <input type="text" id="user-input" placeholder="Type a message...">
                <button id="send-button">Send</button>
            </div>
        </div>
    </div>

</body>

</html>