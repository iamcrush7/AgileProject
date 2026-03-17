<?php include 'config.php'; ?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Find Providers | NE Connect</title>

    <!-- CSS -->
    <link rel="stylesheet" href="css/style.css">

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

    <!-- Google Font (Inter & Poppins fallback) -->
    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600&display=swap"
        rel="stylesheet">

    <style>
        .providers-header {
            text-align: center;
            padding: 120px 2rem 40px;
        }

        .providers-header h2 {
            font-size: 2.8rem;
            color: var(--text-primary);
            margin-bottom: 1rem;
        }

        .providers-header p {
            color: var(--text-secondary);
            font-size: 1.1rem;
            max-width: 600px;
            margin: 0 auto;
        }

        .provider-list {
            max-width: 1000px;
            margin: 0 auto 80px;
            padding: 0 2rem;
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }

        .provider-row {
            background: var(--bg-card);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid var(--glass-border);
            border-radius: 20px;
            padding: 2rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: var(--glass-shadow);
            transition: all var(--transition-speed) ease;
        }

        .provider-row:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0, 242, 254, 0.15);
            border-color: rgba(0, 242, 254, 0.3);
        }

        .provider-info {
            display: flex;
            align-items: center;
            gap: 2rem;
        }

        .provider-avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            color: white;
            box-shadow: 0 4px 15px rgba(0, 242, 254, 0.3);
        }

        .provider-details h3 {
            font-size: 1.5rem;
            color: var(--text-primary);
            margin-bottom: 0.5rem;
        }

        .provider-meta {
            color: var(--text-secondary);
            font-size: 0.95rem;
            display: flex;
            gap: 1rem;
            align-items: center;
        }

        .rating {
            color: #fbbf24;
        }

        .provider-action {
            text-align: right;
        }

        .provider-price {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--accent-color);
            display: block;
            margin-bottom: 1rem;
        }

        @media (max-width: 768px) {
            .provider-row {
                flex-direction: column;
                text-align: center;
                gap: 1.5rem;
            }

            .provider-info {
                flex-direction: column;
            }

            .provider-action {
                text-align: center;
                width: 100%;
            }
        }
    </style>
</head>

