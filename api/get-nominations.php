<?php
/**
 * Admin Nominations Retrieval Endpoint
 * Path: /api/get-nominations.php
 */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$submissionsFile = dirname(__DIR__) . '/submissions.json';
if (file_exists($submissionsFile)) {
    $content = file_get_contents($submissionsFile);
    if ($content !== false && !empty(trim($content))) {
        echo $content;
        exit;
    }
}

echo json_encode([]);
