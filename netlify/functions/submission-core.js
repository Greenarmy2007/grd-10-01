/**
 * Shared Core Nomination Processor (Universal - Host Agnostic)
 * 
 * Works identically across:
 * - Netlify Functions (AWS Lambda format)
 * - Vercel Serverless Functions (Node.js request/response format)
 * - Express.js / Node HTTP server / Render / Railway / VPS / Docker
 * - Cloudflare Pages / Workers (via Node compatibility)
 */

const { Resend } = require('resend');

// Standard security headers for JSON API responses
const API_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  'X-Content-Type-Options': 'nosniff'
};

// Maximum allowed payload size (approx 100KB for text data)
const MAX_PAYLOAD_BYTES = 100 * 1024;

// Field character limits
const LIMITS = {
  nomineeName: 150,
  category: 100,
  organisation: 200,
  cityState: 150,
  reason: 10000,
  keyContribution: 10000,
  nomineeContact: 200,
  nominatorName: 150,
  nominatorContact: 200,
  referenceId: 50
};

// HTML Escaper for template safety against injection
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Word count validator
function countWords(str) {
  if (!str || typeof str !== 'string') return 0;
  const words = str.trim().split(/\s+/);
  return words.filter(Boolean).length;
}

/**
 * Universal Processor: receives parsed or raw body and env config,
 * returns standard { statusCode, headers, body: JSON.stringify(...) }
 */
