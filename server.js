/**
 * Universal Standalone Node.js / Express Server for GRD10
 * 
 * Run anywhere:
 * - Docker containers
 * - VPS (Ubuntu / Debian / AWS EC2 / DigitalOcean)
 * - Platform-as-a-Service (Render, Railway, Fly.io, Heroku)
 * - Local development
 * 
 * Usage:
 *   node server.js
 * Or with custom port:
 *   PORT=3000 node server.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { processNominationSubmission } = require('./netlify/functions/submission-core');

const PORT = process.env.PORT || 8080;
const ROOT_DIR = __dirname;

const MIME_MAP = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = parsedUrl.pathname;

  // 1. API Endpoints: Handle both /api/submit-nomination and /.netlify/functions/submit-nomination
  if (pathname === '/api/submit-nomination' || pathname === '/.netlify/functions/submit-nomination') {
    let bodyChunks = [];
    req.on('data', chunk => bodyChunks.push(chunk));
    req.on('end', async () => {
      const rawBody = Buffer.concat(bodyChunks).toString('utf8');
      const result = await processNominationSubmission({
        httpMethod: req.method,
        rawBody: rawBody,
        env: process.env
      });

      res.writeHead(result.statusCode, result.headers);
      res.end(result.body);
    });
    return;
  }

  if (pathname === '/api/get-nominations') {
    const subFile = path.join(ROOT_DIR, 'submissions.json');
    let content = '[]';
    if (fs.existsSync(subFile)) {
      content = fs.readFileSync(subFile, 'utf8') || '[]';
    }
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(content);
    return;
  }

  // 2. Static File Serving with clean URL routing
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  } else if (!path.extname(pathname)) {
    // Check if clean URL file exists (e.g. /nominate -> /nominate.html)
    if (fs.existsSync(path.join(ROOT_DIR, pathname + '.html'))) {
      pathname = pathname + '.html';
    }
  }

  const filePath = path.join(ROOT_DIR, pathname);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_MAP[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`[GRD10] Universal server listening at http://localhost:${PORT}`);
  console.log(`[GRD10] Nomination API available at:`);
  console.log(`  - http://localhost:${PORT}/api/submit-nomination`);
  console.log(`  - http://localhost:${PORT}/.netlify/functions/submit-nomination`);
});
