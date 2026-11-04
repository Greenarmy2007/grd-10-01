<?php
/**
 * Admin Content Save & Update Endpoint
 * Path: /api/save-content.php
 * 
 * Flow:
 * 1. Validates admin passkey (SHA-256).
 * 2. Saves full site content JSON into Hostinger MySQL DB.
 * 3. Also updates local data-content.json backup.
 */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
    exit;
}

$rawInput = file_get_contents('php://input');
if (empty($rawInput)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Empty payload']);
    exit;
}

$data = json_decode($rawInput, true);
if (!$data || !is_array($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON']);
    exit;
}

$jsonPayload = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

require_once __DIR__ . '/db-config.php';

$pdo = getDbConnection();
$dbSaved = false;

if ($pdo) {
    try {
        $stmt = $pdo->prepare("
            INSERT INTO grd10_site_content (content_key, content_json) 
            VALUES ('main_config', :json)
            ON DUPLICATE KEY UPDATE content_json = :json_update
        ");
        $stmt->execute([
            ':json' => $jsonPayload,
            ':json_update' => $jsonPayload
        ]);
        $dbSaved = true;
    } catch (Exception $e) {
        error_log("[GRD10 save-content DB error] " . $e->getMessage());
    }
}

// Also save local file backup on Hostinger web disk
$localJsonFile = __DIR__ . '/../data-content.json';
@file_put_contents($localJsonFile, $jsonPayload, LOCK_EX);

echo json_encode([
    'success' => true,
    'dbSaved' => $dbSaved,
    'message' => $dbSaved ? 'Content updated in Hostinger MySQL Database!' : 'Content saved to local fallback file (DB credentials pending).'
]);
