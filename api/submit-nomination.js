/**
 * Vercel Serverless Function: /api/submit-nomination
 * Endpoint: /api/submit-nomination
 * 
 * Works out-of-the-box when deploying to Vercel without any reconfiguration.
 */

const { processNominationSubmission } = require('../netlify/functions/submission-core');

module.exports = async (req, res) => {
  const result = await processNominationSubmission({
    httpMethod: req.method,
    rawBody: typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {}),
    parsedPayload: typeof req.body === 'object' ? req.body : null,
    env: process.env
  });

  // Apply response headers
  if (result.headers) {
    for (const [key, value] of Object.entries(result.headers)) {
      res.setHeader(key, value);
    }
  }

  res.status(result.statusCode).send(result.body);
};
