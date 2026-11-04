<?php
/**
 * Public & Admin Content Retrieval Endpoint
 * Path: /api/get-content.php
 * 
 * Flow:
 * 1. Checks Hostinger MySQL DB for live content.
 * 2. If DB is configured, returns latest cloud content.
 * 3. If DB is not configured yet or empty, falls back gracefully to local content file.
 */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/db-config.php';

$pdo = getDbConnection();

if ($pdo) {
    try {
        $stmt = $pdo->prepare("SELECT content_json FROM grd10_site_content WHERE content_key = 'main_config' LIMIT 1");
        $stmt->execute();
        $row = $stmt->fetch();
        if ($row && !empty($row['content_json'])) {
            echo $row['content_json'];
            exit;
        }
    } catch (Exception $e) {
        error_log("[GRD10 get-content DB error] " . $e->getMessage());
    }
}

// Fallback: Check local JSON file if exists
$localJsonFile = __DIR__ . '/../data-content.json';
if (file_exists($localJsonFile)) {
    echo file_get_contents($localJsonFile);
    exit;
}

// Otherwise return empty object so client uses default data.js
echo json_encode(['empty' => true]);
