<?php include 'config.php'; ?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Services | NE Connect</title>

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
            <h1 class="logo">NE Connect</h1>
            <ul class="nav-links">
                <li><a href="index.php">Home</a></li>
                <li><a href="services.php" class="active">Services</a></li>
                <li><a href="index.php">Providers</a></li>
                <li><a href="index.php">About</a></li>
                <li><a href="login.php">Login</a></li>
            </ul>
        </nav>
    </header>

    <!-- Services Section -->
    <section class="services reveal">
        <h2>Our Services</h2>
        <p style="text-align: center; color: var(--text-secondary); margin-bottom: 3rem;">Discover a wide range of local
            services tailored for North East communities.</p>
        <div class="service-grid">

            <div class="service-card">
                <i class="fas fa-tools"></i>
                <h3>Electrician</h3>
                <p>Reliable electrical services at your doorstep. From installations to repairs, our certified
                    electricians ensure safety and efficiency.</p>
                <a href="providers.php?service=electrician" class="btn" style="margin-top: 1.5rem;">Find Providers</a>
            </div>

            <div class="service-card">
                <i class="fas fa-wrench"></i>
                <h3>Plumber</h3>
                <p>Quick plumbing solutions by local experts. We handle leaks, blockages, and installations with
                    precision.</p>
                <a href="providers.php?service=plumber" class="btn" style="margin-top: 1.5rem;">Find Providers</a>
            </div>

            <div class="service-card">
                <i class="fas fa-broom"></i>
                <h3>Home Cleaning</h3>
                <p>Affordable and professional cleaning services. Deep clean your home with eco-friendly products.</p>
                <a href="providers.php?service=cleaning" class="btn" style="margin-top: 1.5rem;">Find Providers</a>
            </div>

            <div class="service-card">
                <i class="fas fa-store"></i>
                <h3>Local Shops</h3>
                <p>Support small NE-owned businesses. Find groceries, essentials, and more from trusted local vendors.
                </p>
                <a href="providers.php?service=shops" class="btn" style="margin-top: 1.5rem;">Find Providers</a>
            </div>

            <div class="service-card">
                <i class="fas fa-car"></i>
                <h3>Auto Repair</h3>
                <p>Expert auto repair services. From oil changes to major repairs, keep your vehicle running smoothly.
                </p>
                <a href="providers.php?service=auto" class="btn" style="margin-top: 1.5rem;">Find Providers</a>
            </div>

            <div class="service-card">
                <i class="fas fa-paint-brush"></i>
                <h3>Painting</h3>
                <p>Professional painting services for homes and offices. Transform your space with quality finishes.</p>
                <a href="providers.php?service=painting" class="btn" style="margin-top: 1.5rem;">Find Providers</a>
            </div>

            <div class="service-card">
                <i class="fas fa-hammer"></i>
                <h3>Carpentry</h3>
                <p>Custom furniture, repairs, and woodwork. Expert carpenters for all your home projects.</p>
                <a href="providers.php?service=carpentry" class="btn" style="margin-top: 1.5rem;">Find Providers</a>
            </div>

            <div class="service-card">
                <i class="fas fa-snowflake"></i>
                <h3>AC Repair & Service</h3>
                <p>Keep your home cool. Professional AC installation, maintenance, and quick repairs.</p>
                <a href="providers.php?service=ac-repair" class="btn" style="margin-top: 1.5rem;">Find Providers</a>
            </div>

            <div class="service-card">
                <i class="fas fa-bug"></i>
                <h3>Pest Control</h3>
                <p>Safe and effective pest control solutions to keep your home healthy and pest-free.</p>
                <a href="providers.php?service=pest-control" class="btn" style="margin-top: 1.5rem;">Find Providers</a>
            </div>

            <div class="service-card">
                <i class="fas fa-truck"></i>
                <h3>Packers & Movers</h3>
                <p>Hassle-free relocation services. Safe packing and transportation of your belongings.</p>
                <a href="providers.php?service=movers" class="btn" style="margin-top: 1.5rem;">Find Providers</a>
            </div>

            <div class="service-card">
                <i class="fas fa-chalkboard-teacher"></i>
                <h3>Tutors</h3>
                <p>Experienced local tutors for various subjects. Boost academic performance safely.</p>
                <a href="providers.php?service=tutors" class="btn" style="margin-top: 1.5rem;">Find Providers</a>
            </div>

            <div class="service-card">
                <i class="fas fa-camera"></i>
                <h3>Photography</h3>
                <p>Professional photographers for events, portraits, and commercial shoots in your area.</p>
                <a href="providers.php?service=photography" class="btn" style="margin-top: 1.5rem;">Find Providers</a>
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