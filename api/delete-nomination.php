<?php
/**
 * Admin Nomination Deletion Endpoint
 * Path: /api/delete-nomination.php
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
$payload = json_decode($rawInput, true);
$targetId = $payload['referenceId'] ?? ($payload['id'] ?? null);

if (!$targetId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Reference ID is required.']);
    exit;
}

$submissionsFile = dirname(__DIR__) . '/submissions.json';
if (file_exists($submissionsFile)) {
    $content = file_get_contents($submissionsFile);
    if ($content !== false && !empty(trim($content))) {
        $list = json_decode($content, true);
        if (is_array($list)) {
            $filtered = array_values(array_filter($list, function($item) use ($targetId) {
                $ref = $item['referenceId'] ?? ($item['id'] ?? null);
                return $ref !== $targetId;
            }));
            file_put_contents($submissionsFile, json_encode($filtered, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE), LOCK_EX);
        }
    }
}

echo json_encode(['success' => true]);
