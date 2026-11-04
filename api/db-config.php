<?php
/**
 * Hostinger MySQL Database Configuration for GRD10
 * File: api/db-config.php
 * 
 * Simply replace the values below once your client provides the Hostinger database details.
 */

// --- FILL THESE 4 CREDENTIALS FROM HOSTINGER HPANEL ---
define('DB_HOST', 'localhost');                  // Usually 'localhost' on Hostinger
define('DB_NAME', 'YOUR_DATABASE_NAME_HERE');    // e.g. 'u123456789_grd10'
define('DB_USER', 'YOUR_DATABASE_USER_HERE');    // e.g. 'u123456789_admin'
define('DB_PASS', 'YOUR_DATABASE_PASSWORD_HERE'); // Password created in Hostinger

/**
 * Get PDO Database Connection
 * Automatically creates the required tables if they don't exist yet.
 */
function getDbConnection() {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    // Check if user has entered real credentials
    if (DB_NAME === 'YOUR_DATABASE_NAME_HERE' || empty(DB_NAME)) {
        return null;
    }

    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);

        // Auto-initialize required table on first run
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS grd10_site_content (
                id INT PRIMARY KEY AUTO_INCREMENT,
                content_key VARCHAR(64) UNIQUE NOT NULL,
                content_json LONGTEXT NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ");

        $pdo->exec("
            CREATE TABLE IF NOT EXISTS grd10_nominations (
                id INT PRIMARY KEY AUTO_INCREMENT,
                reference_id VARCHAR(64) UNIQUE NOT NULL,
                category VARCHAR(128) NOT NULL,
                nominee_name VARCHAR(255) NOT NULL,
                nominee_email VARCHAR(255) NULL,
                nominee_phone VARCHAR(64) NULL,
                dossier_json LONGTEXT NOT NULL,
                status VARCHAR(64) DEFAULT 'Under Review',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ");

        return $pdo;
    } catch (PDOException $e) {
        error_log("[GRD10 DB Error] " . $e->getMessage());
        return null;
    }
}