<body>

    <!-- Navbar -->
    <header>
        <nav class="navbar glass-panel">
            <h1 class="logo">NE Connect</h1>
            <ul class="nav-links">
                <li><a href="index.php">Home</a></li>
                <li><a href="services.php">Services</a></li>
                <li><a href="providers.php" class="active">Providers</a></li>
                <li><a href="index.php">About</a></li>
                <li><a href="login.php">Login</a></li>
            </ul>
        </nav>
    </header>

    <?php
    $service_filter = isset($_GET['service']) ? ucfirst(htmlspecialchars($_GET['service'])) : 'All Services';
    ?>

    <div class="providers-header reveal">
        <h2>Top Providers:
            <?php echo $service_filter; ?>
        </h2>
        <p>Browse our list of verified and trusted local professionals ready to help you.</p>
    </div>

    <div class="provider-list">

        <!-- Dummy Provider 1 -->
        <div class="provider-row reveal">
            <div class="provider-info">
                <div class="provider-avatar">
                    <i class="fas fa-user-tie"></i>
                </div>
                <div class="provider-details">
                    <h3>James Sangma</h3>
                    <div class="provider-meta">
                        <span class="rating"><i class="fas fa-star"></i> 4.9 (120 reviews)</span>
                        <span><i class="fas fa-map-marker-alt"></i> Shillong, Meghalaya</span>
                    </div>
                    <p style="margin-top: 0.5rem; color: var(--text-secondary); font-size: 0.9rem;">Expert in
                        residential and commercial electrical installations.</p>
                </div>
            </div>
            <div class="provider-action">
                <span class="provider-price">₹450 / hr</span>
                <a href="#" class="btn" onclick="alert('Booking functionality coming soon!')">Book Now</a>
            </div>
        </div>

        <!-- Dummy Provider 2 -->
        <div class="provider-row reveal">
            <div class="provider-info">
                <div class="provider-avatar" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
                    <i class="fas fa-wrench"></i>
                </div>
                <div class="provider-details">
                    <h3>Rahul Das</h3>
                    <div class="provider-meta">
                        <span class="rating"><i class="fas fa-star"></i> 4.7 (85 reviews)</span>
                        <span><i class="fas fa-map-marker-alt"></i> Guwahati, Assam</span>
                    </div>
                    <p style="margin-top: 0.5rem; color: var(--text-secondary); font-size: 0.9rem;">Quick response
                        plumbing and pipe leak repairs.</p>
                </div>
            </div>
            <div class="provider-action">
                <span class="provider-price">₹300 / hr</span>
                <a href="#" class="btn"
                    style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); box-shadow: 0 5px 15px rgba(16, 185, 129, 0.3);"
                    onclick="alert('Booking functionality coming soon!')">Book Now</a>
            </div>
        </div>

        <!-- Dummy Provider 3 -->
        <div class="provider-row reveal">
            <div class="provider-info">
                <div class="provider-avatar" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">
                    <i class="fas fa-broom"></i>
                </div>
                <div class="provider-details">
                    <h3>Anjali Sharma</h3>
                    <div class="provider-meta">
                        <span class="rating"><i class="fas fa-star"></i> 5.0 (200+ reviews)</span>
                        <span><i class="fas fa-map-marker-alt"></i> Imphal, Manipur</span>
                    </div>
                    <p style="margin-top: 0.5rem; color: var(--text-secondary); font-size: 0.9rem;">Premium deep
                        cleaning services for apartments.</p>
                </div>
            </div>
            <div class="provider-action">
                <span class="provider-price">₹800 / session</span>
                <a href="#" class="btn"
                    style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); box-shadow: 0 5px 15px rgba(245, 158, 11, 0.3);"
                    onclick="alert('Booking functionality coming soon!')">Book Now</a>
            </div>
        </div>

        <!-- Dummy Provider 4 -->
        <div class="provider-row reveal">
            <div class="provider-info">
                <div class="provider-avatar" style="background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);">
                    <i class="fas fa-hammer"></i>
                </div>
                <div class="provider-details">
                    <h3>David Khongwir</h3>
                    <div class="provider-meta">
                        <span class="rating"><i class="fas fa-star"></i> 4.8 (50 reviews)</span>
                        <span><i class="fas fa-map-marker-alt"></i> Tura, Meghalaya</span>
                    </div>
                    <p style="margin-top: 0.5rem; color: var(--text-secondary); font-size: 0.9rem;">Expert woodworking, custom furniture, and repairs.</p>
                </div>
            </div>
            <div class="provider-action">
                <span class="provider-price">₹500 / hr</span>
                <a href="#" class="btn"
                    style="background: linear-gradient(135deg, #ec4899 0%, #be185d 100%); box-shadow: 0 5px 15px rgba(236, 72, 153, 0.3);"
                    onclick="alert('Booking functionality coming soon!')">Book Now</a>
            </div>
        </div>

        <!-- Dummy Provider 5 -->
        <div class="provider-row reveal">
            <div class="provider-info">
                <div class="provider-avatar" style="background: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%);">
                    <i class="fas fa-snowflake"></i>
                </div>
                <div class="provider-details">
                    <h3>Priya Singh</h3>
                    <div class="provider-meta">
                        <span class="rating"><i class="fas fa-star"></i> 4.6 (92 reviews)</span>
                        <span><i class="fas fa-map-marker-alt"></i> Silchar, Assam</span>
                    </div>
                    <p style="margin-top: 0.5rem; color: var(--text-secondary); font-size: 0.9rem;">Licensed AC technician for repairs and servicing.</p>
                </div>
            </div>
            <div class="provider-action">
                <span class="provider-price">₹400 / service</span>
                <a href="#" class="btn"
                    style="background: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%); box-shadow: 0 5px 15px rgba(14, 165, 233, 0.3);"
                    onclick="alert('Booking functionality coming soon!')">Book Now</a>
            </div>
        </div>

        <!-- Dummy Provider 6 -->
        <div class="provider-row reveal">
            <div class="provider-info">
                <div class="provider-avatar" style="background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);">
                    <i class="fas fa-camera"></i>
                </div>
                <div class="provider-details">
                    <h3>Zosangliana</h3>
                    <div class="provider-meta">
                        <span class="rating"><i class="fas fa-star"></i> 4.9 (110 reviews)</span>
                        <span><i class="fas fa-map-marker-alt"></i> Aizawl, Mizoram</span>
                    </div>
                    <p style="margin-top: 0.5rem; color: var(--text-secondary); font-size: 0.9rem;">Professional event and portrait photographer.</p>
                </div>
            </div>
            <div class="provider-action">
                <span class="provider-price">₹1500 / hr</span>
                <a href="#" class="btn"
                    style="background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); box-shadow: 0 5px 15px rgba(139, 92, 246, 0.3);"
                    onclick="alert('Booking functionality coming soon!')">Book Now</a>
            </div>
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