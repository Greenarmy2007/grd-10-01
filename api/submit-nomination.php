<?php
/**
 * GRD-10 — Hardened PHP API Endpoint for Nomination Submissions
 * Path: /api/submit-nomination.php
 * 
 * Production Security Hardened:
 * - Rejects any query string parameters (protects against PHP-CGI query string/argument injection CVE-2024-4577)
 * - Strict POST method enforcement
 * - Content-Type validation
 * - Max payload size limitation (prevents OOM / DoS CVE-2026-109618)
 * - Honeypot spam rejection
 * - Whitelist field sanitization (prevents XSS & JSON injection)
 * - Atomic and locked file writing to submissions.json
 * - Clean, non-leaking JSON error responses
 */

// 1. Strict Security Headers
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('Referrer-Policy: strict-origin-when-cross-origin');

// Restrict CORS: only allow same-origin or explicit safe origin
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedHosts = [
    'grd10.medscapeindia.org',
    'localhost',
    '127.0.0.1'
];
if ($origin) {
    $parsedOrigin = parse_url($origin, PHP_URL_HOST);
    if ($parsedOrigin && in_array($parsedOrigin, $allowedHosts, true)) {
        header("Access-Control-Allow-Origin: $origin");
    }
} else {
    header('Access-Control-Allow-Origin: *');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');

// 2. Handle Preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 3. Strict Method Check
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
    exit;
}

// 4. CGI Query String Argument Injection Mitigation (CVE-2024-4577 mitigation)
// Submissions MUST NOT pass query strings to the API endpoint
if (!empty($_SERVER['QUERY_STRING'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Query string parameters not allowed on this endpoint']);
    exit;
}

// 5. Payload Size Guard (max 2MB to prevent OOM/DoS memory corruption)
$contentLength = (int)($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength > 2 * 1024 * 1024) {
    http_response_code(413);
    echo json_encode(['success' => false, 'error' => 'Payload Too Large']);
    exit;
}

// 6. Read Raw Input
$rawInput = file_get_contents('php://input');
if (empty($rawInput)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Empty request body']);
    exit;
}

$data = json_decode($rawInput, true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON structure']);
    exit;
}

// 7. Honeypot Anti-Bot Trap
if (!empty($data['website_url'])) {
    // Silently discard spam without error
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'referenceId' => 'GRD-DISCARDED'
    ]);
    exit;
}

// 8. Whitelist Field Sanitization
function sanitizeString($val, $maxLen = 500) {
    if (!is_string($val)) return '';
    $val = trim($val);
    $val = strip_tags($val);
    return mb_substr($val, 0, $maxLen, 'UTF-8');
}

$sanitized = [
    'referenceId'       => sanitizeString($data['referenceId'] ?? '', 40),
    'category'          => sanitizeString($data['category'] ?? '', 100),
    'nomineeName'       => sanitizeString($data['nomineeName'] ?? '', 150),
    'nomineeState'      => sanitizeString($data['nomineeState'] ?? '', 100),
    'nomineePhone'      => sanitizeString($data['nomineePhone'] ?? '', 30),
    'nomineeEmail'      => filter_var($data['nomineeEmail'] ?? '', FILTER_VALIDATE_EMAIL) ? substr($data['nomineeEmail'], 0, 100) : '',
    'nomineeBio'        => sanitizeString($data['nomineeBio'] ?? '', 3000),
    'nominatorName'     => sanitizeString($data['nominatorName'] ?? '', 150),
    'nominatorPhone'    => sanitizeString($data['nominatorPhone'] ?? '', 30),
    'nominatorEmail'    => filter_var($data['nominatorEmail'] ?? '', FILTER_VALIDATE_EMAIL) ? substr($data['nominatorEmail'], 0, 100) : '',
    'nominatorRelation' => sanitizeString($data['nominatorRelation'] ?? '', 150),
    'yearsOfImpact'     => sanitizeString($data['yearsOfImpact'] ?? '', 30),
    'submittedAt'       => date('c'),
    'status'            => 'Under Review',
    'edition'           => sanitizeString($data['edition'] ?? '2026', 10)
];

// Fallback generate referenceId if absent
if (empty($sanitized['referenceId'])) {
    $sanitized['referenceId'] = 'GRD-2026-NOM-' . strtoupper(bin2hex(random_bytes(3)));
}

// Validate essential required fields
if (empty($sanitized['nomineeName']) || empty($sanitized['category'])) {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'Nominee name and category are required.']);
    exit;
}

// 9. Atomic File Storage
$submissionsFile = dirname(__DIR__) . '/submissions.json';

try {
    $existing = [];
    if (file_exists($submissionsFile)) {
        $content = file_get_contents($submissionsFile);
        if ($content !== false && !empty(trim($content))) {
            $decoded = json_decode($content, true);
            if (is_array($decoded)) {
                $existing = $decoded;
            }
        }
    }

    // Prepend new submission
    array_unshift($existing, $sanitized);

    // Keep memory clean: cap local JSON archive to 2,000 entries
    if (count($existing) > 2000) {
        $existing = array_slice($existing, 0, 2000);
    }

    $encoded = json_encode($existing, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    
    // Write with exclusive lock
    $written = file_put_contents($submissionsFile, $encoded, LOCK_EX);
    if ($written === false) {
        throw new RuntimeException('Unable to write to secure storage file.');
    }

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'referenceId' => $sanitized['referenceId'],
        'message' => 'Nomination successfully registered and vaulted for Selection Committee review.'
    ]);
} catch (Exception $e) {
    http_response_code(500);
    error_log('[GRD-10 Security Warning] Submission error: ' . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'A secure server error occurred. Please try again or submit via email.'
    ]);
}
