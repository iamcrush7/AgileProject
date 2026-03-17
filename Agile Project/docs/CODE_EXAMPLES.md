# Code Examples & Usage Guide

## Protected Page Example

To protect a page and require login:

```php
<?php 
include 'config.php';
include 'session.php';
requireLogin(); // Redirects to login if not logged in
?>
```

To require specific user type (provider only):

```php
<?php 
include 'config.php';
include 'session.php';
requireUserType('provider'); // Only providers can access
?>
```

---

## Get Current User Info

```php
<?php
include 'session.php';

if (isLoggedIn()) {
    $user = getCurrentUser();
    echo "Welcome, " . $user['name'];
    echo "Email: " . $user['email'];
    echo "Type: " . $user['user_type'];
}
?>
```

---

## Query Database Examples

### Get All Users
```php
<?php
include 'config.php';

$sql = "SELECT * FROM users WHERE user_type = 'provider'";
$result = $conn->query($sql);

while($row = $result->fetch_assoc()) {
    echo $row['name'] . "<br>";
}
?>
```

### Get Current User's Services
```php
<?php
include 'config.php';
include 'session.php';
requireUserType('provider');

$user = getCurrentUser();
$sql = "SELECT s.*, ps.price, ps.rating FROM services s 
        JOIN provider_services ps ON s.id = ps.service_id 
        WHERE ps.provider_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user['id']);
$stmt->execute();
$result = $stmt->get_result();

while($row = $result->fetch_assoc()) {
    echo $row['name'] . " - $" . $row['price'] . "<br>";
}
?>
```

### Insert Booking
```php
<?php
include 'config.php';

$customer_id = 1;
$provider_id = 2;
$service_id = 3;
$booking_date = "2026-02-15";
$booking_time = "10:00:00";

$sql = "INSERT INTO bookings (customer_id, provider_id, service_id, booking_date, booking_time) 
        VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iiiss", $customer_id, $provider_id, $service_id, $booking_date, $booking_time);

if ($stmt->execute()) {
    echo "Booking created successfully!";
} else {
    echo "Error: " . $stmt->error;
}
?>
```

---

## HTML Form with AJAX Example

```html
<form id="myForm">
    <input type="text" name="name" required>
    <input type="email" name="email" required>
    <button type="submit">Submit</button>
</form>

<script>
document.getElementById('myForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    
    fetch('handler.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Success! ' + data.message);
            window.location.href = data.redirect;
        } else {
            alert('Error: ' + data.message);
        }
    });
});
</script>
```

---

## Handler PHP Template

```php
<?php
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    
    // Validate
    if (empty($name) || empty($email)) {
        echo json_encode(['success' => false, 'message' => 'All fields required']);
        exit;
    }
    
    // Process data
    $sql = "INSERT INTO users (name, email) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $name, $email);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Data saved', 'redirect' => 'page.php']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error saving data']);
    }
    
    $stmt->close();
    exit;
}
?>
```

---

## Display User Name in Navbar

Add this to your navbar:

```php
<?php
include 'session.php';

if (isLoggedIn()) {
    $user = getCurrentUser();
    echo '<span>Welcome, ' . $user['name'] . '</span>';
    echo '<a href="logout.php">Logout</a>';
} else {
    echo '<a href="login.php">Login</a>';
    echo '<a href="register.php">Register</a>';
}
?>
```

---

## Password Reset Example

Handler file (`reset_password_handler.php`):

```php
<?php
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $old_password = isset($_POST['old_password']) ? trim($_POST['old_password']) : '';
    $new_password = isset($_POST['new_password']) ? trim($_POST['new_password']) : '';
    
    // Find user
    $sql = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        
        // Verify old password
        if (password_verify($old_password, $user['password'])) {
            // Hash new password
            $new_hashed = password_hash($new_password, PASSWORD_DEFAULT);
            
            // Update
            $sql = "UPDATE users SET password = ? WHERE email = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ss", $new_hashed, $email);
            
            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Password updated']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Old password incorrect']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'User not found']);
    }
    exit;
}
?>
```

---

## Important Security Notes

1. **Always Hash Passwords**
   ```php
   $hashed = password_hash($password, PASSWORD_DEFAULT);
   ```

2. **Always Verify Passwords**
   ```php
   if (password_verify($password, $hashed)) {
       // Password correct
   }
   ```

3. **Use Prepared Statements**
   ```php
   $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
   $stmt->bind_param("s", $email);
   // GOOD - prevents SQL injection
   ```

4. **Never Use** (Vulnerable to SQL Injection)
   ```php
   $sql = "SELECT * FROM users WHERE email = '$email'";
   // BAD - NEVER DO THIS
   ```

5. **Validate All Input**
   ```php
   if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
       echo "Invalid email";
   }
   ```

6. **Use HTTPS in Production**
   - Always use HTTPS for login pages
   - Never send passwords over HTTP

---

## Common Queries

### Get Provider Rating
```php
$sql = "SELECT AVG(rating) as avg_rating FROM reviews WHERE provider_id = ?";
```

### Get User's Bookings
```php
$sql = "SELECT b.*, s.name, u.name as provider_name 
        FROM bookings b 
        JOIN services s ON b.service_id = s.id 
        JOIN users u ON b.provider_id = u.id 
        WHERE b.customer_id = ?";
```

### Get Top Rated Providers
```php
$sql = "SELECT u.*, AVG(ps.rating) as avg_rating 
        FROM users u 
        JOIN provider_services ps ON u.id = ps.provider_id 
        WHERE u.user_type = 'provider' 
        GROUP BY u.id 
        ORDER BY avg_rating DESC 
        LIMIT 10";
```

---

## Testing with Postman

For API endpoints, you can test with Postman:

1. **Login Request**
   - Method: POST
   - URL: http://localhost/Agile%20Project/login_handler.php
   - Body (form-data):
     - email: admin@neconnect.com
     - password: admin123

2. **Registration Request**
   - Method: POST
   - URL: http://localhost/Agile%20Project/register_handler.php
   - Body (form-data):
     - name: John Doe
     - email: john@example.com
     - password: password123
     - confirm_password: password123
     - user_type: customer

---

That's everything you need! Happy coding! 🚀