async function processNominationSubmission({ httpMethod, rawBody, parsedPayload, env = process.env }) {
  // 1. HTTP Method Check
  if (httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { ...API_HEADERS, 'Allow': 'POST' },
      body: JSON.stringify({
        success: false,
        error: 'Method Not Allowed',
        message: 'Only HTTP POST requests are supported.'
      })
    };
  }

  // 2. Request Payload Size Validation
  const bodyLength = typeof rawBody === 'string'
    ? Buffer.byteLength(rawBody, 'utf8')
    : Buffer.byteLength(JSON.stringify(parsedPayload || {}), 'utf8');

  if (bodyLength > MAX_PAYLOAD_BYTES) {
    return {
      statusCode: 413,
      headers: API_HEADERS,
      body: JSON.stringify({
        success: false,
        error: 'Payload Too Large',
        message: 'The submitted nomination dossier exceeds the maximum allowed size.'
      })
    };
  }

  // 3. Safe JSON Parsing
  let payload = parsedPayload;
  if (!payload && typeof rawBody === 'string') {
    try {
      payload = JSON.parse(rawBody);
    } catch (err) {
      return {
        statusCode: 400,
        headers: API_HEADERS,
        body: JSON.stringify({
          success: false,
          error: 'Malformed JSON',
          message: 'The request payload is not valid JSON.'
        })
      };
    }
  }

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return {
      statusCode: 400,
      headers: API_HEADERS,
      body: JSON.stringify({
        success: false,
        error: 'Invalid Payload',
        message: 'Request body must be a valid JSON object.'
      })
    };
  }

  // 4. Anti-Spam Honeypot Verification
  if (payload.website_url && typeof payload.website_url === 'string' && payload.website_url.trim().length > 0) {
    return {
      statusCode: 400,
      headers: API_HEADERS,
      body: JSON.stringify({
        success: false,
        error: 'Spam Detected',
        message: 'Automated submission rejected.'
      })
    };
  }

  // 5. Input Extraction and Sanitization
  const nomineeName = (payload.nomineeName || '').trim();
  const category = (payload.category || '').trim();
  const organisation = (payload.organisation || '').trim();
  const cityState = (payload.cityState || '').trim();
  const reason = (payload.reason || '').trim();
  const keyContribution = (payload.keyContribution || '').trim();
  const nomineeContact = (payload.nomineeContact || '').trim();
  const nominatorName = (payload.nominatorName || '').trim();
  const nominatorContact = (payload.nominatorContact || '').trim();
  const referenceId = (payload.referenceId || `GRD-2026-NOM-${Math.floor(10000 + Math.random() * 90000)}`).trim();
  const submittedAt = payload.submittedAt || new Date().toISOString();

  // Optional files list (metadata only)
  const fileNames = Array.isArray(payload.fileNames)
    ? payload.fileNames.slice(0, 10).map(f => String(f).slice(0, 100))
    : [];

  // 6. Schema Validation
  const validationErrors = [];

  // Approved categories according to institutional statutes
  const APPROVED_CATEGORIES = [
    'Sports & Kushti',
    'Education',
    'Social Service',
    'Medicine & Healthcare',
    'Media & Journalism'
  ];

  if (!nomineeName) validationErrors.push('Nominee Full Name is required.');
  else if (nomineeName.length > LIMITS.nomineeName) validationErrors.push(`Nominee name exceeds ${LIMITS.nomineeName} characters.`);

  if (!category) {
    validationErrors.push('Award Category is required.');
  } else if (!APPROVED_CATEGORIES.includes(category)) {
    validationErrors.push(`Invalid award category "${category}". Must be one of: ${APPROVED_CATEGORIES.join(', ')}.`);
  }

  if (!organisation) validationErrors.push('Organisation / Profession is required.');
  else if (organisation.length > LIMITS.organisation) validationErrors.push(`Organisation exceeds ${LIMITS.organisation} characters.`);

  if (!cityState) validationErrors.push('City / District & State is required.');
  else if (cityState.length > LIMITS.cityState) validationErrors.push(`City/State exceeds ${LIMITS.cityState} characters.`);

  if (!reason) validationErrors.push('Nomination reason is required.');
  else if (reason.length > LIMITS.reason) validationErrors.push('Nomination reason exceeds maximum length.');

  if (!keyContribution) validationErrors.push('Key Contribution & Measurable Impact is required.');
  else if (keyContribution.length > LIMITS.keyContribution) validationErrors.push('Key contribution exceeds maximum length.');

  if (!nomineeContact) validationErrors.push('Nominee contact details are required.');
  else if (nomineeContact.length > LIMITS.nomineeContact) validationErrors.push(`Nominee contact exceeds ${LIMITS.nomineeContact} characters.`);

  if (!nominatorName) validationErrors.push('Nominator Name is required.');
  else if (nominatorName.length > LIMITS.nominatorName) validationErrors.push(`Nominator name exceeds ${LIMITS.nominatorName} characters.`);

  if (!nominatorContact) validationErrors.push('Nominator contact information is required.');
  else if (nominatorContact.length > LIMITS.nominatorContact) validationErrors.push(`Nominator contact exceeds ${LIMITS.nominatorContact} characters.`);

  if (validationErrors.length > 0) {
    return {
      statusCode: 422,
      headers: API_HEADERS,
      body: JSON.stringify({
        success: false,
        error: 'Validation Error',
        message: 'The submitted nomination failed validation.',
        details: validationErrors
      })
    };
  }

  // 7. Verify Server-Side Environment Variables
  const { RESEND_API_KEY, NOMINATION_RECIPIENT_EMAIL, NOMINATION_FROM_EMAIL } = env;

  if (!RESEND_API_KEY || !NOMINATION_RECIPIENT_EMAIL || !NOMINATION_FROM_EMAIL) {
    console.error('[SUBMIT-NOMINATION CONFIG ERROR] Missing variables:', {
      hasKey: Boolean(RESEND_API_KEY),
      hasRecipient: Boolean(NOMINATION_RECIPIENT_EMAIL),
      hasFrom: Boolean(NOMINATION_FROM_EMAIL)
    });

    return {
      statusCode: 503,
      headers: API_HEADERS,
      body: JSON.stringify({
        success: false,
        error: 'Service Unavailable',
        message: 'The nomination dispatch system is temporarily unconfigured. Please contact the GRD10 Secretariat directly.'
      })
    };
  }

  // 8. Construct Email Content
  const subject = `New GRD10 Awards Nomination — ${category} [${referenceId}]`;

  const filesListHtml = fileNames.length > 0
    ? `<ul>${fileNames.map(f => `<li>${escapeHtml(f)}</li>`).join('')}</ul>`
    : `<em>No supplementary documents attached</em>`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>New GRD10 Nomination Dossier</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1a1a1a; background-color: #f4f5f7; margin: 0; padding: 24px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 680px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e1e4e8; border-radius: 6px; overflow: hidden;">
    <tr>
      <td style="background-color: #0B1726; padding: 24px 32px; border-bottom: 3px solid #C8A96A;">
        <span style="display: block; font-size: 11px; letter-spacing: 2px; color: #C8A96A; text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">Institutional Jury Selection Dossier</span>
        <h1 style="margin: 0; color: #F5F1E8; font-size: 20px; font-weight: 600; letter-spacing: 0.5px;">GRD10 Achiever Awards • 2026</h1>
        <p style="margin: 4px 0 0; color: rgba(245, 241, 232, 0.7); font-size: 12px;">Shri Ghanshyam Raj Narayan Dube Legacy Initiative</p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #F8F9FA; padding: 14px 32px; border-bottom: 1px solid #E1E4E8; font-size: 13px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="color: #555;"><strong>Reference ID:</strong> <span style="font-family: monospace; color: #0B1726; font-size: 14px; font-weight: 700;">${escapeHtml(referenceId)}</span></td>
            <td align="right" style="color: #666; font-size: 12px;"><strong>Submitted:</strong> ${escapeHtml(new Date(submittedAt).toUTCString())}</td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 32px;">
        <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #eee;">
          <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; color: #C8A96A; margin: 0 0 12px;">Nominee Profile</h2>
          <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 14px;">
            <tr>
              <td width="28%" style="color: #666; vertical-align: top;"><strong>Award Category:</strong></td>
              <td style="color: #111;"><strong>${escapeHtml(category)}</strong></td>
            </tr>
            <tr>
              <td style="color: #666; vertical-align: top;"><strong>Full Name:</strong></td>
              <td style="color: #111; font-size: 16px;"><strong>${escapeHtml(nomineeName)}</strong></td>
            </tr>
            <tr>
              <td style="color: #666; vertical-align: top;"><strong>Organisation / Role:</strong></td>
              <td style="color: #111;">${escapeHtml(organisation)}</td>
            </tr>
            <tr>
              <td style="color: #666; vertical-align: top;"><strong>City / State:</strong></td>
              <td style="color: #111;">${escapeHtml(cityState)}</td>
            </tr>
            <tr>
              <td style="color: #666; vertical-align: top;"><strong>Confidential Contact:</strong></td>
              <td style="color: #111;">${escapeHtml(nomineeContact)}</td>
            </tr>
          </table>
        </div>

        <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #eee;">
          <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; color: #C8A96A; margin: 0 0 8px;">Why Nominated</h2>
          <div style="background-color: #fafbfc; border: 1px solid #e1e4e8; border-radius: 4px; padding: 14px; font-size: 14px; line-height: 1.6; color: #24292e; white-space: pre-wrap;">${escapeHtml(reason)}</div>
        </div>

        <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #eee;">
          <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; color: #C8A96A; margin: 0 0 8px;">Key Contribution &amp; Measurable Impact</h2>
          <div style="background-color: #fafbfc; border: 1px solid #e1e4e8; border-radius: 4px; padding: 14px; font-size: 14px; line-height: 1.6; color: #24292e; white-space: pre-wrap;">${escapeHtml(keyContribution)}</div>
        </div>

        <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #eee;">
          <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; color: #C8A96A; margin: 0 0 8px;">Attached Supporting Documents</h2>
          <div style="font-size: 13px; color: #444;">${filesListHtml}</div>
        </div>

        <div>
          <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; color: #C8A96A; margin: 0 0 12px;">Nominator Information</h2>
          <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 14px;">
            <tr>
              <td width="28%" style="color: #666; vertical-align: top;"><strong>Nominator Name:</strong></td>
              <td style="color: #111;">${escapeHtml(nominatorName)}</td>
            </tr>
            <tr>
              <td style="color: #666; vertical-align: top;"><strong>Contact Info:</strong></td>
              <td style="color: #111;">${escapeHtml(nominatorContact)}</td>
            </tr>
          </table>
        </div>
      </td>
    </tr>
    <tr>
      <td style="background-color: #0B1726; padding: 18px 32px; text-align: center; font-size: 12px; color: rgba(245, 241, 232, 0.6); border-top: 1px solid #223348;">
        Strict Institutional Confidence &bull; GRD Nationals &bull; A Philanthropic Initiative of Aryan Medical &amp; Educational Trust
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const textContent = `
GRD10 ACHIEVER AWARDS • 2026
Institutional Jury Selection Dossier
Reference ID: ${referenceId}
Submitted: ${new Date(submittedAt).toUTCString()}
------------------------------------------------------------

AWARD CATEGORY: ${category}

NOMINEE PROFILE:
- Full Name: ${nomineeName}
- Organisation / Role: ${organisation}
- City / State: ${cityState}
- Nominee Contact: ${nomineeContact}

WHY NOMINATED:
${reason}

KEY CONTRIBUTION & MEASURABLE IMPACT:
${keyContribution}

SUPPORTING DOCUMENTS:
${fileNames.length > 0 ? fileNames.map(f => `- ${f}`).join('\n') : 'None attached'}

NOMINATOR INFORMATION:
- Name: ${nominatorName}
- Contact: ${nominatorContact}

------------------------------------------------------------
Strict Institutional Confidence • GRD Nationals
  `.trim();

  // 9. Dispatch via Resend SDK
  try {
    const resend = new Resend(RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: NOMINATION_FROM_EMAIL,
      to: [NOMINATION_RECIPIENT_EMAIL],
      subject: subject,
      html: htmlContent,
      text: textContent,
      headers: {
        'X-Entity-Ref-ID': referenceId
      }
    });

    if (error) {
      console.error('[RESEND ERROR]', {
        message: error.message,
        name: error.name,
        referenceId: referenceId
      });

      return {
        statusCode: 502,
        headers: API_HEADERS,
        body: JSON.stringify({
          success: false,
          error: 'Email Dispatch Error',
          message: 'Unable to deliver nomination notification through email service provider. Please retry shortly or contact the secretariat directly.',
          referenceId: referenceId
        })
      };
    }

    console.info(`[RESEND SUCCESS] Email dispatched for nomination ${referenceId}. Resend ID: ${data?.id}`);

    return {
      statusCode: 200,
      headers: API_HEADERS,
      body: JSON.stringify({
        success: true,
        referenceId: referenceId,
        message: 'Nomination dossier successfully received, validated, and dispatched to the Selection Committee.',
        recipient: NOMINATION_RECIPIENT_EMAIL
      })
    };

  } catch (sdkError) {
    console.error('[UNEXPECTED ERROR in submit-nomination]', {
      message: sdkError.message,
      referenceId: referenceId
    });

    return {
      statusCode: 500,
      headers: API_HEADERS,
      body: JSON.stringify({
        success: false,
        error: 'Internal Server Error',
        message: 'An unexpected error occurred while processing the nomination. Please try again later.',
        referenceId: referenceId
      })
    };
  }
}

module.exports = {
  processNominationSubmission,
  escapeHtml,
  countWords,
  API_HEADERS,
  LIMITS
};
