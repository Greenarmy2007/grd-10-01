/**
 * Netlify Function: submit-nomination
 * Endpoint: /.netlify/functions/submit-nomination
 * (Also rewritten to /api/submit-nomination in netlify.toml)
 */

const { processNominationSubmission } = require('./submission-core');

exports.handler = async (event, context) => {
  return await processNominationSubmission({
    httpMethod: event.httpMethod,
    rawBody: event.body,
    env: process.env
  });
};
