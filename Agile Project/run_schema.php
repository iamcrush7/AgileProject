<?php
/**
 * RUN DATABASE SCHEMA
 * Execute the database schema to create tables
 */

include 'config.php';

echo "<h1>Running Database Schema</h1>";

// Read the SQL file
$sql = file_get_contents('database_schema.sql');

if (!$sql) {
    die("Error: Could not read database_schema.sql file");
}

// Split the SQL into individual statements
$statements = array_filter(array_map('trim', explode(';', $sql)));

$success_count = 0;
$error_count = 0;
$errors = [];

foreach ($statements as $statement) {
    if (empty($statement) || strpos($statement, '--') === 0) {
        continue; // Skip empty lines and comments
    }

    if ($conn->query($statement) === TRUE) {
        $success_count++;
        echo "<p style='color: green;'>✓ Executed: " . substr($statement, 0, 50) . "...</p>";
    } else {
        $error_count++;
        $error_msg = "Error executing: " . substr($statement, 0, 50) . "... - " . $conn->error;
        $errors[] = $error_msg;
        echo "<p style='color: red;'>✗ " . $error_msg . "</p>";
    }
}

$conn->close();

echo "<h2>Summary</h2>";
echo "<p>Successful statements: $success_count</p>";
echo "<p>Failed statements: $error_count</p>";

if (!empty($errors)) {
    echo "<h3>Errors:</h3>";
    foreach ($errors as $error) {
        echo "<p style='color: red;'>$error</p>";
    }
} else {
    echo "<p style='color: green;'>All statements executed successfully!</p>";
}
?>
