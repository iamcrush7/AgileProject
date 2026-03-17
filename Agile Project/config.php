<?php
// Database connection configuration
$servername = "localhost";
$username = "root";           // XAMPP default username
$password = "";               // XAMPP default password (empty)
$dbname = "ne_connect";      // Your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set charset to utf8
$conn->set_charset("utf8");
?>
