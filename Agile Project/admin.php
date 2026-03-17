<?php 
/**
 * ADMIN DASHBOARD
 * Accessible to: Admin users only (role = 'admin')
 * Shows: User management, provider approval, system stats
 */

include 'config.php';
include 'session.php';

// Require admin role
requireAdmin();

$user = getCurrentUser();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard | NE Connect</title>

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
            <h1 class="logo">NE Connect Admin</h1>
            <ul class="nav-links">
                <li><a href="index.php">Home</a></li>
                <li><a href="admin.php" class="active">Dashboard</a></li>
                <li class="nav-user-info">
                    <span class="user-name"><?php echo htmlspecialchars($user['name']); ?></span>
                    <span class="role-badge admin">Admin</span>
                    <a href="index.php?logout=true" class="logout-btn">Logout</a>
                </li>
            </ul>
        </nav>
    </header>

    <!-- Admin Dashboard -->
    <section class="admin-dashboard">
        <div class="container">
            <h2>Admin Dashboard</h2>
            <p>Logged in as: <strong><?php echo htmlspecialchars($user['name']); ?></strong> (Admin)</p>
            
            <!-- Messages -->
            <div id="message-container"></div>

            <!-- Provider Approval Section -->
            <div class="admin-section">
                <h3><i class="fas fa-user-check"></i> Pending Provider Approvals</h3>
                
                <?php
                // Fetch pending providers
                $pending_sql = "
                    SELECT
                        u.id,
                        u.name,
                        u.email,
                        u.phone,
                        u.city,
                        u.state,
                        u.bio,
                        u.profile_image,
                        pd.bio as provider_bio,
                        pd.phone as provider_phone,
                        pd.address,
                        pd.city as provider_city,
                        pd.state as provider_state,
                        pd.aadhaar_card_path
                    FROM users u
                    LEFT JOIN provider_details pd ON u.id = pd.provider_id
                    WHERE u.user_type = 'provider' AND u.status = 'pending'
                    ORDER BY u.created_at DESC
                ";
                
                $pending_result = $conn->query($pending_sql);

                if ($pending_result === false) {
                    echo "<div class='no-data'><p><i class='fas fa-exclamation-triangle'></i> Error loading provider data: " . $conn->error . "</p></div>";
                } elseif ($pending_result->num_rows > 0) {
                    ?>
                    <div class="providers-table-wrapper">
                        <table class="providers-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Location</th>
                                    <th>Bio</th>
                                    <th>Aadhaar</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php while ($provider = $pending_result->fetch_assoc()) { ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($provider['name']); ?></td>
                                    <td><?php echo htmlspecialchars($provider['email']); ?></td>
                                    <td><?php echo htmlspecialchars($provider['provider_phone'] ?? $provider['phone'] ?? 'N/A'); ?></td>
                                    <td>
                                        <?php
                                        $location = [];
                                        if (!empty($provider['provider_city'])) $location[] = $provider['provider_city'];
                                        if (!empty($provider['provider_state'])) $location[] = $provider['provider_state'];
                                        echo htmlspecialchars(implode(', ', $location) ?: 'N/A');
                                        ?>
                                    </td>
                                    <td><?php echo htmlspecialchars(substr($provider['provider_bio'] ?? $provider['bio'] ?? '', 0, 50) . (strlen($provider['provider_bio'] ?? $provider['bio'] ?? '') > 50 ? '...' : '')); ?></td>
                                    <td>
                                        <?php if (!empty($provider['aadhaar_card_path'])): ?>
                                            <a href="<?php echo htmlspecialchars($provider['aadhaar_card_path']); ?>" target="_blank" class="btn-view">
                                                <i class="fas fa-eye"></i> View
                                            </a>
                                        <?php else: ?>
                                            N/A
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <button class="btn-approve" onclick="approveProvider(<?php echo $provider['id']; ?>, '<?php echo htmlspecialchars($provider['name']); ?>')">
                                            <i class="fas fa-check"></i> Approve
                                        </button>
                                        <button class="btn-reject" onclick="rejectProvider(<?php echo $provider['id']; ?>, '<?php echo htmlspecialchars($provider['name']); ?>')">
                                            <i class="fas fa-times"></i> Reject
                                        </button>
                                    </td>
                                </tr>
                                <?php } ?>
                            </tbody>
                        </table>
                    </div>
                    <?php
                } else {
                    echo "<div class='no-data'><p><i class='fas fa-check-circle'></i> No pending providers to approve</p></div>";
                }
                
                $conn->close();
                ?>
            </div>

            <!-- Enhanced Statistics -->
            <div class="admin-stats">
                <div class="stat-card">
                    <i class="fas fa-user-clock"></i>
                    <h4>Pending Approvals</h4>
                    <p id="pending-count">
                        <?php
                        $conn = new mysqli("localhost", "root", "", "ne_connect");
                        $count_sql = "SELECT COUNT(*) as count FROM users WHERE user_type = 'provider' AND status = 'pending'";
                        $count_result = $conn->query($count_sql);
                        $count_row = $count_result->fetch_assoc();
                        echo $count_row['count'];
                        ?>
                    </p>
                </div>
                <div class="stat-card">
                    <i class="fas fa-user-check"></i>
                    <h4>Active Providers</h4>
                    <p id="active-count">
                        <?php
                        $count_sql = "SELECT COUNT(*) as count FROM users WHERE user_type = 'provider' AND status = 'active'";
                        $count_result = $conn->query($count_sql);
                        $count_row = $count_result->fetch_assoc();
                        echo $count_row['count'];
                        ?>
                    </p>
                </div>
                <div class="stat-card">
                    <i class="fas fa-users"></i>
                    <h4>Total Customers</h4>
                    <p id="customer-count">
                        <?php
                        $count_sql = "SELECT COUNT(*) as count FROM users WHERE user_type = 'customer'";
                        $count_result = $conn->query($count_sql);
                        $count_row = $count_result->fetch_assoc();
                        echo $count_row['count'];
                        ?>
                    </p>
                </div>
                <div class="stat-card">
                    <i class="fas fa-calendar-check"></i>
                    <h4>Total Bookings</h4>
                    <p id="booking-count">
                        <?php
                        $count_sql = "SELECT COUNT(*) as count FROM bookings";
                        $count_result = $conn->query($count_sql);
                        $count_row = $count_result->fetch_assoc();
                        echo $count_row['count'];
                        ?>
                    </p>
                </div>
                <div class="stat-card">
                    <i class="fas fa-star"></i>
                    <h4>Total Reviews</h4>
                    <p id="review-count">
                        <?php
                        $count_sql = "SELECT COUNT(*) as count FROM reviews";
                        $count_result = $conn->query($count_sql);
                        $count_row = $count_result->fetch_assoc();
                        echo $count_row['count'];
                        ?>
                    </p>
                </div>
                <div class="stat-card">
                    <i class="fas fa-tools"></i>
                    <h4>Total Services</h4>
                    <p id="service-count">
                        <?php
                        $count_sql = "SELECT COUNT(*) as count FROM services";
                        $count_result = $conn->query($count_sql);
                        $count_row = $count_result->fetch_assoc();
                        echo $count_row['count'];
                        ?>
                    </p>
                </div>
                <div class="stat-card">
                    <i class="fas fa-chart-line"></i>
                    <h4>Avg Rating</h4>
                    <p id="avg-rating">
                        <?php
                        $count_sql = "SELECT ROUND(AVG(rating), 1) as avg_rating FROM reviews";
                        $count_result = $conn->query($count_sql);
                        $count_row = $count_result->fetch_assoc();
                        echo $count_row['avg_rating'] ?? '0.0';
                        ?>
                    </p>
                </div>
                <div class="stat-card">
                    <i class="fas fa-user-shield"></i>
                    <h4>Total Admins</h4>
                    <p id="admin-count">
                        <?php
                        $count_sql = "SELECT COUNT(*) as count FROM users WHERE user_type = 'admin'";
                        $count_result = $conn->query($count_sql);
                        $count_row = $count_result->fetch_assoc();
                        echo $count_row['count'];
                        $conn->close();
                        ?>
                    </p>
                </div>
            </div>

            <!-- User Management Section -->
            <div class="admin-section">
                <h3><i class="fas fa-users-cog"></i> User Management</h3>
                <div class="user-filters">
                    <select id="user-type-filter">
                        <option value="">All Users</option>
                        <option value="customer">Customers</option>
                        <option value="provider">Providers</option>
                        <option value="admin">Admins</option>
                    </select>
                    <select id="user-status-filter">
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <input type="text" id="user-search" placeholder="Search by name or email...">
                </div>

                <?php
                // Fetch all users
                $conn = new mysqli("localhost", "root", "", "ne_connect");
                $users_sql = "
                    SELECT
                        u.id,
                        u.name,
                        u.email,
                        u.user_type,
                        u.phone,
                        u.city,
                        u.state,
                        u.status,
                        u.created_at,
                        COUNT(b.id) as total_bookings,
                        AVG(r.rating) as avg_rating
                    FROM users u
                    LEFT JOIN bookings b ON u.id = b.customer_id
                    LEFT JOIN reviews r ON u.id = r.customer_id
                    GROUP BY u.id
                    ORDER BY u.created_at DESC
                    LIMIT 50
                ";

                $users_result = $conn->query($users_sql);

                if ($users_result && $users_result->num_rows > 0) {
                ?>

                <div class="users-table-wrapper">
                    <div class="table-controls">
                        <div class="table-info">
                            <p>Showing <span id="user-count"><?php echo $users_result->num_rows; ?></span> users</p>
                        </div>
                        <div class="table-actions">
                            <button class="btn-refresh" onclick="loadUsers()">
                                <i class="fas fa-sync-alt"></i> Refresh
                            </button>
                        </div>
                    </div>
                    <table class="users-table" id="users-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Location</th>
                                <th>Bookings</th>
                                <th>Rating</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php while ($user = $users_result->fetch_assoc()) { ?>
                            <tr data-user-type="<?php echo $user['user_type']; ?>" data-user-status="<?php echo $user['status']; ?>">
                                <td><?php echo htmlspecialchars($user['name']); ?></td>
                                <td><?php echo htmlspecialchars($user['email']); ?></td>
                                <td>
                                    <span class="user-type-badge <?php echo $user['user_type']; ?>">
                                        <?php echo ucfirst($user['user_type']); ?>
                                    </span>
                                </td>
                                <td>
                                    <span class="status-badge <?php echo $user['status']; ?>">
                                        <?php echo ucfirst($user['status']); ?>
                                    </span>
                                </td>
                                <td>
                                    <?php
                                    $location = [];
                                    if (!empty($user['city'])) $location[] = $user['city'];
                                    if (!empty($user['state'])) $location[] = $user['state'];
                                    echo htmlspecialchars(implode(', ', $location) ?: 'N/A');
                                    ?>
                                </td>
                                <td><?php echo $user['total_bookings']; ?></td>
                                <td>
                                    <?php if ($user['avg_rating']): ?>
                                        <span class="rating">
                                            <i class="fas fa-star"></i> <?php echo number_format($user['avg_rating'], 1); ?>
                                        </span>
                                    <?php else: ?>
                                        N/A
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <button class="btn-edit" onclick="editUser(<?php echo $user['id']; ?>)">
                                        <i class="fas fa-edit"></i> Edit
                                    </button>
                                    <?php if ($user['status'] === 'active'): ?>
                                        <button class="btn-suspend" onclick="suspendUser(<?php echo $user['id']; ?>)">
                                            <i class="fas fa-ban"></i> Suspend
                                        </button>
                                    <?php else: ?>
                                        <button class="btn-activate" onclick="activateUser(<?php echo $user['id']; ?>)">
                                            <i class="fas fa-check"></i> Activate
                                        </button>
                                    <?php endif; ?>
                                </td>
                            </tr>
                            <?php } ?>
                        </tbody>
                    </table>
                </div>
                <?php
                } else {
                    echo "<div class='no-data'><p><i class='fas fa-exclamation-triangle'></i> Error loading users data</p></div>";
                }
                $conn->close();
                ?>
            </div>

            <!-- Recent Activities Section -->
            <div class="admin-section">
                <h3><i class="fas fa-history"></i> Recent Activities</h3>

                <div class="activities-container">
                    <!-- Recent Bookings -->
                    <div class="activity-column">
                        <h4><i class="fas fa-calendar-alt"></i> Recent Bookings</h4>
                        <div class="activity-list">
                            <?php
                            $conn = new mysqli("localhost", "root", "", "ne_connect");
                            $bookings_sql = "
                                SELECT
                                    b.id,
                                    b.booking_date,
                                    b.booking_time,
                                    b.status,
                                    u.name as customer_name,
                                    s.name as service_name,
                                    p.name as provider_name,
                                    b.created_at
                                FROM bookings b
                                JOIN users u ON b.customer_id = u.id
                                JOIN services s ON b.service_id = s.id
                                JOIN users p ON b.provider_id = p.id
                                ORDER BY b.created_at DESC
                                LIMIT 10
                            ";

                            $bookings_result = $conn->query($bookings_sql);
                            if ($bookings_result->num_rows > 0) {
                                while ($booking = $bookings_result->fetch_assoc()) {
                                    ?>
                                    <div class="activity-item">
                                        <div class="activity-icon">
                                            <i class="fas fa-calendar-check"></i>
                                        </div>
                                        <div class="activity-content">
                                            <p><strong><?php echo htmlspecialchars($booking['customer_name']); ?></strong> booked <strong><?php echo htmlspecialchars($booking['service_name']); ?></strong></p>
                                            <p>Provider: <?php echo htmlspecialchars($booking['provider_name']); ?> | Status: <span class="status-<?php echo $booking['status']; ?>"><?php echo ucfirst($booking['status']); ?></span></p>
                                            <small><?php echo date('M d, Y H:i', strtotime($booking['created_at'])); ?></small>
                                        </div>
                                    </div>
                                    <?php
                                }
                            } else {
                                echo "<p class='no-activity'>No recent bookings</p>";
                            }
                            ?>
                        </div>
                    </div>

                    <!-- Recent Reviews -->
                    <div class="activity-column">
                        <h4><i class="fas fa-star"></i> Recent Reviews</h4>
                        <div class="activity-list">
                            <?php
                            $reviews_sql = "
                                SELECT
                                    r.rating,
                                    r.comment,
                                    u.name as customer_name,
                                    p.name as provider_name,
                                    r.created_at
                                FROM reviews r
                                JOIN users u ON r.customer_id = u.id
                                JOIN users p ON r.provider_id = p.id
                                ORDER BY r.created_at DESC
                                LIMIT 10
                            ";

                            $reviews_result = $conn->query($reviews_sql);
                            if ($reviews_result->num_rows > 0) {
                                while ($review = $reviews_result->fetch_assoc()) {
                                    ?>
                                    <div class="activity-item">
                                        <div class="activity-icon">
                                            <i class="fas fa-star"></i>
                                        </div>
                                        <div class="activity-content">
                                            <p><strong><?php echo htmlspecialchars($review['customer_name']); ?></strong> reviewed <strong><?php echo htmlspecialchars($review['provider_name']); ?></strong></p>
                                            <div class="rating-stars">
                                                <?php for ($i = 1; $i <= 5; $i++): ?>
                                                    <i class="fas fa-star <?php echo $i <= $review['rating'] ? 'filled' : ''; ?>"></i>
                                                <?php endfor; ?>
                                                <span>(<?php echo $review['rating']; ?>/5)</span>
                                            </div>
                                            <?php if (!empty($review['comment'])): ?>
                                                <p class="review-comment">"<?php echo htmlspecialchars(substr($review['comment'], 0, 100)); ?><?php echo strlen($review['comment']) > 100 ? '...' : ''; ?>"</p>
                                            <?php endif; ?>
                                            <small><?php echo date('M d, Y H:i', strtotime($review['created_at'])); ?></small>
                                        </div>
                                    </div>
                                    <?php
                                }
                            } else {
                                echo "<p class='no-activity'>No recent reviews</p>";
                            }
                            $conn->close();
                            ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <p>© 2026 NE Connect | Admin Panel</p>
    </footer>

    <!-- JS -->
    <script src="js/script.js"></script>
    
    <script>
    /**
     * Handle Provider Approval
     */
    function approveProvider(userId, providerName) {
        if (!confirm(`Approve provider "${providerName}"?`)) {
            return;
        }

        const formData = new FormData();
        formData.append('action', 'approve');
        formData.append('user_id', userId);

        fetch('provider_approval.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            showMessage(data.success, data.message);
            
            if (data.success) {
                // Reload page after 1 second
                setTimeout(() => location.reload(), 1500);
            }
        })
        .catch(error => {
            showMessage(false, 'Error: ' + error.message);
        });
    }

    /**
     * Handle Provider Rejection
     */
    function rejectProvider(userId, providerName) {
        if (!confirm(`Reject provider "${providerName}"? This will block their account.`)) {
            return;
        }

        const formData = new FormData();
        formData.append('action', 'reject');
        formData.append('user_id', userId);

        fetch('provider_approval.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            showMessage(data.success, data.message);
            
            if (data.success) {
                // Reload page after 1 second
                setTimeout(() => location.reload(), 1500);
            }
        })
        .catch(error => {
            showMessage(false, 'Error: ' + error.message);
        });
    }

    /**
     * Show Message to User
     */
    function showMessage(success, message) {
        const container = document.getElementById('message-container');
        const messageClass = success ? 'message-success' : 'message-error';
        const icon = success ? '✓' : '✗';
        
        container.innerHTML = `
            <div class="message ${messageClass}">
                <strong>${icon}</strong> ${message}
                <button onclick="this.parentElement.remove()" style="float: right; background: none; border: none; cursor: pointer; font-size: 18px;">×</button>
            </div>
        `;
    }
    </script>

    <style>
    /* Admin Dashboard Styles */
    .admin-dashboard {
        padding: 40px 20px;
        background: #f8f9fa;
        min-height: calc(100vh - 200px);
    }

    .admin-section {
        background: white;
        padding: 30px;
        border-radius: 10px;
        margin-bottom: 30px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .admin-section h3 {
        color: #667eea;
        margin-bottom: 20px;
        font-size: 1.5rem;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    /* Providers Table */
    .providers-table-wrapper {
        overflow-x: auto;
    }

    .providers-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
    }

    .providers-table thead {
        background: #667eea;
        color: white;
    }

    .providers-table th {
        padding: 15px;
        text-align: left;
        font-weight: 600;
        border: 1px solid #ddd;
    }

    .providers-table td {
        padding: 15px;
        border: 1px solid #ddd;
        border-top: none;
    }

    .providers-table tbody tr:nth-child(even) {
        background: #f9f9f9;
    }

    .providers-table tbody tr:hover {
        background: #f0f0f0;
    }

    /* Action Buttons */
    .btn-approve,
    .btn-reject {
        padding: 8px 15px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 0.9rem;
        margin-right: 5px;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        transition: all 0.3s ease;
        font-weight: 500;
    }

    .btn-approve {
        background: #28a745;
        color: white;
    }

    .btn-approve:hover {
        background: #218838;
        transform: translateY(-2px);
        box-shadow: 0 4px 10px rgba(40, 167, 69, 0.3);
    }

    .btn-reject {
        background: #dc3545;
        color: white;
    }

    .btn-reject:hover {
        background: #c82333;
        transform: translateY(-2px);
        box-shadow: 0 4px 10px rgba(220, 53, 69, 0.3);
    }

    /* Message Container */
    #message-container {
        margin-bottom: 20px;
    }

    .message {
        padding: 15px 20px;
        border-radius: 5px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideDown 0.3s ease;
    }

    .message-success {
        background: #d4edda;
        border: 1px solid #c3e6cb;
        color: #155724;
    }

    .message-error {
        background: #f8d7da;
        border: 1px solid #f5c6cb;
        color: #721c24;
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* No Data Message */
    .no-data {
        text-align: center;
        padding: 40px 20px;
        color: #666;
    }

    .no-data p {
        font-size: 1.1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }

    /* Stats Section */
    .admin-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-top: 40px;
    }

    .stat-card {
        background: white;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        border-left: 4px solid #667eea;
    }

    .stat-card i {
        font-size: 2rem;
        color: #667eea;
        margin-bottom: 10px;
    }

    .stat-card h4 {
        color: #333;
        margin: 10px 0;
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .stat-card p {
        font-size: 2rem;
        color: #667eea;
        font-weight: 700;
        margin: 10px 0;
    }

    /* Table Controls */
    .table-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding: 15px;
        background: #f8f9fa;
        border-radius: 8px;
        border: 1px solid #e9ecef;
    }

    .table-info {
        font-size: 0.9rem;
        color: #666;
    }

    .table-info span {
        font-weight: 600;
        color: #667eea;
    }

    .table-actions {
        display: flex;
        gap: 10px;
    }

    .btn-refresh {
        padding: 8px 15px;
        background: #6c757d;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 5px;
        transition: all 0.3s ease;
    }

    .btn-refresh:hover {
        background: #5a6268;
        transform: translateY(-2px);
        box-shadow: 0 4px 10px rgba(108, 117, 125, 0.3);
    }

    /* User Filters */
    .user-filters {
        display: flex;
        gap: 15px;
        margin-bottom: 20px;
        flex-wrap: wrap;
    }

    .user-filters select,
    .user-filters input {
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 0.9rem;
        min-width: 150px;
    }

    .user-filters input:focus,
    .user-filters select:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
    }

    /* Users Table */
    .users-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 0;
    }

    .users-table thead {
        background: #667eea;
        color: white;
    }

    .users-table th {
        padding: 15px;
        text-align: left;
        font-weight: 600;
        border: 1px solid #ddd;
    }

    .users-table td {
        padding: 15px;
        border: 1px solid #ddd;
        border-top: none;
    }

    .users-table tbody tr:nth-child(even) {
        background: #f9f9f9;
    }

    .users-table tbody tr:hover {
        background: #f0f0f0;
    }

    /* User Type and Status Badges */
    .user-type-badge,
    .status-badge {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
        text-transform: capitalize;
    }

    .user-type-badge.customer {
        background: #e3f2fd;
        color: #1976d2;
    }

    .user-type-badge.provider {
        background: #f3e5f5;
        color: #7b1fa2;
    }

    .user-type-badge.admin {
        background: #fff3e0;
        color: #f57c00;
    }

    .status-badge.active {
        background: #e8f5e8;
        color: #2e7d32;
    }

    .status-badge.pending {
        background: #fff3e0;
        color: #f57c00;
    }

    .status-badge.inactive,
    .status-badge.blocked {
        background: #ffebee;
        color: #c62828;
    }

    /* Action Buttons */
    .btn-edit,
    .btn-suspend,
    .btn-activate {
        padding: 6px 12px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.85rem;
        margin-right: 5px;
        display: inline-flex;
        align-items: center;
        gap: 3px;
        transition: all 0.3s ease;
        font-weight: 500;
    }

    .btn-edit {
        background: #17a2b8;
        color: white;
    }

    .btn-edit:hover {
        background: #138496;
        transform: translateY(-1px);
    }

    .btn-suspend {
        background: #ffc107;
        color: #212529;
    }

    .btn-suspend:hover {
        background: #e0a800;
        transform: translateY(-1px);
    }

    .btn-activate {
        background: #28a745;
        color: white;
    }

    .btn-activate:hover {
        background: #218838;
        transform: translateY(-1px);
    }

    /* Rating Display */
    .rating {
        display: flex;
        align-items: center;
        gap: 5px;
        color: #ffc107;
        font-weight: 500;
    }

    /* Activities Section */
    .activities-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
    }

    .activity-column h4 {
        color: #667eea;
        margin-bottom: 15px;
        font-size: 1.1rem;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .activity-list {
        max-height: 400px;
        overflow-y: auto;
    }

    .activity-item {
        display: flex;
        gap: 15px;
        padding: 15px;
        margin-bottom: 10px;
        background: #f8f9fa;
        border-radius: 8px;
        border-left: 4px solid #667eea;
    }

    .activity-icon {
        color: #667eea;
        font-size: 1.2rem;
        margin-top: 2px;
    }

    .activity-content p {
        margin: 0 0 5px 0;
        font-size: 0.9rem;
    }

    .activity-content small {
        color: #666;
        font-size: 0.8rem;
    }

    .rating-stars {
        display: flex;
        align-items: center;
        gap: 2px;
        margin: 5px 0;
    }

    .rating-stars .fas.fa-star {
        color: #ffc107;
        font-size: 0.8rem;
    }

    .rating-stars .fas.fa-star:not(.filled) {
        color: #ddd;
    }

    .review-comment {
        font-style: italic;
        color: #555;
        margin: 5px 0;
    }

    .no-activity {
        text-align: center;
        padding: 40px 20px;
        color: #666;
        font-style: italic;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
        .providers-table,
        .users-table {
            font-size: 0.85rem;
        }

        .providers-table th,
        .providers-table td,
        .users-table th,
        .users-table td {
            padding: 10px;
        }

        .btn-approve,
        .btn-reject,
        .btn-edit,
        .btn-suspend,
        .btn-activate {
            padding: 5px 10px;
            font-size: 0.8rem;
            margin-bottom: 5px;
        }

        .admin-stats {
            grid-template-columns: 1fr;
        }

        .user-filters {
            flex-direction: column;
            align-items: stretch;
        }

        .user-filters select,
        .user-filters input {
            min-width: auto;
        }

        .table-controls {
            flex-direction: column;
            gap: 15px;
            align-items: stretch;
        }

        .activities-container {
            grid-template-columns: 1fr;
        }
    }
    </style>
</body>
</html>